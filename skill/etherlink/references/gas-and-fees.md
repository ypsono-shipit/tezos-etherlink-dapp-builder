# Gas and fees on Etherlink

> **Source:** https://docs.etherlink.com/network/fees/

The constants below (1 gwei minimum base fee, 30,000,000 block gas, inclusion fee `0.000004 XTZ × (150 + data bytes + access list bytes)`, priority fee ignored) come from the April 2026 skill. On November 22, 2026 a fetch of that fees URL returned an empty body, so the numbers were **not** reconfirmed. The two part model itself (execution gas plus an L1 inclusion fee bundled into `eth_estimateGas`) is still the right mental model and is what the Etherlink sub-skill tells agents to follow. Re-read the live page before hardcoding a formula.

Etherlink has a **two-part fee model** that differs meaningfully from standard EVM chains. Underestimating gas — especially in deployment scripts and complex transactions — is the most common cause of reverts and failed deploys on Etherlink.

---

## The Two Fee Components

### 1. Execution Fee (Gas Fee)
Covers EVM computation, same concept as on Ethereum.

- **Base fee:** 1 gwei minimum (`minimum_base_fee_per_gas`)
- **Block gas limit:** 30 million gas units per block (execution only)
- Under normal load the base fee stays at 1 gwei — it only rises exponentially when backlog exceeds ~20M gas units

### 2. Inclusion Fee (L1 DA Fee) — the key difference
Covers posting your transaction's calldata to Tezos L1 as data availability.

```
Inclusion fee = 0.000004 XTZ × (150 + tx.data.size() + tx.access_list.size())
```

- Grows with **calldata size** and **access list size**
- Hits hardest on: contract deployments (large bytecode), complex multicalls, and any tx with a big access list
- `eth_estimateGas` returns a **combined** value (execution + inclusion) — you cannot easily separate them

---

## Why This Catches People Out

On standard EVM chains, `eth_estimateGas` returns execution gas only. On Etherlink it bundles in the inclusion fee, which means:

- **Gas estimates for large transactions look higher than expected** — this is correct, not an inflation bug
- **Hardcoded gas limits copied from Ethereum will be too low** for any transaction with significant calldata (e.g. deploying contracts > a few hundred bytes)
- **Priority fees are ignored** — `max_priority_fee_per_gas` has no effect; the sequencer is FCFS (first-come-first-served), so bumping priority tip does nothing

---

## Practical Rules

### Always use `eth_estimateGas` — never hardcode gas limits
```typescript
// BAD — Ethereum gas limit, will underestimate on large deploys
const hash = await walletClient.writeContract({
  ...
  gas: 200_000n, // ← dangerous if calldata is large
});

// GOOD — let viem / the RPC estimate (includes inclusion fee)
const hash = await walletClient.writeContract({
  // no gas field — viem calls eth_estimateGas automatically
  ...
});
```

### Add a safety buffer for deployment scripts
Contract deployment sends the full bytecode as calldata — inclusion fee is at its highest here.

```javascript
// scripts/deploy.js
const contract = await WhatToBuild.deploy();

// If you must set gas manually (e.g. for a specific override):
// Use 1.3× the estimate to account for inclusion fee variance
const estimated = await hre.ethers.provider.estimateGas(deployTx);
const gasLimit = (estimated * 130n) / 100n;
```

### Hardhat config — don't cap gasLimit
```javascript
export default {
  solidity: "0.8.24",
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts: [PRIVATE_KEY],
      // Do NOT set gasLimit here — let eth_estimateGas handle it
      // gasPrice is fine to set (1 gwei is typical at low load)
      gasPrice: 1_000_000_000, // 1 gwei
    },
  },
};
```

### Large access lists cost extra
EIP-2930 access lists increase the inclusion fee linearly. If you're specifying access lists manually, factor in the extra L1 DA cost or omit them unless needed for execution gas savings.

---

## Fee Quick Reference

| Parameter | Value |
|---|---|
| Minimum base fee | 1 gwei |
| Block gas limit (execution) | 30,000,000 gas |
| Inclusion fee formula | `0.000004 XTZ × (150 + data_bytes + access_list_bytes)` |
| Priority fee (`max_priority_fee_per_gas`) | Ignored — sequencer is FCFS |
| `eth_estimateGas` output | Execution + inclusion combined |
| Recommended gas buffer for deploys | 1.2–1.3× estimated |

---

## Diagnosing Gas Errors

| Error | Likely Cause | Fix |
|---|---|---|
| `Transaction reverted: out of gas` | Gas limit too low (hardcoded or stale estimate) | Remove hardcoded `gas:`, let RPC estimate |
| Deploy succeeds on Shadownet but fails on mainnet | Mainnet has more state → larger access list → higher inclusion fee | Re-estimate on mainnet before deploy |
| Estimate much higher than Ethereum equivalent | Normal — inclusion fee is bundled in | Do not cap it, trust the estimate |
| Priority fee bump has no effect | Sequencer ignores `max_priority_fee_per_gas` | Don't bother bumping it |

## Sources and last verified

Verified November 22, 2026. Procedural steps in this file were carried forward from the April 2026 skill and were not re-derived line by line. Network names were updated where the file is a checklist that used to say Ghostnet. Prefer the live doc if a command disagrees.

- https://docs.etherlink.com/
- https://docs.tezos.com/
- https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/
- https://docs.etherlink.com/michelson/developing/compatibility
