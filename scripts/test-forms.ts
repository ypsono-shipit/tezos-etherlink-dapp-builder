import assert from 'node:assert/strict'
import { handleApply, dispatch } from '../api/lib/apply.ts'
import { clearMemoryLog, readMemoryLog } from '../api/lib/storage.ts'
import { resetRateLimits } from '../api/lib/ratelimit.ts'

process.env.FORM_STORAGE = 'log'

const wallet = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
const tz = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'

function claude(extra: Record<string, unknown> = {}) {
  return {
    wallet,
    email: 'builder@example.xyz',
    xHandle: 'tezbuilder',
    buildIdea: 'A MetaMask checkout for Michelson FA2 NFTs.',
    priorWork: 'A small token dApp.',
    consent: true,
    ...extra,
  }
}

function partner(extra: Record<string, unknown> = {}) {
  return {
    applicantType: 'company',
    name: 'Ada Lovelace',
    org: 'Analytical Engines',
    role: 'Builder',
    email: 'ada@example.xyz',
    xHandle: 'ada',
    website: 'https://example.xyz',
    partnershipTypes: ['Mentor / judge'],
    message: 'Office hours for builders shipping atomic calls.',
    consent: true,
    ...extra,
  }
}

resetRateLimits()
clearMemoryLog()

const ok = await handleApply('claude', claude(), '10.0.0.1')
assert.equal(ok.status, 200)
assert.equal(ok.body.ok, true)
assert.equal(readMemoryLog().length, 1)

const badWallet = await handleApply('claude', claude({ wallet: '0x123' }), '10.0.0.2')
assert.equal(badWallet.status, 400)
assert.match(badWallet.body.error ?? '', /wallet address/)

const tzOk = await handleApply('claude', claude({ wallet: tz, email: 'tz@example.xyz' }), '10.0.0.3')
assert.equal(tzOk.status, 200)

const honeypot = await handleApply('claude', claude({ company_fax: 'https://spam.example', email: 'spam@example.xyz' }), '10.0.0.4')
assert.equal(honeypot.status, 200)
assert.equal(honeypot.body.id, undefined)
assert.equal(readMemoryLog().filter((row) => row.claude?.email === 'spam@example.xyz').length, 0)

const noConsent = await handleApply('claude', claude({ consent: false, email: 'no@example.xyz' }), '10.0.0.5')
assert.equal(noConsent.status, 400)

const company = await handleApply('partner', partner({ org: '' }), '10.1.0.1')
assert.equal(company.status, 400)
assert.match(company.body.error ?? '', /company/)

const person = await handleApply('partner', partner({ applicantType: 'individual', org: '', email: 'solo@example.xyz' }), '10.1.0.2')
assert.equal(person.status, 200)

const badSite = await handleApply('partner', partner({ website: 'example.xyz', email: 'site@example.xyz' }), '10.1.0.3')
assert.equal(badSite.status, 400)

const noType = await handleApply('partner', partner({ partnershipTypes: [], email: 'type@example.xyz' }), '10.1.0.4')
assert.equal(noType.status, 400)

resetRateLimits()
let limited = 0
for (let i = 0; i < 6; i++) {
  const result = await handleApply('claude', claude({ email: `rate${i}@example.xyz` }), '10.9.9.9')
  if (result.status === 429) limited = i + 1
}
assert.equal(limited, 6)

let methodStatus = 0
await dispatch('claude', { method: 'GET', body: {}, headers: {} }, {
  status(code: number) {
    methodStatus = code
    return { json() {} }
  },
})
assert.equal(methodStatus, 405)

for (const result of [badWallet, noConsent, company, badSite, noType]) {
  assert.doesNotMatch(result.body.error ?? '', /[-–—]/)
  assert.doesNotMatch(result.body.error ?? '', /\/(nac|usecases|claude|partners|resources|builder)\b/)
}

console.log('form tests passed')
