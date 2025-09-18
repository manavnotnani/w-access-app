import { createWalletClient, createPublicClient, http, parseEther, formatEther, encodeFunctionData, getContract, keccak256, toHex, encodePacked } from "viem";
import { privateKeyToAccount, signMessage } from "viem/accounts";
import { activeChain } from "./eth";
import { contracts } from "./addresses";
import { walletService } from "./database";
import { KeyManagementService } from "./key-management";
import { FundingService } from "./funding";

export interface TransactionRequest {
  fromWalletId: string;
  toAddress: string;
  amount: string; // in WCO (will be converted to wei)
  gasLimit?: bigint;
}

export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  sponsored?: boolean;
  gasCost?: string;
}

export interface WalletBalance {
  address: string;
  balance: string; // in WCO
  balanceWei: bigint;
}

export class TransactionService {
  private static publicClient = createPublicClient({
    chain: activeChain,
    transport: http(),
  });

  /**
   * Get a reasonable gas price for transactions
   * Uses network gas price with reasonable caps to prevent excessive fees
   */
  private static async getReasonableGasPrice(): Promise<bigint> {
    try {
      const currentGasPrice = await this.publicClient.getGasPrice();
      
      // More reasonable caps based on typical gas prices
      const minGasPrice = parseEther("0.000000001"); // 1 gwei minimum
      const maxGasPrice = parseEther("0.000001"); // 1000 gwei maximum (increased from 100 gwei)
      
      let gasPrice = currentGasPrice;
      
      // Ensure minimum gas price to avoid "underpriced" errors
      if (gasPrice < minGasPrice) {
        console.warn(`Gas price too low (${Number(gasPrice) / 1e9} gwei), using minimum 1 gwei`);
        gasPrice = minGasPrice;
      }
      
      // Cap extremely high gas prices
      if (gasPrice > maxGasPrice) {
        console.warn(`Gas price too high (${Number(gasPrice) / 1e9} gwei), capping to 1000 gwei`);
        gasPrice = maxGasPrice;
      }
      
      // Add 10% buffer for safety
      const finalGasPrice = (gasPrice * 110n) / 100n;
      
      console.log('Gas price calculation:', {
        networkGasPrice: Number(currentGasPrice) / 1e9,
        finalGasPrice: Number(finalGasPrice) / 1e9,
        inGwei: Number(finalGasPrice) / 1e9
      });
      
      return finalGasPrice;
    } catch (error) {
      console.error("Error getting gas price:", error);
      // Fallback to a reasonable gas price
      return parseEther("0.00000001"); // 10 gwei fallback
    }
  }

