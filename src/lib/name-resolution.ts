import { createPublicClient, http, getContract } from "viem";
import { activeChain } from "./eth";
import { contracts } from "./addresses";
import { walletService } from "./database";

export interface NameResolutionResult {
  success: boolean;
  address?: string;
  error?: string;
}

export class NameResolutionService {
  private static publicClient = createPublicClient({
    chain: activeChain,
    transport: http(),
  });

  /**
   * Check if a name exists in the database
   */
  static async checkNameInDatabase(name: string): Promise<{ exists: boolean; wallet?: any }> {
    try {
      // Remove .w-chain suffix if present
      const cleanName = name.replace(/\.w-chain$/, '');
      console.log("🔍 Checking database for name:", cleanName);
      
      // Get all wallets from current session
      const sessionWallets = await walletService.getWalletsBySession();
      console.log("📋 Available wallets in session:", sessionWallets.map(w => w.name));
      
      // Also get all wallets from database (for debugging)
      const allWallets = await walletService.getAllWallets();
      console.log("📋 All wallets in database:", allWallets.map(w => w.name));
      
      // Check if name exists in database
      const isAvailable = await walletService.checkNameAvailability(cleanName);
      console.log("❓ Is name available (should be false if exists):", isAvailable);
      
      if (!isAvailable) {
        // Name exists, first try to find in session wallets
        let wallet = sessionWallets.find(w => w.name.toLowerCase() === cleanName.toLowerCase());
        console.log("🎯 Found in session wallets:", wallet ? `${wallet.name} -> ${wallet.address}` : "Not found");
        
        // If not found in session, try all wallets
        if (!wallet) {
          wallet = allWallets.find(w => w.name.toLowerCase() === cleanName.toLowerCase());
          console.log("🎯 Found in all wallets:", wallet ? `${wallet.name} -> ${wallet.address}` : "Not found");
        }
        
        if (wallet) {
          return {
            exists: true,
            wallet: wallet
          };
        } else {
          // Name exists in database but wallet not found (shouldn't happen)
          console.log("⚠️ Name exists in database but wallet not found - this shouldn't happen");
          return { exists: false };
        }
      }
      
      console.log("❌ Name not found in database");
      return { exists: false };
    } catch (error) {
      console.error("❌ Error checking name in database:", error);
      return { exists: false };
    }
  }

  /**
   * Resolve a .w-chain name to an address
   */
  static async resolveName(name: string): Promise<NameResolutionResult> {
    try {
      console.log("🔍 Resolving name:", name);

      // Validate name format
      if (!this.isValidName(name)) {
        return {
          success: false,
          error: "Invalid name format. Must be a valid .w-chain name",
        };
      }

      // Remove .w-chain suffix if present
      const cleanName = name.replace(/\.w-chain$/, '');
      console.log("🧹 Clean name:", cleanName);

      // First, check if name exists in database
      console.log("🗄️ Checking database...");
      const dbResult = await this.checkNameInDatabase(name);
      
      if (dbResult.exists && dbResult.wallet) {
        console.log("✅ Found in database:", dbResult.wallet.address);
        return {
          success: true,
          address: dbResult.wallet.address,
        };
      }

      // If not found in database, try blockchain
      console.log("📋 Contract address:", contracts.wnsRegistry.address);
      console.log("🔗 RPC URL:", activeChain.rpcUrls.default.http[0]);
      console.log("📞 Calling contract...");
      
      const address = await this.publicClient.readContract({
        address: contracts.wnsRegistry.address,
        abi: contracts.wnsRegistry.abi,
        functionName: 'getNameOwner',
        args: [cleanName],
        authorizationList: [],
      } as any);

      console.log("📍 Resolved address from contract:", address);

      if (address === '0x0000000000000000000000000000000000000000') {
        return {
          success: false,
          error: `Name "${name}" is not registered or available`,
        };
      }

      return {
        success: true,
        address: address as string,
      };
    } catch (error) {
      console.error("❌ Error resolving name:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        success: false,
        error: `Failed to resolve name: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get the name associated with an address
   */
  static async getAddressName(address: string): Promise<NameResolutionResult> {
    try {
      // Validate address format
      if (!this.isValidAddress(address)) {
        return {
          success: false,
          error: "Invalid address format",
        };
      }

      // Call the WNS registry contract
      const name = await this.publicClient.readContract({
        address: contracts.wnsRegistry.address,
        abi: contracts.wnsRegistry.abi,
        functionName: 'getAddressName',
        args: [address as `0x${string}`],
        authorizationList: [],
      } as any);

      if (!name || name === '') {
        return {
          success: false,
          error: "No name registered for this address",
        };
      }

      return {
        success: true,
        address: name as string,
      };
    } catch (error) {
      console.error("Error getting address name:", error);
      return {
        success: false,
        error: `Failed to get address name: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if a name is available for registration
   */
  static async isNameAvailable(name: string): Promise<NameResolutionResult> {
    try {
      // Validate name format
      if (!this.isValidName(name)) {
        return {
          success: false,
          error: "Invalid name format. Must be a valid .w-chain name",
        };
      }

      // Remove .w-chain suffix if present
      const cleanName = name.replace(/\.w-chain$/, '');

      // Call the WNS registry contract
      const isAvailable = await this.publicClient.readContract({
        address: contracts.wnsRegistry.address,
        abi: contracts.wnsRegistry.abi,
        functionName: 'isNameAvailable',
        args: [cleanName],
        authorizationList: [],
      } as any);

      return {
        success: true,
        address: (isAvailable as boolean) ? "available" : "taken",
      };
    } catch (error) {
      console.error("Error checking name availability:", error);
      return {
        success: false,
        error: `Failed to check name availability: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Validate if input is a valid address or name
   */
  static async resolveInput(input: string): Promise<NameResolutionResult> {
    // Check if it's an address
    if (this.isValidAddress(input)) {
      return {
        success: true,
        address: input,
      };
    }

    // Check if it's a .w-chain name
    if (this.isValidName(input)) {
      return await this.resolveName(input);
    }

    // Try to resolve as a name without .w-chain suffix
    const nameWithSuffix = input.includes('.') ? input : `${input}.w-chain`;
    if (this.isValidName(nameWithSuffix)) {
      return await this.resolveName(nameWithSuffix);
    }

    return {
      success: false,
      error: "Invalid input format. Please enter a valid address or .w-chain name",
    };
  }

  /**
   * Validate name format
   */
  private static isValidName(name: string): boolean {
    // Remove .w-chain suffix for validation
    const cleanName = name.replace(/\.w-chain$/, '');
    
    // Check basic format: alphanumeric, hyphens, underscores, 3-63 characters
    const nameRegex = /^[a-zA-Z0-9_-]{3,63}$/;
    return nameRegex.test(cleanName);
  }

  /**
   * Validate address format
   */
  private static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Format name for display
   */
  static formatName(name: string): string {
    if (name.endsWith('.w-chain')) {
      return name;
    }
    return `${name}.w-chain`;
  }

  /**
   * Get display name for an address (either the registered name or truncated address)
   */
  static async getDisplayName(address: string): Promise<string> {
    const nameResult = await this.getAddressName(address);
    if (nameResult.success && nameResult.address) {
      return this.formatName(nameResult.address);
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
