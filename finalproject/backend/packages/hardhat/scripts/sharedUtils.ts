import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export function getClientsAccts() {
  const providerApiKey = process.env.ALCHEMY_API_KEY || '';
  if (!providerApiKey) {
    throw new Error('ALCHEMY_API_KEY not found in environment variables');
  }

  const privateKey = process.env.PRIVATE_KEY || '';
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not found in environment variables');
  }

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${privateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const acctAddress = deployer.account.address;
  console.log('Deployer address:', acctAddress);

  return { publicClient, account, deployer };
}
