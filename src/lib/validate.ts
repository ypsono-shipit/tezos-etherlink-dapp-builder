export const HONEYPOT = 'company_fax'

const EVM = /^0x[0-9a-fA-F]{40}$/
const TZ = /^tz[123][1-9A-HJ-NP-Za-km-z]{33}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HANDLE = /^[A-Za-z0-9_]{1,15}$/
const WEB = /^https?:\/\/\S+\.\S+$/

export const PARTNER_TYPES = [
  'Sponsor',
  'Prizes / bounties',
  'Mentor / judge',
  'Tooling / infra credits',
  'Community / media',
  'Other',
] as const

export type PartnerType = (typeof PARTNER_TYPES)[number]
export type WalletKind = 'evm' | 'tz'
export type ApplicantKind = 'company' | 'individual'

export type ClaudeApplication = {
  wallet: string
  walletType: WalletKind
  email: string
  xHandle: string
  buildIdea: string
  priorWork: string
  consent: true
}

export type PartnerApplication = {
  applicantType: ApplicantKind
  name: string
  org: string
  role: string
  email: string
  xHandle: string
  website: string
  partnershipTypes: PartnerType[]
  message: string
  consent: true
}

export type ValidationOk<T> = { ok: true; value: T }
export type ValidationErr = { ok: false; errors: string[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function honeypotTripped(body: unknown): boolean {
  if (!isRecord(body)) return false
  const raw = body[HONEYPOT]
  if (typeof raw !== 'string') return raw != null && raw !== false
  return raw.trim().length > 0
}

function handleOf(raw: string): string {
  return raw.trim().replace(/^@/, '')
}

function emailOf(raw: string): string {
  return raw.trim().toLowerCase()
}

export function validateClaude(body: unknown): ValidationOk<ClaudeApplication> | ValidationErr {
  if (!isRecord(body)) return { ok: false, errors: ['Send a JSON application.'] }
  const errors: string[] = []
  const wallet = str(body.wallet, 80)
  const email = emailOf(str(body.email, 200))
  const xHandle = handleOf(str(body.xHandle ?? body.x, 40))
  const buildIdea = str(body.buildIdea ?? body.build, 4000)
  const priorWork = str(body.priorWork ?? body.prev, 4000)
  const consent = body.consent === true

  let walletType: WalletKind | null = null
  if (EVM.test(wallet)) walletType = 'evm'
  else if (TZ.test(wallet)) walletType = 'tz'
  else errors.push('Check the wallet address format.')

  if (!EMAIL.test(email)) errors.push('Enter a valid email.')
  if (!xHandle) errors.push('Add your X handle.')
  else if (!HANDLE.test(xHandle)) errors.push('Enter a valid X handle.')
  if (buildIdea.length < 10) errors.push('Tell us a bit more about what you will build.')
  if (priorWork.length < 2) errors.push('Tell us what you have built before.')
  if (!consent) errors.push('Please tick the consent box.')
  if (errors.length || !walletType) return { ok: false, errors }

  return {
    ok: true,
    value: { wallet, walletType, email, xHandle, buildIdea, priorWork, consent: true },
  }
}

export function validatePartner(body: unknown): ValidationOk<PartnerApplication> | ValidationErr {
  if (!isRecord(body)) return { ok: false, errors: ['Send a JSON application.'] }
  const errors: string[] = []
  const applicantType: ApplicantKind = body.applicantType === 'individual' || body.applicant === 'individual' ? 'individual' : 'company'
  const name = str(body.name, 120)
  const org = str(body.org, 160)
  const role = str(body.role, 120)
  const email = emailOf(str(body.email, 200))
  const xHandle = handleOf(str(body.xHandle ?? body.x, 40))
  const website = str(body.website, 300)
  const message = str(body.message ?? body.how, 4000)
  const consent = body.consent === true
  const rawTypes = Array.isArray(body.partnershipTypes) ? body.partnershipTypes : []
  const partnershipTypes = PARTNER_TYPES.filter((type) => rawTypes.includes(type))

  if (!name) errors.push('Add your name.')
  if (applicantType === 'company' && !org) errors.push('Add your company.')
  if (!role) errors.push('Add your role.')
  if (!EMAIL.test(email)) errors.push('Enter a valid email.')
  if (xHandle && !HANDLE.test(xHandle)) errors.push('Enter a valid X handle.')
  if (website && !WEB.test(website)) errors.push('Website should start with https://.')
  if (!partnershipTypes.length) errors.push('Pick at least one partnership type.')
  if (message.length < 10) errors.push('Tell us how you would like to partner.')
  if (!consent) errors.push('Please tick the consent box.')
  if (errors.length) return { ok: false, errors }

  return {
    ok: true,
    value: { applicantType, name, org, role, email, xHandle, website, partnershipTypes, message, consent: true },
  }
}
