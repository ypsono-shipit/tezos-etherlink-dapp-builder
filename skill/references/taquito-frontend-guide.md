# Taquito Frontend Integration (React / Next.js)

## Installation
```bash
npm install @taquito/taquito @taquito/beacon-wallet
```

## Basic Wallet Connection
```typescript
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

const Tezos = new TezosToolkit('https://rpc.shadownet.tezos.com'); // or mainnet RPC
const wallet = new BeaconWallet({ name: "My dApp" });

export async function connectWallet() {
  await wallet.requestPermissions({ network: { type: 'ghostnet' } }); // or 'mainnet'
  Tezos.setWalletProvider(wallet);
  const address = await wallet.getPKH();
  return address;
}

export async function disconnectWallet() {
  await wallet.clearActiveAccount();
}
```

## Calling a Contract Entry Point
```typescript
export async function callIncrement(contractAddress: string, amount: number) {
  const contract = await Tezos.wallet.at(contractAddress);
  const op = await contract.methods.increment(amount).send();
  await op.confirmation(1);
  console.log("Confirmed:", op.opHash);
  return op.opHash;
}
```

## Reading Contract Storage
```typescript
export async function getStorage(contractAddress: string) {
  const contract = await Tezos.contract.at(contractAddress);
  const storage = await contract.storage();
  return storage;
}
```

## React Hook: useWallet
```typescript
import { useState, useCallback } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    const addr = await connectWallet();
    setAddress(addr);
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setAddress(null);
  }, []);

  return { address, connect, disconnect, isConnected: !!address };
}
```

## Hybrid App: Taquito (L1) + viem (Etherlink)
```typescript
import { createWalletClient, custom } from 'viem';
import { defineChain } from 'viem';

const etherlink = defineChain({
  id: 42793,
  name: 'Etherlink',
  nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
  rpcUrls: { default: { http: ['https://node.mainnet.etherlink.com'] } },
});

const evmClient = createWalletClient({
  chain: etherlink,
  transport: custom(window.ethereum),
});

// Use Tezos for L1, evmClient for Etherlink — in the same React app
```
