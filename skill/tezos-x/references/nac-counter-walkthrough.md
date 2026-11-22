# NAC counter walkthrough

Paraphrase of the official tutorial, for an agent that needs the shape of the project. When a step disagrees with the live page, follow the page. The tutorial was last updated November 20, 2026, and it runs on Tezos X Previewnet, not on Etherlink Shadownet.

https://docs.etherlink.com/tutorials/nac-counter

Network numbers: `tezos-x-network-info.md`. The tutorial says to prefer the previewnet repo and the dashboard if its table is stale.

## What you build

- A Michelson counter (`int` storage) with entrypoints `increment`, `decrement` (fails with `"at zero"` at 0), and `reset`. This is the only counter.
- A Solidity forwarder. `increment()` and `decrement()` call `callMichelson` on the precompile. They do not store the count. They emit `CounterCalled` after a successful forward.

A live demo is linked from the tutorial (`tzx-counter`). You do not need a private repo.

## Before you deploy

You need MetaMask (or another EIP-1193 wallet) and Temple, test XTZ on **both** addresses from the faucet, Remix or Hardhat or Foundry, and the SmartPy IDE. Origination spends the `tz1` balance. The Solidity deploy spends the `0x` balance.

## Gateway call

Precompile: `0xff00000000000000000000000000000000000007`.

```solidity
interface INativeAtomicGateway {
    function callMichelson(
        string calldata destination,
        string calldata entrypoint,
        bytes calldata data
    ) external payable;
}
```

`destination` is the `KT1` string, because a Michelson contract address does not fit a 20 byte EVM address. `entrypoint` is `"increment"` or `"decrement"`. For `unit`, `data` is `hex"030b"`.

The tutorial's forwarder stores the `KT1` from the constructor, uses a low-level `call` with gas `3_000_000`, and bubbles revert data. Keep that structure if you are following the tutorial line by line. See `nac-cross-runtime-calls.md` for why octez.js defaults `callMichelson` to 5M instead.

## Order of work

1. Paste the SmartPy `CounterNacTutorial` from the tutorial (storage `counter`, the three entrypoints, and the `@sp.add_test` scenario). Run it in the SmartPy IDE.
2. Add the Michelson RPC in Temple. Fund the `tz1`.
3. Deploy from the SmartPy IDE on Tezos X Previewnet (the IDE's Tezos-X / Previewnet tab, or a custom RPC). Connect with octez.connect (Beacon in older IDEs) and Temple. Save the `KT1`.
4. Read storage before any EVM call. Authoritative path:

```bash
curl -s "https://michelson.previewnet.tezosx.nomadic-labs.com/chains/main/blocks/head/context/contracts/KT1.../storage"
```

TzKT can lag the RPC. If they disagree, trust the RPC. Initial storage is 0.

5. In Remix, injected provider, MetaMask on Previewnet, deploy the forwarder with the `KT1` constructor argument.
6. Call `increment`. On Blockscout the tx is Success and `CounterCalled` has `action = increment`. The Michelson RPC storage is now 1.
7. Call `decrement` once. Storage returns to 0.
8. Call `decrement` again. Michelson rejects `"at zero"`, so the EVM transaction reverts. There is no `CounterCalled` log, and storage stays 0. MetaMask may refuse to broadcast because estimation fails. The tutorial's workaround is a fixed gas limit in Remix (it suggests `300000` for this demo) so the failed tx is visible on Blockscout. That `300000` is only to force the revert on chain. It is not the gateway gas inside the contract.

## After the tutorial

EVM gateway surface beyond `callMichelson`: the docs page "NAC usage" on the EVM side. Michelson gateway and calls back into EVM: "NAC usage" on the Michelson side. Helpers that build the unsigned transactions: `octez-js-tezos-x.md`.

## Sources and last verified

Verified November 22, 2026.

- https://docs.etherlink.com/tutorials/nac-counter
- https://github.com/trilitech/tezos-x-previewnet
