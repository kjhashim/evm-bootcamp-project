import { getClientsAccts } from './sharedUtils';
import { abi } from "../artifacts/contracts/LuckyToken.sol/LuckyToken.json";

const openStdin = function () {
    process.stdin.resume();
    return process.stdin;
};

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error(
            'Required parameters not provided: <contract address>'
        );

    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error('Contract address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error('Invalid contract address');

    const { publicClient, account, deployer } = getClientsAccts();
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number: ", blockNumber);

    const lastRequest = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "lastFaucetRequest",
        args: [account.address]
    })) as bigint;

    const cooldown = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "faucetCooldown"
    })) as bigint;

    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    if (lastRequest + cooldown > currentTime) {
        const waitTime = Number(lastRequest + cooldown - currentTime);
        throw new Error(`Please wait ${waitTime} seconds before requesting tokens again`);
    }

    console.log('Ready to request tokens from faucet');
    console.log('Press enter to continue...');

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        const hash = await deployer.writeContract({
            address: contractAddress,
            abi,
            functionName: "requestTokens",
            account,
            chain: deployer.chain
        });
        console.log("Transaction hash:", hash);
        console.log("Waiting for confirmations...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("Transaction confirmed");
        console.log("Receipt:", receipt);

        process.exit();
    });
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});