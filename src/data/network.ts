export const REPO = 'https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder'
export const SKILL_INSTALL = `npx skills add ${REPO}`

export const EVM_RPC = 'https://evm.previewnet.tezosx.nomadic-labs.com'
export const MICHELSON_RPC = 'https://michelson.previewnet.tezosx.nomadic-labs.com'
export const BLOCKSCOUT = 'https://blockscout.previewnet.tezosx.nomadic-labs.com'
export const TZKT = 'https://tzkt.previewnet.tezosx.nomadic-labs.com'
export const FAUCET = 'https://faucet.previewnet.tezosx.nomadic-labs.com'
export const DASHBOARD = 'https://previewnet.tezosx.nomadic-labs.com/'
export const BRIDGE = 'https://bridge.previewnet.tezosx.nomadic-labs.com/'
export const NAC_GATEWAY = 'KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw'
export const PRECOMPILE = '0xff00000000000000000000000000000000000007'
export const CHAIN_ID = '128064'
export const CHAIN_HEX = '0x1f440'
export const MICHELSON_CHAIN = 'NetXY2oPPzkxUW1'

export type NetRow = { label: string; value: string }

export const EVM_ROWS: NetRow[] = [
  { label: 'Network name', value: 'Tezos X Previewnet' },
  { label: 'RPC URL', value: EVM_RPC },
  { label: 'Chain ID', value: `${CHAIN_ID} (${CHAIN_HEX})` },
  { label: 'Currency', value: 'XTZ' },
  { label: 'Explorer', value: BLOCKSCOUT },
]

export const MICHELSON_ROWS: NetRow[] = [
  { label: 'RPC URL', value: MICHELSON_RPC },
  { label: 'Chain ID', value: MICHELSON_CHAIN },
  { label: 'Explorer (TzKT)', value: TZKT },
  { label: 'NAC gateway', value: NAC_GATEWAY },
  { label: 'Wallets', value: 'Temple · Kukai · Umami · octez-client' },
]
