---
name: tezos-x-dapp-builder
description: Build on Tezos X, where an EVM interface and a Michelson interface share one ledger and call each other atomically. Activate for Previewnet, native atomic composability, gateways, octez.js cross-runtime helpers, or the NAC counter tutorial.
version: 3.0
last_updated: November 2026
---

# Tezos X

Tezos X here means the Etherlink execution layer with two interfaces in one kernel: EVM (Solidity, `0x` accounts, JSON-RPC) and Michelson (`tz`/`KT1` accounts, Tezos RPC). Native atomic composability (NAC) is a call through a gateway inside one transaction and one block. It is not a bridge and it does not wrap the asset.

Use this sub-skill when a contract on one interface must call a contract on the other and the whole action must succeed or revert together. For a pure Solidity app, use `../etherlink/SKILL.md`. For Tezos L1 only, use `../tezos/SKILL.md`.

## Read these first
- `references/tezos-x-network-info.md` — Previewnet ids, RPCs, faucet, bridge, rollup, and the Michelson RPCs for mainnet and Shadownet
- `references/nac-cross-runtime-calls.md` — precompile, gateway entrypoints, views, revert behavior, mutez/wei, gas
- `references/octez-js-tezos-x.md` — `@tezos-x/octez.js` and `buildEvmToMichelsonCall` / `buildMichelsonToEvmCall`
- `references/nac-counter-walkthrough.md` — SmartPy counter + Remix forwarder on Previewnet

## Rules of thumb
1. Previewnet is the hackathon network. It can be reset. If the repo, the dashboard, and this file disagree, trust the repo and the dashboard.
2. Each account has an `0x` address and a `tz1` address with separate balances. Fund both.
3. EVM → Michelson goes to precompile `0xff00000000000000000000000000000000000007`. Michelson → EVM goes to `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw`.
4. 1 mutez = 10^12 wei. Amounts that are not a whole number of mutez are rejected by octez.js (`SubMutezPrecisionError`).
5. Do not hardcode an EVM alias captured before the November 9, 2026 Previewnet kernel (v0.11). Derivation changed.
6. Tickets, Sapling, timelocks, global constants, and `tz4` accounts are not available on the Michelson interface yet. Do not propose a ticket contract, a ticket checkout, or any other ticket issuance idea for Tezos X. Hackathon builds should use `callMichelson`, `%call_evm`, FA2, or a read only view. A Michelson account calling an EVM pool in one operation is in scope. A ticket is not.
7. `SOURCE` on a cross-interface call is the null address `tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU`, not the EVM alias. Do not use `SENDER == SELF_ADDRESS` as an auth check.

## Sources and last verified

Verified November 22, 2026.

- https://docs.etherlink.com/overview/native-atomic-composability
- https://docs.etherlink.com/tutorials/nac-counter
- https://docs.etherlink.com/michelson/developing/compatibility
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
- https://octez-js.tezos.com/docs/25.0.0/tezosx_cross_runtime/
- https://github.com/trilitech/tezos-x-previewnet
- https://github.com/trilitech/tezos-x-previewnet/blob/main/README.md
- https://previewnet.tezosx.nomadic-labs.com/
