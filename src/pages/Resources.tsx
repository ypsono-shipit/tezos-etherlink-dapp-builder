import { useMemo, useState } from 'react'
import { ArrowUpRight, FileText, GraduationCap, Newspaper, Play, Search, Wrench } from 'lucide-react'
import { RESOURCE_GROUPS, RESOURCES, type ResourceType } from '../data/resources.ts'
import { Marketing, Wave } from '../components/ui.tsx'

const TYPE_CLASS: Record<ResourceType, string> = {
  Doc: 'bg-white/10 text-white',
  Tutorial: 'bg-azure/15 text-azure',
  Article: 'bg-royal/25 text-[#9db8ff]',
  Tool: 'bg-white text-ink',
  Video: 'bg-royal/25 text-white',
}

const TYPE_ICON = {
  Doc: FileText,
  Tutorial: GraduationCap,
  Article: Newspaper,
  Tool: Wrench,
  Video: Play,
}

const FILTERS = ['All', 'Docs', 'Tutorials', 'Articles', 'Tools', 'Videos'] as const
const FILTER_TYPE: Record<(typeof FILTERS)[number], ResourceType | 'all'> = {
  All: 'all',
  Docs: 'Doc',
  Tutorials: 'Tutorial',
  Articles: 'Article',
  Tools: 'Tool',
  Videos: 'Video',
}

export default function Resources() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const type = FILTER_TYPE[filter]
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RESOURCE_GROUPS.map((group) => ({
      group,
      items: RESOURCES.filter((item) => item.g === group && (type === 'all' || item.ty === type) && (!q || `${item.t} ${item.s} ${item.d}`.toLowerCase().includes(q))),
    })).filter((group) => group.items.length)
  }, [query, type])

  return (
    <Marketing title="Resources | Tezos X">
      <section className="relative pt-10 md:pt-36 pb-16 md:pb-24">
        <Wave count={150} mode="wave" className="bottom-0 h-[110px] md:h-[150px] opacity-30" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
        <div className="orb w-[360px] h-[360px] md:w-[560px] md:h-[560px] bg-royal/45 -top-24 right-0 md:right-[10%]" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-6">
          <div className="eyebrow mb-4">Resources</div>
          <h1 className="h-sec text-[44px] md:text-[80px]">Everything you need to <b>build on Tezos X.</b></h1>
          <p className="text-muted mt-5 md:text-lg max-w-2xl">A curated library of official Tezos X docs, tutorials, tools and announcements. Every link checked on Nov 22, 2026.</p>
        </div>
      </section>
      <section className="relative pb-10">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="glass p-3 md:p-4 flex flex-col md:flex-row gap-3 md:items-center sticky top-3 md:top-24 z-30">
            <div className="field flex items-center gap-2 px-4 flex-1">
              <Search className="w-4 h-4 text-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="bg-transparent w-full py-3 text-sm placeholder:text-white/35" placeholder="Search docs, tutorials, tools…" aria-label="Search resources" />
            </div>
            <div className="seg" role="tablist" aria-label="Resource type">
              {FILTERS.map((item) => (
                <button key={item} type="button" className={filter === item ? 'on' : ''} onClick={() => setFilter(item)}>{item}</button>
              ))}
            </div>
          </div>
          {groups.length ? (
            <div className="mt-8 space-y-12">
              {groups.map(({ group, items }) => (
                <div key={group}>
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold">{group}</h2>
                    <span className="text-xs text-muted">{items.length} item{items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const Icon = TYPE_ICON[item.ty]
                      return (
                        <a key={item.u} href={item.u} target="_blank" rel="noopener noreferrer" className="glass p-4 sm:p-5 flex flex-col group hover:border-azure/40 transition">
                          <div className="hidden sm:flex items-start justify-between mb-4">
                            <span className={`icon-c ${item.ty === 'Tool' ? 'bg-azure/15 text-azure' : 'bg-white/10'}`}><Icon className="w-5 h-5" /></span>
                            <span className={`pill text-[11px] font-semibold px-2.5 py-1 ${TYPE_CLASS[item.ty]}`}>{item.ty}</span>
                          </div>
                          <div className="font-semibold leading-snug">{item.t}</div>
                          <p className="text-sm text-muted mt-1.5 flex-1">{item.d}</p>
                          <div className="mt-3 sm:mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-muted flex items-center gap-2">
                              <span className={`sm:hidden pill text-[10px] font-semibold px-2 py-0.5 ${TYPE_CLASS[item.ty]}`}>{item.ty}</span>
                              {item.s}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-azure" />
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mt-10 text-center">Nothing matches. Try another word.</p>
          )}
        </div>
      </section>
    </Marketing>
  )
}
