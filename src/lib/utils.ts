//Old working code for utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Abi } from "viem";
import { encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { activeChain, contracts, getPublicClient, getWalletClient, getContracts } from "./eth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Basic, RFC5322-inspired email validation suitable for client-side checks
// Intentionally conservative to avoid false positives; server should re-validate
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false; // practical upper bound
  // Disallow spaces and consecutive dots, require one @ with valid parts
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return false;
  if (trimmed.includes("..")) return false;
  return true;
}

export async function getGuardianCount(): Promise<bigint> {
  const currentContracts = getContracts();
  const result = await getPublicClient().readContract({
    address: currentContracts.walletImplementation.address,
    abi: currentContracts.walletImplementation.abi as unknown as Abi,
    functionName: "getGuardianCount",
    args: [],
  } as any);
  return result as bigint;
}

export async function addGuardian(guardian: `0x${string}`) {
  const walletClient = getWalletClient();
  if (!walletClient) throw new Error("Wallet not connected");
  const [account] = await walletClient.getAddresses();

  const currentContracts = getContracts();
  const params = {
    chain: activeChain,
    account,
    address: currentContracts.walletImplementation.address,
    abi: currentContracts.walletImplementation.abi as unknown as Abi,
    functionName: "addGuardian",
    args: [guardian],
  } as unknown as Parameters<typeof walletClient.writeContract>[0];

  const hash = await walletClient.writeContract(params);
  return getPublicClient().waitForTransactionReceipt({ hash });
}

// Gas estimation interface
export interface GasEstimate {
  estimatedGas: bigint;
  gasWithBuffer: bigint;
  gasPrice: bigint;
  gasCost: bigint;
  gasCostInWCO: string;
}

// Estimate gas for wallet creation without deploying
export const estimateWalletCreationGas = async (name: string, privateKey: string): Promise<GasEstimate> => {
  try {
    // Create a wallet from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    
    // Estimate gas for the createWallet function call with fallback
    let estimatedGas: bigint;
    
    try {
      // Try to estimate gas using the contract method
      const currentContracts = getContracts();
      estimatedGas = await getPublicClient().estimateContractGas({
        address: currentContracts.walletFactory.address,
        abi: currentContracts.walletFactory.abi,
        functionName: 'createWallet',
        args: [name],
        account: account.address,
      });
    } catch (error) {
      // Fallback to a reasonable estimate if RPC estimation fails
      
      // For a simple proxy deployment + initialization, this should be sufficient
      // But we're seeing high gas usage, so let's be more generous
      // Base transaction: 21,000
      // Contract creation: ~100,000 (increased from 32,000)
      // String storage: ~5,000 per character (increased from 2,000)
      // Initialize function call: ~50,000 (increased from 15,000)
      const baseGas = 21000n; // Base transaction cost
      const contractCreationGas = 100000n; // Proxy creation with buffer
      const stringStorageGas = BigInt(name.length) * 5000n; // String storage cost with buffer
      const initializationGas = 50000n; // Initialize function call with buffer
      
      estimatedGas = baseGas + contractCreationGas + stringStorageGas + initializationGas;
    }

    // Add 20% buffer to gas estimate for safety
    const gasWithBuffer = (estimatedGas * 120n) / 100n;
    
    
    // Get gas price with EIP-1559 optimization if available
    let gasPrice: bigint;
    
    try {
      // Try to get EIP-1559 gas parameters for better cost optimization
      const feeData = await getPublicClient().estimateFeesPerGas();
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        gasPrice = feeData.maxFeePerGas; // Use maxFeePerGas for cost calculation
      } else {
        gasPrice = await getPublicClient().getGasPrice();
      }
    } catch (error) {
      // Fallback to a reasonable gas price if RPC calls fail
      // For W-Chain testnet, use a conservative estimate
      gasPrice = 1000000000n; // 1 gwei as fallback
    }
    
    // Ensure gasPrice is defined and valid
    if (!gasPrice || gasPrice <= 0n) {
      gasPrice = 1000000000n; // 1 gwei as final fallback
    }
    
    const gasCost = gasPrice * gasWithBuffer;
    const gasCostInWCO = (Number(gasCost) / 1e18).toFixed(6);
    
    
    return {
      estimatedGas,
      gasWithBuffer,
      gasPrice,
      gasCost,
      gasCostInWCO
    };
  } catch (error) {
    throw error;
  }
};

