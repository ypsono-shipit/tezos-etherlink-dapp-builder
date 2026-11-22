---
name: etherlink-dapp-builder
description: Expert Etherlink EVM dApp developer. Activate for Solidity smart contracts, Hardhat/Foundry, viem/ethers.js, MetaMask/WalletConnect, ERC20/ERC721/ERC1155, and deployment to Etherlink mainnet (chain 42793) or Shadownet (chain 127823). For calls into the Michelson interface, use the Tezos X sub-skill instead.
version: 3.0
last_updated: November 2026
chain: Etherlink (EVM interface of the Tezos X execution layer)
---

# Etherlink EVM dApp Builder

Etherlink is a Tezos Smart Rollup execution layer. The EVM interface is the Solidity side: same tooling as Ethereum, gas token XTZ (18 decimals), chain id 42793 on mainnet. Since Ganesha, the same rollup also runs a Michelson interface. A call from one interface to the other is native atomic composability, documented in `../tezos-x/SKILL.md`, not in this file.

## When to use this skill
- Solidity on the EVM interface
- Hardhat or Foundry
- viem v2 or ethers.js v6
- MetaMask or WalletConnect
- ERC20 / ERC721 / ERC1155
- Porting an Ethereum contract onto Etherlink

If the contract must call Michelson in the same transaction, stop and open `../tezos-x/SKILL.md`.

## Stack
| Layer | Tool |
|---|---|
| Contracts | Solidity ^0.8.20 |
| Tooling | Hardhat or Foundry |
| Frontend | viem v2 or ethers.js v6 |
| Wallet | MetaMask, WalletConnect, Rabby |
| Testnet | Etherlink Shadownet (chain 127823) |
| Mainnet | Etherlink (chain 42793) |
| Explorer | https://explorer.etherlink.com |

## Network quick reference
See `references/network-info.md`.

```
Mainnet:   https://node.mainnet.etherlink.com   chainId 42793
Shadownet: https://node.shadownet.etherlink.com chainId 127823
Native token: XTZ (18 decimals)
Faucet: https://shadownet.faucet.etherlink.com
```

Shadownet chain id, RPC, and faucet are carried from the April 2026 skill. The docs getting-started page (November 20, 2026) points at a Network information page that 404'd at `/network-information` on November 22, 2026. Confirm the live page before a production deploy. Previewnet is a different network; do not reuse 42793 there.

## Workflows

### 1. Compile
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```
Full config → `references/hardhat-config.md`

### 2. Deploy
```bash
npx hardhat run scripts/deploy.js --network shadownet
npx hardhat run scripts/deploy.js --network etherlinkMainnet
```

### 3. Frontend with viem
`references/viem-frontend-guide.md`: `createPublicClient`, `createWalletClient`, reads, writes, MetaMask chain switch.

### 4. Gas and fees
Two parts: execution gas, plus an L1 data-availability inclusion fee that scales with calldata. `eth_estimateGas` returns both. A gas limit copied from Ethereum is too small for large deploys. Priority fees are ignored; the sequencer is first come, first served.

- `references/gas-and-fees.md`
- Do not pass a hardcoded `gas` on deploy. Let `eth_estimateGas` run.
- The numeric formula in that file (1 gwei base, 30M block gas, `0.000004 XTZ × (150 + bytes)`) is the April 2026 writeup. `https://docs.etherlink.com/network/fees/` returned an empty body on November 22, 2026, so those constants were **not** reconfirmed. Re-read the fees page before relying on them.

### 5. Security and release
- `references/security-checklist.md`
- `references/deployment-checklist.md`

## Differences from Ethereum mainnet
- Gas token is XTZ, 18 decimals, not ETH
- Target block time is about 500 ms, with preconfirmation around 50 ms. L1 settlement is about 6 seconds. Source: "What is Etherlink?" and the architecture page, both current as of November 20, 2026. The older "~2 min finality / 500 ms to 6 s blocks" line is out of date.
- Full EVM for the Solidity interface. Chain id and RPC change; the language does not.
- No EIP-4844 blobs. Data availability is the inclusion fee above, not blobs.
- Michelson contracts and NAC are a second interface, not an EVM precompile you can ignore. See `../tezos-x/SKILL.md`.

## Bridging from Tezos L1
L1 ↔ Etherlink asset movement is a bridge: `../shared/bridging-xtz-fa-complete-guide.md`.
Chain choice: `../shared/architecture-comparison.md`.

## Sources and last verified

Verified November 22, 2026, except the fee constants and the Shadownet EVM triple noted above.

- https://docs.etherlink.com/
- https://docs.etherlink.com/overview/architecture
- https://docs.etherlink.com/evm/getting-started
- https://docs.etherlink.com/overview/native-atomic-composability
- https://docs.etherlink.com/network/fees/
