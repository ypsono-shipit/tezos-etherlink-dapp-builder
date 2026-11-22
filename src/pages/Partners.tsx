import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Handshake, Server, ShieldCheck, Trophy } from 'lucide-react'
import { HONEYPOT, PARTNER_TYPES, validatePartner, type ApplicantKind, type PartnerType } from '../lib/validate.ts'
import { FormPage, Ph, Wave } from '../components/ui.tsx'

export default function Partners() {
  const [kind, setKind] = useState<ApplicantKind>('company')
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [website, setWebsite] = useState('')
  const [types, setTypes] = useState<PartnerType[]>([])
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [fax, setFax] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  function toggle(type: PartnerType) {
    setTypes((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type])
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      applicantType: kind, name, org, role, email, xHandle: handle, website,
      partnershipTypes: types, message, consent, [HONEYPOT]: fax,
    }
    const local = validatePartner(payload)
    if (!local.ok) {
      setError(local.errors.join(' '))
      return
    }
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/partner-apply', {
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
    <FormPage title="Partner with us | Tezos X" backTo="/">
      <div className="orb w-[560px] h-[560px] bg-royal/55 -top-32 -left-40 md:left-[5%]" />
      <Wave count={160} mode="wave" className="md:bottom-0 h-[120px] opacity-25 hidden md:flex" />
      <div className="relative mx-auto max-w-6xl px-5 md:px-6 pt-10 md:pt-16 grid md:grid-cols-[.85fr_1.15fr] gap-10 md:gap-14 items-start">
        <div className={`md:sticky md:top-10 ${done ? 'hidden md:block' : ''}`}>
          <div className="flex items-center gap-2 mb-5">
            <span className="pill bg-azure/15 text-azure text-xs font-semibold px-3 py-1">Partnerships open</span>
          </div>
          <h1 className="h-sec text-[40px] md:text-6xl">Partner with us for the <b>Tezos X hackathon.</b></h1>
          <p className="text-muted mt-5 md:text-lg">Companies and individuals: put your product, prizes or expertise in front of builders shipping the first apps that compose EVM and Michelson in one transaction.</p>
          <div className="meta mt-5">
            <b>Companies</b><span className="sep" /><b>Individuals</b><span className="sep" />
            <span>Reply within a few days <Ph>tbc</Ph></span>
          </div>
          <div className="mt-8">
            <div className="text-xs text-muted mb-3 uppercase tracking-[.18em]">How it works</div>
            <div className="tl grid-cols-3">
              <div><div className="n on" /><div className="mt-2.5 text-sm font-semibold">Submit</div><div className="text-xs text-muted">This form</div></div>
              <div><div className="n" /><div className="mt-2.5 text-sm font-semibold">Intro call</div><div className="text-xs text-muted">With the team</div></div>
              <div><div className="n" /><div className="mt-2.5 text-sm font-semibold">Announce</div><div className="text-xs text-muted">On the site</div></div>
            </div>
          </div>
          <div className="glass mt-8 p-2 divide-y divide-white/5">
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-white text-ink"><Trophy className="w-5 h-5" /></span><div><div className="font-semibold text-sm">Sponsor a track or bounty</div><div className="text-xs text-muted">Prizes for builds on your protocol or tooling</div></div></div>
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-azure/15 text-azure"><GraduationCap className="w-5 h-5" /></span><div><div className="font-semibold text-sm">Mentor or judge</div><div className="text-xs text-muted">Office hours, workshops, demo day panel</div></div></div>
            <div className="flex items-center gap-4 p-4"><span className="icon-c bg-royal/25 text-[#8fb0ff]"><Server className="w-5 h-5" /></span><div><div className="font-semibold text-sm">Tooling, credits & reach</div><div className="text-xs text-muted">Infra credits, APIs, community and media</div></div></div>
          </div>
          <p className="text-xs text-muted mt-5">Partner tiers & benefits <Ph>tbc</Ph></p>
        </div>

        {done ? (
          <div className="glass p-8 md:p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-royal text-white grid place-items-center pulse mb-6"><Handshake className="w-8 h-8" /></div>
            <h2 className="h-sec text-3xl md:text-4xl">Thanks for <b>reaching out.</b></h2>
            <p className="text-muted mt-3 max-w-md mx-auto">We've got your partnership request{org ? ` from ${org}` : ''}. The team will reply to <span className="text-white">{email}</span> shortly.</p>
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {types.map((type) => <span key={type} className="pill bg-azure/15 text-azure text-xs font-semibold px-3 py-1">{type}</span>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link to="/" className="pill bg-white text-ink font-semibold px-5 py-3">Back to home</Link>
              <Link to="/usecases" className="pill glass-soft px-5 py-3">See use cases</Link>
            </div>
          </div>
        ) : (
          <form className="glass p-5 md:p-8 space-y-5" noValidate onSubmit={(event) => { void onSubmit(event) }}>
            <div className="flex items-center justify-between"><div className="text-lg font-bold">Partner application</div><span className="text-xs text-muted">* required</span></div>
            <div>
              <div className="block text-sm font-medium mb-2">I'm applying as</div>
              <div className="seg" role="tablist" aria-label="Applicant type">
                <button type="button" className={kind === 'company' ? 'on' : ''} onClick={() => setKind('company')}>Company</button>
                <button type="button" className={kind === 'individual' ? 'on' : ''} onClick={() => setKind('individual')}>Individual</button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium" htmlFor="pname">Full name *</label><input id="pname" value={name} onChange={(event) => setName(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="Jane Doe" /></div>
              <div><label className="text-sm font-medium" htmlFor="org">Company / org {kind === 'company' ? '*' : '(optional)'}</label><input id="org" value={org} onChange={(event) => setOrg(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder={kind === 'company' ? 'Acme Labs' : 'Independent'} /></div>
              <div><label className="text-sm font-medium" htmlFor="role">Role / title *</label><input id="role" value={role} onChange={(event) => setRole(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="Head of DevRel" /></div>
              <div><label className="text-sm font-medium" htmlFor="email">Email *</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="jane@acme.xyz" /></div>
              <div>
                <label className="text-sm font-medium" htmlFor="x">X handle</label>
                <div className="field mt-2 flex items-center px-4"><span className="text-muted">@</span><input id="x" value={handle} onChange={(event) => setHandle(event.target.value)} className="bg-transparent w-full py-3.5 pl-1 text-sm placeholder:text-white/30" placeholder="acmelabs" /></div>
              </div>
              <div><label className="text-sm font-medium" htmlFor="site">Website</label><input id="site" value={website} onChange={(event) => setWebsite(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="https://acme.xyz" /></div>
            </div>
            <div>
              <div className="block text-sm font-medium mb-2.5">Partnership type * <span className="text-muted font-normal">(pick any)</span></div>
              <div className="flex flex-wrap gap-2">
                {PARTNER_TYPES.map((type) => (
                  <button type="button" key={type} className={`chip ${types.includes(type) ? 'on' : ''}`} aria-pressed={types.includes(type)} onClick={() => toggle(type)}>{type}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="how">How would you like to partner? *</label>
              <textarea id="how" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} className="field w-full mt-2 px-4 py-3.5 text-sm placeholder:text-white/30" placeholder="e.g. a bounty for the best dApp using an oracle across EVM and Michelson…" />
            </div>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={fax} onChange={(event) => setFax(event.target.value)} name={HONEYPOT} />
            <label className="flex items-start gap-3 text-xs text-muted">
              <input type="checkbox" className="mt-0.5 accent-[#7fa8ff]" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              I agree to be contacted by the Tezos X hackathon team about this partnership. <Ph>privacy copy tbc</Ph>
            </label>
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
