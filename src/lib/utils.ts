//Old working code for utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Abi } from "viem";
import { encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { activeChain, contracts, publicClient, walletClient } from "./eth";

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
    
    console.log(`Estimating gas for wallet creation: ${account.address}`);
    
    // Estimate gas for the createWallet function call with fallback
    let estimatedGas: bigint;
    
    try {
      // Try to estimate gas using the contract method
      estimatedGas = await publicClient.estimateContractGas({
        address: contracts.walletFactory.address,
        abi: contracts.walletFactory.abi,
        functionName: 'createWallet',
        args: [name],
        account: account.address,
      });
      console.log(`Gas estimated via RPC: ${estimatedGas}`);
    } catch (error) {
      // Fallback to a reasonable estimate if RPC estimation fails
      console.warn('RPC gas estimation failed, using fallback estimate:', error);
      
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
      console.log(`Using fallback gas estimate: ${estimatedGas} (base: ${baseGas}, creation: ${contractCreationGas}, string: ${stringStorageGas}, init: ${initializationGas})`);
    }

    // Add 20% buffer to gas estimate for safety
    const gasWithBuffer = (estimatedGas * 120n) / 100n;
    
    console.log(`Gas estimation: ${estimatedGas} (with buffer: ${gasWithBuffer})`);
    
    // Get gas price with EIP-1559 optimization if available
    let gasPrice: bigint;
    
    try {
      // Try to get EIP-1559 gas parameters for better cost optimization
      const feeData = await publicClient.estimateFeesPerGas();
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        gasPrice = feeData.maxFeePerGas; // Use maxFeePerGas for cost calculation
        console.log(`Using EIP-1559 gas pricing: maxFeePerGas=${gasPrice}`);
      } else {
        gasPrice = await publicClient.getGasPrice();
        console.log(`Using legacy gas price: ${gasPrice}`);
      }
    } catch (error) {
      console.warn('Failed to get gas price from RPC, using fallback:', error);
      // Fallback to a reasonable gas price if RPC calls fail
      // For W-Chain testnet, use a conservative estimate
      gasPrice = 1000000000n; // 1 gwei as fallback
      console.log(`Using fallback gas price: ${gasPrice} wei (1 gwei)`);
    }
    
    // Ensure gasPrice is defined and valid
    if (!gasPrice || gasPrice <= 0n) {
      gasPrice = 1000000000n; // 1 gwei as final fallback
      console.log(`Using final fallback gas price: ${gasPrice} wei`);
    }
    
    const gasCost = gasPrice * gasWithBuffer;
    const gasCostInWCO = (Number(gasCost) / 1e18).toFixed(6);
    
    console.log(`Gas cost calculation: ${gasPrice} * ${gasWithBuffer} = ${gasCost} wei (${gasCostInWCO} WCO)`);
    
    return {
      estimatedGas,
      gasWithBuffer,
      gasPrice,
      gasCost,
      gasCostInWCO
    };
  } catch (error) {
    console.error('Gas estimation failed:', error);
    throw error;
  }
};

