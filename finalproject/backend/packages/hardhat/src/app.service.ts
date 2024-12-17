import { Injectable } from '@nestjs/common';
import * as luckyTokenJson from "./assets/LuckyToken.json";
import * as tokenHandlerson from './assets/TokenHandler.json';
import * as wheelJson from './assets/Wheel.json';
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  PublicClient,
} from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor() {
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
    this.walletClient = createWalletClient({
      transport: http(process.env.RPC_ENDPOINT_URL),
      chain: sepolia,
      account: account,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): string {
    return {result: this.appService.getContractAddress()};
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }

  getTotalSupply() {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`),
    });
    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'symbol',
    });
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'totalSupply',
    });
    return `${formatEther(totalSupply as bigint)} ${symbol}`;
  }

  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async checkAdminRole(address: string): Promise<boolean> {
    // const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    const DEFAULT_ADMIN_ROLE =  await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'DEFAULT_ADMIN_ROLE'
    });
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [DEFAULT_ADMIN_ROLE, address],
    });
    return hasRole;
  }

  mintTokens(address: string) {
    return { result: true };
  }

  async getTransactionReceipt(hash: string) {
    const receipt = await this.publicClient.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    return {
      result: `Transaction status: ${receipt.status} , Block number ${receipt.blockNumber}`,
    };
  }

}
