# Security Checklist — Tezos L1 (SmartPy / LIGO)

## Before Writing Any Code
- [ ] Understand the threat model (who can call which entry points?)
- [ ] Never commit private keys — use `.env` + `.gitignore`
- [ ] Decide on admin key management (multisig vs single key)

## Smart Contract Security

### Access Control
- [ ] Protect admin-only entry points: `sp.verify(sp.sender == self.data.admin, "NOT_ADMIN")`
- [ ] Consider a multisig admin pattern for production
- [ ] Use `sp.sender` (not `sp.source`) for caller checks inside contracts

### Storage
- [ ] Understand storage burn costs — every new bigmap key costs mutez
- [ ] Use `sp.if self.data.map.contains(key):` before accessing optional entries
- [ ] Avoid unbounded loops over maps/lists (no gas limit but can time out)

### FA2 / FA1.2 Tokens
- [ ] Audit `update_operators` logic — anyone calling with wrong params should fail
- [ ] Enforce balance checks before transfers
- [ ] Test `transfer` with zero-amount edge cases
- [ ] FA2: ensure `from_` parameter matches `sp.sender` or has operator approval

### Tickets (Linear Assets)
- [ ] Tickets are linear — they must be consumed exactly once
- [ ] Never duplicate tickets; use `sp.split_ticket` / `sp.join_tickets` correctly
- [ ] Validate ticket types and amounts before accepting

### Entry Point Validation
- [ ] Use `sp.verify` / `failwith` for all preconditions (not silent failures)
- [ ] Validate all nat/int parameters for underflow: `sp.as_nat(a - b)` will fail if b > a
- [ ] Explicitly check mutez amounts: `sp.verify(sp.amount == sp.mutez(0))` if no tez expected

## Testing
- [ ] Write `@sp.add_test` scenario for every entry point
- [ ] Test unauthorized caller paths (they should fail)
- [ ] Test with zero, minimum, and maximum values
- [ ] Simulate multiple users in a scenario

## Deployment
- [ ] Use Ghostnet for full end-to-end testing before mainnet
- [ ] Verify contract on TzKT explorer after deployment
- [ ] Record contract address and storage initial state
