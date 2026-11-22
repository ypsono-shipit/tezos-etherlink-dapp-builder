# octez.js on Tezos X

octez.js is the Trilitech fork of Taquito. The public API matches Taquito; package names changed. Docs version read: 25.0.0, on November 22, 2026. The Tezos X pages are marked work in progress.

## Install

```bash
npm install @tezos-x/octez.js @tezos-x/octez.js-signer @tezos-x/octez.js-dapp-wallet @tezos-x/octez.js-utils
```

`@tezos-x/octez.js-utils` holds the cross-runtime helpers. `@tezos-x/octez.js-michel-codec` packs Michelson values.

## Point the toolkit at the Michelson interface

octez.js talks to the Michelson RPC, not the EVM JSON-RPC.

```js
import { TezosToolkit } from '@tezos-x/octez.js';

const Tezos = new TezosToolkit('https://michelson.previewnet.tezosx.nomadic-labs.com');
```

Network table: `tezos-x-network-info.md`. Differences from L1, from the support page and the compatibility page: no baking, attestation, delegation, staking, or smart-rollup operations; fees are burnt; `tz4`, tickets, Sapling, timelocks, and global constants are not implemented yet.

## Migration from Taquito

Same classes and methods. Rename imports. Do `@taquito/taquito` → `@tezos-x/octez.js` before the prefix replace, or you will produce `@tezos-x/octez.js-taquito`.

| Taquito | octez.js |
|---|---|
| `@taquito/taquito` | `@tezos-x/octez.js` |
| `@taquito/signer` | `@tezos-x/octez.js-signer` |
| `@taquito/rpc` | `@tezos-x/octez.js-rpc` |
| `@taquito/utils` | `@tezos-x/octez.js-utils` |
| `@taquito/michelson-encoder` | `@tezos-x/octez.js-michelson-encoder` |
| `@taquito/michel-codec` | `@tezos-x/octez.js-michel-codec` |
| `@taquito/local-forging` | `@tezos-x/octez.js-local-forging` |
| `@taquito/remote-signer` | `@tezos-x/octez.js-remote-signer` |
| `@taquito/ledger-signer` | `@tezos-x/octez.js-ledger-signer` |
| `@taquito/beacon-wallet` | `@tezos-x/octez.js-dapp-wallet` |
| `@taquito/tzip12` | `@tezos-x/octez.js-tzip12` |
| `@taquito/tzip16` | `@tezos-x/octez.js-tzip16` |
| `@taquito/sapling` | `@tezos-x/octez.js-sapling` |
| `@taquito/timelock` | `@tezos-x/octez.js-timelock` |
| `@taquito/contracts-library` | `@tezos-x/octez.js-contracts-library` |
| `@taquito/http-utils` | `@tezos-x/octez.js-http-utils` |
| `@taquito/core` | `@tezos-x/octez.js-core` |

`BeaconWallet` still imports from `@tezos-x/octez.js-dapp-wallet`. Taquito remains a valid L1 client; it does not ship the Tezos X helpers.

## Michelson → EVM

`buildMichelsonToEvmCall` turns `{ to, value, data }` into a gateway call. `toTransferParams` feeds `Tezos.contract.transfer` or `Tezos.wallet.transfer`.

```js
import { TezosToolkit } from '@tezos-x/octez.js';
import { buildMichelsonToEvmCall, toTransferParams } from '@tezos-x/octez.js-utils';

const Tezos = new TezosToolkit('https://michelson.previewnet.tezosx.nomadic-labs.com');

const call = buildMichelsonToEvmCall({
  to: '0xdeAD000000000000000042000000000000000000',
  value: 10n ** 18n, // 1 tez, in wei
});
const op = await Tezos.contract.transfer(toTransferParams(call));
await op.confirmation();
```

- No calldata: native transfer through `%call`.
- Calldata: `%call_evm`. Pass `methodSignature` (canonical, must match the selector) or a known-signature table.
- `to` must be a valid EVM address. Mixed case needs a valid EIP-55 checksum.
- `value` is a bigint, a safe integer, or a decimal / `0x` hex string, and must be a whole number of mutez.
- Default gateway is `NAC_GATEWAY`. Override with `gatewayAddress`.

## EVM → Michelson

`buildEvmToMichelsonCall` returns an unsigned EVM transaction `{ to, data, value, gasLimit }`. Sign it with viem or ethers. `to` is the precompile.

```js
import { buildEvmToMichelsonCall } from '@tezos-x/octez.js-utils';

const transfer = buildEvmToMichelsonCall({
  kind: 'transfer',
  destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  amount: 1000n, // mutez
});

const call = buildEvmToMichelsonCall({
  kind: 'call-michelson',
  destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
  entrypoint: 'set', // no % prefix
  parameter: { value: { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }] } },
});
```

`parameter` is binary Micheline (hex, without the `05` pack prefix) or a Micheline expression with an optional `type`, packed with `@tezos-x/octez.js-michel-codec`. A `transfer` may target `tz…` or `KT1…`. A `call-michelson` targets a `KT1` contract. Amounts are mutez. `gasLimit` is the recommended default (3M transfer, 5M call). Override it with an estimate for real contracts.

## tx codec

The docs fetched on November 22, 2026 do not name a package `tx-codec`. Encoding is `packData` / `@tezos-x/octez.js-michel-codec`, as above, or the constant `0x030b` for Michelson `Unit` (counter tutorial). Use the michel-codec package. Do not invent a `tx-codec` import.

## Sources and last verified

Verified November 22, 2026.

- https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
- https://octez-js.tezos.com/docs/25.0.0/tezosx_cross_runtime/
- https://octez-js.tezos.com/typedoc/functions/_tezos-x_octez.js-utils.buildEvmToMichelsonCall.html
- https://octez-js.tezos.com/typedoc/functions/_tezos-x_octez.js-utils.buildMichelsonToEvmCall.html
- https://docs.etherlink.com/tutorials/nac-counter
- https://github.com/trilitech/tezos-x-previewnet
- https://github.com/trilitech/tezos-x-previewnet/blob/main/README.md
