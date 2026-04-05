# Bridging XTZ & FA Tokens: L1 ↔ Etherlink Complete Guide

## Official Bridge UI
- **Mainnet**: https://bridge.etherlink.com/tezos
- **Shadownet**: https://shadownet.bridge.etherlink.com/tezos

## Bridge Flows

### L1 → Etherlink (Deposit) — Instant
1. Connect Beacon wallet (L1) and MetaMask (Etherlink) in the bridge UI
2. Select amount of XTZ or FA token to bridge
3. Confirm on Tezos L1 — funds arrive on Etherlink within seconds

### Etherlink → L1 (Withdrawal)
- **Fast withdrawal** (~1 min + small fee via liquidity providers)
- **Standard withdrawal** (secure, ~15 days dispute period — no additional fee)

## Programmatic XTZ Deposit (L1 → Etherlink)
```typescript
import { TezosToolkit } from '@taquito/taquito';

const BRIDGE_DEPOSIT_CONTRACT = 'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg'; // mainnet

async function depositXTZToEtherlink(
  tezos: TezosToolkit,
  etherlinkAddress: string, // 0x... address on Etherlink
  amountMutez: number
) {
  const bridge = await tezos.wallet.at(BRIDGE_DEPOSIT_CONTRACT);
  const op = await bridge.methods
    .deposit(etherlinkAddress.toLowerCase().replace('0x', ''))
    .send({ amount: amountMutez, mutez: true });
  await op.confirmation(1);
  return op.opHash;
}
```

## FA2 Token Bridging
FA2 tokens require approval before bridging:
```typescript
// 1. Approve the bridge contract as operator on L1
const tokenContract = await tezos.wallet.at('KT1TokenAddress');
const approveOp = await tokenContract.methods.update_operators([{
  add_operator: {
    owner: userAddress,
    operator: BRIDGE_DEPOSIT_CONTRACT,
    token_id: 0
  }
}]).send();
await approveOp.confirmation(1);

// 2. Then call the bridge deposit for FA2
```

## Checking Bridge Status
```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  transport: http('https://node.mainnet.etherlink.com')
});

// Poll for balance change on Etherlink side after deposit
async function waitForDeposit(address: `0x${string}`, expectedMinBalance: bigint) {
  let balance = 0n;
  while (balance < expectedMinBalance) {
    balance = await client.getBalance({ address });
    await new Promise(r => setTimeout(r, 3000));
  }
  return balance;
}
```

## Security Notes
- Always test bridging flows on Shadownet before mainnet
- Standard withdrawals are the most secure (no trusted intermediary)
- Fast withdrawals depend on liquidity provider availability
- Verify bridge contract addresses from the official Etherlink docs
