import { getClientsAccts } from './sharedUtils';
import { abi as wheelAbi } from "../artifacts/contracts/Wheel.sol/Wheel.json";
import { abi as tokenHandlerAbi } from "../artifacts/contracts/TokenHandler.sol/TokenHandler.json";

const openStdin = function () {
    process.stdin.resume();
    return process.stdin;
};

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error(
            'Required parameters not provided: <wheel address> <amount> <color>'
        );

    const wheelAddress = parameters[0] as `0x${string}`;
    const betAmount = parameters[1];
    const betColor = parameters[2].toLowerCase();

    if (!wheelAddress) throw new Error('Wheel address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(wheelAddress))
        throw new Error('Invalid wheel address');
    if (isNaN(Number(betAmount)))
        throw new Error('Invalid bet amount, expecting integer');
    if (!['red', 'white'].includes(betColor))
        throw new Error('Invalid color, must be "red" or "white"');

    const { publicClient, account, deployer } = getClientsAccts();

    // Check game state
    const isOpen = await publicClient.readContract({
        address: wheelAddress,
        abi: wheelAbi,
        functionName: "isGameOpen"
    });

    if (!isOpen) {
        throw new Error("Game is currently closed");
    }

    // Get bet limits
    const minBet = await publicClient.readContract({
        address: wheelAddress,
        abi: wheelAbi,
        functionName: "minBet"
    }) as number;

    const maxBet = await publicClient.readContract({
        address: wheelAddress,
        abi: wheelAbi,
        functionName: "maxBet"
    }) as number;

    if (BigInt(betAmount) < minBet || BigInt(betAmount) > maxBet) {
        throw new Error(`Bet amount must be between ${minBet} and ${maxBet}`);
    }

    // Get TokenHandler address
    const tokenHandler = await publicClient.readContract({
        address: wheelAddress,
        abi: wheelAbi,
        functionName: "tokenHandler"
    }) as `0x${string}`;

    // Check balances
    const userStash = await publicClient.readContract({
        address: tokenHandler,
        abi: tokenHandlerAbi,
        functionName: "getStashBalance",
        args: [account.address]
    });

    const kittyBalance = await publicClient.readContract({
        address: tokenHandler,
        abi: tokenHandlerAbi,
        functionName: "getGameKittyBalance"
    });

    console.log("\nGame Status:");
    console.log(`Your stash balance: ${userStash.toString()}`);
    console.log(`Kitty balance: ${kittyBalance.toString()}`);
    console.log(`\nBet Details:`);
    console.log(`Amount: ${betAmount}`);
    console.log(`Color: ${betColor}`);
    console.log('\nPress enter to place bet...');

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        const hash = await deployer.writeContract({
            address: wheelAddress,
            abi: wheelAbi,
            functionName: "bet",
            args: [BigInt(betAmount), betColor],
            account,
            chain: deployer.chain
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Bet placed successfully");
        
        // Get updated balances
        const newStash = await publicClient.readContract({
            address: tokenHandler,
            abi: tokenHandlerAbi,
            functionName: "getStashBalance",
            args: [account.address]
        });

        const newKitty = await publicClient.readContract({
            address: tokenHandler,
            abi: tokenHandlerAbi,
            functionName: "getGameKittyBalance"
        });

        console.log("\nUpdated balances:");
        console.log(`Your stash: ${newStash.toString()}`);
        console.log(`Kitty: ${newKitty.toString()}`);
        
        // Determine if bet was won or lost
        const balanceDiff = Number(newStash) - Number(userStash);
        if (balanceDiff > 0) {
            console.log("\n🎉 Congratulations! You won!");
            console.log(`Profit: ${balanceDiff} tokens`);
        } else {
            console.log("\n😢 Better luck next time!");
            console.log(`Loss: ${-balanceDiff} tokens`);
        }

        process.exit();
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});