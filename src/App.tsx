import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'human' | 'agent'

interface Skill {
  category: string
  categoryColor: string
  title: string
  description: string
  file: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REPO = 'https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder'
const RAW  = 'https://raw.githubusercontent.com/ypsono-shipit/tezos-etherlink-dapp-builder/main'

const NPX_HUMAN = `npx skills add ${REPO}`
const NPX_AGENT = `# Add to your AI agent's context:
npx skills add ${REPO}

# Or reference the SKILL.md directly:
${RAW}/skill/SKILL.md

# Individual reference files:
${RAW}/skill/references/etherlink-network-info.md
${RAW}/skill/references/etherlink-hardhat-config.md
${RAW}/skill/references/tezos-smart-contract-quickstart.md
${RAW}/skill/references/taquito-frontend-guide.md
${RAW}/skill/references/bridging-xtz-fa-complete-guide.md`

const SKILLS: Skill[] = [
  {
    category: 'NETWORK',
    categoryColor: '#2C7DF7',
    title: 'Etherlink Network Info',
    description: 'RPC endpoints, chain IDs, block explorer links, and faucet URLs for Etherlink mainnet and Shadownet testnet. Ready to paste into Hardhat, viem, or MetaMask.',
    file: 'etherlink-network-info.md',
  },
  {
    category: 'TOOLING',
    categoryColor: '#00C2FF',
    title: 'Hardhat Configuration',
    description: 'Complete Hardhat setup with deploy scripts pre-configured for Etherlink mainnet and Shadownet. Includes environment variable handling and verification commands.',
    file: 'etherlink-hardhat-config.md',
  },
  {
    category: 'CONTRACTS',
    categoryColor: '#7B5CF5',
    title: 'Smart Contract Quickstart',
    description: 'SmartPy and JsLIGO contract examples including an FA2 token. Covers compilation with Taqueria and deployment via octez-client on Tezos L1.',
    file: 'tezos-smart-contract-quickstart.md',
  },
  {
    category: 'FRONTEND',
    categoryColor: '#10B981',
    title: 'Taquito Frontend Guide',
    description: 'React integration with Taquito + Beacon Wallet for Tezos L1. Includes a reusable useWallet hook and a hybrid setup combining viem for the Etherlink side.',
    file: 'taquito-frontend-guide.md',
  },
  {
    category: 'BRIDGING',
    categoryColor: '#F59E0B',
    title: 'XTZ & FA Token Bridging',
    description: 'Complete guide for bridging XTZ and FA2 tokens between Tezos L1 and Etherlink. Covers instant deposits, fast withdrawals, and standard secure withdrawals.',
    file: 'bridging-xtz-fa-complete-guide.md',
  },
  {
    category: 'SECURITY',
    categoryColor: '#EF4444',
    title: 'Security Checklist',
    description: 'Pre-deployment security review covering Solidity contracts on Etherlink and SmartPy/LIGO on Tezos L1. Includes bridge, key management, and audit guidance.',
    file: 'security-checklist.md',
  },
  {
    category: 'DEPLOYMENT',
    categoryColor: '#3B82F6',
    title: 'Deployment Checklist',
    description: 'Six-phase launch process from local development through Shadownet testing to mainnet. Includes a quick-reference network table for all RPC endpoints.',
    file: 'deployment-checklist.md',
  },
  {
    category: 'ARCHITECTURE',
    categoryColor: '#8B5CF6',
    title: 'Architecture Comparison',
    description: 'Side-by-side comparison of Tezos L1 vs Etherlink across language, speed, tooling, and assets. Includes hybrid architecture patterns for production apps.',
    file: 'architecture-comparison.md',
  },
]

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className={`transition-all duration-200 ${className}`}
      style={{
        background: copied ? '#10B98122' : '#1A2E5288',
        border: `1px solid ${copied ? '#10B98155' : '#1A2E52'}`,
        borderRadius: 6,
        padding: '6px 10px',
        color: copied ? '#10B981' : '#7A9CC4',
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          Copy
        </>
      )}
    </button>
  )
}

// ─── Tezos Logo ───────────────────────────────────────────────────────────────

function TezosLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#2C7DF7" opacity="0.15" />
        <text x="14" y="19" textAnchor="middle" fill="#2C7DF7" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">ꜩ</text>
      </svg>
      <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
        Tezos <span style={{ color: '#2C7DF7' }}>Skills</span>
      </span>
    </div>
  )
}

