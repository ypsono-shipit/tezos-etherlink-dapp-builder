import { createHash, createSign } from 'node:crypto'
import type { ClaudeApplication, PartnerApplication } from '../../src/lib/validate.js'

export type StoredKind = 'claude' | 'partner'

export type StoredRecord = {
  id: string
  kind: StoredKind
  createdAt: string
  ipHash: string
  status: 'received'
  claude?: ClaudeApplication
  partner?: PartnerApplication
}

const memory: StoredRecord[] = []

export function readMemoryLog(): StoredRecord[] {
  return memory
}

export function clearMemoryLog() {
  memory.length = 0
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'unset-ip-hash-salt'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function adapterName(): string {
  return (process.env.FORM_STORAGE || 'log').toLowerCase()
}

export async function saveRecord(record: StoredRecord): Promise<void> {
  const adapter = adapterName()
  if (adapter === 'log') {
    memory.push(record)
    // TODO: choose a storage destination. FORM_STORAGE=log prints the submission and does not persist it.
    console.log(JSON.stringify({
      todo: 'FORM_STORAGE is log. Submission was not persisted. Set FORM_STORAGE to sheets, notion, or postgres.',
      record,
    }))
    return
  }
  if (adapter === 'noop') {
    console.log(JSON.stringify({
      todo: 'FORM_STORAGE is noop. Submission accepted and discarded.',
      kind: record.kind,
      id: record.id,
    }))
    return
  }
  if (adapter === 'sheets') return saveSheets(record)
  if (adapter === 'notion') return saveNotion(record)
  if (adapter === 'postgres') return savePostgres(record)
  throw new Error(`Unknown FORM_STORAGE: ${adapter}`)
}

function b64url(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url')
}

async function googleToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = b64url(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${payload}`)
  const signature = signer.sign(privateKey).toString('base64url')
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${payload}.${signature}`,
    }),
  })
  if (!response.ok) throw new Error(`Google token failed (${response.status})`)
  const json = (await response.json()) as { access_token?: string }
  if (!json.access_token) throw new Error('Google token missing')
  return json.access_token
}

function rowFor(record: StoredRecord): string[] {
  if (record.kind === 'claude' && record.claude) {
    const item = record.claude
    return [record.id, item.wallet, item.walletType, item.email, item.xHandle, item.buildIdea, item.priorWork, record.createdAt, record.ipHash, record.status]
  }
  const item = record.partner!
  return [record.id, item.applicantType, item.name, item.org, item.role, item.email, item.xHandle, item.website, item.partnershipTypes.join(', '), item.message, record.createdAt, record.ipHash, record.status]
}

async function saveSheets(record: StoredRecord): Promise<void> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const sheetId = process.env.GOOGLE_SHEETS_ID
  const tab = record.kind === 'claude'
    ? (process.env.GOOGLE_SHEETS_CLAUDE_TAB || 'claude_applications')
    : (process.env.GOOGLE_SHEETS_PARTNER_TAB || 'partner_applications')
  if (!email || !key || !sheetId) throw new Error('Google Sheets env is incomplete')
  const token = await googleToken(email, key)
  const range = encodeURIComponent(`${tab}!A1`)
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [rowFor(record)] }),
    },
  )
  if (!response.ok) throw new Error(`Sheets append failed (${response.status})`)
}

function rich(value: string) {
  return { rich_text: [{ text: { content: value.slice(0, 1900) } }] }
}

async function saveNotion(record: StoredRecord): Promise<void> {
  const token = process.env.NOTION_TOKEN
  const database = record.kind === 'claude'
    ? process.env.NOTION_CLAUDE_DATABASE_ID
    : process.env.NOTION_PARTNER_DATABASE_ID
  if (!token || !database) throw new Error('Notion env is incomplete')
  const title = record.kind === 'claude'
    ? record.claude!.email
    : `${record.partner!.name}${record.partner!.org ? ` (${record.partner!.org})` : ''}`
  const properties: Record<string, unknown> = record.kind === 'claude' && record.claude
    ? {
        Name: { title: [{ text: { content: title } }] },
        Wallet: rich(record.claude.wallet),
        WalletType: rich(record.claude.walletType),
        Email: { email: record.claude.email },
        XHandle: rich(record.claude.xHandle),
        BuildIdea: rich(record.claude.buildIdea),
        PriorWork: rich(record.claude.priorWork),
        Status: rich(record.status),
      }
    : {
        Name: { title: [{ text: { content: title } }] },
        ApplicantType: rich(record.partner!.applicantType),
        Org: rich(record.partner!.org),
        Role: rich(record.partner!.role),
        Email: { email: record.partner!.email },
        XHandle: rich(record.partner!.xHandle),
        Website: rich(record.partner!.website),
        PartnershipTypes: rich(record.partner!.partnershipTypes.join(', ')),
        Message: rich(record.partner!.message),
        Status: rich(record.status),
      }
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parent: { database_id: database }, properties }),
  })
  if (!response.ok) throw new Error(`Notion create failed (${response.status})`)
}

async function savePostgres(record: StoredRecord): Promise<void> {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  const postgres = (await import('postgres')).default
  const ssl = /localhost|127\.0\.0\.1/.test(url) ? undefined : 'require' as const
  const sql = postgres(url, { ssl, max: 1 })
  try {
    if (record.kind === 'claude' && record.claude) {
      await sql`
        create table if not exists claude_applications (
          id text primary key,
          wallet text not null unique,
          wallet_type text not null,
          email text not null unique,
          x_handle text not null,
          build_idea text not null,
          prior_work text not null,
          created_at timestamptz not null,
          ip_hash text not null,
          status text not null
        )`
      const item = record.claude
      await sql`
        insert into claude_applications
          (id, wallet, wallet_type, email, x_handle, build_idea, prior_work, created_at, ip_hash, status)
        values
          (${record.id}, ${item.wallet}, ${item.walletType}, ${item.email}, ${item.xHandle}, ${item.buildIdea}, ${item.priorWork}, ${record.createdAt}, ${record.ipHash}, ${record.status})`
      return
    }
    const item = record.partner!
    await sql`
      create table if not exists partner_applications (
        id text primary key,
        applicant_type text not null,
        name text not null,
        org text,
        role text not null,
        email text not null unique,
        x_handle text,
        website text,
        partnership_types text[] not null,
        message text not null,
        created_at timestamptz not null,
        ip_hash text not null,
        status text not null
      )`
    await sql`
      insert into partner_applications
        (id, applicant_type, name, org, role, email, x_handle, website, partnership_types, message, created_at, ip_hash, status)
      values
        (${record.id}, ${item.applicantType}, ${item.name}, ${item.org}, ${item.role}, ${item.email}, ${item.xHandle}, ${item.website}, ${item.partnershipTypes}, ${item.message}, ${record.createdAt}, ${record.ipHash}, ${record.status})`
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code === '23505') {
      const duplicate = new Error(record.kind === 'claude'
        ? 'This email or wallet is already in the queue.'
        : 'This email is already in the queue.')
      ;(duplicate as Error & { status?: number }).status = 409
      throw duplicate
    }
    throw error
  } finally {
    await sql.end({ timeout: 2 })
  }
}
