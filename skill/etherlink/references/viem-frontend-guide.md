# viem Frontend Guide for Etherlink

## Installation
```bash
npm install viem
```

## Chain Config
```typescript
import { defineChain } from 'viem'

export const etherlink = defineChain({
  id: 42793,
  name: 'Etherlink',
  nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
  rpcUrls: { default: { http: ['https://node.mainnet.etherlink.com'] } },
  blockExplorers: { default: { name: 'Etherlink Explorer', url: 'https://explorer.etherlink.com' } },
})

export const etherlinkShadownet = defineChain({
  id: 127823,
  name: 'Etherlink Shadownet',
  nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
  rpcUrls: { default: { http: ['https://node.shadownet.etherlink.com'] } },
  blockExplorers: { default: { name: 'Shadownet Explorer', url: 'https://shadownet.explorer.etherlink.com' } },
})
```

## Read from Contract
```typescript
import { createPublicClient, http } from 'viem'
import { etherlink } from './chains'
import { ABI, CONTRACT_ADDRESS } from './abi'

const client = createPublicClient({ chain: etherlink, transport: http() })

// Read a view function
const result = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'getSuggestions',
})
```

## Connect MetaMask + Write to Contract
```typescript
import { createWalletClient, custom } from 'viem'
import { etherlink } from './chains'

async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask not installed')

  const walletClient = createWalletClient({
    chain: etherlink,
    transport: custom(window.ethereum),
  })

  const [address] = await walletClient.requestAddresses()

  // Switch to Etherlink
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xa729' }], // 42793 hex
    })
  } catch {
    // Chain not added yet — add it
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xa729',
        chainName: 'Etherlink',
        nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
        rpcUrls: ['https://node.mainnet.etherlink.com'],
        blockExplorerUrls: ['https://explorer.etherlink.com'],
      }],
    })
  }

  return { walletClient, address }
}

// Write to contract
async function submitTx(walletClient, address) {
  const hash = await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'myFunction',
    args: ['arg1', BigInt(42)],
    account: address,
  })
  console.log('tx hash:', hash)
  return hash
}
```

## Wait for Transaction Receipt
```typescript
const receipt = await client.waitForTransactionReceipt({ hash })
console.log('confirmed in block', receipt.blockNumber)
```

## Vite + TypeScript Setup
Add to `src/vite-env.d.ts` (or any `.d.ts`):
```typescript
/// <reference types="vite/client" />
```
Access env vars:
```typescript
const address = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
```

## ABI Type Casting
viem infers bigint for uint256. When mapping to your own types:
```typescript
const raw = await client.readContract({ ... })
// Cast via unknown to bridge bigint → number safely
const list = (raw as unknown as MyType[]).map(item => ({
  id: Number(item.id),        // bigint → number
  votes: Number(item.votes),  // bigint → number
  author: item.author,        // string stays string
}))
```

## Common Pitfalls
- `readContract` / `writeContract` are client **methods** in viem v2, not standalone imports
- `walletClient.writeContract` needs `account` param (the connected address)
- `uint256` in ABI returns as `bigint` — always convert with `Number()` or `BigInt()`
- Chain ID `0xa729` = `42793` decimal (Etherlink mainnet)
- Chain ID `0x1f3af` = `127823` decimal (Shadownet)