// ─── Skill Card ───────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: Skill }) {
  const fileUrl = `${REPO}/blob/main/skill/references/${skill.file}`
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#0C1528',
        border: '1px solid #1A2E52',
        borderLeft: `3px solid ${skill.categoryColor}`,
        borderRadius: 10,
        padding: '28px 28px 24px',
        textDecoration: 'none',
        transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.background = '#0F1D38'
        el.style.borderColor = `#2A4070`
        el.style.borderLeftColor = skill.categoryColor
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.background = '#0C1528'
        el.style.borderColor = '#1A2E52'
        el.style.borderLeftColor = skill.categoryColor
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Category badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 20,
        background: `${skill.categoryColor}18`,
        border: `1px solid ${skill.categoryColor}40`,
        color: skill.categoryColor,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        marginBottom: 16,
        alignSelf: 'flex-start',
      }}>
        {skill.category}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>
        {skill.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#7A9CC4', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
        {skill.description}
      </p>

      {/* Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7A9CC4', fontSize: 13, fontWeight: 500 }}>
        View on GitHub
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<Tab>('human')

  const copyText = tab === 'human' ? NPX_HUMAN : NPX_AGENT

  return (
    <div style={{ minHeight: '100vh', background: '#060D1F' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6, 13, 31, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1A2E52',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <TezosLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a
            href="https://docs.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#7A9CC4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A9CC4')}
          >Docs</a>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#7A9CC4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A9CC4')}
          >GitHub</a>
          <a
            href="https://tezos.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#2C7DF7',
              color: '#fff',
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Tezos.com
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 560, display: 'flex', alignItems: 'center' }}>

        {/* Aurora background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 15% 55%, rgba(44,125,247,0.28) 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 75% 25%, rgba(0,194,255,0.18) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 85% 75%, rgba(123,92,245,0.15) 0%, transparent 50%)
            `,
          }} />
          {/* Mesh grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: `linear-gradient(rgba(44,125,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(44,125,247,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '80px 32px 100px', width: '100%' }}>
          {/* Eyebrow */}
          <p className="fade-in-up" style={{ color: '#2C7DF7', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Tezos Skills &nbsp;|&nbsp; Developer Tooling Resources
          </p>

          {/* Heading */}
          <h1 className="fade-in-up delay-1" style={{ fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', marginBottom: 24, maxWidth: 700 }}>
            Agent Skills
          </h1>

          {/* Subtitle */}
          <p className="fade-in-up delay-2" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#7A9CC4', lineHeight: 1.65, maxWidth: 620, marginBottom: 40, fontWeight: 400 }}>
            Pre-built skills you can drop into your AI agents to build on Tezos L1 and Etherlink.
            Each skill gives your agent the context it needs to write contracts, deploy, bridge assets, and more.
          </p>

          {/* Human / Agent toggle */}
          <div className="fade-in-up delay-3" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['human', 'agent'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 18px',
                  borderRadius: 99,
                  border: `1px solid ${tab === t ? '#2C7DF7' : '#1A2E52'}`,
                  background: tab === t ? '#2C7DF718' : 'transparent',
                  color: tab === t ? '#2C7DF7' : '#7A9CC4',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t === 'human' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                )}
                {t === 'human' ? 'Human' : 'Agent'}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="fade-in-up delay-4" style={{
            background: 'rgba(12, 21, 40, 0.9)',
            border: '1px solid #1A2E52',
            borderRadius: 10,
            padding: tab === 'human' ? '14px 18px' : '18px',
            display: 'flex',
            alignItems: tab === 'human' ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            maxWidth: 700,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: tab === 'human' ? 'center' : 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
              <span style={{ color: '#2C7DF7', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, flexShrink: 0, marginTop: tab === 'human' ? 0 : 1 }}>$</span>
              <pre style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13,
                color: '#CBD5E1',
                whiteSpace: tab === 'human' ? 'nowrap' : 'pre-wrap',
                overflow: 'auto',
                margin: 0,
                flex: 1,
              }}>
                {tab === 'human' ? NPX_HUMAN : NPX_AGENT}
              </pre>
            </div>
            <CopyButton text={copyText} />
          </div>

          {/* Sub-hint */}
          <p className="fade-in-up delay-4" style={{ marginTop: 14, color: '#4A6A94', fontSize: 13 }}>
            {tab === 'human'
              ? 'Run in your terminal to install the skill into Claude Code.'
              : 'Paste the raw SKILL.md URL directly into your agent\'s system prompt or context.'}
          </p>
        </div>
      </section>

      {/* ── Skills section ── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 32px 120px',
      }}>
        {/* Section header */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Official Skills
          </h2>
          <p style={{ fontSize: 18, color: '#7A9CC4', maxWidth: 560, lineHeight: 1.6 }}>
            Skills for building on Tezos L1 and Etherlink — maintained in the official repo.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, #2C7DF740, #1A2E52, transparent)', marginBottom: 56 }} />

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {SKILLS.map(skill => (
            <SkillCard key={skill.file} skill={skill} />
          ))}
        </div>
      </section>

      {/* ── Install CTA ── */}
      <section style={{
        borderTop: '1px solid #1A2E52',
        background: 'linear-gradient(180deg, #060D1F 0%, #091426 100%)',
        padding: '72px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(44,125,247,0.12) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#2C7DF718', border: '1px solid #2C7DF740',
            borderRadius: 99, padding: '5px 14px', marginBottom: 24,
            color: '#2C7DF7', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            ONE-COMMAND INSTALL
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Get started in seconds
          </h2>
          <p style={{ color: '#7A9CC4', fontSize: 16, lineHeight: 1.6, marginBottom: 36 }}>
            Add the complete Tezos + Etherlink knowledge base to your AI agent with one command.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#0C1528', border: '1px solid #1A2E52', borderRadius: 10,
            padding: '14px 18px', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#2C7DF7', fontFamily: 'monospace', fontSize: 14 }}>$</span>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#CBD5E1' }}>
                {NPX_HUMAN}
              </code>
            </div>
            <CopyButton text={NPX_HUMAN} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 8,
                background: '#2C7DF7', color: '#fff',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View on GitHub
            </a>
            <a
              href="https://docs.etherlink.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 24px', borderRadius: 8,
                background: 'transparent',
                border: '1px solid #1A2E52',
                color: '#7A9CC4', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2C7DF7'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E52'; e.currentTarget.style.color = '#7A9CC4' }}
            >
              Etherlink Docs →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #1A2E52',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <TezosLogo />
        <p style={{ color: '#4A6A94', fontSize: 13 }}>
          MIT License · Built for Tezos + Etherlink developers
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Tezos', href: 'https://tezos.com' },
            { label: 'Etherlink', href: 'https://etherlink.com' },
            { label: 'GitHub', href: REPO },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{ color: '#4A6A94', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7A9CC4')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A6A94')}
            >
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
