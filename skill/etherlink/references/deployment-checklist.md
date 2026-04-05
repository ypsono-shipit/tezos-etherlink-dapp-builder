# Deployment Checklist — Etherlink (EVM)

## Phase 1: Local Development
- [ ] `npx hardhat compile` — zero errors, zero warnings
- [ ] `npx hardhat test` — all tests pass
- [ ] `npx hardhat coverage` — >90% line coverage
- [ ] Linter clean (`npx solhint 'contracts/**/*.sol'`)

## Phase 2: Shadownet Testnet
```bash
cp .env.example .env          # fill PRIVATE_KEY
npx hardhat run scripts/deploy.js --network shadownet
```
- [ ] Contract deployed, address recorded
- [ ] Verify on https://shadownet.explorer.etherlink.com
- [ ] All functions called via frontend on Shadownet
- [ ] MetaMask chain switching tested (chainId 127823)
- [ ] Error states tested (reverts, wrong network, insufficient XTZ)

## Phase 3: Security Review
- [ ] `security-checklist.md` completed
- [ ] Peer code review done
- [ ] No hardcoded secrets; `.env` in `.gitignore`
- [ ] `.env.example` committed with placeholder values

## Phase 4: Mainnet Deployment
```bash
# Update .env: point to mainnet values
npx hardhat run scripts/deploy.js --network etherlinkMainnet
```
- [ ] Deployer wallet has enough XTZ (gas + any initial contract funding)
- [ ] Contract verified on https://explorer.etherlink.com
  ```bash
  npx hardhat verify --network etherlinkMainnet <address> <constructorArgs>
  ```
- [ ] Frontend env vars updated (`VITE_CONTRACT_ADDRESS`, `VITE_NETWORK=mainnet`)
- [ ] README updated with deployed address

## Network Reference
| Network | RPC | Chain ID | Explorer |
|---|---|---|---|
| Etherlink Mainnet | https://node.mainnet.etherlink.com | 42793 | https://explorer.etherlink.com |
| Shadownet | https://node.shadownet.etherlink.com | 127823 | https://shadownet.explorer.etherlink.com |
| Faucet | https://shadownet.faucet.etherlink.com | — | — |
