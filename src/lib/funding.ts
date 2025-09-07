import { createWalletClient, http, parseEther, formatEther, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { activeChain } from "./eth";

// Server private key for funding wallets (should be stored securely in environment variables)
const SERVER_PRIVATE_KEY_RAW = import.meta.env.VITE_SERVER_PRIVATE_KEY;

// Validate and format the private key
const SERVER_PRIVATE_KEY = (() => {
  if (!SERVER_PRIVATE_KEY_RAW) {
    console.warn('VITE_SERVER_PRIVATE_KEY not found in environment variables');
    return "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  }
  
  // Ensure the private key starts with 0x
  const formattedKey = SERVER_PRIVATE_KEY_RAW.startsWith('0x') 
    ? SERVER_PRIVATE_KEY_RAW 
    : `0x${SERVER_PRIVATE_KEY_RAW}`;
  
  // Validate the length (should be 66 characters including 0x prefix)
  if (formattedKey.length !== 66) {
    console.error('Invalid private key length:', formattedKey.length);
    throw new Error('Invalid private key: must be 64 hex characters (32 bytes)');
  }
  
  return formattedKey;
})();

export interface FundingStatus {
  isFunded: boolean;
  balance: string;
  fundingAmount: string;
  error?: string;
}

export interface FundingResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class FundingService {
  private static serverAccount = (() => {
    try {
      return privateKeyToAccount(SERVER_PRIVATE_KEY as `0x${string}`);
    } catch (error) {
      console.error('Failed to create server account from private key:', error);
      throw new Error('Invalid server private key configuration');
    }
  })();
  
  private static serverWalletClient = createWalletClient({
    account: this.serverAccount,
    chain: activeChain,
    transport: http(activeChain.rpcUrls.default.http[0]),
  });
  
  private static publicClient = createPublicClient({
    chain: activeChain,
    transport: http(activeChain.rpcUrls.default.http[0]),
  });

  /**
   * Check server account balance
   */
  static async getServerBalance(): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: this.serverAccount.address,
      });
      return formatEther(balance);
    } catch (error) {
      console.error("Error getting server balance:", error);
      throw new Error("Failed to get server balance");
    }
  }

  /**
   * Check if server has sufficient balance for funding
   */
  static async hasSufficientBalance(fundingAmount: string = "0.32"): Promise<boolean> {
    try {
      const balance = await this.getServerBalance();
      const balanceInWei = parseEther(balance);
      const requiredAmount = parseEther(fundingAmount);
      
      // Reserve some amount for gas fees (0.001 WCO)
      const gasReserve = parseEther("0.001");
      const totalRequired = requiredAmount + gasReserve;
      
      return balanceInWei >= totalRequired;
    } catch (error) {
      console.error("Error checking server balance:", error);
      return false;
    }
  }

  /**
   * Get funding status for a wallet
   */
  static async getFundingStatus(walletAddress: string, fundingAmount: string = "0.32"): Promise<FundingStatus> {
    try {
      const serverBalance = await this.getServerBalance();
      const hasBalance = await this.hasSufficientBalance(fundingAmount);
      
      // Check if wallet already has sufficient funds
      const walletBalance = await this.publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });
      
      // Check if wallet has sufficient balance for the required funding amount
      const requiredAmount = parseEther(fundingAmount);
      const isFunded = walletBalance >= requiredAmount;
      
      return {
        isFunded,
        balance: serverBalance,
        fundingAmount,
        error: !hasBalance ? "Server account has insufficient balance for funding" : undefined
      };
    } catch (error) {
      console.error("Error getting funding status:", error);
      return {
        isFunded: false,
        balance: "0",
        fundingAmount,
        error: error instanceof Error ? error.message : "Failed to check funding status"
      };
    }
  }

  /**
   * Check if wallet is already funded with sufficient amount
   */
  static async isWalletFunded(walletAddress: string, requiredAmount: string): Promise<boolean> {
    try {
      const walletBalance = await this.publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });
      
      const requiredAmountInWei = parseEther(requiredAmount);
      return walletBalance >= requiredAmountInWei;
    } catch (error) {
      console.error("Error checking wallet funding status:", error);
      return false;
    }
  }

  /**
   * Fund a wallet with WCO tokens
   */
  static async fundWallet(walletAddress: string, amount: string = "0.32"): Promise<FundingResult> {
    try {
      // Check if server has sufficient balance
      const hasBalance = await this.hasSufficientBalance(amount);
    //   if (!hasBalance) {
    //     return {
    //       success: false,
    //       error: "Server account has insufficient balance for funding"
    //     };
    //   }

      // Get nonce for the transaction
      const nonce = await this.publicClient.getTransactionCount({
        address: this.serverAccount.address,
        blockTag: 'pending'
      });

      // Get gas price
      const gasPrice = await this.publicClient.getGasPrice();

      // Estimate gas
      const gasEstimate = await this.publicClient.estimateGas({
        account: this.serverAccount.address,
        to: walletAddress as `0x${string}`,
        value: parseEther(amount),
      });

      // Create raw transaction
      const transaction = {
        to: walletAddress as `0x${string}`,
        value: parseEther(amount),
        gas: gasEstimate,
        gasPrice,
        nonce,
      };

      // Sign and send transaction
      const signedTransaction = await this.serverAccount.signTransaction(transaction);
      const hash = await this.publicClient.sendRawTransaction({
        serializedTransaction: signedTransaction,
      });

      // Wait for transaction confirmation
      await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        success: true,
        transactionHash: hash
      };
    } catch (error) {
      console.error("Error funding wallet:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fund wallet"
      };
    }
  }

  /**
   * Fund a wallet with exact gas cost amount
   */
  static async fundWalletForGas(walletAddress: string, gasCostInWCO: string): Promise<FundingResult> {
    try {
      // Add a small buffer (10%) to the gas cost for safety
      const fundingAmount = (parseFloat(gasCostInWCO) * 1.1).toFixed(6);
      
      console.log(`Checking if wallet ${walletAddress} needs funding for gas cost ${gasCostInWCO} WCO`);
      
      // Check if wallet is already funded with sufficient amount
      const isAlreadyFunded = await this.isWalletFunded(walletAddress, fundingAmount);
      
      if (isAlreadyFunded) {
        console.log(`Wallet ${walletAddress} is already funded with sufficient amount (${fundingAmount} WCO)`);
        return {
          success: true,
          transactionHash: "already_funded" // Special identifier for already funded wallets
        };
      }
      
      console.log(`Funding wallet ${walletAddress} with ${fundingAmount} WCO for gas cost ${gasCostInWCO} WCO`);
      
      return await this.fundWallet(walletAddress, fundingAmount);
    } catch (error) {
      console.error("Error funding wallet for gas:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fund wallet for gas"
      };
    }
  }

  /**
   * Get server account address
   */
  static getServerAddress(): string {
    return this.serverAccount.address;
  }

  /**
   * Get minimum funding amount
   */
  static getMinimumFundingAmount(): string {
    return "0.32"; // 0.32 WCO
  }

  /**
   * Get recommended funding amount
   */
  static getRecommendedFundingAmount(): string {
    return "0.32"; // 0.32 WCO
  }
}
