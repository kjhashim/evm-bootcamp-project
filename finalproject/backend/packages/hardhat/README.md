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
deploying "LuckyToken" (tx: 0x939953085299dfc5f01a1bc75145c0471b2f3b4a67b67b3ee782c23d28cc7b79)...: deployed at 0xa1125c2b9F8f01ffcc842a7A1DF51e93896005Eb with 1721217 gas
LuckyToken deployed to address: 0xa1125c2b9F8f01ffcc842a7A1DF51e93896005Eb
deploying "TokenHandler" (tx: 0x468e9188d9510196586dcbd8af144f00b523cf33698a65151b6362f8fff0fb17)...: deployed at 0x352eC232dEc669c21a06b5970749B3C7C9aCe77c with 915061 gas
TokenHandler deployed to address: 0x352eC232dEc669c21a06b5970749B3C7C9aCe77c
deploying "Wheel" (tx: 0x5f575e6b1f28de3c40b538ba95ff9e35c46d7fbf375e1879a7c7ace1bdae6faf)...: deployed at 0x33aee53756ceeFE20C3D3A37DCb9434884f5a3DD with 1256458 gas
Wheel deployed to address: 0x33aee53756ceeFE20C3D3A37DCb9434884f5a3DD
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

