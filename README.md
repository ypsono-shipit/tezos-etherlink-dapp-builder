# Tezos + Etherlink dApp Builder Skill for Claude

Official Claude Skill for building full-stack dApps on **Tezos L1** (SmartPy / LIGO / Michelson) and **Etherlink** (EVM-compatible L2 powered by Tezos Smart Rollups) — April 2026 best practices.

## One-Command Install
```bash
npx skills add https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder
```

## What this skill does

- **Intelligent decision tree**: Etherlink (for Solidity speed & EVM familiarity) vs Tezos L1 (for native XTZ, FA2 tokens, tickets)
- **Complete workflows**: smart contracts, testing, deployment, frontend integration (Taquito + ethers/viem)
- **Bridging XTZ & FA tokens** between L1 and Etherlink
- Security checklists, network configs, Hardhat templates, and architecture guidance

## Usage examples

- "Build a simple NFT minting dApp on Etherlink with a React frontend"
- "Create a staking contract on Tezos L1 using SmartPy and integrate with Taquito"
- "Implement cross-chain bridging from Tezos L1 to Etherlink"

## Structure

```
skill/SKILL.md          → Main instructions and triggers
skill/references/       → Detailed docs, templates, and checklists (loaded progressively)
```

MIT License. Feel free to fork and improve!
