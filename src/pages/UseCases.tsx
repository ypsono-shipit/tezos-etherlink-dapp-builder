import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IDEAS, type IdeaDir, type IdeaLevel } from '../data/ideas.ts'
import { IdeaCard } from '../components/ideas.tsx'
import { Marketing, Wave } from '../components/ui.tsx'

export default function UseCases() {
  const [dir, setDir] = useState<'all' | IdeaDir>('all')
  const [level, setLevel] = useState<'all' | IdeaLevel>('all')
  const shown = useMemo(
    () => IDEAS.filter((idea) => (dir === 'all' || idea.dir === dir) && (level === 'all' || idea.lvl === level)),
    [dir, level],
  )
  return (
    <Marketing title="Use cases | Tezos X">
      <section className="relative pt-10 md:pt-36 pb-16 md:pb-24">
        <Wave count={150} mode="wave" className="bottom-0 h-[110px] md:h-[150px] opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
        <div className="orb w-[360px] h-[360px] md:w-[560px] md:h-[560px] bg-royal/45 -top-24 right-0 md:right-[10%]" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">Use cases</div>
          <h1 className="h-sec text-[44px] md:text-[80px]">Ideas that <b>only work atomically.</b></h1>
          <p className="text-muted mt-5 md:text-lg max-w-2xl">Twelve starting points that need a call across EVM and Michelson in a single transaction. Filter by direction and difficulty, remix one, or bring your own.</p>
        </div>
      </section>
      <section id="ideas" className="relative py-8 md:py-10">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="flex flex-nowrap md:flex-wrap gap-3 mb-8 overflow-x-auto">
            <div className="seg" role="tablist" aria-label="Idea direction">
              {([['all', 'All'], ['e2m', 'EVM → Michelson'], ['m2e', 'Michelson → EVM'], ['both', 'Both ways']] as const).map(([value, label]) => (
                <button key={value} type="button" className={dir === value ? 'on' : ''} onClick={() => setDir(value)}>{label}</button>
              ))}
            </div>
            <div className="seg" role="tablist" aria-label="Difficulty">
              {([['all', 'Any'], ['Beginner', 'Beginner'], ['Intermediate', 'Intermediate'], ['Advanced', 'Advanced']] as const).map(([value, label]) => (
                <button key={value} type="button" className={level === value ? 'on' : ''} onClick={() => setLevel(value)}>{label}</button>
              ))}
            </div>
          </div>
          {shown.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shown.map((idea, index) => (
                <IdeaCard key={idea.t} idea={idea} index={IDEAS.indexOf(idea)} featured={index === 0 && dir === 'all' && level === 'all'} linked />
              ))}
            </div>
          ) : (
            <div className="text-muted">No ideas match.</div>
          )}
          <p className="text-xs text-muted mt-6">Ideas are suggestions for club members, not existing products. Each one uses a gateway call that works on Previewnet today.</p>
        </div>
      </section>
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="glass p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 justify-between relative overflow-hidden">
            <div className="orb w-72 h-72 bg-royal/40 -right-10 -top-20" />
            <div className="relative">
              <div className="text-2xl font-bold">Picked an idea?</div>
              <p className="text-muted text-sm mt-1">Set up Previewnet, scaffold it with the dApp Builder, and apply for the Boundless perk.</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <Link to="/nac#quickstart" className="pill bg-royal text-white font-semibold px-5 py-3">Quickstart</Link>
              <Link to="/boundless" className="pill bg-white text-ink font-semibold px-5 py-3">Apply for Boundless</Link>
            </div>
          </div>
        </div>
      </section>
    </Marketing>
  )
}
