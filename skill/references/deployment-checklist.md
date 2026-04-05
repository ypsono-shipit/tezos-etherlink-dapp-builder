# Deployment Checklist

## Phase 1: Local Development
- [ ] Contracts compile without warnings
- [ ] Unit tests written and passing (100% of entry points covered)
- [ ] Edge cases tested (zero values, max values, unauthorized callers)
- [ ] Local node or fork tested if applicable

## Phase 2: Shadownet Testnet
- [ ] Deployed to Shadownet (Etherlink) or Tezos Ghostnet/Shadownet
- [ ] Contract address recorded and verified on block explorer
- [ ] All entry points called and verified on-chain
- [ ] Frontend connected to testnet and flows tested end-to-end
- [ ] Wallet connection tested (MetaMask for Etherlink, Beacon for Tezos L1)
- [ ] Error states tested (insufficient funds, wrong network, rejected tx)

## Phase 3: Bridging Tests (if applicable)
- [ ] XTZ deposit (L1 → Etherlink) tested on Shadownet
- [ ] Withdrawal (Etherlink → L1) tested — both fast and standard
- [ ] FA2 token bridging tested with operator approvals

## Phase 4: Security Review
- [ ] Security checklist completed (`security-checklist.md`)
- [ ] Code reviewed by at least one other developer
- [ ] No hardcoded secrets or private keys in codebase
- [ ] `.env.example` provided, `.env` in `.gitignore`

## Phase 5: Mainnet Deployment
- [ ] Environment variables updated to mainnet RPCs and Chain IDs
- [ ] Deployer wallet funded with enough XTZ for gas + storage
- [ ] Deploy script run on mainnet
- [ ] Contract address verified on mainnet explorer
- [ ] Frontend config updated to mainnet endpoints
- [ ] Smoke test on mainnet with small amounts

## Phase 6: Post-Deployment
- [ ] Contract address(es) documented in README
- [ ] Monitor contract events / activity for first 24–48 hours
- [ ] Incident response plan in place
- [ ] Community / users notified of launch

## Network Reference (Quick)
| Network        | RPC                                    | Chain ID |
|----------------|----------------------------------------|----------|
| Etherlink Main | https://node.mainnet.etherlink.com     | 42793    |
| Shadownet      | https://node.shadownet.etherlink.com   | 127823   |
| Tezos Mainnet  | https://rpc.tzbeta.net                 | —        |
| Tezos Ghostnet | https://rpc.ghostnet.teztnets.com      | —        |
