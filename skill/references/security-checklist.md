# Security Checklist

## Before Writing Any Code
- [ ] Chosen the right chain for the use case (see `architecture-comparison.md`)
- [ ] Never commit private keys — use `.env` + `.gitignore`
- [ ] Understand the threat model (who can call which entry points?)

## Smart Contract Security (Etherlink / Solidity)
- [ ] Use latest stable Solidity version (`^0.8.24`)
- [ ] Enable optimizer in Hardhat config
- [ ] Protect against reentrancy (use `ReentrancyGuard` or checks-effects-interactions pattern)
- [ ] Use `SafeMath` patterns (built-in in Solidity 0.8+)
- [ ] Validate all external inputs
- [ ] Use `Ownable` or access control patterns for admin functions
- [ ] Emit events for all state changes
- [ ] Set correct visibility on all functions (`external` preferred over `public`)
- [ ] Test for integer overflow/underflow
- [ ] Review token approval patterns (avoid unlimited approvals in user-facing flows)

## Smart Contract Security (Tezos L1 / SmartPy / LIGO)
- [ ] Validate ticket handling carefully — tickets are linear types
- [ ] Use `sp.verify` / `failwith` for all preconditions
- [ ] Understand storage costs (every new key costs burn)
- [ ] Protect admin-only entry points with `sp.verify(sp.sender == self.data.admin)`
- [ ] Audit FA2 `update_operators` logic carefully
- [ ] Use formal verification tooling where available

## Deployment & Operations
- [ ] All tests pass locally
- [ ] Deployed and tested fully on Shadownet before mainnet
- [ ] Contract verified on block explorer
- [ ] No sensitive data in contract storage or events
- [ ] Admin keys secured (multisig recommended for production)
- [ ] Upgrade/migration path planned if contract is upgradeable

## Bridge & Cross-Chain
- [ ] Verify bridge contract addresses against official Etherlink documentation
- [ ] Test full deposit + withdrawal cycle on Shadownet
- [ ] Understand standard vs fast withdrawal trade-offs
- [ ] FA2 operator approvals scoped to minimum necessary

## Recommended Audit Approach
1. Internal review using this checklist
2. Peer review / code review
3. Professional audit for high-value contracts
4. Bug bounty program post-launch
