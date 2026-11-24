import { dispatch } from './_lib/apply.js'

type Req = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

// Older clients still post here. Same handler as /api/boundless-apply, and the
// sheet tab stays claude_applications.
export default function handler(req: Req, res: Res) {
  return dispatch('boundless', req, res)
}
