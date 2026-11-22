import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Droplets, GitMerge, Home, Library, Lightbulb, Plus, Rocket, Handshake, Sparkles } from 'lucide-react'
import { addPreviewnet } from '../lib/wallet.ts'
import { CHAIN_ID, FAUCET, MICHELSON_CHAIN } from '../data/network.ts'

const ToastContext = createContext<(message: string) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function Wave({ count = 120, mode = 'valley', className = '' }: { count?: number; mode?: 'valley' | 'wave'; className?: string }) {
  const bars = useMemo(() => {
    const next: { cls: string; v: number }[] = []
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1)
      let v = mode === 'valley'
        ? 0.28 + 0.72 * Math.pow(Math.abs(x - 0.5) * 2, 1.6)
        : 0.35 + 0.4 * Math.sin(x * Math.PI * 3) + 0.25 * Math.sin(x * 17)
      v = Math.max(0.08, Math.min(1, v + ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.08))
      const cls = i % 23 === 11 ? 'm' : i % 3 === 2 ? 'd' : ''
      next.push({ cls, v })
    }
    return next
  }, [count, mode])

  return (
    <div className={`wave ${className}`} aria-hidden="true">
      {bars.map((bar, index) => (
        <i key={index} className={bar.cls} style={{ height: `${Math.round(bar.v * 100)}%`, animationDelay: `${(index % 20) * -0.16}s` }} />
      ))}
    </div>
  )
}

export function Ph({ children }: { children: string }) {
  return <span className="ph">{children}</span>
}

export function Logo({ club = true }: { club?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="w-7 h-7 rounded-full bg-white text-ink grid place-items-center text-sm font-extrabold">ꜩ</span>
      Tezos X
      {club ? <span className="text-muted font-normal hidden sm:inline">Builders’ Club</span> : null}
    </Link>
  )
}

