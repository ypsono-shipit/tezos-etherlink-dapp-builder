const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 5
const hits = new Map<string, number[]>()

export function resetRateLimits() {
  hits.clear()
}

function remember(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

async function upstashAllow(key: string): Promise<boolean | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!base || !token) return null
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const incr = await fetch(`${base.replace(/\/$/, '')}/incr/${encodeURIComponent(key)}`, { headers })
    if (!incr.ok) return null
    const payload = (await incr.json()) as { result?: number }
    const count = payload.result ?? 0
    if (count === 1) {
      await fetch(`${base.replace(/\/$/, '')}/expire/${encodeURIComponent(key)}/600`, { headers })
    }
    return count <= LIMIT
  } catch (error) {
    console.error('Rate limit store failed, using memory.', error)
    return null
  }
}

export async function allow(key: string): Promise<boolean> {
  const remote = await upstashAllow(key)
  if (remote !== null) return remote
  return remember(key)
}
