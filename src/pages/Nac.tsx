import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Check, GitMerge, Hexagon, Plus, RotateCcw, Wallet } from 'lucide-react'
import { Marketing, Wave } from '../components/ui.tsx'
import { NetworkCard } from '../components/NetworkCard.tsx'

type Dir = 'e2m' | 'm2e'
type Metric = 'tx' | 'lat'

const STEPS: Record<Dir, [string, string][]> = {
  e2m: [['MetaMask', '0x… account'], ['Solidity', 'your EVM contract'], ['NAC precompile', '0xff…0007'], ['Michelson', 'KT1… entrypoint']],
  m2e: [['Temple', 'tz1… account'], ['Michelson', 'your KT1 contract'], ['NAC gateway', 'KT18oDJ…iqsPw'], ['Solidity', '%call_evm target']],
}

const STEP_META = [
  { n: '① Sign', icon: Wallet, bubble: 'bg-white text-ink' },
  { n: '② Contract', icon: Hexagon, bubble: 'bg-royal/30 text-[#8fb0ff]' },
  { n: '③ Gateway', icon: GitMerge, bubble: 'bg-royal text-white', azure: true },
  { n: '④ Target', icon: Box, bubble: 'bg-azure/15 text-azure' },
]

const FAQ = [
  { q: 'Is Tezos X a new chain or a bridge?', a: 'Neither in the usual sense: it is one execution layer (built on Etherlink, a Tezos Smart Rollup) where an EVM interface and a Michelson interface share a single ledger. Cross interface calls happen inside the same kernel and block.', open: true },
  { q: 'What happens if the other side fails?', a: 'The whole transaction reverts on both sides; the EVM caller can catch the revert.' },
  { q: 'Do I need two wallets?', a: 'Usually MetaMask plus a Tezos wallet (each with its own balance). The Tezos X Wallet offers one account for both interfaces.' },
  { q: 'Is it on mainnet?', a: 'Per tezos.com the Michelson interface and NAC activated on Etherlink mainnet in Aug 2026 (Ganesha). The hackathon targets Previewnet.' },
  { q: 'Can Previewnet be reset?', a: 'Yes. It was reset on July 20, 2026. Check the Previewnet dashboard changelog before relying on deployed state.' },
]

function useFlowPhase(dir: Dir, fail: boolean) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    const id = window.setInterval(() => setPhase((value) => value + 1), 800)
    return () => window.clearInterval(id)
  }, [dir, fail])

  const forward = dir === 'e2m'
  const boxes = forward ? [0, 1, 2, 3] : [3, 2, 1, 0]
  const failing = forward ? 3 : 0
  const playable = fail ? boxes.slice(0, 3) : boxes
  const active = playable[phase % playable.length]
  const next = playable[playable.indexOf(active) + 1]
  const liveLink = next == null ? -1 : Math.min(active, next)
  const dimLink = fail ? (forward ? 2 : 0) : -1
  return { active, liveLink, dimLink, forward, failing }
}

function FlowLink({ forward, live, dim }: { forward: boolean; live: boolean; dim: boolean }) {
  const state = dim ? 'dim' : live ? 'live' : 'idle'
  return (
    <div className={`flow-link ${forward ? 'forward' : 'reverse'} ${state}`} aria-hidden="true">
      <span className="flow-link-track" />
    </div>
  )
}

