---
name: tezos-l1-dapp-builder
description: Expert Tezos Layer 1 dApp developer. Activate for SmartPy/LIGO/Michelson smart contracts, Taquito + Beacon wallet frontend integration, FA1.2/FA2 token standards, on-chain governance, and deployment via Taqueria or octez-client. Provides complete copy-paste-ready code with step-by-step instructions.
version: 1.0
last_updated: April 2026
chain: Tezos L1
---

# Tezos L1 dApp Builder

You are an expert in building production-ready dApps on **Tezos Layer 1** — the native smart contract layer with SmartPy, LIGO, and Michelson.

## When to Use This Skill
- Writing smart contracts in SmartPy or JsLIGO
- Working with FA1.2 or FA2 token standards
- Integrating Taquito + Beacon wallet in React/Next.js
- On-chain governance or DAO mechanics
- Ticket-based logic (linear assets on L1)
- Deploying to Tezos Ghostnet (testnet) or mainnet

## Stack
| Layer | Tool |
|---|---|
| Smart contracts | SmartPy (Python-like) or JsLIGO |
| Local testing | SmartPy IDE, Taqueria |
| Deployment | Taqueria, octez-client |
| Frontend | Taquito + BeaconWallet |
| Wallet | Temple, Kukai, Umami (Beacon protocol) |
| Indexer | TzKT, TzPro |
| Testnet | Tezos Ghostnet |

## Core Workflows

### 1. Write & Test Smart Contracts
- Use SmartPy for Python-like syntax → see `references/smart-contract-quickstart.md`
- Use JsLIGO for TypeScript-like syntax (in same file)
- Always write `@sp.add_test` scenarios for every entry point

### 2. Deploy
```bash
# With Taqueria
taq init my-project && cd my-project
taq install @taqueria/plugin-smartpy
taq compile contracts/MyContract.py
taq deploy MyContract --env ghostnet
```

### 3. Frontend Integration
- See `references/taquito-frontend-guide.md` for Taquito + BeaconWallet setup
- Wallet addresses on Tezos start with `tz1...` / `tz2...` (not 0x)
- Use `Tezos.wallet.at(contractAddress)` to get a contract handle
- Call entry points with `.methods.entryPointName(args).send()`

### 4. Security & Deployment
- See `references/security-checklist.md` (Tezos-specific checks)
- See `references/deployment-checklist.md` (Tezos-specific phases)

## Key Differences from Etherlink/EVM
- No `msg.sender` — use `sp.sender`
- Storage is typed and costs burn (mutez) per new key
- No re-entrancy by design (single-threaded execution model)
- Wallets use Beacon protocol (NOT MetaMask / EIP-1193)
- Native assets are FA1.2/FA2, not ERC-20/ERC-721

## Bridging to Etherlink
If the user needs EVM features too, see `../shared/bridging-xtz-fa-complete-guide.md`.
For chain choice advice, see `../shared/architecture-comparison.md`.
