# Hardhat Configuration for Etherlink

## Installation

```bash
npm install --save-dev hardhat
# IMPORTANT: install the hh2 tag — the latest tag does not work with Hardhat 2
npm install --save-dev "@nomicfoundation/hardhat-toolbox@hh2"
npm install --save-dev dotenv
```

> **Node.js**: Hardhat requires Node.js **v22+**. Check with `node --version`.  
> On Mac: `brew install node@22 && brew link node@22 --force --overwrite`  
> If still on old version: `echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`

---

## ESM vs CommonJS — Critical Note

If your `package.json` contains `"type": "module"`, your project uses ESM.  
**Do not use `require()` or `module.exports`** — Hardhat will error with:  
`ReferenceError: require is not defined in ES module scope`

Use ESM syntax instead (`import` / `export default`).

---

## hardhat.config.js (ESM — for projects with `"type": "module"`)

```javascript
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);

export default {
  solidity: "0.8.24",
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts: [PRIVATE_KEY],
    },
    shadownet: {
      url: "https://node.shadownet.etherlink.com",
      chainId: 127823,
      accounts: [PRIVATE_KEY],
    },
  },
};
```

## hardhat.config.cjs (CommonJS — for projects WITHOUT `"type": "module"`)

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);

module.exports = {
  solidity: "0.8.24",
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts: [PRIVATE_KEY],
    },
    shadownet: {
      url: "https://node.shadownet.etherlink.com",
      chainId: 127823,
      accounts: [PRIVATE_KEY],
    },
  },
};
```

---

## .env

```
PRIVATE_KEY=0x_your_private_key_here
```

Never commit this file. Add `.env` to `.gitignore`.

---

## Deployment Script — scripts/deploy.js (ESM)

```javascript
import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(
    await hre.ethers.provider.getBalance(deployer.address)
  ), "XTZ");

  const MyContract = await hre.ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Deployed to:", address);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

---

## package.json scripts

```json
"scripts": {
  "compile": "hardhat compile",
  "deploy:shadownet": "hardhat run scripts/deploy.js --network shadownet",
  "deploy:mainnet": "hardhat run scripts/deploy.js --network etherlinkMainnet"
}
```

---

## Commands

```bash
# Compile contracts
npm run compile

# Deploy to Shadownet (testnet first)
npm run deploy:shadownet

# Deploy to Etherlink Mainnet
npm run deploy:mainnet
```

---

## Common Errors

| Error | Fix |
|---|---|
| `require is not defined in ES module scope` | Use ESM syntax (`import`/`export default`) or rename config to `.cjs` |
| `hardhat-toolbox does not work with Hardhat 2` | Install `@nomicfoundation/hardhat-toolbox@hh2` not `latest` |
| `No Hardhat config file found` | Run from the project root directory where `hardhat.config.js` lives |
| Node version error | Upgrade to Node v22+ |
