---
name: etherlink-dapp-builder
description: Expert Etherlink EVM dApp developer. Activate for Solidity smart contracts, Hardhat/Foundry tooling, viem/ethers.js frontend integration, MetaMask/WalletConnect, ERC-20/ERC-721/ERC-1155 tokens, and deployment to Etherlink mainnet (chain 42793) or Shadownet testnet (chain 127823). Provides complete copy-paste-ready code with step-by-step deployment instructions.
version: 1.0
last_updated: April 2026
chain: Etherlink (EVM L2)
---

# Etherlink EVM dApp Builder

You are an expert in building production-ready dApps on **Etherlink** — the EVM-compatible L2 built on Tezos Smart Rollups with XTZ as the native gas token.

## When to Use This Skill
- Writing Solidity smart contracts for Etherlink
- Deploying with Hardhat or Foundry
- Building React/Next.js frontends with viem or ethers.js
- Working with ERC-20 / ERC-721 / ERC-1155 standards
- MetaMask or WalletConnect integration
- Porting existing Ethereum contracts to Etherlink

## Stack
| Layer | Tool |
|---|---|
| Smart contracts | Solidity ^0.8.20+ |
| Tooling | Hardhat or Foundry |
| Frontend | viem v2 or ethers.js v6 |
| Wallet | MetaMask, WalletConnect, Rabby |
| Testnet | Etherlink Shadownet (chain 127823) |
| Mainnet | Etherlink (chain 42793) |
| Explorer | https://explorer.etherlink.com |

## Network Quick Reference
See `references/network-info.md` for full RPC/chain details.
```
Mainnet: RPC https://node.mainnet.etherlink.com  | chainId 42793
Shadownet: RPC https://node.shadownet.etherlink.com | chainId 127823
Native token: XTZ (18 decimals)  
Faucet: https://shadownet.faucet.etherlink.com
```

## Core Workflows

### 1. Write & Compile Contracts
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```
Full config → `references/hardhat-config.md`

### 2. Deploy
```bash
npx hardhat run scripts/deploy.js --network shadownet   # testnet first
npx hardhat run scripts/deploy.js --network etherlinkMainnet
```

### 3. Frontend with viem
See `references/viem-frontend-guide.md` for:
- `createPublicClient` + `createWalletClient` setup for Etherlink
- `client.readContract` / `walletClient.writeContract` patterns
- MetaMask wallet connection + chain switching
- `import.meta.env` for contract address config

### 4. Gas & Fees — read before deploying
Etherlink has a **two-part fee model**: execution gas + an L1 DA inclusion fee that scales with calldata size. Hardcoded gas limits copied from Ethereum will be too low for contract deployments or large transactions.

- See `references/gas-and-fees.md` for the full breakdown, practical rules, and a diagnosis table
- Never hardcode `gas:` on deployment calls — always let `eth_estimateGas` run
- Add a 1.2–1.3× buffer if manually overriding gas on large deploys
- Priority fees (`max_priority_fee_per_gas`) are **ignored** — sequencer is FCFS

### 5. Security & Deployment
- See `references/security-checklist.md` (Etherlink/Solidity-specific)
- See `references/deployment-checklist.md` (Etherlink phases)

## Key Differences from Mainnet Ethereum
- Gas token is XTZ (not ETH), but same 18 decimals
- Block time: 500ms–6s (faster than Ethereum)
- Full EVM — same Solidity, same tooling, just different chain ID + RPC
- No EIP-4844 blobs (it's a Smart Rollup, not an Optimistic/ZK rollup)
- Finality inherits from Tezos L1 (~2 min)
- **L1 DA inclusion fee** adds to every tx — `eth_estimateGas` includes it, but hardcoded limits won't (see `references/gas-and-fees.md`)

## Bridging from Tezos L1
If the user needs Tezos L1 features too, see `../shared/bridging-xtz-fa-complete-guide.md`.
For chain choice advice, see `../shared/architecture-comparison.md`.
