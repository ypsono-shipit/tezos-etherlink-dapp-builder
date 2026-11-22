import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Check, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { HONEYPOT, validateClaude, type WalletKind } from '../lib/validate.ts'
import { FormPage, Ph, Wave } from '../components/ui.tsx'

const HINTS: Record<WalletKind, [string, string]> = {
  evm: ['0x1234…abcd', 'EVM interface address: 0x + 40 hex characters.'],
  tz: ['tz1…', 'Michelson interface address: tz1 / tz2 / tz3, 36 characters.'],
}

export default function ClaudePage() {
  const [params] = useSearchParams()
  const idea = params.get('idea') ?? ''
  const [kind, setKind] = useState<WalletKind>('evm')
  const [wallet, setWallet] = useState('')
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [build, setBuild] = useState(idea && !idea.includes('/') ? idea : '')
  const [prior, setPrior] = useState('')
  const [consent, setConsent] = useState(true)
  const [fax, setFax] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = { wallet, email, xHandle: handle, buildIdea: build, priorWork: prior, consent, [HONEYPOT]: fax }
    const local = validateClaude(payload)
    if (!local.ok) {
      setError(local.errors.join(' '))
      return
    }
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/claude-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null
      if (!response.ok || !json?.ok) {
        setError(json?.error || 'Something went wrong. Please try again.')
        setSending(false)
        return
      }
      setDone(true)
      window.scrollTo(0, 0)
    } catch {
      setError('Could not reach the server. Please try again.')
      setSending(false)
    }
  }

  return (
    <FormPage title="Free Claude sub | Tezos X" backTo="/#perk">
      <div className="orb w-[560px] h-[560px] bg-royal/55 -top-32 -left-40 md:left-[5%]" />
      <Wave count={160} mode="wave" className="top-[620px] md:top-auto md:bottom-0 h-[120px] opacity-25 hidden md:flex" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-6 pt-10 md:pt-16 grid md:grid-cols-[.85fr_1.15fr] gap-10 md:gap-14 items-start">
        <div className={`md:sticky md:top-10 ${done ? 'hidden md:block' : ''}`}>
          <div className="flex items-center gap-2 mb-5">
            <span className="pill bg-azure/15 text-azure text-xs font-semibold px-3 py-1">Builder perk</span>
            <Ph>terms tbc</Ph>
          </div>
          <h1 className="h-sec text-[40px] md:text-6xl">Free Claude sub <b>by ypsono.</b></h1>
          <p className="text-muted mt-5 md:text-lg">For builders shipping on Tezos X Previewnet. Tell us what you want to build and what you have built before. Selected applicants get a Claude subscription for the hackathon.</p>
          <div className="meta mt-5">
            <b>Free</b><span className="sep" />
            <span>Limited seats <Ph>tbc</Ph></span><span className="sep" />
            <span>~2 min to apply</span>
          </div>
          <div className="mt-8">
            <div className="text-xs text-muted mb-3 uppercase tracking-[.18em]">How it works</div>
            <div className="tl grid-cols-3">
              <div><div className="n on" /><div className="mt-2.5 text-sm font-semibold">Apply</div><div className="text-xs text-muted">Today</div></div>
              <div><div className="n" /><div className="mt-2.5 text-sm font-semibold">Review</div><div className="text-xs text-muted">Rolling</div></div>
              <div><div className="n" /><div className="mt-2.5 text-sm font-semibold">Access</div><div className="text-xs text-muted">By email</div></div>
            </div>
          </div>
          <div className="glass mt-8 p-2 divide-y divide-white/5">
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-white text-ink"><Sparkles className="w-5 h-5" /></span><div className="flex-1"><div className="font-semibold text-sm">What you get</div><div className="text-xs text-muted">Claude subscription · duration <Ph>tbc</Ph></div></div></div>
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-azure/15 text-azure"><Users className="w-5 h-5" /></span><div className="flex-1"><div className="font-semibold text-sm">Seats</div><div className="text-xs text-muted">Limited · number <Ph>tbc</Ph></div></div></div>
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-royal/25 text-[#8fb0ff]"><CalendarCheck className="w-5 h-5" /></span><div className="flex-1"><div className="font-semibold text-sm">Decisions</div><div className="text-xs text-muted">Rolling, by email <Ph>tbc</Ph></div></div></div>
          </div>
        </div>

        {done ? (
          <div className="glass p-8 md:p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-royal text-white grid place-items-center pulse mb-6"><Check className="w-8 h-8" /></div>
            <h2 className="h-sec text-3xl md:text-4xl">You're <b>in the queue.</b></h2>
            <p className="text-muted mt-3 max-w-md mx-auto">Thanks! We'll email you at <span className="text-white">{email}</span> once applications are reviewed. Meanwhile, get set up on Previewnet.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link to="/nac#quickstart" className="pill bg-white text-ink font-semibold px-5 py-3">Previewnet quickstart</Link>
              <Link to="/usecases" className="pill glass-soft px-5 py-3">Browse ideas</Link>
            </div>
          </div>
        ) : (
          <form className="glass p-5 md:p-8 space-y-5" noValidate onSubmit={(event) => { void onSubmit(event) }}>
            <div className="flex items-center justify-between"><div className="text-lg font-bold">Apply</div><span className="text-xs text-muted">All fields required</span></div>
            <div>
              <label className="block text-sm font-medium" htmlFor="wallet">Wallet address</label>
              <div className="seg mt-2 mb-2" role="tablist" aria-label="Wallet kind">
                <button type="button" className={kind === 'evm' ? 'on' : ''} onClick={() => setKind('evm')}>EVM 0x…</button>
                <button type="button" className={kind === 'tz' ? 'on' : ''} onClick={() => setKind('tz')}>Tezos tz1…</button>
              </div>
              <input id="wallet" value={wallet} onChange={(event) => setWallet(event.target.value)} className="field w-full px-4 py-3.5 mono text-sm placeholder:text-white/30" placeholder={HINTS[kind][0]} autoComplete="off" />
              <div className="text-xs text-muted mt-1.5">{HINTS[kind][1]}</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="you@builder.xyz" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="x">X handle</label>
                <div className="field mt-2 flex items-center px-4">
                  <span className="text-muted">@</span>
                  <input id="x" value={handle} onChange={(event) => setHandle(event.target.value)} className="bg-transparent w-full py-3.5 pl-1 text-sm placeholder:text-white/30" placeholder="yourhandle" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="build">What are you looking to build?</label>
              <textarea id="build" rows={4} value={build} onChange={(event) => setBuild(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="e.g. a MetaMask checkout for Michelson FA2 NFTs using callMichelson…" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="prev">What have you built before?</label>
              <textarea id="prev" rows={3} value={prior} onChange={(event) => setPrior(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="Links to GitHub, deployed dApps, hackathon wins…" />
            </div>
            <label className="flex items-start gap-3 text-xs text-muted">
              <input type="checkbox" className="mt-0.5 accent-[#7fa8ff]" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              I agree to be contacted about the perk and the Tezos X hackathon. <Ph>privacy copy tbc</Ph>
            </label>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={fax} onChange={(event) => setFax(event.target.value)} name={HONEYPOT} />
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-xs text-muted flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-azure" />Spam protected</span>
              <button disabled={sending} className="pill bg-royal text-white font-semibold pl-6 pr-2 py-2 flex items-center gap-3 whitespace-nowrap disabled:opacity-60">
                {sending ? 'Sending' : 'Submit'}<span className="hidden sm:inline">{sending ? '' : ' application'}</span>
                <span className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center"><ArrowRight className="w-4 h-4" /></span>
              </button>
            </div>
            {error ? <div className="text-sm text-ice" role="alert">{error}</div> : null}
          </form>
        )}
      </div>
    </FormPage>
  )
}
