import { randomUUID } from 'node:crypto'
import { honeypotTripped, validateClaude, validatePartner, type ClaudeApplication, type PartnerApplication } from '../../src/lib/validate.ts'
import { allow } from './ratelimit.ts'
import { hashIp, saveRecord, type StoredKind } from './storage.ts'

export type ApplyResult = { status: number; body: { ok: boolean; error?: string; id?: string } }

export function ipFromHeaders(
  headers: Record<string, string | string[] | undefined> | undefined,
  fallback = 'unknown',
): string {
  const forwarded = headers?.['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  if (raw) return raw.split(',')[0]?.trim() || fallback
  return fallback
}

function fromStorageError(error: unknown): ApplyResult {
  const status = (error as { status?: number }).status
  if (status === 409) return { status: 409, body: { ok: false, error: (error as Error).message } }
  console.error('Form storage failed.', error)
  return { status: 502, body: { ok: false, error: 'Storage is not ready. Try again later.' } }
}

async function persist(kind: StoredKind, ipHash: string, value: ClaudeApplication | PartnerApplication): Promise<ApplyResult> {
  const id = randomUUID()
  try {
    await saveRecord({
      id,
      kind,
      createdAt: new Date().toISOString(),
      ipHash,
      status: 'received',
      claude: kind === 'claude' ? value as ClaudeApplication : undefined,
      partner: kind === 'partner' ? value as PartnerApplication : undefined,
    })
  } catch (error) {
    return fromStorageError(error)
  }
  return { status: 200, body: { ok: true, id } }
}

export async function handleApply(kind: StoredKind, body: unknown, ip: string): Promise<ApplyResult> {
  if (honeypotTripped(body)) return { status: 200, body: { ok: true } }

  const ipHash = hashIp(ip || 'unknown')
  const permitted = await allow(`${kind}:${ipHash}`)
  if (!permitted) return { status: 429, body: { ok: false, error: 'Too many attempts. Please wait and try again.' } }

  if (kind === 'claude') {
    const parsed = validateClaude(body)
    if (!parsed.ok) return { status: 400, body: { ok: false, error: parsed.errors.join(' ') } }
    return persist('claude', ipHash, parsed.value)
  }

  const parsed = validatePartner(body)
  if (!parsed.ok) return { status: 400, body: { ok: false, error: parsed.errors.join(' ') } }
  return persist('partner', ipHash, parsed.value)
}

type Req = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

export async function dispatch(kind: StoredKind, req: Req, res: Res, fallbackIp = 'unknown') {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed.' })
    return
  }
  const result = await handleApply(kind, req.body, ipFromHeaders(req.headers, fallbackIp))
  res.status(result.status).json(result.body)
}
