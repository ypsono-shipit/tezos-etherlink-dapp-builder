import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BarChart3, Building2, Gamepad2, Image, Landmark, Repeat, Send, ShieldCheck, Ticket, Vote, Zap } from 'lucide-react'
import { DIR_LABEL, LEVEL_CLASS, type Idea } from '../data/ideas.ts'

const ICONS = {
  ticket: Ticket,
  image: Image,
  bar: BarChart3,
  repeat: Repeat,
  landmark: Landmark,
  zap: Zap,
  shield: ShieldCheck,
  vote: Vote,
  activity: Activity,
  game: Gamepad2,
  building: Building2,
  send: Send,
}

export function IdeaCard({ idea, index, featured = false, linked = false }: { idea: Idea; index: number; featured?: boolean; linked?: boolean }) {
  const Icon = ICONS[idea.icon]
  const bubble = index % 3 === 0 ? 'bg-white text-ink' : index % 3 === 1 ? 'bg-azure/15 text-azure' : 'bg-royal/25 text-[#8fb0ff]'
  return (
    <div className={`glass p-5 flex flex-col ${featured ? 'ring-1 ring-azure/30' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <span className={`icon-c ${bubble}`}><Icon className="w-5 h-5" /></span>
        <span className={`pill text-[11px] font-semibold px-2.5 py-1 ${LEVEL_CLASS[idea.lvl]}`}>{idea.lvl}</span>
      </div>
      <div className="font-bold">{idea.t}</div>
      <p className="text-sm text-muted mt-1.5 flex-1">{idea.d}</p>
      {linked ? (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-muted mono">{DIR_LABEL[idea.dir]}</span>
          <Link to={`/claude?idea=${encodeURIComponent(idea.t)}`} className="text-azure font-semibold flex items-center gap-1">
            Use idea <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-muted mono">{DIR_LABEL[idea.dir]}</div>
      )}
    </div>
  )
}
