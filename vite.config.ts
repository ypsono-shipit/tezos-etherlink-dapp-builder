import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { defineConfig, type Plugin, type Connect } from 'vite'
import react from '@vitejs/plugin-react'

const root = dirname(fileURLToPath(import.meta.url))

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function apiDev(): Plugin {
  return {
    name: 'tezos-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/claude-apply' && url !== '/api/partner-apply') return next()
        try {
          const length = Number(req.headers['content-length'] || 0)
          if (length > 100_000) {
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'That application is too large.' }))
            return
          }
          const raw = await readBody(req)
          let body: unknown = {}
          if (raw) {
            try { body = JSON.parse(raw) } catch { body = null }
          }
          const outfile = resolve(root, 'node_modules/.cache/tezosx-api.mjs')
          mkdirSync(dirname(outfile), { recursive: true })
          await build({
            entryPoints: [resolve(root, 'api/_lib/apply.ts')],
            bundle: true,
            platform: 'node',
            format: 'esm',
            outfile,
            packages: 'external',
          })
          const mod = await import(pathToFileURL(outfile).href + `?t=${Date.now()}`)
          const kind = url.endsWith('claude-apply') ? 'claude' : 'partner'
          const result = await mod.handleApply(kind, body, req.socket.remoteAddress || 'local')
          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch (error) {
          console.error(error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Something went wrong. Please try again.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDev()],
  appType: 'spa',
})
