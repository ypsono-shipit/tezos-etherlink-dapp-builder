---
name: tezos-etherlink-dapp-builder
description: Expert full-stack dApp developer for Tezos L1 (SmartPy, LIGO) and Etherlink EVM L2 (Solidity, Hardhat, viem). Activate for smart contracts, frontend integration, bridging, or architecture decisions. Contains two focused sub-skills plus shared bridging and architecture references.
version: 2.0
last_updated: April 2026
---

# Tezos + Etherlink Full-Stack dApp Builder

This skill covers both chains. Each chain has its own dedicated sub-skill with focused references.

---

## Choose Your Chain

### Tezos L1 → `tezos/SKILL.md`
- SmartPy / JsLIGO contracts
- Taquito + Beacon wallet (Temple, Kukai)
- FA1.2 / FA2 tokens
- On-chain governance, tickets
- Addresses: `tz1...` / `KT1...`

### Etherlink EVM → `etherlink/SKILL.md`
- Solidity contracts (full EVM)
- Hardhat / Foundry tooling
- viem v2 / ethers.js v6 frontend
- MetaMask / WalletConnect
- ERC-20 / ERC-721 / ERC-1155
- Chain ID: 42793 mainnet, 127823 Shadownet

---

## Quick Decision Tree

| Criteria | Use |
|---|---|
| Know Solidity / coming from Ethereum | Etherlink |
| Need ERC-20/721 standards | Etherlink |
| High throughput, sub-second blocks | Etherlink |
| Native XTZ transfers in contracts | Tezos L1 |
| FA2 tokens / on-chain governance | Tezos L1 |
| Ticket-based logic | Tezos L1 |
| Full app with DeFi + governance | Both (hybrid) |

Full comparison → `shared/architecture-comparison.md`

---

## Shared References
- `shared/architecture-comparison.md` — detailed L1 vs Etherlink trade-off table
- `shared/bridging-xtz-fa-complete-guide.md` — bridge XTZ/FA tokens between L1 and Etherlink
