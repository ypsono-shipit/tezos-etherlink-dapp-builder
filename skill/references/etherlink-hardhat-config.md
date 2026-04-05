# Hardhat Configuration for Etherlink

## Installation
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

## hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    etherlinkMainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts: [process.env.PRIVATE_KEY]
    },
    shadownet: {
      url: "https://node.shadownet.etherlink.com",
      chainId: 127823,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

## .env
```
PRIVATE_KEY=your_private_key_here
```

## Deployment Script (scripts/deploy.js)
```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const MyContract = await ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy();
  await contract.waitForDeployment();

  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => { console.error(error); process.exit(1); });
```

## Commands
```bash
# Test on Shadownet
npx hardhat run scripts/deploy.js --network shadownet

# Deploy to Mainnet
npx hardhat run scripts/deploy.js --network etherlinkMainnet

# Verify (if explorer supports it)
npx hardhat verify --network shadownet DEPLOYED_ADDRESS
```