export function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [on, setOn] = useState(false)
  const notify = (next: string) => {
    setMessage(next)
    setOn(true)
    window.setTimeout(() => setOn(false), 1200)
  }
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] pill bg-white text-ink text-sm font-semibold px-4 py-2 transition pointer-events-none ${on ? 'opacity-100' : 'opacity-0'}`} role="status">
        {message || 'Copied'}
      </div>
    </ToastContext.Provider>
  )
}

export async function copyValue(value: string, notify: (message: string) => void) {
  try {
    await navigator.clipboard.writeText(value)
    notify('Copied')
  } catch {
    notify('Copy failed')
  }
}

export function CopyButton({ value, label, className = '', children }: { value: string; label: string; className?: string; children?: ReactNode }) {
  const notify = useToast()
  return (
    <button type="button" className={className} aria-label={label} onClick={() => { void copyValue(value, notify) }}>
      {children}
    </button>
  )
}

export function AddMetaMask({ className, children }: { className: string; children: ReactNode }) {
  const notify = useToast()
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        void addPreviewnet().then((result) => {
          if (result === 'added') notify('Network added')
        })
      }}
    >
      {children}
    </button>
  )
}

const NAV = [
  { to: '/', label: 'Home', key: 'home' },
  { to: '/nac', label: 'Composability', key: 'nac' },
  { to: '/usecases', label: 'Use cases', key: 'ideas' },
  { to: '/claude', label: 'Claude perk', key: 'perk' },
  { to: '/resources', label: 'Resources', key: 'docs' },
  { to: '/#builder', label: 'dApp Builder', key: 'builder' },
]

function useActiveKey() {
  const { pathname } = useLocation()
  const [builder, setBuilder] = useState(false)
  useEffect(() => {
    if (pathname !== '/') {
      setBuilder(false)
      return
    }
    const section = document.getElementById('builder')
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setBuilder(entry.isIntersecting),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  if (pathname === '/' && builder) return 'builder'
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/nac')) return 'nac'
  if (pathname.startsWith('/usecases')) return 'ideas'
  if (pathname.startsWith('/claude')) return 'perk'
  if (pathname.startsWith('/resources')) return 'docs'
  return ''
}

function DesktopNav() {
  const active = useActiveKey()
  return (
    <header className="fixed top-4 inset-x-0 z-50 hidden md:block">
      <div className="mx-auto max-w-6xl px-6">
        <div className="tabbar pill flex items-center justify-between pl-5 pr-2 py-2">
          <Logo />
          <nav className="flex items-center gap-1 text-sm text-muted" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.key} to={item.to} className={`px-3 py-1.5 pill hover:text-white ${active === item.key ? 'text-azure bg-azure/10' : ''}`} aria-current={active === item.key ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link to="/nac#quickstart" className="pill bg-royal text-white text-sm font-semibold px-4 py-2 flex items-center gap-1.5">
            Start building <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function MobileHeader() {
  const { pathname } = useLocation()
  const home = pathname === '/'
  return (
    <div className="md:hidden flex items-center justify-between px-5 pt-5 relative z-20">
      <Logo club={false} />
      {home ? (
        <Link to="/nac#quickstart" className="glass-soft pill px-3 py-1.5 text-xs flex items-center gap-1.5">
          Quickstart <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <Link to="/" className="glass-soft pill px-3 py-1.5 text-xs flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </Link>
      )}
    </div>
  )
}

function MobileTabs() {
  const active = useActiveKey()
  const tabs = [
    { to: '/', label: 'Home', key: 'home', icon: Home },
    { to: '/nac', label: 'NAC', key: 'nac', icon: GitMerge },
    { to: '/usecases', label: 'Ideas', key: 'ideas', icon: Lightbulb },
    { to: '/claude', label: 'Perk', key: 'perk', icon: Sparkles },
    { to: '/resources', label: 'Docs', key: 'docs', icon: Library },
  ]
  return (
    <nav className="md:hidden fixed bottom-4 inset-x-4 z-50 tabbar rounded-[26px] px-3 py-2.5 flex justify-between text-[10px] text-muted" aria-label="Sections">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Link key={tab.key} to={tab.to} className={`flex flex-col items-center gap-1 px-2 ${active === tab.key ? 'text-azure' : ''}`} aria-current={active === tab.key ? 'page' : undefined}>
            <Icon className="w-5 h-5" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-16 md:mt-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 md:px-6 py-10">
        <Link to="/partners" className="glass-soft mb-4 p-4 md:px-5 flex items-center gap-4">
          <span className="icon-c bg-white text-ink"><Handshake className="w-5 h-5" /></span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Become a partner</div>
            <div className="text-xs text-muted">Sponsor, offer bounties, or mentor members of the Tezos X Builders’ Club.</div>
          </div>
          <span className="hidden sm:flex pill bg-white/10 px-4 py-2 text-sm font-medium items-center gap-1.5 whitespace-nowrap">Partner with us <ArrowRight className="w-4 h-4" /></span>
          <ArrowRight className="w-5 h-5 sm:hidden text-muted" />
        </Link>
        <div className="glass p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <span className="icon-c bg-royal text-white"><Rocket className="w-5 h-5" /></span>
            <div>
              <div className="font-semibold text-sm">Previewnet quickstart</div>
              <div className="text-xs text-muted">Add both interfaces, fund, ship.</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:ml-auto text-xs">
            <CopyButton value={CHAIN_ID} label="Copy EVM chain ID" className="copy glass-soft pill px-3 py-2 mono flex items-center gap-2">
              <span className="text-muted">EVM</span>{CHAIN_ID}
            </CopyButton>
            <CopyButton value={MICHELSON_CHAIN} label="Copy Michelson chain ID" className="copy glass-soft pill px-3 py-2 mono flex items-center gap-2">
              <span className="text-muted">Michelson</span>{MICHELSON_CHAIN}
            </CopyButton>
            <AddMetaMask className="pill bg-white text-ink font-semibold px-3.5 py-2 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add to MetaMask
            </AddMetaMask>
            <a href={FAUCET} className="pill bg-royal text-white font-semibold px-3.5 py-2 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5" /> Faucet
            </a>
            <Link to="/nac#quickstart" className="pill glass-soft px-3.5 py-2 flex items-center gap-1.5">
              Full guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-6 h-6 rounded-full bg-white text-ink grid place-items-center text-xs font-extrabold">ꜩ</span>
              Tezos X Builders’ Club
            </div>
            <p className="text-xs text-muted mt-2">Tracks & prizes <Ph>tbc</Ph></p>
            <div className="tl grid-cols-4 mt-5 text-[11px]">
              <div><div className="n on" /><div className="mt-2 text-white">Previewnet</div><div className="text-muted">Live</div></div>
              <div><div className="n" /><div className="mt-2 text-white">Kickoff</div><div className="text-muted">TBC</div></div>
              <div><div className="n" /><div className="mt-2 text-white">Submit</div><div className="text-muted">TBC</div></div>
              <div><div className="n" /><div className="mt-2 text-white">Winners</div><div className="text-muted">TBC</div></div>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-2">Learn</div>
            <div className="space-y-1.5">
              <Link className="block" to="/nac">Native Atomic Composability</Link>
              <Link className="block" to="/usecases">Use cases</Link>
              <a className="block" href="https://docs.etherlink.com/tutorials/nac-counter">NAC tutorial</a>
              <Link className="block" to="/resources">Resources library</Link>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-2">Build</div>
            <div className="space-y-1.5">
              <Link className="block" to="/#builder">dApp Builder</Link>
              <Link className="block" to="/claude">Claude perk</Link>
              <a className="block" href="https://previewnet.tezosx.nomadic-labs.com/">Previewnet dashboard</a>
              <Link className="block" to="/partners">Become a partner</Link>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted mb-2">Community</div>
            <div className="space-y-1.5">
              <a className="block" href="https://discord.gg/tezos">Discord</a>
              <a className="block" href="https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder">GitHub</a>
              <a className="block" href="https://tezos.com/tezos-x/"><code className="mono">tezos.com/tezos-x</code></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 text-xs text-muted flex justify-end">
          <span className="max-w-full text-right break-all">Network data: <code className="mono">github.com/trilitech/tezos-x-previewnet</code></span>
        </div>
      </div>
    </footer>
  )
}

export function Marketing({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => { document.title = title }, [title])
  return (
    <ToastProvider>
      <div className="overflow-x-hidden pb-28 md:pb-0" data-page-title={title}>
        <DesktopNav />
        <MobileHeader />
        <MobileTabs />
        <main className="relative overflow-hidden">
          {children}
          <Footer />
        </main>
      </div>
    </ToastProvider>
  )
}

export function FormPage({ title, backTo, children }: { title: string; backTo: string; children: ReactNode }) {
  useEffect(() => { document.title = title }, [title])
  return (
    <ToastProvider>
      <div className="overflow-x-hidden pb-10" data-page-title={title}>
        <header className="relative z-20 mx-auto max-w-6xl px-5 md:px-6 pt-5 md:pt-6 flex items-center justify-between">
          <Logo />
          <Link to={backTo} className="pill glass-soft px-4 py-2 text-sm flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </header>
        <main className="relative [overflow-x:clip]">{children}</main>
      </div>
    </ToastProvider>
  )
}

export function PageTitle({ title }: { title: string }) {
  useEffect(() => { document.title = title }, [title])
  return <span className="sr-only" data-page-title={title}>{title}</span>
}
