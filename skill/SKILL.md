---
name: tezos-etherlink-dapp-builder
description: Expert full-stack dApp developer for Tezos L1 (SmartPy, LIGO, octez.js), Etherlink EVM (Solidity, Hardhat, viem), and Tezos X native atomic composability across both interfaces. Activate for smart contracts, frontend integration, bridging, cross-runtime calls, or architecture decisions.
version: 3.0
last_updated: November 2026
---

# Tezos + Etherlink + Tezos X dApp Builder

This skill covers Tezos L1, the Etherlink EVM interface, and Tezos X (EVM and Michelson interfaces on one rollup, composed with native atomic composability). Each surface has its own sub-skill.

## Choose your surface

### Tezos L1 → `tezos/SKILL.md`
- SmartPy / JsLIGO contracts
- octez.js (Taquito fork) + Beacon wallet (Temple, Kukai). Taquito still works as an alternative
- FA1.2 / FA2 tokens, tickets, onchain governance
- Addresses: `tz1...` / `KT1...`
- Public testnet: Shadownet. Ghostnet has been removed

### Etherlink EVM → `etherlink/SKILL.md`
- Solidity contracts (EVM interface)
- Hardhat / Foundry, viem v2 / ethers.js v6
- MetaMask / WalletConnect
- ERC20 / ERC721 / ERC1155
- Chain ID: 42793 mainnet, 127823 Shadownet
- Since the Ganesha upgrade, Etherlink also has a Michelson interface. Cross-interface calls are Tezos X, below

### Tezos X (both, via NAC) → `tezos-x/SKILL.md`
- One rollup kernel, one ledger, two interfaces
- EVM precompile `0xff00000000000000000000000000000000000007` and Michelson gateway `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw`
- A call is one transaction. If the callee reverts, the caller can catch it on EVM; Michelson has no try/catch, so the operation reverts
- Hackathon target: Tezos X Previewnet (EVM chain `128064` / `0x1f440`, Michelson chain `NetXY2oPPzkxUW1`)
- Do not use a bridge or wrapped asset when both contracts already live on Tezos X

## Quick decision tree

| Criteria | Use |
|---|---|
| Know Solidity / coming from Ethereum, and you do not need Michelson in the same transaction | Etherlink EVM |
| Need ERC20/721 standards only | Etherlink EVM |
| High throughput, about 500 ms blocks | Etherlink EVM or Tezos X |
| Native XTZ transfers inside a Tezos L1 contract, tickets, or L1 governance | Tezos L1 |
| FA2 tokens or onchain governance that must live on L1 | Tezos L1 |
| A Solidity contract must call Michelson, or the reverse, in one atomic transaction | Tezos X (NAC) |
| Move XTZ or FA tokens between Tezos L1 and Etherlink | Bridge (`shared/bridging-xtz-fa-complete-guide.md`), not NAC |
| Full app with EVM UX and a Michelson core | Tezos X |

Full comparison → `shared/architecture-comparison.md`

## Shared references
- `shared/architecture-comparison.md` — L1 vs Etherlink vs Tezos X
- `shared/bridging-xtz-fa-complete-guide.md` — bridge XTZ/FA tokens between L1 and Etherlink

## Sources and last verified

Verified November 22, 2026.

- https://docs.etherlink.com/
- https://docs.etherlink.com/overview/native-atomic-composability
- https://docs.etherlink.com/michelson/developing/compatibility
- https://docs.tezos.com/developing/testnets
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
- https://github.com/trilitech/tezos-x-previewnet
