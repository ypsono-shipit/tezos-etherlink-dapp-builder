import { spawnSync } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const outDir = resolve('.api-build')
rmSync(outDir, { recursive: true, force: true })

const compiled = spawnSync(
  'npx',
  ['tsc', '-p', 'tsconfig.api.json', '--pretty', 'false'],
  { stdio: 'inherit', shell: false },
)
if (compiled.status !== 0) {
  console.error('API TypeScript emit failed')
  process.exit(compiled.status ?? 1)
}

const handlers = ['api/boundless-apply.js', 'api/claude-apply.js', 'api/partner-apply.js']
for (const file of handlers) {
  const source = readFileSync(resolve(outDir, file), 'utf8')
  if (source.includes('.ts"') || source.includes(".ts'")) {
    console.error(`${file} still imports a .ts path after compile`)
    process.exit(1)
  }
}

async function call(mod, body, method = 'POST', ip = 'unknown') {
  return new Promise((done, reject) => {
    const res = {
      status(code) {
        return {
          json(payload) {
            done({ code, payload })
          },
        }
      },
    }
    const headers = ip === 'unknown' ? {} : { 'x-forwarded-for': ip }
    Promise.resolve(mod.default({ method, body, headers }, res)).catch(reject)
  })
}

const loaded = new Map()
for (const file of handlers) {
  const mod = await import(resolve(outDir, file))
  loaded.set(file, mod)
  if (typeof mod.default !== 'function') {
    console.error(`${file} has no default handler`)
    process.exit(1)
  }
  const bad = await call(mod, {})
  if (bad.code !== 400 || bad.payload?.ok !== false) {
    console.error(`${file} did not reject an empty application`, bad)
    process.exit(1)
  }
  const denied = await call(mod, {}, 'GET')
  if (denied.code !== 405) {
    console.error(`${file} did not reject GET`, denied)
    process.exit(1)
  }
}

const helpers = ['api/_lib/apply.js', 'api/_lib/storage.js', 'api/_lib/ratelimit.js', 'src/lib/validate.js']
for (const file of helpers) {
  await import(resolve(outDir, file))
}

process.env.FORM_STORAGE = 'log'
delete process.env.GOOGLE_SHEETS_CLAUDE_TAB
const storage = await import(resolve(outDir, 'api/_lib/storage.js'))
if (storage.CLAUDE_APPLICATIONS_TAB !== 'claude_applications' || storage.sheetTab('boundless') !== 'claude_applications') {
  console.error('Boundless applications must keep writing to the claude_applications sheet tab')
  process.exit(1)
}

const application = {
  wallet: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
  email: 'boundless-check@example.xyz',
  xHandle: 'tezbuilder',
  buildIdea: 'A MetaMask checkout for Michelson FA2 NFTs.',
  priorWork: 'A small token dApp.',
  consent: true,
}
for (const file of ['api/boundless-apply.js', 'api/claude-apply.js']) {
  const mod = loaded.get(file)
  const ok = await call(mod, { ...application, email: file.includes('claude') ? 'alias-check@example.xyz' : application.email }, 'POST', '10.8.8.8')
  if (ok.code !== 200 || ok.payload?.ok !== true || !ok.payload?.id) {
    console.error(`${file} did not accept a Boundless application`, ok)
    process.exit(1)
  }
}
const saved = storage.readMemoryLog()
if (saved.length !== 2 || saved.some((row) => row.kind !== 'boundless' || !row.boundless)) {
  console.error('Boundless applications were not stored on the log adapter', saved)
  process.exit(1)
}

console.log('compiled API handlers load')