export const deploySmartContractWallet = async (name: string, privateKey: string) => {
  try {
    // Create a wallet from the private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    console.log(`Deploying wallet for account: ${account.address}`);
    console.log(`Wallet Factory address: ${contracts.walletFactory.address}`);
    console.log(`Wallet Implementation address: ${contracts.walletImplementation.address}`);
    
    // First, let's check if the contracts are actually deployed
    try {
      const factoryCode = await publicClient.getCode({
        address: contracts.walletFactory.address,
      });
      const implCode = await publicClient.getCode({
        address: contracts.walletImplementation.address,
      });
      
      console.log(`Factory contract code length: ${factoryCode?.length || 0}`);
      console.log(`Implementation contract code length: ${implCode?.length || 0}`);
      
      if (!factoryCode || factoryCode === '0x') {
        throw new Error(`WalletFactory contract not deployed at ${contracts.walletFactory.address}`);
      }
      if (!implCode || implCode === '0x') {
        throw new Error(`WalletImplementation contract not deployed at ${contracts.walletImplementation.address}`);
      }
      console.log('Contract deployment verification passed');
      
      console.log('Skipping factory implementation check due to TypeScript constraints');
      
    } catch (codeCheckError) {
      console.error('Contract deployment check failed:', codeCheckError);
      throw new Error(`Contract deployment verification failed: ${codeCheckError instanceof Error ? codeCheckError.message : 'Unknown error'}`);
    }
    
    // Get gas estimate
    const gasEstimate = await estimateWalletCreationGas(name, privateKey);
    const { gasWithBuffer, gasPrice, gasCost } = gasEstimate;
    
    // Check if the account has sufficient balance for gas
    const balance = await publicClient.getBalance({
      address: account.address,
    });
    
    console.log(`Account balance: ${balance} wei, Required gas cost: ${gasCost} wei`);
    
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
      data = encodeFunctionData({
        abi: contracts.walletFactory.abi,
        functionName: 'createWallet',
        args: [name],
      });
      console.log(`Encoded function data: ${data}`);
    } catch (error) {
      console.error('Failed to encode function data:', error);
      throw new Error(`Failed to encode function data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Validate data is properly encoded
    if (!data || typeof data !== 'string' || !data.startsWith('0x')) {
      throw new Error(`Invalid encoded data: ${data}`);
    }

    // Get the nonce for the account
    let nonce: number;
    try {
      nonce = await publicClient.getTransactionCount({
        address: account.address,
        blockTag: 'pending'
      });
      console.log(`Account nonce: ${nonce}`);
    } catch (error) {
      console.warn('Failed to get nonce from RPC, using 0:', error);
      nonce = 0; // Fallback to 0 if RPC call fails
    }
    
    // Ensure nonce is a valid number
    if (nonce === undefined || nonce === null || isNaN(nonce)) {
      nonce = 0;
      console.log(`Using fallback nonce: ${nonce}`);
    }

    // Create the transaction with proper gas estimation and EIP-1559 if available
    const transaction: any = {
      to: contracts.walletFactory.address,
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
    console.log(`Using legacy transaction: type=0x0, gasPrice=${gasPrice}`);

    // Debug: Log all transaction parameters to identify undefined values
    console.log('Transaction parameters:', {
      to: transaction.to,
      data: transaction.data,
      gas: transaction.gas,
      nonce: transaction.nonce,
      value: transaction.value,
      gasPrice: transaction.gasPrice,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
    });

    // Validate all required parameters are defined
    if (!transaction.to || !transaction.data || !transaction.gas || transaction.nonce === undefined || transaction.value === undefined) {
      throw new Error(`Invalid transaction parameters: to=${transaction.to}, data=${transaction.data}, gas=${transaction.gas}, nonce=${transaction.nonce}, value=${transaction.value}`);
    }

    // Skip walletClient approach due to RPC configuration issues
    // Use manual transaction signing for better control over RPC endpoint
    console.log('Using manual transaction signing with controlled RPC endpoint');
    const signedTransaction = await account.signTransaction(transaction);

    // Send the raw transaction
    const hash = await publicClient.sendRawTransaction({
      serializedTransaction: signedTransaction,
    });
    
    console.log(`Transaction sent via manual signing: ${hash}`);
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    console.log('Transaction receipt:', receipt);
    console.log('Transaction status:', receipt.status);
    console.log('Transaction logs:', receipt.logs);
    console.log('Number of logs:', receipt.logs.length);
    
    // Check if transaction was reverted
    if (receipt.status === 'reverted') {
      console.error('Transaction was reverted by the smart contract');
      console.error(`Gas used: ${receipt.gasUsed} out of ${gasWithBuffer} (${Number(receipt.gasUsed * 100n / gasWithBuffer)}% of limit)`);
      
      // Try to get the revert reason by simulating the transaction
      try {
        console.log('Attempting contract simulation to get revert reason...');
        const simulateResult = await publicClient.simulateContract({
          address: contracts.walletFactory.address,
          abi: contracts.walletFactory.abi,
          functionName: 'createWallet',
          args: [name],
          account: account.address,
        });
        console.log('Simulation succeeded unexpectedly:', simulateResult);
      } catch (simulateError) {
        console.error('Contract simulation error:', simulateError);
        
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
    console.error('Deployment failed:', error);
    throw error;
  }
};

const extractWalletAddress = (logs: any[]): string => {
  console.log('Extracting wallet address from logs...');
  
  // Log all events for debugging
  logs.forEach((log, index) => {
    console.log(`Log ${index}:`, {
      address: log.address,
      topics: log.topics,
      data: log.data
    });
  });
  
  // Find any event from the factory contract (WalletCreated event)
  const factoryEvent = logs.find(log => 
    log.address.toLowerCase() === contracts.walletFactory.address.toLowerCase()
  );
  
  if (factoryEvent) {
    console.log('Found factory event:', factoryEvent);
    
    if (factoryEvent.topics && factoryEvent.topics.length >= 2) {
      // The first topic is the event signature, second topic is the wallet address
      // Remove the 0x prefix and first 6 characters (0x000000000000000000000000) to get the address
      const walletAddress = `0x${factoryEvent.topics[1].slice(26)}`;
      console.log('Extracted wallet address:', walletAddress);
      return walletAddress;
    } else {
      console.error('Factory event found but topics are missing or insufficient:', factoryEvent);
    }
  } else {
    console.error('No factory event found. Expected factory address:', contracts.walletFactory.address);
    console.error('Available log addresses:', logs.map(log => log.address));
  }
  
  // Try alternative approach - look for any log with topics that might contain an address
  for (const log of logs) {
    if (log.topics && log.topics.length >= 2) {
      // Check if the second topic looks like an address (starts with 0x000000000000000000000000)
      const topic = log.topics[1];
      if (topic && topic.length === 66 && topic.startsWith('0x000000000000000000000000')) {
        const potentialAddress = `0x${topic.slice(26)}`;
        console.log('Found potential wallet address in log:', potentialAddress);
        return potentialAddress;
      }
    }
  }
  
  throw new Error('Wallet creation event not found in transaction logs');
};
