import { useState } from 'react'
import { Link } from 'react-router-dom'
import { REPO } from '../data/network.ts'
import { PageTitle } from '../components/ui.tsx'

type Tab = 'human' | 'agent'
type ChainTab = 'tezos' | 'etherlink' | 'tezosx' | 'shared'

interface Skill {
  category: string
  categoryColor: string
  title: string
  description: string
  path: string
}

const RAW = 'https://raw.githubusercontent.com/ypsono-shipit/tezos-etherlink-dapp-builder/main'
const NPX_HUMAN = `npx skills add ${REPO}`
const NPX_AGENT = `# Combined skill:
${RAW}/skill/SKILL.md

# Tezos L1 only:
${RAW}/skill/tezos/SKILL.md

# Etherlink EVM only:
${RAW}/skill/etherlink/SKILL.md

# Tezos X (both interfaces):
${RAW}/skill/tezos-x/SKILL.md`

const TEZOS_SKILLS: Skill[] = [
  { category: 'CONTRACTS', categoryColor: '#7fa8ff', title: 'Smart contract quickstart', description: 'SmartPy and JsLIGO contract examples, including an FA2 token. Compile with Taqueria and deploy with octez client on Tezos L1.', path: 'tezos/references/tezos-smart-contract-quickstart.md' },
  { category: 'FRONTEND', categoryColor: '#9db8ff', title: 'octez.js frontend guide', description: 'React integration with octez.js and Beacon Wallet (Temple, Kukai). Includes a reusable wallet hook and a hybrid setup with viem. Taquito still works as an alternative.', path: 'tezos/references/taquito-frontend-guide.md' },
  { category: 'SECURITY', categoryColor: '#c7d6ff', title: 'Security checklist', description: 'Tezos L1 security review: sp.verify patterns, FA2 operator logic, ticket linearity, storage burn costs, and admin key management.', path: 'tezos/references/security-checklist.md' },
  { category: 'DEPLOYMENT', categoryColor: '#2f5bff', title: 'Deployment checklist', description: 'Phase by phase Tezos L1 launch: local SmartPy tests, then Shadownet, a security review, then mainnet with octez client or Taqueria.', path: 'tezos/references/deployment-checklist.md' },
]

const ETHERLINK_SKILLS: Skill[] = [
  { category: 'NETWORK', categoryColor: '#2f5bff', title: 'Etherlink network info', description: 'RPC endpoints, chain IDs (42793 mainnet, 127823 Shadownet), explorer links, and faucet URLs. Ready to paste into Hardhat, viem, or MetaMask.', path: 'etherlink/references/network-info.md' },
  { category: 'TOOLING', categoryColor: '#7fa8ff', title: 'Hardhat configuration', description: 'Complete Hardhat setup with deploy scripts for Etherlink mainnet and Shadownet. Includes env handling and contract verification.', path: 'etherlink/references/hardhat-config.md' },
  { category: 'FRONTEND', categoryColor: '#9db8ff', title: 'viem frontend guide', description: 'viem v2 patterns for Etherlink: createPublicClient, wallet connection, MetaMask chain switching, writeContract, and ABI bigint casting.', path: 'etherlink/references/viem-frontend-guide.md' },
  { category: 'GAS AND FEES', categoryColor: '#8fb0ff', title: 'Gas and fees', description: 'Etherlink two part fee model: execution gas plus an L1 data inclusion fee. Why a fixed gas limit fails on large deploys, how eth_estimateGas bundles both, and safe buffer rules.', path: 'etherlink/references/gas-and-fees.md' },
  { category: 'SECURITY', categoryColor: '#c7d6ff', title: 'Security checklist', description: 'Solidity security: reentrancy guards, OpenZeppelin access control, SafeERC20, input validation, and Etherlink specific pitfalls.', path: 'etherlink/references/security-checklist.md' },
  { category: 'DEPLOYMENT', categoryColor: '#2f5bff', title: 'Deployment checklist', description: 'Phase by phase Etherlink launch: Hardhat compile, Shadownet testing, security review, then mainnet deploy with contract verification.', path: 'etherlink/references/deployment-checklist.md' },
]

const TEZOSX_SKILLS: Skill[] = [
  { category: 'NETWORK', categoryColor: '#2f5bff', title: 'Previewnet network info', description: 'Chain ids, RPCs, faucet, bridge, and rollup for Previewnet, plus Michelson endpoints for mainnet and Shadownet.', path: 'tezos-x/references/tezos-x-network-info.md' },
  { category: 'CALLS', categoryColor: '#7fa8ff', title: 'Cross runtime calls', description: 'Precompile, gateway entrypoints, atomic revert, mutez and wei, and gas defaults.', path: 'tezos-x/references/nac-cross-runtime-calls.md' },
  { category: 'SDK', categoryColor: '#9db8ff', title: 'octez.js for Tezos X', description: 'Package rename from Taquito, plus buildEvmToMichelsonCall and buildMichelsonToEvmCall.', path: 'tezos-x/references/octez-js-tezos-x.md' },
  { category: 'TUTORIAL', categoryColor: '#c7d6ff', title: 'NAC counter walkthrough', description: 'SmartPy counter and a Solidity forwarder on Previewnet, including an atomic revert.', path: 'tezos-x/references/nac-counter-walkthrough.md' },
]

