# Etherlink network information (November 2026)

## EVM interface

### Mainnet
- RPC: `https://node.mainnet.etherlink.com`
- Chain ID: 42793
- Native token: XTZ (18 decimals)
- Explorer: https://explorer.etherlink.com
- Governance: https://governance.etherlink.com

Chain id 42793 and this RPC are the values the April 2026 skill and current Etherlink getting-started guidance still point at. On November 22, 2026 the URL `https://docs.etherlink.com/network-information` returned 404. Confirm the docs "Network information" page before a mainnet deploy.

### Shadownet
- RPC: `https://node.shadownet.etherlink.com`
- Chain ID: 127823
- Explorer: https://shadownet.explorer.etherlink.com
- Faucet: https://shadownet.faucet.etherlink.com

These four Shadownet values are carried from the April 2026 skill. They were not re-read from a live network table on November 22, 2026.

### MetaMask, mainnet
- Network name: Etherlink Mainnet
- RPC: https://node.mainnet.etherlink.com
- Chain ID: 42793
- Symbol: XTZ
- Explorer: https://explorer.etherlink.com

## Michelson interface (same rollup)

octez.js documents these Michelson RPCs. They are not the EVM JSON-RPC.

| Network | RPC | Chain ID |
|---|---|---|
| Mainnet | `https://michelson.etherlink.mainnet.octez.io` | `NetXohUVN5QWR4f` |
| Shadownet | `https://michelson.etherlink.shadownet.octez.io` | `NetXtLrzvQDobza` |

Previewnet (separate from Shadownet) is in `../../tezos-x/references/tezos-x-network-info.md`. Do not add chain 42793 when the user asked for Previewnet. Previewnet EVM chain id is 128064.

## Sources and last verified

Verified November 22, 2026, with the Shadownet EVM caveat above.

- https://docs.etherlink.com/evm/getting-started
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
- https://github.com/trilitech/tezos-x-previewnet
