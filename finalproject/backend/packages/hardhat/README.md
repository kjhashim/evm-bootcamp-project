## Description

Back end code for Betting Game

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
reusing "TokenHandler" at 0xd2D2Dd292Cd393FE17ef0459d9b5Be59D57989D8
TokenHandler deployed to address: 0xd2D2Dd292Cd393FE17ef0459d9b5Be59D57989D8
deploying "Wheel" (tx: 0x66bf6bec7bd13b18f6aa1c67fce6b69c82ed68352f0c405b25ba9a2805229783)...: deployed at 0x8b115f111824850Cb29502e342F67C6697710B7C with 1294490 gas
Wheel deployed to address: 0x8b115f111824850Cb29502e342F67C6697710B7C```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

