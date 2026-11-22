export const PREVIEW_CHAIN = {
  chainId: '0x1f440',
  chainName: 'Tezos X Previewnet',
  nativeCurrency: { name: 'XTZ', symbol: 'XTZ', decimals: 18 },
  rpcUrls: ['https://evm.previewnet.tezosx.nomadic-labs.com'],
  blockExplorerUrls: ['https://blockscout.previewnet.tezosx.nomadic-labs.com'],
}

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

export async function addPreviewnet(): Promise<'added' | 'missing' | 'dismissed'> {
  const eth = (window as Window & { ethereum?: EthereumProvider }).ethereum
  if (!eth) {
    window.alert('Install MetaMask to add the network.')
    return 'missing'
  }
  try {
    await eth.request({ method: 'wallet_addEthereumChain', params: [PREVIEW_CHAIN] })
    return 'added'
  } catch {
    return 'dismissed'
  }
}
