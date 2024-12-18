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
deploying "Wheel" (tx: 0xc1e50806c2382ede60d852f87b1a44ea87e4c7c9e17f1aab6a4e91e9fa6dfee4)...: deployed at 0x18c3E3eda727288B84B3bcaeA276eAA271A90ef3 with 1256458 gas
Wheel deployed to address: 0x18c3E3eda727288B84B3bcaeA276eAA271A90ef3
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

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