export default function Nac() {
  const [dir, setDir] = useState<Dir>('e2m')
  const [fail, setFail] = useState(false)
  const [metric, setMetric] = useState<Metric>('tx')
  const flow = useFlowPhase(dir, fail)
  const heights = metric === 'tx' ? [86, 48, 14] : [70, 92, 8]
  const tip = metric === 'tx' ? '1 tx · atomic' : 'same block · ~500 ms'
  return (
    <Marketing title="Native Atomic Composability | Tezos X">
      <section className="relative pt-10 md:pt-36 pb-16 md:pb-24">
        <Wave count={150} mode="wave" className="bottom-0 h-[110px] md:h-[150px] opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
        <div className="orb w-[360px] h-[360px] md:w-[560px] md:h-[560px] bg-royal/45 -top-24 right-0 md:right-[10%]" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">Native Atomic Composability</div>
          <h1 className="h-sec text-[44px] md:text-[80px]">One action, <b>one result.</b></h1>
          <p className="text-muted mt-5 md:text-lg max-w-2xl">Tezos X runs an EVM runtime and a Michelson runtime inside the same rollup kernel, sharing one ledger. A contract on one interface calls the other through a gateway, in the same transaction and the same block. Either every step succeeds, or none do.</p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs">
            <span className="glass-soft pill px-3 py-1.5">EVM precompile <span className="mono text-white/80">0xff…0007</span></span>
            <span className="glass-soft pill px-3 py-1.5">Michelson gateway <span className="mono text-white/80">KT18oDJ…iqsPw</span></span>
            <span className="glass-soft pill px-3 py-1.5">1 mutez = 10¹² wei</span>
          </div>
        </div>
      </section>

      <section id="nac" className="relative py-10 md:py-14">
        <div className="orb w-[560px] h-[560px] bg-royal/35 left-1/2 -translate-x-1/2 top-20" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="glass p-5 md:p-7 md:col-span-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="seg" role="tablist" aria-label="Call direction">
                  <button type="button" className={dir === 'e2m' ? 'on' : ''} onClick={() => setDir('e2m')}>EVM → Michelson</button>
                  <button type="button" className={dir === 'm2e' ? 'on' : ''} onClick={() => setDir('m2e')}>Michelson → EVM</button>
                </div>
                <button type="button" className="flex items-center gap-3 text-sm text-muted" aria-pressed={fail} onClick={() => setFail((value) => !value)}>
                  Simulate failure
                  <span className={`w-12 h-7 rounded-full relative transition ${fail ? 'bg-azure/25' : 'bg-white/10'}`}>
                    <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-azure transition ${fail ? 'translate-x-5' : ''}`} />
                  </span>
                </button>
              </div>
              <div className="flow-row">
                {STEPS[dir].map((step, index) => {
                  const meta = STEP_META[index]
                  const Icon = meta.icon
                  const live = index === flow.active
                  const failed = fail && index === flow.failing
                  return (
                    <div key={meta.n} className="flow-step">
                      {index > 0 ? (
                        <FlowLink forward={flow.forward} live={flow.liveLink === index - 1} dim={flow.dimLink === index - 1} />
                      ) : null}
                      <div className={`flow-box glass-soft p-3.5 md:p-4 flex md:flex-col md:items-start items-center gap-3 ${live ? 'is-live' : ''} ${failed ? 'is-failed' : ''}`}>
                        <span className={`icon-c ${meta.bubble} md:mb-3`}><Icon className="w-5 h-5" /></span>
                        <div className="flex-1">
                          <div className={`text-[11px] mb-2 ${meta.azure ? 'text-azure' : 'text-muted'}`}>{meta.n}</div>
                          <div className="font-semibold text-sm">{step[0]}</div>
                          <div className={`text-xs text-muted ${index === 2 ? 'mono text-[11px]' : ''}`}>{step[1]}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 glass-soft p-4 flex items-center gap-4">
                <span className={`icon-c ${fail ? 'bg-white text-ink' : 'bg-royal text-white'}`}>
                  {fail ? <RotateCcw className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                </span>
                <div className="flex-1">
                  <div className="font-semibold">{fail ? 'Reverted on both sides' : 'Committed atomically'}</div>
                  <div className="text-xs text-muted">
                    {fail
                      ? 'The target rejected the call. No EVM event, no storage change. Nothing half done.'
                      : dir === 'e2m'
                        ? 'EVM event emitted and Michelson storage updated in the same block.'
                        : 'Michelson operation and EVM call applied together in the same block.'}
                  </div>
                </div>
                <span className={`font-bold mono ${fail ? 'text-white' : 'text-azure'}`}>{fail ? '0 changes' : '1 tx'}</span>
              </div>
              <pre className="mt-4 glass-soft p-4 text-[12px] leading-relaxed overflow-x-auto"><code>{`// Solidity → Michelson through the gateway precompile
interface INativeAtomicGateway {
  function callMichelson(
    string destination, string entrypoint, bytes data
  ) external payable;
}
INativeAtomicGateway(0xff00000000000000000000000000000000000007)
  .callMichelson("KT1…", "increment", data);`}</code></pre>
            </div>

            <div className="glass p-5 md:p-6 flex flex-col md:col-span-2 min-w-0">
              <div>
                <div className="text-sm font-semibold">Transactions per cross runtime action</div>
                <div className="text-xs text-muted">per docs.etherlink.com architecture</div>
              </div>
              <div className="seg mt-4 self-start" role="tablist" aria-label="Chart metric">
                <button type="button" className={metric === 'tx' ? 'on' : ''} onClick={() => setMetric('tx')}>Txs</button>
                <button type="button" className={metric === 'lat' ? 'on' : ''} onClick={() => setMetric('lat')}>Latency</button>
              </div>
              <div className="relative flex-1 min-h-[230px] mt-12">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M10 40 C 90 50, 160 100, 290 170" stroke="rgba(255,255,255,.45)" strokeDasharray="4 5" fill="none" />
                </svg>
                <div className="absolute inset-0 grid grid-cols-3 gap-5 items-end px-2">
                  {([
                    ['Cross chain', 'bridge', false],
                    ['L1↔L2', 'bridge', false],
                    ['NAC', '(Tezos X)', true],
                  ] as const).map((label, index) => (
                    <div key={label[0]} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className={`bar relative w-full max-w-[56px] rounded-2xl transition-all duration-500 ${label[2] ? 'bg-azure shadow-[0_0_30px_rgba(127,168,255,.45)]' : index === 1 ? 'bg-white/85' : 'bg-white'}`} style={{ height: `${heights[index]}%` }}>
                        {label[2] ? (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full bg-white text-ink text-[11px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-lg">
                            {tip}
                            <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                          </div>
                        ) : null}
                      </div>
                      <div className={`text-[11px] text-center leading-tight ${label[2] ? 'text-azure font-semibold' : 'text-muted'}`}>{label[0]}<br />{label[1]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Atomic (all or nothing)</span><span className="font-semibold text-azure">Yes, NAC only</span></div>
                <div className="flex justify-between"><span className="text-muted">Asset representation</span><span className="font-semibold">Native tokens</span></div>
                <div className="flex justify-between"><span className="text-muted">Trust assumption</span><span className="font-semibold">None, same kernel</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quickstart" className="relative py-20 md:py-28">
        <div className="orb w-[500px] h-[500px] bg-royal/40 -right-40 top-10" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">Previewnet quickstart</div>
          <h2 className="h-sec text-4xl md:text-6xl mb-10">From zero to your first <b>atomic call.</b></h2>
          <div className="grid md:grid-cols-[.9fr_1.1fr] gap-4">
            <div className="glass p-2">
              <div className="divide-y divide-white/5">
                <div className="flex gap-4 p-4"><span className="icon-c bg-royal text-white font-bold">1</span><div><div className="font-semibold">Add both interfaces to your wallets</div><div className="text-sm text-muted">MetaMask for EVM, Temple, Kukai, Umami or octez client for Michelson. Each account has a 0x… and a tz1… address with separate balances.</div></div></div>
                <div className="flex gap-4 p-4"><span className="icon-c bg-white/10 font-bold">2</span><div><div className="font-semibold">Fund both addresses</div><div className="text-sm text-muted">The faucet funds 0x… and tz1… addresses with testnet XTZ. Fund both, each side pays its own gas.</div></div></div>
                <div className="flex gap-4 p-4"><span className="icon-c bg-white/10 font-bold">3</span><div><div className="font-semibold">Follow the cross interface counter</div><div className="text-sm text-muted">SmartPy contract on Michelson + Solidity forwarder from Remix. See a success and an atomic revert.</div></div></div>
                <div className="flex gap-4 p-4"><span className="icon-c bg-white/10 font-bold">4</span><div><div className="font-semibold">Ship your idea</div><div className="text-sm text-muted">Use <span className="mono text-white/80">@tezos-x/octez.js-utils</span> and tx codec, or let the dApp Builder skill scaffold it.</div></div></div>
              </div>
            </div>
            <NetworkCard />
          </div>
        </div>
      </section>

      <section id="faq" className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-6 grid md:grid-cols-[.8fr_1.2fr] gap-8 md:gap-16">
          <div>
            <div className="eyebrow mb-4">FAQ</div>
            <h2 className="h-sec text-4xl md:text-5xl">Good <b>questions.</b></h2>
            <p className="text-muted mt-4">Can't find it? Browse the <Link className="text-azure" to="/resources">resources library</Link> or ask in the Tezos X channel on Discord.</p>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((item) => (
              <details key={item.q} className="py-5 group" open={item.open}>
                <summary className="font-semibold cursor-pointer flex justify-between gap-4">
                  {item.q}
                  <Plus className="w-5 h-5 text-muted shrink-0" />
                </summary>
                <p className="text-sm text-muted mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Marketing>
  )
}
