# Tezos L1 Smart Contract Quickstart

## SmartPy Incrementer Example
```python
import smartpy as sp

class Incrementer(sp.Contract):
    def __init__(self):
        self.init(value=sp.nat(0))

    @sp.entry_point
    def increment(self, params):
        self.data.value += params

    @sp.entry_point
    def decrement(self, params):
        self.data.value = sp.as_nat(self.data.value - params)

@sp.add_test(name="Incrementer")
def test():
    scenario = sp.test_scenario()
    c = Incrementer()
    scenario += c
    scenario += c.increment(5)
    scenario.verify(c.data.value == 5)
    scenario += c.decrement(2)
    scenario.verify(c.data.value == 3)
```

## JsLIGO Example
```javascript
type storage = nat;
type parameter = ["Increment", nat] | ["Decrement", nat];

const main = (action: parameter, store: storage): [list<operation>, storage] => {
  return [
    [],
    match(action) {
      case Increment(n): store + n;
      case Decrement(n): store - n;
    }
  ];
};
```

## FA2 Token (SmartPy)
```python
import smartpy as sp
from templates import fa2_lib as fa2

class MyFA2Token(fa2.Admin, fa2.Fa2Nft, fa2.MintNft, fa2.BurnNft):
    def __init__(self, admin, metadata, token_metadata):
        fa2.Fa2Nft.__init__(self, metadata, token_metadata=token_metadata)
        fa2.Admin.__init__(self, admin)
```

## Deployment with Taqueria
```bash
npm install -g @taqueria/cli
taq init my-project
cd my-project
taq install @taqueria/plugin-smartpy
taq install @taqueria/plugin-taquito
taq compile
taq originate --network shadownet
```

## Deployment with octez-client (CLI)
```bash
octez-client originate contract myContract \
  transferring 0 from myWallet \
  running myContract.tz \
  --init '0' \
  --burn-cap 1
```

## Tezos Shadownet RPC
- RPC: `https://rpc.shadownet.tezos.com`
- Faucet: https://faucet.shadownet.tezos.com

## Sources and last verified

Verified November 22, 2026. Procedural steps in this file were carried forward from the April 2026 skill and were not re-derived line by line. Network names were updated where the file is a checklist that used to say Ghostnet. Prefer the live doc if a command disagrees.

- https://docs.etherlink.com/
- https://docs.tezos.com/
- https://octez-js.tezos.com/docs/25.0.0/migration_from_taquito/
- https://docs.etherlink.com/michelson/developing/compatibility
