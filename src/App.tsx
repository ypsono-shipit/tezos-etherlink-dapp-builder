import { useState } from 'react'

type Tab = 'human' | 'agent'
type ChainTab = 'tezos' | 'etherlink' | 'shared'

interface Skill {
  category: string
  categoryColor: string
  title: string
  description: string
  path: string  // relative to skill/
}

const REPO = 'https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder'
const RAW  = 'https://raw.githubusercontent.com/ypsono-shipit/tezos-etherlink-dapp-builder/main'

const NPX_HUMAN = `npx skills add ${REPO}`
const NPX_AGENT_COMBINED = `# Combined skill (both chains):
${RAW}/skill/SKILL.md

# Tezos L1 only:
${RAW}/skill/tezos/SKILL.md

# Etherlink EVM only:
${RAW}/skill/etherlink/SKILL.md`

const TEZOS_SKILLS: Skill[] = [
  {
    category: 'CONTRACTS',
    categoryColor: '#7B5CF5',
    title: 'Smart Contract Quickstart',
    description: 'SmartPy and JsLIGO contract examples including an FA2 token. Compilation with Taqueria and deployment via octez-client on Tezos L1.',
    path: 'tezos/references/tezos-smart-contract-quickstart.md',
  },
  {
    category: 'FRONTEND',
    categoryColor: '#10B981',
    title: 'Taquito Frontend Guide',
    description: 'React integration with Taquito + Beacon Wallet (Temple, Kukai). Includes a reusable useWallet hook and hybrid Taquito + viem setup.',
    path: 'tezos/references/taquito-frontend-guide.md',
  },
  {
    category: 'SECURITY',
    categoryColor: '#EF4444',
    title: 'Security Checklist',
    description: 'Tezos L1-specific security review: sp.verify patterns, FA2 operator logic, ticket linearity, storage burn costs, and admin key management.',
    path: 'tezos/references/security-checklist.md',
  },
  {
    category: 'DEPLOYMENT',
    categoryColor: '#3B82F6',
    title: 'Deployment Checklist',
    description: 'Phase-by-phase Tezos L1 launch: local SmartPy tests → Ghostnet → security review → mainnet with octez-client or Taqueria.',
    path: 'tezos/references/deployment-checklist.md',
  },
]

const ETHERLINK_SKILLS: Skill[] = [
  {
    category: 'NETWORK',
    categoryColor: '#2C7DF7',
    title: 'Etherlink Network Info',
    description: 'RPC endpoints, chain IDs (42793 mainnet, 127823 Shadownet), explorer links, and faucet URLs. Ready to paste into Hardhat, viem, or MetaMask.',
    path: 'etherlink/references/network-info.md',
  },
  {
    category: 'TOOLING',
    categoryColor: '#00C2FF',
    title: 'Hardhat Configuration',
    description: 'Complete Hardhat setup with deploy scripts pre-configured for Etherlink mainnet and Shadownet. Includes .env handling and contract verification.',
    path: 'etherlink/references/hardhat-config.md',
  },
  {
    category: 'FRONTEND',
    categoryColor: '#10B981',
    title: 'viem Frontend Guide',
    description: 'viem v2 patterns for Etherlink: createPublicClient, wallet connection, MetaMask chain switching, writeContract, and ABI bigint casting.',
    path: 'etherlink/references/viem-frontend-guide.md',
  },
  {
    category: 'GAS & FEES',
    categoryColor: '#F59E0B',
    title: 'Gas & Fees',
    description: 'Etherlink two-part fee model: execution gas + L1 DA inclusion fee. Why hardcoded gas limits fail on large deploys, how eth_estimateGas bundles both, and safe buffer rules.',
    path: 'etherlink/references/gas-and-fees.md',
  },
  {
    category: 'SECURITY',
    categoryColor: '#EF4444',
    title: 'Security Checklist',
    description: 'Solidity/EVM security: reentrancy guards, OpenZeppelin access control, SafeERC20, input validation, and Etherlink-specific pitfalls.',
    path: 'etherlink/references/security-checklist.md',
  },
  {
    category: 'DEPLOYMENT',
    categoryColor: '#3B82F6',
    title: 'Deployment Checklist',
    description: 'Phase-by-phase Etherlink launch: Hardhat compile → Shadownet testing → security review → mainnet deploy with contract verification.',
    path: 'etherlink/references/deployment-checklist.md',
  },
]

const SHARED_SKILLS: Skill[] = [
  {
    category: 'BRIDGING',
    categoryColor: '#F59E0B',
    title: 'XTZ & FA Token Bridging',
    description: 'Complete guide for bridging XTZ and FA2 tokens between Tezos L1 and Etherlink. Covers instant deposits, fast withdrawals, and standard withdrawals.',
    path: 'shared/bridging-xtz-fa-complete-guide.md',
  },
  {
    category: 'ARCHITECTURE',
    categoryColor: '#8B5CF6',
    title: 'Architecture Comparison',
    description: 'Side-by-side comparison of Tezos L1 vs Etherlink: language, speed, tooling, token standards, and wallets. Includes hybrid architecture patterns.',
    path: 'shared/architecture-comparison.md',
  },
]

