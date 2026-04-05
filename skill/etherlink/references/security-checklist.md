# Security Checklist — Etherlink (Solidity / EVM)

## Before Writing Any Code
- [ ] Understand the threat model (who can call which functions?)
- [ ] Never commit private keys — use `.env` + `.gitignore`
- [ ] Confirm you need Etherlink vs Tezos L1 (see `../shared/architecture-comparison.md`)

## Smart Contract Security

### Solidity Basics
- [ ] Use latest stable Solidity: `pragma solidity ^0.8.24;`
- [ ] Enable optimizer in Hardhat config (`runs: 200`)
- [ ] Set correct visibility on all functions (`external` preferred over `public`)
- [ ] Emit events for all meaningful state changes

### Reentrancy
- [ ] Use `ReentrancyGuard` from OpenZeppelin on any function that sends ETH/XTZ
- [ ] Follow checks-effects-interactions: update state BEFORE external calls
- [ ] Never call unknown external contracts mid-function without guards

### Access Control
- [ ] Use `Ownable` or `AccessControl` (OpenZeppelin) for admin functions
- [ ] Use `onlyOwner` / `onlyRole` modifiers, not inline `require(msg.sender == owner)`
- [ ] Consider `Ownable2Step` for safer ownership transfers

### Integer & Input Validation
- [ ] Solidity 0.8+ reverts on overflow/underflow — but still validate inputs
- [ ] Use `SafeERC20` for ERC-20 transfers (handles non-standard tokens)
- [ ] Validate array lengths and indices before accessing

### Token Approvals
- [ ] Avoid unlimited approvals in user-facing flows — use exact amounts
- [ ] Use `permit` (EIP-2612) where possible to save an approval tx

### Etherlink-Specific
- [ ] Gas token is XTZ — `msg.value` is in wei (1 XTZ = 1e18 wei)
- [ ] Block times vary (500ms–6s) — avoid `block.timestamp` for precision logic
- [ ] No EIP-4844 blobs — standard calldata costs apply

## Testing
- [ ] 100% of public/external functions have unit tests
- [ ] Hardhat tests cover: happy path, revert conditions, edge cases
- [ ] Run `npx hardhat coverage` and aim for >90%
- [ ] Test on Shadownet with real MetaMask interactions

## Deployment
- [ ] Run `npx hardhat run scripts/deploy.js --network shadownet` first
- [ ] Verify source on Etherlink Explorer after mainnet deploy
- [ ] Record deployed addresses in a `deployments/` folder
