import { getClientsAccts } from './sharedUtils';
import { abi as tokenHandlerAbi } from "../artifacts/contracts/TokenHandler.sol/TokenHandler.json";

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

    // Check ownership
    const owner = await publicClient.readContract({
        address: handlerAddress,
        abi: tokenHandlerAbi,
        functionName: "ownerAddress"
    }) as string;

    if (owner.toLowerCase() !== account.address.toLowerCase()) {
        throw new Error("Only the owner can withdraw from stash");
    }

    // Check stash balance
    const stashBalance = await publicClient.readContract({
        address: handlerAddress,
        abi: tokenHandlerAbi,
        functionName: "getStashBalance",
        args: [account.address]
    }) as number;

    if (BigInt(amount) > stashBalance) {
        throw new Error(`Insufficient stash balance. You have ${stashBalance.toString()} tokens`);
    }

    console.log(`Ready to withdraw ${amount} tokens from stash to wallet`);
    console.log('Press enter to continue...');

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        const hash = await deployer.writeContract({
            address: handlerAddress,
            abi: tokenHandlerAbi,
            functionName: "withdrawStashToWallet",
            args: [BigInt(amount)],
            account,
            chain: deployer.chain
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Withdrawal confirmed");
        console.log("Receipt:", receipt);

        process.exit();
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});