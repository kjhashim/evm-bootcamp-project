import { getClientsAccts } from './sharedUtils';
import { abi } from "../artifacts/contracts/LuckyToken.sol/LuckyToken.json";


const openStdin = function () {
    process.stdin.resume();
    return process.stdin;
  };

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error(
      'Required parameters not provided: <contract address> <amount to mint>'
    );

  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error('Contract address not provided');
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error('Invalid contract address');

  const amountToMint = parameters[1];
  if (isNaN(Number(amountToMint)))
    throw new Error('Invalid amount to mint, expecting integer');

  const { publicClient, account, deployer } = getClientsAccts();
  const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number: ", blockNumber);

    const adminAddress = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getAdminAddress",
    })) as string;

    if (adminAddress !== contractAddress) {
        throw new Error('You are not authorized to mint this token');
    }

    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
            const hash = await deployer.writeContract({
              address: contractAddress,
              abi,
              functionName: "mint",
              args: [contractAddress, amountToMint],
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
