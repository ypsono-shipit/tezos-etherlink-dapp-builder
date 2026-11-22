# Deployment checklist, Tezos L1

## Phase 1: Local Development
- [ ] Contracts compile in SmartPy IDE or via `taq compile`
- [ ] All `@sp.add_test` scenarios pass
- [ ] Edge cases covered (zero amounts, unauthorized callers, max storage)

## Phase 2: Shadownet
Ghostnet has been removed. Use Shadownet (https://docs.tezos.com/developing/testnets).

```bash
taq deploy MyContract --env shadownet

octez-client -E https://rpc.shadownet.teztnets.com \
  originate contract MyContract transferring 0 from myWallet \
  running MyContract.tz --init '...' --burn-cap 0.5
```
- [ ] Contract deployed and address recorded
- [ ] Verify on the Shadownet explorer linked from https://teztnets.com/
- [ ] All entry points called via frontend on Shadownet
- [ ] Beacon wallet connection tested (Temple / Kukai)
- [ ] Error states tested (wrong caller, insufficient balance)

## Phase 3: Security Review
- [ ] `security-checklist.md` completed
- [ ] Peer code review done
- [ ] No hardcoded keys or secrets
- [ ] `.env.example` provided, `.env` gitignored

## Phase 4: Mainnet
```bash
taq deploy MyContract --env mainnet
# or octez-client against https://rpc.tzbeta.net
```
- [ ] Deployer wallet funded (XTZ for storage burn + fees)
- [ ] Initial storage values correct for production
- [ ] Contract verified on https://tzkt.io
- [ ] Frontend env vars updated to mainnet RPC + contract address
- [ ] Announce contract address publicly if applicable

## Network Reference
| Network | RPC | Explorer |
|---|---|---|
| Mainnet | https://rpc.tzbeta.net | https://tzkt.io |
| Shadownet | https://rpc.shadownet.teztnets.com | see https://teztnets.com/ |

## Sources and last verified

Verified November 22, 2026.

- https://docs.tezos.com/developing/testnets
- https://docs.tezos.com/developing/octez-client/installing
