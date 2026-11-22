# Tezos X network info

Previewnet identifiers below were checked against the official repository on November 22, 2026. That repository contains only `README.md`. There is no `docs/` directory. Every chain id, RPC, faucet, bridge, explorer, rollup address, L1 bridge contract, and wallet field in this Previewnet section matches that README. Nothing in those fields was changed.

The README prints the EVM chain id as decimal `128064`. `0x1f440` is that same integer in hex, used by `wallet_addEthereumChain`. It is not a different chain id.

The README does not publish the NAC precompile, the Michelson gateway address, or kernel v0.11. Those stay in `nac-cross-runtime-calls.md`, sourced from Etherlink docs, octez.js, and the Previewnet dashboard, not from this repo.

Michelson interface endpoints for Etherlink mainnet and Shadownet come from the octez.js Tezos X support page. They are not in the previewnet README.

## Previewnet

| | EVM interface | Michelson interface |
|---|---|---|
| Chain ID | `128064` (`0x1f440`, CAIP-2 `eip155:128064`) | `NetXY2oPPzkxUW1` (`tezos:NetXY2oPPzkxUW1`) |
| RPC | `https://evm.previewnet.tezosx.nomadic-labs.com` | `https://michelson.previewnet.tezosx.nomadic-labs.com` |
| Explorer | `https://blockscout.previewnet.tezosx.nomadic-labs.com` | `https://tzkt.previewnet.tezosx.nomadic-labs.com` |
| Currency | XTZ, 18 decimals | XTZ, 6 decimals (mutez) |

Other Previewnet endpoints from the same README:

- Faucet: `https://faucet.previewnet.tezosx.nomadic-labs.com`
- Bridge (L1 ↔ Previewnet, this is a bridge, not NAC): `https://bridge.previewnet.tezosx.nomadic-labs.com/`
- Dashboard: `https://previewnet.tezosx.nomadic-labs.com/`
- Rollup: `sr1BvTT7tVNneG2TeP18sixq57TxsZELebLu`
- L1 bridge contracts published in that README (Shadownet TzKT links): bridge `KT1DUaf49SNALJRSB8R45TvEtgVi2xZnCh8B`, delayed bridge `KT1NVGmkSgJx4nkRSeVpQs8QvYRBZ58kewdS`, ticketer `KT1FcWeWiEC7Ve5JMdZpKyvaFdsJv7n4GFzi`

MetaMask (EVM), from the repo:

| Field | Value |
|---|---|
| Network name | Tezos X Previewnet |
| RPC URL | `https://evm.previewnet.tezosx.nomadic-labs.com` |
| Chain ID | `128064` |
| Currency symbol | XTZ |
| Block explorer | `https://blockscout.previewnet.tezosx.nomadic-labs.com` |

`wallet_addEthereumChain` uses chain id `0x1f440`.

Michelson wallets (Temple, Kukai, Umami) or the client:

```bash
octez-client --endpoint https://michelson.previewnet.tezosx.nomadic-labs.com config update
```

Quick checks from the repo:

```bash
curl -s -X POST https://evm.previewnet.tezosx.nomadic-labs.com \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

curl -s https://michelson.previewnet.tezosx.nomadic-labs.com/chains/main/chain_id
```

Previewnet was reset on July 20, 2026 (dashboard, v0.7). A reset drops accounts, balances, and contracts. Re-read the dashboard changelog before reusing an address.

The repo also publishes a Reown / WalletConnect project id (`d9e485a41c494fde4e23c8cdc06db59c`). It is a public client id from that README, not a server secret.

## Michelson interface on Etherlink mainnet and Shadownet

From octez.js "Support for Tezos X" (docs version 25.0.0). The page says these endpoints may change and points at Etherlink network information for the current values.

| Network | Michelson RPC | Chain ID |
|---|---|---|
| Mainnet | `https://michelson.etherlink.mainnet.octez.io` | `NetXohUVN5QWR4f` |
| Shadownet | `https://michelson.etherlink.shadownet.octez.io` | `NetXtLrzvQDobza` |
| Previewnet | `https://michelson.previewnet.tezosx.nomadic-labs.com` | `NetXY2oPPzkxUW1` |

A self-hosted EVM node exposes the Michelson RPC at `<node>/tezlink` (same octez.js page).

## EVM interface on Etherlink mainnet and Shadownet

| Network | RPC | Chain ID | Explorer |
|---|---|---|---|
| Mainnet | `https://node.mainnet.etherlink.com` | 42793 | `https://explorer.etherlink.com` |
| Shadownet | `https://node.shadownet.etherlink.com` | 127823 | `https://shadownet.explorer.etherlink.com` |

Mainnet chain id 42793 and `https://node.mainnet.etherlink.com` match the values still cited from Etherlink docs and the April 2026 skill. Shadownet chain id 127823, its RPC, explorer `https://shadownet.explorer.etherlink.com`, and faucet `https://shadownet.faucet.etherlink.com` are carried from that skill. On November 22, 2026, `https://docs.etherlink.com/network-information` returned 404, and the getting-started page only links to a "Network information" page without inlining the table. Re-check the live docs page before a mainnet or Shadownet deploy. Previewnet values above were read from the repo the same day and do not depend on that page.

## What is already on mainnet

The Michelson overview on docs.etherlink.com (updated November 19, 2026) describes the Michelson interface and NAC as part of Etherlink. It does not print an activation date. Tezos Spotlight's August 2026 review says Ganesha (Etherlink 7.0) activated on August 21, 2026, and The Baking Sheet issue 321 says activation was at block 51,484,839. Treat the date as reported by those writeups, not as a line in the docs page.

## Sources and last verified

Previewnet section re-read from the official repo on November 22, 2026. The repository root is only `README.md`.

- https://github.com/trilitech/tezos-x-previewnet
- https://github.com/trilitech/tezos-x-previewnet/blob/main/README.md
- https://previewnet.tezosx.nomadic-labs.com/
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
- https://docs.etherlink.com/michelson/
- https://docs.etherlink.com/evm/getting-started
- https://spotlight.tezos.com/month-at-a-glance-august-2026/
- https://bakingsheet.tezoscommons.org/p/the-baking-sheet-issue-321