const SHARED_SKILLS: Skill[] = [
  { category: 'BRIDGING', categoryColor: '#9db8ff', title: 'XTZ and FA token bridging', description: 'Guide for moving XTZ and FA2 tokens between Tezos L1 and Etherlink. Covers instant deposits, fast withdrawals, and standard withdrawals.', path: 'shared/bridging-xtz-fa-complete-guide.md' },
  { category: 'ARCHITECTURE', categoryColor: '#7fa8ff', title: 'Architecture comparison', description: 'Side by side comparison of Tezos L1 and Etherlink: language, speed, tooling, token standards, and wallets. Includes hybrid architecture patterns.', path: 'shared/architecture-comparison.md' },
]

const CHAINS = {
  tezos: { label: 'Tezos L1', color: '#2f5bff', description: 'SmartPy / LIGO · octez.js · Beacon Wallet · FA2 tokens', skills: TEZOS_SKILLS, skillPath: 'tezos/SKILL.md' },
  etherlink: { label: 'Etherlink EVM', color: '#7fa8ff', description: 'Solidity · Hardhat · viem · MetaMask · ERC standards', skills: ETHERLINK_SKILLS, skillPath: 'etherlink/SKILL.md' },
  tezosx: { label: 'Tezos X', color: '#9db8ff', description: 'Previewnet · both interfaces · octez.js', skills: TEZOSX_SKILLS, skillPath: 'tezos-x/SKILL.md' },
  shared: { label: 'Shared', color: '#c7d6ff', description: 'Bridging · Architecture comparison · Cross chain patterns', skills: SHARED_SKILLS, skillPath: 'SKILL.md' },
} as const

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        })
      }}
      style={{
        background: copied ? 'rgba(127,168,255,.15)' : 'rgba(255,255,255,.06)',
        border: `1px solid ${copied ? 'rgba(127,168,255,.45)' : 'rgba(255,255,255,.12)'}`,
        borderRadius: 6,
        padding: '6px 10px',
        color: copied ? '#7fa8ff' : '#8a90a6',
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function SkillCard({ skill, accent }: { skill: Skill; accent: string }) {
  return (
    <a href={`${REPO}/blob/main/skill/${skill.path}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', background: '#10131d', border: '1px solid rgba(255,255,255,.08)', borderLeft: `3px solid ${skill.categoryColor}`, borderRadius: 10, padding: '24px 24px 20px', textDecoration: 'none' }}>
      <div style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, background: 'rgba(127,168,255,.12)', border: '1px solid rgba(127,168,255,.28)', color: skill.categoryColor, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 14, alignSelf: 'flex-start' }}>{skill.category}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{skill.title}</h3>
      <p style={{ fontSize: 14, color: '#8a90a6', lineHeight: 1.7, flex: 1, marginBottom: 18 }}>{skill.description}</p>
      <div style={{ color: accent, fontSize: 13, fontWeight: 500 }}>View on GitHub</div>
    </a>
  )
}

export default function Builder() {
  const [tab, setTab] = useState<Tab>('human')
  const [chainTab, setChainTab] = useState<ChainTab>('etherlink')
  const chain = CHAINS[chainTab]
  const copyText = tab === 'human' ? NPX_HUMAN : NPX_AGENT
  return (
    <div data-page-title="Tezos and Etherlink dApp Builder" style={{ minHeight: '100vh', background: '#0b0d14', color: '#fff' }}>
      <PageTitle title="Tezos and Etherlink dApp Builder" />
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11,13,20,.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.08)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, background: '#fff', color: '#0b0d14', display: 'grid', placeItems: 'center' }}>ꜩ</span>
          Tezos <span style={{ color: '#7fa8ff' }}>Skills</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 14 }}>
          <Link to="/" style={{ color: '#8a90a6' }}>Builders’ Club</Link>
          <a href="https://docs.etherlink.com" style={{ color: '#8a90a6' }}>Docs</a>
          <a href={REPO} style={{ color: '#8a90a6' }}>GitHub</a>
          <a href="https://tezos.com" style={{ background: '#2f5bff', color: '#fff', padding: '7px 16px', borderRadius: 8, fontWeight: 600 }}>Tezos.com</a>
        </div>
      </nav>

      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 15% 55%, rgba(47,91,255,.28) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '72px 32px 80px' }}>
          <p style={{ color: '#7fa8ff', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Tezos Skills | Developer tooling</p>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>Agent Skills</h1>
          <p style={{ fontSize: 18, color: '#8a90a6', lineHeight: 1.65, maxWidth: 640, marginBottom: 28 }}>
            Pre built skills for building on <span style={{ color: '#7fa8ff', fontWeight: 600 }}>Tezos L1</span> and <span style={{ color: '#9db8ff', fontWeight: 600 }}>Etherlink EVM</span>. Drop them into your AI agent to write contracts, deploy, and bridge assets.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {(['human', 'agent'] as Tab[]).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} style={{ padding: '8px 16px', borderRadius: 99, border: `1px solid ${tab === item ? '#2f5bff' : 'rgba(255,255,255,.12)'}`, background: tab === item ? 'rgba(47,91,255,.12)' : 'transparent', color: tab === item ? '#7fa8ff' : '#8a90a6', cursor: 'pointer' }}>
                {item === 'human' ? 'Human' : 'Agent'}
              </button>
            ))}
          </div>
          <div style={{ background: 'rgba(16,19,29,.9)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', gap: 12, maxWidth: 800 }}>
            <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#d5d8e6', whiteSpace: 'pre-wrap', margin: 0 }}>{copyText}</pre>
            <CopyButton text={copyText} />
          </div>
          <p style={{ marginTop: 12, color: '#8a90a6', fontSize: 13 }}>
            {tab === 'human' ? 'Run in your terminal to install the skill into Claude Code.' : 'Paste the raw SKILL.md URLs directly into your agent system prompt or context.'}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 80px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 10 }}>Official Skills</h2>
        <p style={{ color: '#8a90a6', maxWidth: 560, marginBottom: 28 }}>Two separate skill sets, one per chain, plus shared references for bridging and architecture.</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {(Object.keys(CHAINS) as ChainTab[]).map((key) => {
            const cfg = CHAINS[key]
            const on = chainTab === key
            return (
              <button key={key} type="button" onClick={() => setChainTab(key)} style={{ padding: '10px 18px', borderRadius: 10, border: `1px solid ${on ? cfg.color : 'rgba(255,255,255,.12)'}`, background: on ? 'rgba(127,168,255,.12)' : 'transparent', color: on ? cfg.color : '#8a90a6', fontWeight: 600, cursor: 'pointer' }}>
                {cfg.label} <span style={{ marginLeft: 8, fontSize: 11 }}>{key === 'tezos' ? 'WIP' : cfg.skills.length}</span>
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: 'rgba(127,168,255,.08)', border: '1px solid rgba(127,168,255,.25)', borderRadius: 10, padding: '14px 20px', marginBottom: 24 }}>
          <div><span style={{ color: chain.color, fontWeight: 700 }}>{chain.label}</span><span style={{ color: '#8a90a6', marginLeft: 12 }}>{chain.description}</span></div>
          <a href={`${REPO}/blob/main/skill/${chain.skillPath}`} style={{ color: chain.color, fontWeight: 600, fontSize: 13 }}>View SKILL.md</a>
        </div>
        {chainTab === 'tezos' ? (
          <div style={{ textAlign: 'center', padding: '72px 32px', background: '#10131d', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12 }}>
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>Under construction</h3>
            <p style={{ color: '#8a90a6', maxWidth: 460, margin: '0 auto 16px' }}>Tezos L1 skills are being written and reviewed. Check back soon. Etherlink skills are ready to use now.</p>
            <button type="button" onClick={() => setChainTab('etherlink')} style={{ padding: '9px 22px', borderRadius: 8, background: 'rgba(127,168,255,.12)', border: '1px solid rgba(127,168,255,.35)', color: '#7fa8ff', fontWeight: 600, cursor: 'pointer' }}>View Etherlink skills</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {chain.skills.map((skill) => <SkillCard key={skill.path} skill={skill} accent={chain.color} />)}
          </div>
        )}
      </section>

      <section style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '64px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 34, marginBottom: 12 }}>Get started in seconds</h2>
        <p style={{ color: '#8a90a6', marginBottom: 24 }}>Add the complete Tezos and Etherlink knowledge base to your AI agent with one command.</p>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: 12, background: '#10131d', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '13px 16px' }}>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{NPX_HUMAN}</code>
          <CopyButton text={NPX_HUMAN} />
        </div>
      </section>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.08)', padding: '22px 32px', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', color: '#8a90a6', fontSize: 13 }}>
        <span>MIT License · Built for Tezos and Etherlink developers</span>
        <span style={{ display: 'flex', gap: 16 }}>
          <a href="https://tezos.com">Tezos</a>
          <a href="https://etherlink.com">Etherlink</a>
          <a href={REPO}>GitHub</a>
        </span>
      </footer>
    </div>
  )
}
