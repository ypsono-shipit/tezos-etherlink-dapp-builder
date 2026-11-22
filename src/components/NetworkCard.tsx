import { useState } from 'react'
import { Copy, Droplets, Plus } from 'lucide-react'
import { EVM_ROWS, FAUCET, MICHELSON_ROWS } from '../data/network.ts'
import { AddMetaMask, CopyButton } from './ui.tsx'

export function NetworkCard() {
  const [side, setSide] = useState<'evm' | 'mich'>('evm')
  const rows = side === 'evm' ? EVM_ROWS : MICHELSON_ROWS
  return (
    <div className="card-grad grain relative p-5 md:p-7 overflow-hidden">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-xs text-white/70">Network card</div>
          <div className="text-2xl font-bold">Tezos X Previewnet</div>
        </div>
        <div className="seg !bg-black/20" role="tablist" aria-label="Network interface">
          <button type="button" className={side === 'evm' ? 'on' : ''} onClick={() => setSide('evm')}>EVM</button>
          <button type="button" className={side === 'mich' ? 'on' : ''} onClick={() => setSide('mich')}>Michelson</button>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-2xl px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/60">{row.label}</div>
              <div className="mono text-[13px] truncate">{row.value}</div>
            </div>
            <CopyButton value={row.value} label={`Copy ${row.label}`} className="w-8 h-8 rounded-full bg-white/15 grid place-items-center flex-none">
              <Copy className="w-4 h-4" />
            </CopyButton>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {side === 'evm' ? (
          <AddMetaMask className="pill bg-white text-ink font-semibold px-5 py-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add to MetaMask
          </AddMetaMask>
        ) : null}
        <a href={FAUCET} className="pill bg-royal text-white font-semibold px-5 py-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" /> Open faucet
        </a>
      </div>
      <div className="text-[11px] text-white/60 mt-4">Source of truth: the trilitech previewnet repo on GitHub · Previewnet can be reset, so check the dashboard.</div>
    </div>
  )
}