  /**
   * Get gas price with retry logic for network issues
   */
  private static async getGasPriceWithRetry(maxRetries: number = 3): Promise<bigint> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getReasonableGasPrice();
      } catch (error) {
        console.warn(`Gas price attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          // Final fallback - use a higher gas price for this network
          return parseEther("0.0000001"); // 100 gwei fallback
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    return parseEther("0.0000001"); // 100 gwei
  }

  /**
   * Check if transaction should be sponsored based on gas cost
   */
  private static shouldSponsorTransaction(gasCost: bigint, walletBalance: bigint, transactionValue: bigint): boolean {
    const totalCost = gasCost + transactionValue;
    const gasCostInWCO = Number(formatEther(gasCost));
    
    // Sponsor if gas cost is more than 1 WCO (very expensive)
    const shouldSponsor = gasCostInWCO > 1.0;
    
    console.log('Sponsorship check:', {
      gasCostInWCO,
      walletBalance: formatEther(walletBalance),
      transactionValue: formatEther(transactionValue),
      totalCost: formatEther(totalCost),
      shouldSponsor
    });
    
    return shouldSponsor;
  }

  /**
   * Sponsor a transaction by funding the wallet with gas costs
   */
  private static async sponsorTransaction(walletAddress: string, gasCost: bigint): Promise<{ success: boolean; error?: string }> {
    try {
      const gasCostInWCO = formatEther(gasCost);
      console.log(`Sponsoring transaction for wallet ${walletAddress} with gas cost ${gasCostInWCO} WCO`);
      
      const result = await FundingService.fundWalletForGas(walletAddress, gasCostInWCO);
      
      if (result.success) {
        console.log(`Successfully sponsored transaction for wallet ${walletAddress}`);
        return { success: true };
      } else {
        console.error(`Failed to sponsor transaction: ${result.error}`);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error sponsoring transaction:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to sponsor transaction" 
      };
    }
  }

  /**
   * Get nonce from smart contract wallet
   */
  private static async getWalletNonce(walletAddress: string): Promise<bigint> {
    try {
      const nonce = await this.publicClient.readContract({
        address: walletAddress as `0x${string}`,
        abi: contracts.walletImplementation.abi,
        functionName: 'nonce',
        authorizationList: [],
      });
      return nonce as bigint;
    } catch (error) {
      console.error("Error getting wallet nonce:", error);
      throw new Error("Failed to get wallet nonce");
    }
  }

  /**
   * Generate signature for smart contract wallet execute function
   */
  private static async generateExecuteSignature(
    account: any,
    walletAddress: string,
    dest: string,
    value: bigint,
    func: string,
    nonce: bigint
  ): Promise<string> {
    try {
      // Create the transaction hash as per the smart contract
      // keccak256(abi.encodePacked(chainId, address(this), dest, value, func, nonce))
      const chainId = BigInt(activeChain.id);
      
      // Use viem's encodePacked to match Solidity's abi.encodePacked
      const packedData = encodePacked(
        ['uint256', 'address', 'address', 'uint256', 'bytes', 'uint256'],
        [chainId, walletAddress as `0x${string}`, dest as `0x${string}`, value, func as `0x${string}`, nonce]
      );

      // Create the transaction hash
      const txHash = keccak256(packedData);

      // Create wallet client for signing
      const walletClient = createWalletClient({
        account,
        chain: activeChain,
        transport: http(),
      });

      // Sign the transaction hash directly - viem will apply EIP-191 prefix
      const signature = await walletClient.signMessage({
        account,
        message: { raw: txHash }
      });

      console.log('Generated signature for execute function:', {
        chainId: chainId.toString(),
        walletAddress,
        dest,
        value: value.toString(),
        func,
        nonce: nonce.toString(),
        packedData,
        txHash,
        signature
      });

      return signature;
    } catch (error) {
      console.error("Error generating execute signature:", error);
      throw new Error("Failed to generate signature for smart contract wallet");
    }
  }

  /**
   * Get aggressive gas price for networks that require higher fees
   */
  private static async getAggressiveGasPrice(): Promise<bigint> {
    try {
      const currentGasPrice = await this.publicClient.getGasPrice();
      
      // For networks that require higher gas prices, use a more aggressive strategy
      const minGasPrice = parseEther("0.0000001"); // 100 gwei minimum
      const maxGasPrice = parseEther("0.00001"); // 10000 gwei maximum
      
      let gasPrice = currentGasPrice;
      
      // Ensure minimum gas price for high-fee networks
      if (gasPrice < minGasPrice) {
        console.warn(`Gas price too low (${Number(gasPrice) / 1e9} gwei), using minimum 100 gwei`);
        gasPrice = minGasPrice;
      }
      
      // Cap extremely high gas prices
      if (gasPrice > maxGasPrice) {
        console.warn(`Gas price too high (${Number(gasPrice) / 1e9} gwei), capping to 10000 gwei`);
        gasPrice = maxGasPrice;
      }
      
      // Add 20% buffer for high-fee networks
      const finalGasPrice = (gasPrice * 120n) / 100n;
      
      console.log('Aggressive gas price calculation:', {
        networkGasPrice: Number(currentGasPrice) / 1e9,
        finalGasPrice: Number(finalGasPrice) / 1e9,
        inGwei: Number(finalGasPrice) / 1e9
      });
      
      return finalGasPrice;
    } catch (error) {
      console.error("Error getting aggressive gas price:", error);
      // High fallback for networks that require high gas prices
      return parseEther("0.0000002"); // 200 gwei fallback
    }
  }

  /**
   * Get wallet balance
   */
  static async getWalletBalance(walletAddress: string): Promise<WalletBalance> {
    try {
      const balance = await this.publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });

      return {
        address: walletAddress,
        balance: formatEther(balance),
        balanceWei: balance,
      };
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      throw new Error(`Failed to get wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Estimate gas for a transaction
   */
  static async estimateGasForTransaction(
    fromAddress: string,
    toAddress: string,
    amount: string
  ): Promise<bigint> {
    try {
      const gasEstimate = await this.publicClient.estimateGas({
        account: fromAddress as `0x${string}`,
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
      });

      // Add 20% buffer for safety
      return (gasEstimate * 120n) / 100n;
    } catch (error) {
      console.error("Error estimating gas:", error);
      throw new Error(`Failed to estimate gas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send WCO tokens from wallet to another address
   * Uses smart contract wallet for proper transaction handling
   */
  static async sendTransaction(request: TransactionRequest): Promise<TransactionResult> {
    // Use the smart contract wallet implementation
    return await this.sendTransactionViaContract(request);
  }

  /**
   * Send transaction using smart contract wallet execute function
   */
  static async sendTransactionViaContract(request: TransactionRequest): Promise<TransactionResult> {
    try {
      // Get wallet from database
      const wallet = await walletService.getWalletById(request.fromWalletId);
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      // Get wallet private key
      const privateKey = await this.getWalletPrivateKey(wallet.id);
      if (!privateKey) {
        throw new Error("Unable to access wallet private key");
      }

      // Create wallet account
      const account = privateKeyToAccount(privateKey as `0x${string}`);
      const walletClient = createWalletClient({
        account,
        chain: activeChain,
        transport: http(),
      });

      // Get current balance of smart contract wallet (for transfer amount)
      const walletBalance = await this.getWalletBalance(wallet.address);
      const amountWei = parseEther(request.amount);

      // Get current balance of owner's account (for gas fees)
      const ownerBalance = await this.publicClient.getBalance({
        address: account.address as `0x${string}`
      });

      // Get current nonce from the smart contract
      const walletNonce = await this.getWalletNonce(wallet.address);
      
      // Generate signature for the execute function
      const signature = await this.generateExecuteSignature(
        account,
        wallet.address,
        request.toAddress,
        amountWei,
        '0x', // Empty function call data for simple transfer
        walletNonce
      );

      // Create the transaction data for the execute function
      const executeData = encodeFunctionData({
        abi: contracts.walletImplementation.abi,
        functionName: 'execute',
        args: [
          request.toAddress as `0x${string}`,
          amountWei,
          '0x', // Empty function call data for simple transfer
          signature, // Generated signature
        ],
      });

      // Estimate gas for the contract call (server will be sender)
      const gasEstimate = await this.publicClient.estimateGas({
        account: FundingService.getServerAddress() as `0x${string}`,
        to: wallet.address as `0x${string}`,
        data: executeData,
      });

      // Get aggressive gas price for this network that requires higher fees
      const gasPrice = await this.getAggressiveGasPrice();

      // Calculate total transaction cost
      const gasLimit = (gasEstimate * 120n) / 100n; // 20% buffer
      const totalGasCost = gasLimit * gasPrice;
      const totalCost = amountWei + totalGasCost;

      // Pre-check: Relayer/server has enough balance to pay gas
      try {
        const serverBalanceStr = await FundingService.getServerBalance();
        const serverBalanceWei = parseEther(serverBalanceStr);
        if (serverBalanceWei < totalGasCost) {
          const needed = formatEther(totalGasCost);
          const available = formatEther(serverBalanceWei);
          return {
            success: false,
            error: `Relayer has insufficient funds for gas. Required: ${needed} WCO, Available: ${available} WCO. Please top-up relayer or try again later.`,
          };
        }
      } catch (e) {
        console.warn('Unable to verify relayer balance, proceeding to attempt relay.', e);
      }

      // Check if transaction should be sponsored
      const shouldSponsor = this.shouldSponsorTransaction(totalGasCost, walletBalance.balanceWei, amountWei);
      
      if (shouldSponsor) {
        console.log("Transaction will be sponsored due to high gas costs");
        
        // Sponsor the transaction by funding the wallet
        const sponsorshipResult = await this.sponsorTransaction(wallet.address, totalGasCost);
        
        if (!sponsorshipResult.success) {
          return {
            success: false,
            error: `Unable to sponsor transaction: ${sponsorshipResult.error}. Please ensure you have sufficient balance for gas fees.`,
          };
        }
        
        // Wait a moment for the funding transaction to be confirmed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh wallet balance after sponsorship
        const updatedBalance = await this.getWalletBalance(wallet.address);
        
        // Check if wallet now has sufficient balance for transfer
        if (updatedBalance.balanceWei < amountWei) {
          return {
            success: false,
            error: `Insufficient balance even after sponsorship. Required: ${request.amount} WCO for transfer, Available: ${updatedBalance.balance} WCO`,
          };
        }
      } else {
        // Check if wallet has sufficient balance for the transfer
        if (walletBalance.balanceWei < amountWei) {
          return {
            success: false,
            error: `Insufficient balance for transfer. Required: ${request.amount} WCO, Available: ${walletBalance.balance} WCO`,
          };
        }
      }

      // No need for owner's gas balance when relaying; server sponsors gas

      // Relay via backend/server (server pays gas)
      console.log('Smart contract transaction details:', {
        from: FundingService.getServerAddress(),
        to: wallet.address,
        gasPrice: gasPrice.toString(),
        gasPriceInGwei: Number(gasPrice) / 1e9,
        gasLimit: gasLimit.toString(),
        sponsored: shouldSponsor,
        executeData: executeData
      });

      const relay = await FundingService.relayTransaction({
        to: wallet.address as `0x${string}`,
        data: executeData,
        gas: gasLimit,
        gasPrice,
      });

      if (!relay.success || !relay.transactionHash) {
        return { success: false, error: relay.error ?? 'Relayer failed to send transaction' };
      }
      const hash = relay.transactionHash as `0x${string}`;

      // Wait for confirmation
      await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        success: true,
        transactionHash: hash,
        sponsored: shouldSponsor,
        gasCost: formatEther(totalGasCost),
      };
    } catch (error) {
      console.error("Error sending transaction via contract:", error);
      
      // Handle specific error types
      let errorMessage = "Failed to send transaction";
      
      if (error instanceof Error) {
        if (error.message.includes("underpriced")) {
          errorMessage = "Transaction gas price too low. Please try again.";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient balance for transaction.";
        } else if (error.message.includes("nonce")) {
          errorMessage = "Transaction nonce error. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get wallet private key from secure key management
   */
  private static async getWalletPrivateKey(walletId: string): Promise<string | null> {
    try {
      // First try session storage
      let privateKey = KeyManagementService.getPrivateKey(walletId);
      
      if (!privateKey && KeyManagementService.hasEncryptedKeys(walletId)) {
        // If we have encrypted keys but no session, we need to prompt for PIN
        // This should be handled by the UI layer, which will call getKeysWithPin
        // and then retry the transaction
        throw new Error("PIN_REQUIRED");
      }
      
      if (!privateKey) {
        console.warn(`No private key found for wallet ${walletId}. Keys may have expired or not been stored.`);
        return null;
      }
      
      return privateKey;
    } catch (error) {
      if (error instanceof Error && error.message === "PIN_REQUIRED") {
        throw error; // Propagate PIN requirement to UI
      }
      console.error("Error retrieving wallet private key:", error);
      return null;
    }
  }

  /**
   * Authenticate with PIN and get private key
   */
  static async authenticateWithPin(walletId: string, pin: string): Promise<string | null> {
    try {
      const keys = await KeyManagementService.getKeysWithPin(walletId, pin);
      return keys?.privateKey || null;
    } catch (error) {
      console.error("Error authenticating with PIN:", error);
      return null;
    }
  }

  /**
   * Check if wallet requires PIN authentication
   */
  static requiresPinAuthentication(walletId: string): boolean {
    return !KeyManagementService.hasValidKeys(walletId) && KeyManagementService.hasEncryptedKeys(walletId);
  }

  /**
   * Get minimum balance requirements for a transaction
   */
  static async getMinimumBalanceRequirements(
    walletAddress: string, 
    amount: string
  ): Promise<{
    transactionValue: string;
    estimatedGasCost: string;
    totalRequired: string;
    willBeSponsored: boolean;
  }> {
    try {
      const amountWei = parseEther(amount);
      
      // Estimate gas
      const gasLimit = await this.estimateGasForTransaction(walletAddress, "0x0000000000000000000000000000000000000000", amount);
      
      // Get current gas price
      const gasPrice = await this.getAggressiveGasPrice();
      
      // Calculate costs
      const totalGasCost = gasLimit * gasPrice;
      const totalCost = amountWei + totalGasCost;
      
      // Check if it would be sponsored
      const walletBalance = await this.getWalletBalance(walletAddress);
      const shouldSponsor = this.shouldSponsorTransaction(totalGasCost, walletBalance.balanceWei, amountWei);
      
      return {
        transactionValue: amount,
        estimatedGasCost: formatEther(totalGasCost),
        totalRequired: shouldSponsor ? amount : formatEther(totalCost),
        willBeSponsored: shouldSponsor,
      };
    } catch (error) {
      console.error("Error calculating minimum balance requirements:", error);
      throw new Error("Failed to calculate minimum balance requirements");
    }
  }

  /**
   * Validate transaction parameters
   */
  static validateTransaction(request: TransactionRequest): { valid: boolean; error?: string } {
    if (!request.fromWalletId) {
      return { valid: false, error: "From wallet ID is required" };
    }

    if (!request.toAddress) {
      return { valid: false, error: "Recipient address is required" };
    }

    if (!request.amount || parseFloat(request.amount) <= 0) {
      return { valid: false, error: "Amount must be greater than 0" };
    }

    // Basic address validation
    if (!request.toAddress.startsWith('0x') || request.toAddress.length !== 42) {
      return { valid: false, error: "Invalid recipient address format" };
    }

    return { valid: true };
  }
}
