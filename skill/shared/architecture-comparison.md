# Tezos L1, Etherlink EVM, and Tezos X

Checked against docs.etherlink.com (architecture and "What is Etherlink?", November 20, 2026), docs.tezos.com testnets, the Michelson compatibility page (November 20, 2026), and octez.js Tezos X support. L1 block time was not re-measured; the old "~15 seconds" figure is left as a hint and should be confirmed on docs.tezos.com.

## At a glance

| Aspect | Tezos L1 | Etherlink EVM interface | Tezos X (both interfaces) |
|---|---|---|---|
| Language | SmartPy / LIGO / Michelson | Solidity | Both, in one transaction via NAC |
| Block time | See docs.tezos.com (this file used to say ~15 s) | About 500 ms, preconfirmation about 50 ms | Same kernel as Etherlink, about 500 ms |
| Settlement | L1 consensus | About 6 seconds on L1 (docs table) | Same as Etherlink |
| Tooling | Taqueria, octez.js or Taquito, octez-client | Hardhat, Foundry, Remix, viem | Those plus `@tezos-x/octez.js-utils` |
| Native asset | XTZ, FA1.2, FA2 | XTZ (18 decimals) and ERC20/721/1155 | Same ledger. No wrapped copy for a NAC call |
| Tickets | Yes | Not on the Michelson interface yet | Not yet. Do not design around tickets |
| Governance | Onchain protocol governance | Governed on L1. `VOTING_POWER` is 0 | Same as Etherlink |
| Wallets | Beacon (Temple, Kukai, Umami) | MetaMask, WalletConnect, Rabby | Usually one of each, separate balances |
| When | L1 assets, tickets, L1 votes | Solidity only | The call itself must be atomic across interfaces |

Moving XTZ or FA tokens between L1 and Etherlink is a bridge (two ledgers, not atomic). NAC is intra-Etherlink only. The architecture page's comparison table: a bridge is 2 or more transactions and is not all or nothing; NAC is 1 transaction, same block, native tokens, no extra trust because it is the same kernel.

## When to choose Etherlink EVM only
- The team knows Solidity and does not need Michelson in the same transaction
- ERC20 / ERC721 / ERC1155
- MetaMask without a Tezos wallet

## When to choose Tezos L1
- Native L1 XTZ, FA tokens, or tickets
- Protocol governance or a contract that must be originated on L1
- Users are already on Beacon wallets and the app never touches EVM

## When to choose Tezos X
- One user action must update EVM state and Michelson state together
- You want a Solidity door on a Michelson core, or the reverse
- You are on Previewnet for the hackathon, or on Etherlink mainnet after Ganesha

## Hybrid that is still a bridge

```
User (MetaMask) → Etherlink EVM contracts
                      ↕ official L1 bridge (not NAC)
User (Beacon)   → Tezos L1 contracts
```

Use this when the asset has to leave the rollup. Use NAC when both contracts are already on the rollup.

## Sources and last verified

Verified November 22, 2026. L1 block time was not rechecked.

- https://docs.etherlink.com/
- https://docs.etherlink.com/overview/architecture
- https://docs.etherlink.com/michelson/developing/compatibility
- https://docs.tezos.com/developing/testnets
- https://octez-js.tezos.com/docs/25.0.0/tezosx_support/
