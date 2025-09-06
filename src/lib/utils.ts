import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Abi } from "viem";
import { encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { activeChain, contracts, publicClient, walletClient } from "./eth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getGuardianCount(): Promise<bigint> {
  const params = {
    address: contracts.walletImplementation.address,
    abi: contracts.walletImplementation.abi as unknown as Abi,
    functionName: "getGuardianCount",
    args: [],
  } as unknown as Parameters<typeof publicClient.readContract>[0];

  const result = await publicClient.readContract(params);
  return result as bigint;
}

export async function addGuardian(guardian: `0x${string}`) {
  if (!walletClient) throw new Error("Wallet not connected");
  const [account] = await walletClient.getAddresses();

  const params = {
    chain: activeChain,
    account,
    address: contracts.walletImplementation.address,
    abi: contracts.walletImplementation.abi as unknown as Abi,
    functionName: "addGuardian",
    args: [guardian],
  } as unknown as Parameters<typeof walletClient.writeContract>[0];

  const hash = await walletClient.writeContract(params);
  return publicClient.waitForTransactionReceipt({ hash });
}

export const deploySmartContractWallet = async (name: string, privateKey: string) => {
  try {
    // Create a wallet from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    // Check if the account has sufficient balance for gas
    const balance = await publicClient.getBalance({
      address: account.address,
    });
    
    // Get gas price and estimate gas
    const gasPrice = await publicClient.getGasPrice();
    const estimatedGas = 500000n; // Estimated gas for contract deployment
    const gasCost = gasPrice * estimatedGas;
    
    if (balance < gasCost) {
      throw new Error(
        `Insufficient funds for gas. Required: ${gasCost} wei, Available: ${balance} wei. ` +
        `Please fund the address ${account.address} with some WCO tokens first.`
      );
    }

    // Get the nonce for the account
    const nonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: 'pending'
    });

    // Encode the function call data
    const data = encodeFunctionData({
      abi: contracts.walletFactory.abi,
      functionName: 'createWallet',
      args: [name],
    });

    // Create the transaction
    const transaction = {
      to: contracts.walletFactory.address,
      data,
      gas: estimatedGas,
      gasPrice,
      nonce,
      value: 0n,
    };

    // Sign the transaction
    const signedTransaction = await account.signTransaction(transaction);

    // Send the raw transaction
    const hash = await publicClient.sendRawTransaction({
      serializedTransaction: signedTransaction,
    });
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    // Extract wallet address from event logs
    const walletAddress = extractWalletAddress(receipt.logs);
    
    return walletAddress;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
};

const extractWalletAddress = (logs: any[]): string => {
  // Find any event from the factory contract (WalletCreated event)
  const factoryEvent = logs.find(log => 
    log.address.toLowerCase() === contracts.walletFactory.address.toLowerCase()
  );
  
  if (factoryEvent && factoryEvent.topics && factoryEvent.topics.length >= 2) {
    // The first topic is the event signature, second topic is the wallet address
    // Remove the 0x prefix and first 6 characters (0x000000000000000000000000) to get the address
    return `0x${factoryEvent.topics[1].slice(26)}`;
  }
  
  throw new Error('Wallet creation event not found in transaction logs');
};