const CHAIN_CONFIG = {
  tezos: {
    label: 'Tezos L1',
    color: '#2C7DF7',
    dimColor: '#2C7DF720',
    borderColor: '#2C7DF740',
    description: 'SmartPy / LIGO · Taquito · Beacon Wallet · FA2 tokens',
    skills: TEZOS_SKILLS,
    skillPath: 'tezos/SKILL.md',
  },
  etherlink: {
    label: 'Etherlink EVM',
    color: '#10B981',
    dimColor: '#10B98120',
    borderColor: '#10B98140',
    description: 'Solidity · Hardhat · viem · MetaMask · ERC standards',
    skills: ETHERLINK_SKILLS,
    skillPath: 'etherlink/SKILL.md',
  },
  shared: {
    label: 'Shared',
    color: '#F59E0B',
    dimColor: '#F59E0B20',
    borderColor: '#F59E0B40',
    description: 'Bridging · Architecture comparison · Cross-chain patterns',
    skills: SHARED_SKILLS,
    skillPath: 'SKILL.md',
  },
}

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
      className={className}
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
        transition: 'all 0.2s',
      }}
    >
      {copied ? (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
      ) : (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy</>
      )}
    </button>
  )
}

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

function SkillCard({ skill, accentColor }: { skill: Skill; accentColor: string }) {
  const fileUrl = `${REPO}/blob/main/skill/${skill.path}`
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#0C1528', border: '1px solid #1A2E52',
        borderLeft: `3px solid ${skill.categoryColor}`,
        borderRadius: 10, padding: '24px 24px 20px',
        textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#0F1D38'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#0C1528'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
        borderRadius: 20, background: `${skill.categoryColor}18`,
        border: `1px solid ${skill.categoryColor}40`, color: skill.categoryColor,
        fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 14, alignSelf: 'flex-start',
      }}>
        {skill.category}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>{skill.title}</h3>
      <p style={{ fontSize: 14, color: '#7A9CC4', lineHeight: 1.7, flex: 1, marginBottom: 18 }}>{skill.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: accentColor, fontSize: 13, fontWeight: 500 }}>
        View on GitHub
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
    </a>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('human')
  const [chainTab, setChainTab] = useState<ChainTab>('tezos')

  const chain = CHAIN_CONFIG[chainTab]
  const copyText = tab === 'human' ? NPX_HUMAN : NPX_AGENT_COMBINED

  return (
    <div style={{ minHeight: '100vh', background: '#060D1F' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,13,31,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1A2E52', padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <TezosLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a href="https://docs.etherlink.com" target="_blank" rel="noopener noreferrer"
            style={{ color: '#7A9CC4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A9CC4')}>Docs</a>
          <a href={REPO} target="_blank" rel="noopener noreferrer"
            style={{ color: '#7A9CC4', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A9CC4')}>GitHub</a>
          <a href="https://tezos.com" target="_blank" rel="noopener noreferrer"
            style={{ background: '#2C7DF7', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>Tezos.com</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 520, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 15% 55%, rgba(44,125,247,0.28) 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 75% 25%, rgba(0,194,255,0.18) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 85% 75%, rgba(123,92,245,0.15) 0%, transparent 50%)
            `,
          }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: `linear-gradient(rgba(44,125,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(44,125,247,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '72px 32px 90px', width: '100%' }}>
          <p style={{ color: '#2C7DF7', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            Tezos Skills &nbsp;|&nbsp; Developer Tooling Resources
          </p>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20, maxWidth: 700 }}>
            Agent Skills
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 20px)', color: '#7A9CC4', lineHeight: 1.65, maxWidth: 600, marginBottom: 36, fontWeight: 400 }}>
            Pre-built skills for building on <span style={{ color: '#2C7DF7', fontWeight: 600 }}>Tezos L1</span> and <span style={{ color: '#10B981', fontWeight: 600 }}>Etherlink EVM</span>.
            Drop them into your AI agent to write contracts, deploy, and bridge assets.
          </p>

          {/* Human / Agent toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {(['human', 'agent'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 99,
                border: `1px solid ${tab === t ? '#2C7DF7' : '#1A2E52'}`,
                background: tab === t ? '#2C7DF718' : 'transparent',
                color: tab === t ? '#2C7DF7' : '#7A9CC4',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {t === 'human'
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                }
                {t === 'human' ? 'Human' : 'Agent'}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div style={{
            background: 'rgba(12,21,40,0.9)', border: '1px solid #1A2E52', borderRadius: 10,
            padding: tab === 'human' ? '13px 16px' : '16px',
            display: 'flex', alignItems: tab === 'human' ? 'center' : 'flex-start',
            justifyContent: 'space-between', gap: 12, maxWidth: 800, backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: tab === 'human' ? 'center' : 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
              <span style={{ color: '#2C7DF7', fontFamily: 'monospace', fontSize: 13, flexShrink: 0 }}>$</span>
              <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#CBD5E1', whiteSpace: tab === 'human' ? 'normal' : 'pre-wrap', overflow: 'visible', margin: 0, flex: 1 }}>
                {copyText}
              </pre>
            </div>
            <CopyButton text={copyText} />
          </div>
          <p style={{ marginTop: 12, color: '#4A6A94', fontSize: 13 }}>
            {tab === 'human' ? 'Run in your terminal to install the skill into Claude Code.' : 'Paste the raw SKILL.md URLs directly into your agent\'s system prompt or context.'}
          </p>
        </div>
      </section>

      {/* Skills section */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 100px' }}>

        {/* Section header */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Official Skills
          </h2>
          <p style={{ fontSize: 16, color: '#7A9CC4', maxWidth: 520, lineHeight: 1.6 }}>
            Two separate skill sets — one per chain — plus shared references for bridging and architecture.
          </p>
        </div>

        {/* Chain tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 36, flexWrap: 'wrap' }}>
          {(Object.entries(CHAIN_CONFIG) as [ChainTab, typeof CHAIN_CONFIG.tezos][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setChainTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: `1px solid ${chainTab === key ? cfg.color : '#1A2E52'}`,
                background: chainTab === key ? cfg.dimColor : 'transparent',
                color: chainTab === key ? cfg.color : '#7A9CC4',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: chainTab === key ? cfg.color : '#4A6A94',
                display: 'inline-block', flexShrink: 0,
                boxShadow: chainTab === key ? `0 0 6px ${cfg.color}` : 'none',
              }} />
              {cfg.label}
              <span style={{
                background: chainTab === key ? cfg.borderColor : '#1A2E52',
                color: chainTab === key ? cfg.color : '#4A6A94',
                borderRadius: 20, padding: '1px 8px', fontSize: 11,
              }}>
                {key === 'tezos' ? 'WIP' : cfg.skills.length}
              </span>
            </button>
          ))}
        </div>

        {/* Active chain description + SKILL.md link */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          background: chain.dimColor, border: `1px solid ${chain.borderColor}`,
          borderRadius: 10, padding: '14px 20px', marginBottom: 28,
        }}>
          <div>
            <span style={{ color: chain.color, fontWeight: 700, fontSize: 15 }}>{chain.label}</span>
            <span style={{ color: '#7A9CC4', fontSize: 14, marginLeft: 12 }}>{chain.description}</span>
          </div>
          <a
            href={`${REPO}/blob/main/skill/${chain.skillPath}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: chain.color, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: `1px solid ${chain.borderColor}`, borderRadius: 8, padding: '5px 12px',
              background: chain.dimColor, transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            View SKILL.md
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* Skills grid */}
        {chainTab === 'tezos' ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 16, padding: '72px 32px',
            background: '#0C1528', border: '1px solid #1A2E52', borderRadius: 12,
          }}>
            <div style={{ fontSize: 40 }}>🚧</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Under Construction</h3>
            <p style={{ fontSize: 15, color: '#7A9CC4', maxWidth: 420, textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Tezos L1 skills are being written and reviewed. Check back soon — Etherlink skills are ready to use now.
            </p>
            <button
              onClick={() => setChainTab('etherlink')}
              style={{
                marginTop: 8, padding: '9px 22px', borderRadius: 8,
                background: '#10B98118', border: '1px solid #10B98140',
                color: '#10B981', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              View Etherlink Skills →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {chain.skills.map(skill => (
              <SkillCard key={skill.path} skill={skill} accentColor={chain.color} />
            ))}
          </div>
        )}
      </section>

      {/* Install CTA */}
      <section style={{
        borderTop: '1px solid #1A2E52',
        background: 'linear-gradient(180deg, #060D1F 0%, #091426 100%)',
        padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(44,125,247,0.12) 0%, transparent 60%)' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>Get started in seconds</h2>
          <p style={{ color: '#7A9CC4', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Add the complete Tezos + Etherlink knowledge base to your AI agent with one command.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0C1528', border: '1px solid #1A2E52', borderRadius: 10, padding: '13px 16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#2C7DF7', fontFamily: 'monospace', fontSize: 14 }}>$</span>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#CBD5E1' }}>{NPX_HUMAN}</code>
            </div>
            <CopyButton text={NPX_HUMAN} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={REPO} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, background: '#2C7DF7', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View on GitHub
            </a>
            <a href="https://docs.etherlink.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, background: 'transparent', border: '1px solid #1A2E52', color: '#7A9CC4', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2C7DF7'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E52'; e.currentTarget.style.color = '#7A9CC4' }}>
              Etherlink Docs →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1A2E52', padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <TezosLogo />
        <p style={{ color: '#4A6A94', fontSize: 13 }}>MIT License · Built for Tezos + Etherlink developers</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {[{ label: 'Tezos', href: 'https://tezos.com' }, { label: 'Etherlink', href: 'https://etherlink.com' }, { label: 'GitHub', href: REPO }].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{ color: '#4A6A94', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#7A9CC4')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A6A94')}>{l.label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
