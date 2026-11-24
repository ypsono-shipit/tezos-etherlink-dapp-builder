import { dispatch } from './_lib/apply.js'

type Req = {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

export default function handler(req: Req, res: Res) {
  return dispatch('boundless', req, res)
}
