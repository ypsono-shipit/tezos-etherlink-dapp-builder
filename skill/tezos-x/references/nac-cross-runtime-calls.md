# Native atomic composability

Summary of docs.etherlink.com "Native Atomic Composability" (updated November 20, 2026), the octez.js cross-runtime page, the Previewnet kernel changelog, and the NAC counter tutorial. Where those sources disagree, the note says so.

## What a call is

Each interface has one gateway. A cross-interface call is a normal call to that local address. No compiler plugin is required.

1. The caller sends the target address and payload to its gateway.
2. The gateway forwards it to the other runtime.
3. On the first interaction, the target runtime creates an alias for the caller.
4. The target runs an internal transaction whose sender is that alias.
5. The result comes back to the caller.

Re-entrancy is supported. A callback is seen as coming from the other runtime's alias, not from the original caller.

Each runtime keeps its own gas model. The caller converts remaining gas with a benchmarked coefficient, and unused gas converts back. The concept page points at a Resources page for the coefficient. That conversion table was not copied here.

Each cross-interface call emits a gateway event with an id indexers can use to join the two blocks. Schemas are on the per-interface usage pages.

## Addresses

| Direction | Entry | Confirmed source |
|---|---|---|
| EVM → Michelson | Precompile `0xff00000000000000000000000000000000000007` | Counter tutorial, octez.js `NAC_PRECOMPILE_ADDRESS`, Ganesha announcement |
| Michelson → EVM | `KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw` | octez.js `NAC_GATEWAY` (same address on previewnet and mainnet, per that constant's comment) |

EVM methods named by octez.js: `call` and `callMichelson`. The counter tutorial uses `callMichelson(string destination, string entrypoint, bytes data)`.

Michelson entrypoints named by octez.js: `%call` (native XTZ transfer, no calldata) and `%call_evm` (contract call with calldata). A calldata call needs `methodSignature` in canonical form, for example `transfer(address,uint256)`, matching the selector, unless the selector is in the known-signature list.

`%materialize_alias` creates the other runtime's alias without waiting for a NAC. The Previewnet dashboard (v0.11, November 9, 2026) and Tezos GitLab MR 22932 describe it. The MR says the Michelson parameter is `pair string (pair string (option string))`: native runtime, native address, optional public key. It refuses tez, an unknown runtime, and an address that is already an alias of this runtime. Calling it again for an existing alias does nothing. The concept page on docs.etherlink.com does not mention this entrypoint. The EVM side has a matching `materializeAlias` method (MR 22919, cited by 22932).

Read-only identity views, from the Previewnet dashboard changelog (June 3, 2026, v0.6), on precompile `0xff…07`: `originOf(addr, sourceRuntime)` returns Native, Alias, or Unknown, and `resolveAddress(addr, sourceRuntime, targetRuntime)` returns the counterpart and whether it is already materialized. Both are described there as non-payable, log-free, and `STATICCALL` safe. The exact ABI was not re-read from the EVM NAC usage page in this pass. Use that docs page before encoding the call by hand.

## Atomic revert

From the concept page:

- On EVM, a low-level `call` can catch the failure and continue, or the caller can revert with it.
- On Michelson there is no try/catch. A failed internal operation reverts the operation group, including nested calls back into EVM.
- If the Michelson runtime reverts for any reason, nested cross-interface calls it started are rolled back too.

Out of gas, Previewnet v0.11 (dashboard, November 9, 2026): a cross-runtime call whose Michelson target runs out of gas now returns EVM status **429** with body `OOG`, instead of status 400 with the interpreter message. The revert is still catchable. Update any decoder that switches on 400. This is a kernel changelog, not a line on the concept page. An out-of-gas inside a cross-runtime call no longer aborts the whole block (same note).

## Value and gas

From octez.js `constants.ts`:

- `WEI_PER_MUTEZ = 10^12`. 1 mutez (10^-6 XTZ) is 10^12 wei, because EVM XTZ has 18 decimals.
- `NAC_RECOMMENDED_GAS`: 3,000,000 for `call` (a transfer), 5,000,000 for `callMichelson`. These are defaults with headroom over simple Previewnet calls (about 2.6M and 2.4M in the comment). A heavier callee needs more. Replace the default with `eth_estimateGas` when you can.
- The counter tutorial's sample forwarder instead passes a fixed `GATEWAY_GAS` of 3,000,000 into a low-level `call`. That is the tutorial's number, not the octez.js default for `callMichelson`. Prefer an estimate, and if you follow the tutorial exactly, keep its 3,000,000 so the sample matches the doc.

`buildMichelsonToEvmCall` throws `SubMutezPrecisionError` when `value` is not a whole number of mutez.

A Michelson entrypoint that takes `unit` is encoded as `0x030b` (tag `0x03`, `Unit` opcode `0x0b`). Confirmed in the counter tutorial. Anything else needs `packData` from `@tezos-x/octez.js-michel-codec` or an on-chain encoder. See `octez-js-tezos-x.md`.

## Aliases (v0.11)

Previewnet v0.11 changed how the EVM alias of a `tz1`, `tz2`, or `tz3` is derived. The dashboard says the new alias matches a rescue smart wallet that can be deployed on other EVM chains, so funds sent to that address on another chain can be recovered with the Tezos key. GitLab MR 23037 (RFC-26051) says the alias is the `CREATE2` address, through the Safe singleton factory, of a rescue account bound to the key hash. Other addresses keep the legacy Keccak-256 alias. The kernel writes `0xfe` at a guard so the rescue account cannot be deployed on Tezos X itself.

Do not reuse an alias stored before that upgrade. Recompute it. The docs page is https://docs.etherlink.com/overview/accounts-and-aliases (linked from the dashboard). This pass did not re-quote that page; the changelog and the MR are the sources for the sentences above.

Aliases cannot hold tez. They forward it to the EVM account. See the compatibility page.

## Removed wrappers

Previewnet v0.10 (dashboard, August 18, 2026) removed the experimental FA1.2 wrapper precompile (`0xff…ff09`) and stopped recognizing the ERC20 wrapper `KT18oDJJKXMKhfE1bSuAPGp92pYcwVKvCChb`. Call the token through `callMichelson` or `%call_evm` instead. That wrapper address is not the NAC gateway.

## Sources and last verified

Verified November 22, 2026.

- https://docs.etherlink.com/overview/native-atomic-composability
- https://docs.etherlink.com/tutorials/nac-counter
- https://docs.etherlink.com/michelson/developing/compatibility
- https://docs.etherlink.com/overview/accounts-and-aliases
- https://octez-js.tezos.com/docs/25.0.0/tezosx_cross_runtime/
- https://github.com/trilitech/octez.js/blob/4e978e9b925d74583c04a8230567c8ba514af715/packages/octez.js-utils/src/tezosx/constants.ts
- https://previewnet.tezosx.nomadic-labs.com/
- https://gitlab.com/tezos/tezos/-/merge_requests/22932
- https://gitlab.com/tezos/tezos/-/merge_requests/23037
