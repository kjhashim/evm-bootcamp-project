import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract, parseEther } from "ethers";

/**
 * Deploys the LuckyToken, TokenHandler, Wheel contracts for Spin the Weel
 * game using the deployer account and constructor arguments set to the 
 * deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployGame: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    /*
      On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

      When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
      should have sufficient balance to pay for the gas fees for contract creation.

      You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
      with a random private key in the .env file (then used on hardhat.config.ts)
      You can run the `yarn account` command to check your balance in every network.
    */
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;
    const MINT_VALUE = "1000000000";
    const FAUCET_AMOUNT = "100";

    // Deploy LuckyToken
    const luckyTokenContract = await deploy("LuckyToken", {
        from: deployer,
        args: [parseEther(MINT_VALUE), parseEther(FAUCET_AMOUNT)],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true,
    });
    console.log("LuckyToken deployed to address:", luckyTokenContract.address);

    // Deploy TokenHandler, passing LuckyToken's address to it
    const tokenHandlerContract = await deploy("TokenHandler", {
        from: deployer,
        args: [luckyTokenContract.address],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true,
    });
    console.log("TokenHandler deployed to address:", tokenHandlerContract.address);

    // Deploy ContractA, passing TokenHandler's address to it
    const wheelContract = await deploy("Wheel", {
        from: deployer,
        args: [tokenHandlerContract.address],
        log: true,
        // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
        // automatically mining the contract deployment transaction. There is no effect on live networks.
        autoMine: true,
    });
    console.log("Wheel deployed to address:", wheelContract.address);

};

export default deployGame;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags wheel
deployGame.tags = ["game", "wheel"];
