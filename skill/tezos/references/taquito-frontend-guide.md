# Frontend on Tezos L1 (React)

Use octez.js. It is the Taquito fork with the same toolkit API. Taquito still runs on L1; it does not include the Tezos X helpers.

## Install octez.js

```bash
npm install @tezos-x/octez.js @tezos-x/octez.js-dapp-wallet
```

## Wallet connection

Shadownet RPC from the Octez client docs: `https://rpc.shadownet.teztnets.com`. Mainnet public RPCs include `https://rpc.tzbeta.net` and `https://tezos-mainnet.octez.io` (docs.tezos.com nodes page; that page's own "last updated" stamp is April 16, 2024, so confirm the host before you ship).

```typescript
import { TezosToolkit } from '@tezos-x/octez.js';
import { BeaconWallet } from '@tezos-x/octez.js-dapp-wallet';

const Tezos = new TezosToolkit('https://rpc.shadownet.teztnets.com');
const wallet = new BeaconWallet({ name: 'My dApp' });

export async function connectWallet() {
  await wallet.requestPermissions({ network: { type: 'shadownet' } });
  Tezos.setWalletProvider(wallet);
  return wallet.getPKH();
}

export async function disconnectWallet() {
  await wallet.clearActiveAccount();
}
```

For mainnet, pass `{ type: 'mainnet' }` and a mainnet RPC. Do not pass `ghostnet`. Ghostnet has been removed (docs.tezos.com testnets page).

## Call an entrypoint

```typescript
export async function callIncrement(contractAddress: string, amount: number) {
  const contract = await Tezos.wallet.at(contractAddress);
  const op = await contract.methods.increment(amount).send();
  await op.confirmation(1);
  return op.opHash;
}
```

## Read storage

```typescript
export async function getStorage(contractAddress: string) {
  const contract = await Tezos.contract.at(contractAddress);
  return contract.storage();
}
```

## useWallet

```typescript
import { useState, useCallback } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const connect = useCallback(async () => setAddress(await connectWallet()), []);
  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setAddress(null);
  }, []);
  return { address, connect, disconnect, isConnected: !!address };
}
```

## Taquito alternative (L1 only)

```bash
npm install @taquito/taquito @taquito/beacon-wallet
```

```typescript
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
```

Same method names. Package map: https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/

## Hybrid app: L1 + Etherlink EVM

```typescript
import { createWalletClient, custom, defineChain } from 'viem';

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
```

That client is the EVM interface only. A call that must land on Michelson in the same transaction uses `../tezos-x/references/octez-js-tezos-x.md`, not this snippet. Chain 42793 is Etherlink mainnet, not Tezos X Previewnet (128064).

## Sources and last verified

Verified November 22, 2026.

- https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/
- https://docs.tezos.com/developing/testnets
- https://docs.tezos.com/developing/octez-client/installing
- https://docs.tezos.com/architecture/nodes
