import { getClientsAccts } from './sharedUtils';
import { abi } from "../artifacts/contracts/LuckyToken.sol/LuckyToken.json";

async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error(
            'Required parameters not provided: <contract address> [address to check]'
        );

    const contractAddress = parameters[0] as `0x${string}`;
    const addressToCheck = parameters[1] as `0x${string}` || null;

    if (!contractAddress) throw new Error('Contract address not provided');
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error('Invalid contract address');
    if (addressToCheck && !/^0x[a-fA-F0-9]{40}$/.test(addressToCheck))
        throw new Error('Invalid address to check');

    const { publicClient, account } = getClientsAccts();

    // Get contract balance
    const contractBalance = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getContractTokenBalance"
    });
    console.log("\nContract Balance:", contractBalance.toString());

    // Get faucet amount
    const faucetAmount = await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "faucetAmount"
    });
    console.log("Faucet Amount per Request:", faucetAmount.toString());

    if (addressToCheck) {
        // Get specific address balance
        const balance = await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName: "balanceOf",
            args: [addressToCheck]
        });
        console.log(`Balance for ${addressToCheck}: ${balance.toString()}`);

        // Get last faucet request time if available
        try {
            const lastRequest = await publicClient.readContract({
                address: contractAddress,
                abi,
                functionName: "lastFaucetRequest",
                args: [addressToCheck]
            });
            const lastRequestTime = new Date(Number(lastRequest) * 1000);
            console.log(`Last Faucet Request: ${lastRequestTime.toLocaleString()}`);
        } catch (error) {
            console.log("No faucet request history available");
        }
    }

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});