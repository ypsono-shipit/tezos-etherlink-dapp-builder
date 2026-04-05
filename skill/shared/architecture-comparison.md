# Tezos L1 vs Etherlink: Architecture Comparison

## At a Glance

| Aspect            | Tezos L1                          | Etherlink (EVM L2)                    | Recommendation                        |
|-------------------|-----------------------------------|---------------------------------------|---------------------------------------|
| Language          | SmartPy / LIGO / Michelson        | Solidity (any EVM version)            | Etherlink for EVM devs                |
| Block Time        | ~15 seconds                       | 500ms – 6s (variable)                 | Etherlink for latency-sensitive apps  |
| Finality          | ~2 minutes (BFT)                  | Inherits Tezos L1 (~2 min)            | Similar security model                |
| Tooling           | Taqueria, Taquito, octez-client   | Hardhat, Foundry, Remix, viem         | Etherlink for Ethereum ecosystem      |
| Native Assets     | XTZ, FA1.2, FA2 tokens            | WXTZ (wrapped), ERC-20/721/1155       | L1 for native tokens, bridge as needed|
| Gas / Fees        | Low, predictable (storage burn)   | Low (XTZ as gas, EVM pricing)         | Both are affordable                   |
| EVM Compatible    | No                                | Yes (full EVM)                        | Etherlink for Solidity contracts      |
| Tickets           | Yes (native L1 feature)           | No (bridge uses tickets internally)   | L1 for ticket-based logic             |
| Governance        | On-chain (LB, protocol votes)     | Governed by Tezos L1 validators       | L1 for governance logic               |
| Wallet Support    | Beacon (Temple, Kukai, etc.)      | MetaMask, WalletConnect, Rabby        | Depends on user base                  |
| Indexers          | TzKT, TzPro                       | Etherlink Explorer API                | Good coverage on both                 |
| Smart Rollups     | N/A (L1)                          | Built on Tezos Smart Rollups          | L2 security guaranteed by L1          |

## When to Choose Etherlink
- You or your team knows Solidity
- You need ERC-20 / ERC-721 / ERC-1155 compatibility
- You want to re-use existing Ethereum contracts with minimal changes
- You need high throughput (DeFi, gaming, high-frequency interactions)
- You want MetaMask / WalletConnect out of the box

## When to Choose Tezos L1
- You need native XTZ transfers within contracts
- You're building with FA1.2 or FA2 token standards
- You want on-chain governance or DAO mechanics
- You need Michelson tickets (advanced asset ownership)
- Your users already use Beacon-compatible wallets

## Hybrid Architecture (Recommended for Most Production Apps)

```
User (MetaMask) ←→ Etherlink Frontend
                         ↕ (viem / ethers)
                   Etherlink Contracts
                         ↕ (Official Bridge)
                    Tezos L1 Contracts
                         ↕ (Taquito)
User (Beacon Wallet) ←→ Tezos L1 Frontend
```

### Example Hybrid: NFT Marketplace
- **Minting & trading** → Etherlink (ERC-721, familiar UX, MetaMask)
- **Governance & royalties** → Tezos L1 (FA2, on-chain votes)
- **Bridging** → Official bridge for moving assets between layers

### Example Hybrid: DeFi Protocol
- **AMM / liquidity pools** → Etherlink (Solidity, composable with EVM DeFi)
- **Staking rewards in XTZ** → Tezos L1 (native XTZ, lower overhead)
- **Bridge flow** → Users deposit XTZ to Etherlink, earn yield, withdraw

## Data Availability & Security
Both chains share the same underlying security: Etherlink is a **Tezos Smart Rollup**, meaning its state is verified and settled on Tezos L1. This gives Etherlink EVM apps L1-level security guarantees without L1 throughput limits.
