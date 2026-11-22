import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const forbidden = /#3ddc97|mint|emerald|teal|green|amber/i
const roots = ['src', 'public', 'index.html', 'tailwind.config.js', 'api']
if (existsSync('dist')) roots.push('dist')

function files(path, out = []) {
  if (!existsSync(path)) return out
  const info = statSync(path)
  if (info.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (name === 'node_modules' || name.endsWith('.map')) continue
      files(join(path, name), out)
    }
    return out
  }
  if (/\.(png|jpg|jpeg|webp|woff2?|map)$/.test(path)) return out
  out.push(path)
  return out
}

function hueOk(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (max <= 60) return true
  const sat = max === 0 ? 0 : delta / max
  if (sat < 0.22) return true
  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  return h >= 205 && h <= 250
}

function expand(hex) {
  if (hex.length === 3) return hex.split('').map((c) => c + c).join('')
  return hex
}

const problems = []
for (const root of roots) {
  for (const file of files(root)) {
    const text = readFileSync(file, 'utf8')
    if (forbidden.test(text)) {
      const line = text.split('\n').findIndex((row) => forbidden.test(row)) + 1
      problems.push(`${file}:${line} forbidden palette word`)
    }
    if (file.startsWith('dist')) continue
    const hexes = text.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/g)
    for (const match of hexes) {
      const hex = expand(match[1])
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      if (!hueOk(r, g, b)) problems.push(`${file} off palette #${hex} rgb(${r},${g},${b})`)
    }
    const rgbs = text.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)
    for (const match of rgbs) {
      const r = Number(match[1])
      const g = Number(match[2])
      const b = Number(match[3])
      if (!hueOk(r, g, b)) problems.push(`${file} off palette rgba(${r},${g},${b})`)
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('palette check passed')
