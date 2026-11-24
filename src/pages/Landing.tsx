import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Box, Copy, FileCode2, GitMerge, Hexagon, MonitorSmartphone, Network, Shield, Split } from 'lucide-react'
import { IDEAS } from '../data/ideas.ts'
import { REPO, SKILL_INSTALL } from '../data/network.ts'
import { IdeaCard } from '../components/ideas.tsx'
import { CopyButton, GithubIcon, Marketing, Ph, Wave } from '../components/ui.tsx'

const SKILL_ROWS = [
  { icon: Split, bubble: 'bg-royal/25 text-[#8fb0ff]', title: 'Interface decision tree', detail: 'EVM, Michelson, or both via NAC', aside: 'architecture' },
  { icon: GitMerge, bubble: 'bg-azure/15 text-azure', title: 'Cross runtime calls', detail: 'callMichelson · %call_evm · views', aside: 'new' },
  { icon: FileCode2, bubble: 'bg-white/10', title: 'Contracts and tests', detail: 'Solidity · SmartPy · LIGO · Hardhat · Foundry', aside: 'templates' },
  { icon: MonitorSmartphone, bubble: 'bg-white/10', title: 'Frontend wiring', detail: 'viem / ethers · octez.js (Taquito fork)', aside: 'dApp' },
  { icon: Network, bubble: 'bg-white/10', title: 'Network configs', detail: 'Previewnet · Shadownet · Mainnet', aside: 'synced' },
  { icon: Shield, bubble: 'bg-white/10', title: 'Security and deploy checklists', detail: 'incl. atomic revert handling', aside: 'checklist' },
]

