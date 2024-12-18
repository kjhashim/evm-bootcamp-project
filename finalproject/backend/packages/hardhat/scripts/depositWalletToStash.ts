import { getClientsAccts } from './sharedUtils';
import { abi as tokenHandlerAbi } from "../artifacts/contracts/TokenHandler.sol/TokenHandler.json";
import { abi as luckyTokenAbi } from "../artifacts/contracts/LuckyToken.sol/LuckyToken.json";

const openStdin = function () {
    process.stdin.resume();
    return process.stdin;
};

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error(
            'Required parameters not provided: <token handler address> <amount>'
        );

    const handlerAddress = parameters[0] as `0x${string}`;
    const amount = parameters[1];

    if (!handlerAddress) throw new Error('Handler address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(handlerAddress))
        throw new Error('Invalid handler address');
    if (isNaN(Number(amount)))
        throw new Error('Invalid amount, expecting integer');

    const { publicClient, account, deployer } = getClientsAccts();
    
    // Get LuckyToken address from TokenHandler
    const tokenAddress = await publicClient.readContract({
        address: handlerAddress,
        abi: tokenHandlerAbi,
        functionName: "token"
    }) as `0x${string}`;

    // First approve TokenHandler to spend tokens
    console.log("Approving token transfer...");
    const approveHash = await deployer.writeContract({
        address: tokenAddress,
        abi: luckyTokenAbi,
        functionName: "approve",
        args: [handlerAddress, BigInt(amount)],
        account,
        chain: deployer.chain
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    
    console.log(`Ready to deposit ${amount} tokens to your stash`);
    console.log('Press enter to continue...');

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        const hash = await deployer.writeContract({
            address: handlerAddress,
            abi: tokenHandlerAbi,
            functionName: "depositWalletToStash",
            args: [BigInt(amount)],
            account,
            chain: deployer.chain
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Deposit confirmed");
        console.log("Receipt:", receipt);

        // Show updated stash balance
        const stashBalance = await publicClient.readContract({
            address: handlerAddress,
            abi: tokenHandlerAbi,
            functionName: "getStashBalance",
            args: [account.address]
        });
        console.log("New stash balance:", stashBalance.toString());

        process.exit();
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});