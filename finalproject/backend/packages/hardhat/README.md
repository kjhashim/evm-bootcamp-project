## Description

This is the back end code for Onchain MegaBets.

For the front end code, go to https://github.com/Munaiz123/evmBootCamp_FinalProject_Frontend/

## Project setup and compilation

```bash
npm install
npm install --save-dev hardhat
npm install --save-dev @openzeppelin/contracts
npm install --save-dev @nomicfoundation/hardhat-ethers
npm install --save-dev @nomicfoundation/hardhat-chai-matchers
npm install --save-dev @typechain/hardhat
npm install --save-dev hardhat-gas-reporter
npm install --save-dev solidity-coverage
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev hardhat-deploy
npm install --save-dev hardhat-deploy-ethers
npm install --save-dev hardhat-deploy@^0.12.0 hardhat-deploy-ethers
npx hardhat compile
```

## Deploy the 3 smart contracts

Commands to deploy to sepolia or locally:
```bash
npx hardhat run deploy/deploy_game.ts --network sepolia
or
npx hardhat deploy --network hardhat
or
yarn deploy

```

deploy to Sepolia:

```bash
$ npx hardhat deploy --network sepolia
Nothing to compile
No need to generate any newer typings.
deploying "LuckyToken" (tx: 0x7c5d1dcd5ad45dca197421c28f6ee044a18fcda3c3fb42656ff4bd0e75bbd6aa)...: deployed at 0xF0b66cD3DE25C92B2759dBcb6F578380866406E4 with 1738265 gas
LuckyToken deployed to address: 0xF0b66cD3DE25C92B2759dBcb6F578380866406E4
deploying "TokenHandler" (tx: 0x0ccab94a853b8736dfb36bf7599e0b1cd062d4d02851c3264189ae907f92d1bd)...: deployed at 0x7E0c9D26BE0Dd087aBc61A16a463BF8ac00C0289 with 916611 gas
TokenHandler deployed to address: 0x7E0c9D26BE0Dd087aBc61A16a463BF8ac00C0289
deploying "Wheel" (tx: 0xea28367d8f9094fcf37a0fcda74a8d587c7b181b57db3891805cbbcff26cbcf0)...: deployed at 0x1267AC7e84F3999b233a3BCb3c5258c5f14436b7 with 1294490 gas
Wheel deployed to address: 0x1267AC7e84F3999b233a3BCb3c5258c5f14436b7

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

