import { getClientsAccts } from './sharedUtils';
import { abi } from "../artifacts/contracts/Wheel.sol/Wheel.json";

const openStdin = function () {
    process.stdin.resume();
    return process.stdin;
};

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error(
            'Required parameters not provided: <wheel address> <action>'
        );

    const wheelAddress = parameters[0] as `0x${string}`;
    const action = parameters[1].toLowerCase(); // "open" or "close"

    if (!wheelAddress) throw new Error('Wheel address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(wheelAddress))
        throw new Error('Invalid wheel address');
    if (!['open', 'close'].includes(action))
        throw new Error('Invalid action, must be "open" or "close"');

    const { publicClient, account, deployer } = getClientsAccts();

    // Check ownership
    const isOwner = await publicClient.readContract({
        address: wheelAddress,
        abi,
        functionName: "owner"
    }) as string;

    if (isOwner.toLowerCase() !== account.address.toLowerCase()) {
        throw new Error("Only the owner can control the game state");
    }

    const currentState = await publicClient.readContract({
        address: wheelAddress,
        abi,
        functionName: "isGameOpen"
    });

    console.log(`Current game state: ${currentState ? 'Open' : 'Closed'}`);
    console.log(`Ready to ${action} the game`);
    console.log('Press enter to continue...');

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        const hash = await deployer.writeContract({
            address: wheelAddress,
            abi,
            functionName: action === 'open' ? 'openGame' : 'closeGame',
            account,
            chain: deployer.chain
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(`Game ${action}ed successfully`);
        console.log("Receipt:", receipt);

        process.exit();
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});