export const deploySmartContractWallet = async (name: string, privateKey: string) => {
  try {
    // Create a wallet from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    
    // First, let's check if the contracts are actually deployed
    try {
      const currentContracts = getContracts();
      const factoryCode = await getPublicClient().getCode({
        address: currentContracts.walletFactory.address,
      });
      const implCode = await getPublicClient().getCode({
        address: currentContracts.walletImplementation.address,
      });
      
      
      if (!factoryCode || factoryCode === '0x') {
        throw new Error(`WalletFactory contract not deployed at ${currentContracts.walletFactory.address}`);
      }
      if (!implCode || implCode === '0x') {
        throw new Error(`WalletImplementation contract not deployed at ${currentContracts.walletImplementation.address}`);
      }
      
      
    } catch (codeCheckError) {
      throw new Error(`Contract deployment verification failed: ${codeCheckError instanceof Error ? codeCheckError.message : 'Unknown error'}`);
    }
    
    // Get gas estimate
    const gasEstimate = await estimateWalletCreationGas(name, privateKey);
    const { gasWithBuffer, gasPrice, gasCost } = gasEstimate;
    
    // Check if the account has sufficient balance for gas
    const balance = await getPublicClient().getBalance({
      address: account.address,
    });
    
    
    if (balance < gasCost) {
      const balanceInWCO = Number(balance) / 1e18;
      const requiredInWCO = Number(gasCost) / 1e18;
      throw new Error(
        `Insufficient funds for gas. Required: ${requiredInWCO.toFixed(6)} WCO (${gasCost} wei), Available: ${balanceInWCO.toFixed(6)} WCO (${balance} wei). ` +
        `Please fund the address ${account.address} with some WCO tokens first.`
      );
    }

    // Encode the function call data for the transaction
    let data: string;
    try {
      const currentContracts = getContracts();
      data = encodeFunctionData({
        abi: currentContracts.walletFactory.abi,
        functionName: 'createWallet',
        args: [name],
      });
    } catch (error) {
      throw new Error(`Failed to encode function data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Validate data is properly encoded
    if (!data || typeof data !== 'string' || !data.startsWith('0x')) {
      throw new Error(`Invalid encoded data: ${data}`);
    }

    // Get the nonce for the account
    let nonce: number;
    try {
      nonce = await getPublicClient().getTransactionCount({
        address: account.address,
        blockTag: 'pending'
      });
    } catch (error) {
      nonce = 0; // Fallback to 0 if RPC call fails
    }
    
    // Ensure nonce is a valid number
    if (nonce === undefined || nonce === null || isNaN(nonce)) {
      nonce = 0;
    }

    // Create the transaction with proper gas estimation and EIP-1559 if available
    const currentContracts = getContracts();
    const transaction: any = {
      to: currentContracts.walletFactory.address,
      data,
      gas: gasWithBuffer,
      nonce,
      value: 0n,
      chainId: activeChain.id,
    };

    // Use legacy transaction for better compatibility with W-Chain
    // The RPC seems to have issues with EIP-1559, so let's use legacy format
    transaction.type = '0x0'; // Legacy transaction type
    transaction.gasPrice = gasPrice;
    // Don't set EIP-1559 fields for legacy transactions

    // Debug: Log all transaction parameters to identify undefined values

    // Validate all required parameters are defined
    if (!transaction.to || !transaction.data || !transaction.gas || transaction.nonce === undefined || transaction.value === undefined) {
      throw new Error(`Invalid transaction parameters: to=${transaction.to}, data=${transaction.data}, gas=${transaction.gas}, nonce=${transaction.nonce}, value=${transaction.value}`);
    }

    // Skip walletClient approach due to RPC configuration issues
    // Use manual transaction signing for better control over RPC endpoint
    const signedTransaction = await account.signTransaction(transaction);

    // Send the raw transaction
    const hash = await getPublicClient().sendRawTransaction({
      serializedTransaction: signedTransaction,
    });
    
    
    // Wait for confirmation
    const receipt = await getPublicClient().waitForTransactionReceipt({ hash });
    
    
    // Check if transaction was reverted
    if (receipt.status === 'reverted') {
      
      // Try to get the revert reason by simulating the transaction
      try {
        const currentContracts = getContracts();
        const simulateResult = await getPublicClient().simulateContract({
          address: currentContracts.walletFactory.address,
          abi: currentContracts.walletFactory.abi,
          functionName: 'createWallet',
          args: [name],
          account: account.address,
        });
      } catch (simulateError) {
        
        // Extract more detailed error information
        let errorMessage = 'Unknown revert reason';
        if (simulateError instanceof Error) {
          errorMessage = simulateError.message;
          
          // Try to extract revert reason from error message
          const revertMatch = errorMessage.match(/revert(?:ed)?\s*(?:with\s*reason\s*)?[:\s]*["']?([^"']+)["']?/i);
          if (revertMatch && revertMatch[1]) {
            errorMessage = revertMatch[1].trim();
          }
        }
        
        throw new Error(`Smart contract reverted: ${errorMessage}`);
      }
      
      throw new Error(`Smart contract transaction was reverted. Gas usage: ${receipt.gasUsed}/${gasWithBuffer}. This might be due to: 1) Insufficient gas, 2) Contract implementation issues, or 3) Invalid parameters.`);
    }
    
    // Extract wallet address from event logs
    const walletAddress = extractWalletAddress(receipt.logs);
    
    return walletAddress;
  } catch (error) {
    throw error;
  }
};

const extractWalletAddress = (logs: any[]): string => {
  
  // Log all events for debugging
  logs.forEach((log, index) => {
  });
  
  // Find any event from the factory contract (WalletCreated event)
  const factoryEvent = logs.find(log => 
    log.address.toLowerCase() === contracts.walletFactory.address.toLowerCase()
  );
  
  if (factoryEvent) {
    
    if (factoryEvent.topics && factoryEvent.topics.length >= 2) {
      // The first topic is the event signature, second topic is the wallet address
      // Remove the 0x prefix and first 6 characters (0x000000000000000000000000) to get the address
      const walletAddress = `0x${factoryEvent.topics[1].slice(26)}`;
      return walletAddress;
    } else {
    }
  } else {
  }
  
  // Try alternative approach - look for any log with topics that might contain an address
  for (const log of logs) {
    if (log.topics && log.topics.length >= 2) {
      // Check if the second topic looks like an address (starts with 0x000000000000000000000000)
      const topic = log.topics[1];
      if (topic && topic.length === 66 && topic.startsWith('0x000000000000000000000000')) {
        const potentialAddress = `0x${topic.slice(26)}`;
        return potentialAddress;
      }
    }
  }
  
  throw new Error('Wallet creation event not found in transaction logs');
};