export default function Landing() {
  const featured = IDEAS.filter((idea) => ['Tezos wallet calls EVM DeFi', 'Cross runtime swap router', 'Cross runtime flash arbitrage'].includes(idea.t))
  return (
    <Marketing title="Build on Tezos X | Builders’ Club">
      <section id="hero" className="relative min-h-[780px] md:min-h-[860px] flex items-center pb-36 md:pb-44">
        <Wave count={150} className="bottom-0 h-[120px] md:h-[170px] opacity-40 md:opacity-55" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="orb w-[240px] h-[240px] md:w-[380px] md:h-[380px] bg-[#1d2fb8]/40 top-[10%] md:top-[45%] -left-40" />
        <div className="relative mx-auto max-w-6xl w-full px-5 md:px-6 pt-8 md:pt-24 grid md:grid-cols-[minmax(0,1fr)_560px] gap-10 items-center">
          <div>
            <Link to="/nac#quickstart" className="inline-flex items-center gap-2.5 pill bg-azure/10 border border-azure/40 pl-2 pr-4 py-2 text-sm font-semibold text-azure mb-7 shadow-[0_0_40px_rgba(127,168,255,.18)]">
              <span className="relative flex w-6 h-6 rounded-full bg-azure/20 items-center justify-center"><span className="w-2.5 h-2.5 rounded-full bg-azure pulse" /></span>
              Previewnet live now <ArrowRight className="w-4 h-4" />
            </Link>
            <h1 className="h-sec text-[64px] leading-[.98] md:text-[112px]">Build on <b>Tezos&nbsp;X</b></h1>
            <p className="mt-6 text-muted text-base md:text-lg max-w-lg">EVM and Michelson on one chain. Contracts on both sides call each other natively in one atomic transaction. No bridges, no wrapped assets.</p>
            <div className="meta mt-5">
              <b>EVM + Michelson</b><span className="sep" />
              <span><b className="text-azure">1</b> atomic tx</span><span className="sep" />
              <span>~500 ms blocks</span><span className="sep" />
              <span>Club dates <Ph>tbc</Ph></span>
            </div>
            <div className="mt-9 flex items-center gap-3 flex-wrap">
              <Link to="/nac#quickstart" className="pill bg-royal text-white font-semibold px-6 py-3.5">Start building</Link>
              <Link to="/usecases" className="pill glass-soft !bg-[#151a2b] px-6 py-3.5 font-medium">Explore use cases</Link>
              <a href="#nac" aria-label="Scroll" className="w-[52px] h-[52px] rounded-full bg-white text-ink grid place-items-center shadow-lg shadow-white/10">
                <ArrowDown className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="hero-logo order-first md:order-none mx-auto md:mx-0 md:justify-self-end" aria-hidden="true">
            <video autoPlay muted loop playsInline preload="auto" poster="/hero/tezos-ascii-poster.jpg">
              <source src="/hero/tezos-ascii.webm" type="video/webm" />
              <source src="/hero/tezos-ascii.mp4" type="video/mp4" />
            </video>
            <img className="hero-logo-still" src="/hero/tezos-ascii-poster.jpg" alt="" />
          </div>
        </div>
      </section>

      <section id="nac" className="relative py-10 md:py-14">
        <div className="orb w-[420px] h-[420px] bg-royal/30 left-1/3 top-0" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">01 · Native Atomic Composability</div>
          <div className="glass p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="h-sec text-4xl md:text-[56px] !leading-[1.08]">One action, <b>one result.</b></h2>
              <p className="text-muted mt-4 md:text-lg">A Solidity contract can call a Michelson contract, or the other way round, inside a single transaction, in the same block. If any step fails, everything reverts. No bridge, no relayer, no wrapped tokens.</p>
              <div className="mt-7 flex items-center gap-3">
                <Link to="/nac" className="pill bg-white text-ink font-semibold pl-5 pr-1.5 py-1.5 flex items-center gap-3">
                  Learn more <span className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center"><ArrowRight className="w-4 h-4" /></span>
                </Link>
                <span className="text-xs text-muted">Diagram, code & comparison</span>
              </div>
            </div>
            <div className="glass-soft p-4 md:p-5">
              <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2">
                <div className="text-center"><span className="icon-c bg-royal/30 text-[#8fb0ff] mx-auto"><Hexagon className="w-5 h-5" /></span><div className="text-[11px] text-muted mt-2">EVM</div></div>
                <div className="h-px border-t border-dashed border-azure/60" />
                <div className="text-center"><span className="icon-c bg-royal text-white mx-auto pulse"><GitMerge className="w-5 h-5" /></span><div className="text-[11px] text-azure mt-2">Gateway</div></div>
                <div className="h-px border-t border-dashed border-azure/60" />
                <div className="text-center"><span className="icon-c bg-azure/15 text-azure mx-auto"><Box className="w-5 h-5" /></span><div className="text-[11px] text-muted mt-2">Michelson</div></div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="glass-soft py-3"><div className="text-2xl font-extrabold">1</div><div className="text-[11px] text-muted">transaction</div></div>
                <div className="glass-soft py-3"><div className="text-2xl font-extrabold">~500<span className="text-sm">ms</span></div><div className="text-[11px] text-muted">same block</div></div>
                <div className="glass-soft py-3"><div className="text-2xl font-extrabold text-azure">0</div><div className="text-[11px] text-muted">bridges</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ideas" className="relative py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">02 · Core use cases</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h2 className="h-sec text-4xl md:text-[56px] !leading-[1.08]">Ideas that <b>only work atomically.</b></h2>
            <Link to="/usecases" className="pill bg-white text-ink font-semibold pl-5 pr-1.5 py-1.5 flex items-center gap-3 self-start md:self-auto whitespace-nowrap">
              Learn more <span className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center"><ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((idea, index) => <IdeaCard key={idea.t} idea={idea} index={index} />)}
          </div>
          <p className="text-xs text-muted mt-5">3 of 12 ideas · <Link to="/usecases" className="text-azure">see all with filters →</Link></p>
        </div>
      </section>

      <section id="perk" className="relative py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">03 · Builder perk</div>
          <div className="glass relative overflow-hidden p-6 md:p-10 grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center">
            <div className="orb w-[420px] h-[420px] bg-royal/45 -right-24 -top-32" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="pill bg-azure/15 text-azure text-xs font-semibold px-3 py-1">For club members</span>
                <Ph>terms tbc</Ph>
              </div>
              <h2 className="h-sec text-3xl md:text-5xl">
                <span className="inline-flex items-baseline whitespace-nowrap">
                  <img src="/boundless-logo.png" alt="" className="h-[1cap] w-auto mr-[0.18em]" />
                  Boundless
                </span>{' '}
                credits <b>for members.</b>
              </h2>
              <p className="text-muted mt-4 max-w-lg">Building on Tezos X Previewnet? Apply for a Boundless API key with a credit budget. It works with OpenAI and Anthropic compatible tools like Claude Code, Codex and OpenCode, running open models. Selected builders get access.</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to="/boundless" className="pill bg-white text-ink font-semibold px-6 py-3.5 flex items-center gap-2 whitespace-nowrap">
                  Apply now <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-muted">Seats and eligibility <Ph>placeholder</Ph></span>
              </div>
            </div>
            <div className="relative glass-soft p-5">
              <div className="flex justify-between items-center mb-4"><span className="text-sm font-semibold">Application</span><span className="text-[11px] text-muted">~2 min</span></div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-royal text-white grid place-items-center text-xs font-bold">1</span>Wallet address (0x… or tz1…)</div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-royal text-white grid place-items-center text-xs font-bold">2</span>Email + X handle</div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-xs font-bold">3</span>What you will build</div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 grid place-items-center text-xs font-bold">4</span>What you have built before</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="builder" className="relative py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">04 · Tezos & Etherlink dApp Builder</div>
          <div className="grid md:grid-cols-[.95fr_1.05fr] gap-4">
            <div className="glass p-6 md:p-8 flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="pill bg-white/10 text-xs font-semibold px-3 py-1">Open source agent skill</span>
                <span className="pill bg-azure/15 text-azure text-xs font-semibold px-3 py-1">Updated for Tezos X Previewnet</span>
              </div>
              <h2 className="h-sec text-3xl md:text-[44px]">Ship faster with the <b>Tezos & Etherlink dApp Builder.</b></h2>
              <p className="text-muted mt-4">An AI agent skill that knows the stack: when to use EVM vs Michelson, how to call across them through the NAC gateway, and how to test, deploy and wire up a frontend.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/builder" className="pill bg-royal text-white font-semibold px-5 py-3 flex items-center gap-2">Open the builder</Link>
                <a href={`${REPO}/tree/main/skill`} className="pill glass-soft px-5 py-3 font-medium flex items-center gap-2"><GithubIcon /> Skill on GitHub</a>
              </div>
              <div className="mt-6 glass-soft p-3 flex items-center justify-between gap-3">
                <code className="text-[12.5px] text-white/85 truncate min-w-0 flex-1">{SKILL_INSTALL}</code>
                <CopyButton value={SKILL_INSTALL} label="Copy install command" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center flex-none">
                  <Copy className="w-4 h-4" />
                </CopyButton>
              </div>
            </div>
            <div className="glass p-2 min-w-0">
              <div className="divide-y divide-white/5">
                {SKILL_ROWS.map((row) => {
                  const Icon = row.icon
                  return (
                    <div key={row.title} className="flex items-center gap-4 p-4">
                      <span className={`icon-c ${row.bubble}`}><Icon className="w-5 h-5" /></span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{row.title}</div>
                        <div className="text-xs text-muted">{row.detail}</div>
                      </div>
                      {row.aside === 'new'
                        ? <span className="pill bg-azure/15 text-azure text-[11px] font-semibold px-2 py-0.5">new</span>
                        : <span className={`text-xs ${row.aside === 'synced' ? 'text-azure font-semibold' : 'text-muted'}`}>{row.aside}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="glass relative overflow-hidden text-center px-6 pt-12 pb-40 md:pt-16 md:pb-48">
            <Wave count={110} mode="valley" className="bottom-0 h-[150px] md:h-[190px] opacity-70" />
            <h2 className="relative h-sec text-3xl md:text-5xl">Ship what only <b>Tezos X</b> can do.</h2>
            <p className="relative text-muted mt-3">Previewnet is live. Boundless API credits for selected builders.</p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/nac#quickstart" className="pill bg-royal text-white font-semibold px-6 py-3.5">Start building</Link>
              <Link to="/boundless" className="pill bg-white text-ink font-semibold px-6 py-3.5">Apply for Boundless</Link>
            </div>
          </div>
        </div>
      </section>
    </Marketing>
  )
}
