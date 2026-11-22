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

const handlers = ['api/claude-apply.js', 'api/partner-apply.js']
for (const file of handlers) {
  const source = readFileSync(resolve(outDir, file), 'utf8')
  if (source.includes('.ts"') || source.includes(".ts'")) {
    console.error(`${file} still imports a .ts path after compile`)
    process.exit(1)
  }
}

async function call(mod, body, method = 'POST') {
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
    Promise.resolve(mod.default({ method, body, headers: {} }, res)).catch(reject)
  })
}

for (const file of handlers) {
  const mod = await import(resolve(outDir, file))
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

console.log('compiled API handlers load')
