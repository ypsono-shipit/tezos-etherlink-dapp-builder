---
name: tezos-l1-dapp-builder
description: Expert Tezos Layer 1 dApp developer. Activate for SmartPy, LIGO, or Michelson on L1, octez.js or Taquito with Beacon, FA1.2/FA2, tickets, onchain governance, and deploys via Taqueria or octez-client. Shadownet is the public testnet. For the Etherlink Michelson interface or cross-runtime calls, use the Tezos X sub-skill.
version: 3.0
last_updated: November 2026
chain: Tezos L1
---

# Tezos L1 dApp Builder

Tezos Layer 1 is the base chain: SmartPy, LIGO, Michelson, bakers, tickets, and protocol governance. It is not the Michelson interface of Etherlink. That interface is Tezos X (`../tezos-x/SKILL.md`) and it does not yet have tickets, Sapling, timelocks, global constants, or tz4 accounts.

## When to use this skill
- SmartPy or JsLIGO contracts that must live on L1
- FA1.2 or FA2 on L1
- octez.js or Taquito with Beacon (Temple, Kukai, Umami)
- Tickets or L1 governance
- Deploy to Shadownet or mainnet

## Stack
| Layer | Tool |
|---|---|
| Contracts | SmartPy or JsLIGO |
| Local tests | SmartPy IDE, Taqueria |
| Deploy | Taqueria, octez-client |
| Frontend | `@tezos-x/octez.js` + `@tezos-x/octez.js-dapp-wallet` (Beacon). `@taquito/taquito` + `@taquito/beacon-wallet` still work on L1 |
| Wallets | Temple, Kukai, Umami |
| Indexer | TzKT |
| Testnet | Shadownet. Ghostnet has been removed |

## Workflows

### 1. Contracts
- SmartPy: `references/tezos-smart-contract-quickstart.md`
- JsLIGO is covered in the same guide
- Write `@sp.add_test` scenarios for every entrypoint

### 2. Deploy
```bash
taq init my-project && cd my-project
taq install @taqueria/plugin-smartpy
taq compile contracts/MyContract.py
taq deploy MyContract --env shadownet
```

octez-client against the public Shadownet RPC:

```bash
octez-client --endpoint https://rpc.shadownet.teztnets.com config update
```

Faucet: https://faucet.shadownet.teztnets.com
Current testnets: https://teztnets.com/ and https://docs.tezos.com/developing/testnets

### 3. Frontend
`references/taquito-frontend-guide.md` now leads with octez.js. The Beacon API is unchanged (`requestPermissions`, `Tezos.wallet.at`, `.methods.entryPointName(args).send()`). Addresses are `tz1` / `tz2` / `tz3` and `KT1`, not `0x`.

Network type for Beacon on the testnet is `shadownet`, not `ghostnet`.

### 4. Security and release
- `references/security-checklist.md`
- `references/deployment-checklist.md`

## Differences from Etherlink
- `sp.sender`, not `msg.sender`
- Storage is typed and new keys burn mutez
- Single threaded. No EVM style reentrancy, but cross-contract calls still need care
- Beacon wallets, not MetaMask
- FA1.2 / FA2, and tickets on L1 only

## If they also need EVM
Bridge: `../shared/bridging-xtz-fa-complete-guide.md`.
Same transaction as a Solidity contract: `../tezos-x/SKILL.md`, and do not promise tickets there.

## Sources and last verified

Verified November 22, 2026.

- https://docs.tezos.com/developing/testnets
- https://docs.tezos.com/developing/octez-client/installing
- https://docs.tezos.com/tutorials/smart-contract/jsligo
- https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/
- https://docs.etherlink.com/michelson/developing/compatibility
