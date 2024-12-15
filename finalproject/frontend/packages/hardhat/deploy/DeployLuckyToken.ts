import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/LuckyToken.sol/LuckyToken.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const privateKey = process.env.PRIVATE_KEY || "";
const MINT_VALUE = 1000000000

async function main() {
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number: ", blockNumber);

    const account = privateKeyToAccount(`0x${privateKey}`);
    const deployer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Deployer address:", deployer.account.address);

    const balance = await publicClient.getBalance({
        address: deployer.account.address,
    });
    console.log(
        "Deployer balance:",
        formatEther(balance),
        deployer.chain.nativeCurrency.symbol
    );

    console.log("\nDeploying LuckyToken contract");
    const hash = await deployer.deployContract({
        abi,
        bytecode: bytecode as `0x${string}`,
    });
    console.log("Transaction hash: ", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("LuckyToken contract deployed to address: ", receipt.contractAddress);


    // Minting some tokens
    const mintValue = parseEther(MINT_VALUE);
    const mintTx = await deployer.writeContract({
        address: receipt.contractAddress,
        abi,
        functionName: "mint",
        args: [deployer.account.address, mintValue],
    });
    console.log("Mint transaction hash:", mintTx);
    console.log("Waiting for confirmations...");
    const receiptmint = await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log("Transaction confirmed. Receipt:", receiptmint);
    console.log(
      `Minted ${mintValue.toString()} decimal units to account ${
        deployer.account.address
      }\n`
    );

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
