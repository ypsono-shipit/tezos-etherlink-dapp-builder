export type IdeaDir = 'e2m' | 'm2e' | 'both'
export type IdeaLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type Idea = {
  t: string
  d: string
  dir: IdeaDir
  lvl: IdeaLevel
  icon: 'ticket' | 'image' | 'bar' | 'repeat' | 'landmark' | 'zap' | 'shield' | 'vote' | 'activity' | 'game' | 'building' | 'send'
}

export const DIR_LABEL: Record<IdeaDir, string> = {
  e2m: 'EVM → Michelson',
  m2e: 'Michelson → EVM',
  both: 'Both ways',
}

export const IDEAS: Idea[] = [
  { t: 'Pay with anything ticketing', d: 'MetaMask user pays in USDC, Michelson ticket contract priced in tez issues the ticket in one tx.', dir: 'e2m', lvl: 'Beginner', icon: 'ticket' },
  { t: 'One click FA2 NFT checkout', d: 'Buy a Michelson FA2 NFT from any EVM wallet; payment and transfer settle together or not at all.', dir: 'e2m', lvl: 'Beginner', icon: 'image' },
  { t: 'Prediction market, both wallets', d: 'Market logic in Michelson, bets placed from Solidity frontends; payouts can\'t half settle.', dir: 'e2m', lvl: 'Beginner', icon: 'bar' },
  { t: 'Cross runtime swap router', d: 'Swap on the EVM DEX and deposit the output into a Michelson vault in one atomic route.', dir: 'both', lvl: 'Intermediate', icon: 'repeat' },
  { t: 'Unified collateral lending', d: 'Post FA2 collateral on Michelson, borrow ERC20 tokens on EVM; health checks read state across runtimes.', dir: 'both', lvl: 'Advanced', icon: 'landmark' },
  { t: 'Cross runtime flash arbitrage', d: 'Borrow on EVM, trade a Michelson pool, repay. The whole loop reverts if it isn\'t profitable.', dir: 'both', lvl: 'Advanced', icon: 'zap' },
  { t: 'Formally verified vault core', d: 'Keep critical accounting in a verifiable Michelson contract; expose it to EVM dApps via the gateway.', dir: 'e2m', lvl: 'Advanced', icon: 'shield' },
  { t: 'Michelson DAO, EVM treasury', d: 'A Tezos style governance contract executes EVM treasury actions with %call_evm when a vote passes.', dir: 'm2e', lvl: 'Intermediate', icon: 'vote' },
  { t: 'EVM price feeds for Michelson', d: 'Michelson contracts read EVM oracle state synchronously through the gateway view, no relayer.', dir: 'm2e', lvl: 'Intermediate', icon: 'activity' },
  { t: 'Game items across runtimes', d: 'Game loop in Solidity, items as Michelson FA2 tokens; crafting burns and creates items atomically.', dir: 'both', lvl: 'Intermediate', icon: 'game' },
  { t: 'Compliance gated RWA transfers', d: 'An ERC20 transfer checks a Michelson registry first and reverts if the holder isn\'t allowed.', dir: 'e2m', lvl: 'Advanced', icon: 'building' },
  { t: 'Tez native payroll to 0x wallets', d: 'A Michelson payroll contract pays a list of EVM addresses in one atomic batch.', dir: 'm2e', lvl: 'Beginner', icon: 'send' },
]

export const LEVEL_CLASS: Record<IdeaLevel, string> = {
  Beginner: 'bg-azure/15 text-azure',
  Intermediate: 'bg-royal/25 text-[#9db8ff]',
  Advanced: 'bg-white/10 text-white',
}
