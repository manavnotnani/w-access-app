import { createPublicClient, http, getContract } from "viem";
import { getActiveChain, getContracts } from "./eth";
import { walletService } from "./database";

export interface NameResolutionResult {
  success: boolean;
  address?: string;
  error?: string;
}

export class NameResolutionService {
  private static getPublicClient() {
    return createPublicClient({
      chain: getActiveChain(),
      transport: http(),
    });
  }

  /**
   * Check if a name exists in the database
   */
  static async checkNameInDatabase(name: string): Promise<{ exists: boolean; wallet?: any }> {
    try {
      // Remove .w-chain suffix if present
      const cleanName = name.replace(/\.w-chain$/, '');
      
      // Get all wallets from current session
      const sessionWallets = await walletService.getWalletsBySession();
      
      // Also get all wallets from database (for debugging)
      const allWallets = await walletService.getAllWallets();
      
      // Check if name exists in database
      const isAvailable = await walletService.checkNameAvailability(cleanName);
      
      if (!isAvailable) {
        // Name exists, first try to find in session wallets
        let wallet = sessionWallets.find(w => w.name.toLowerCase() === cleanName.toLowerCase());
        
        // If not found in session, try all wallets
        if (!wallet) {
          wallet = allWallets.find(w => w.name.toLowerCase() === cleanName.toLowerCase());
        }
        
        if (wallet) {
          return {
            exists: true,
            wallet: wallet
          };
        } else {
          // Name exists in database but wallet not found (shouldn't happen)
          return { exists: false };
        }
      }
      
      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  }

  /**
   * Resolve a .w-chain name to an address
   */
  static async resolveName(name: string): Promise<NameResolutionResult> {
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

      // First, check if name exists in database
      const dbResult = await this.checkNameInDatabase(name);
      
      if (dbResult.exists && dbResult.wallet) {
        return {
          success: true,
          address: dbResult.wallet.address,
        };
      }

      // If not found in database, try blockchain
      const contracts = getContracts();
      const address = await this.getPublicClient().readContract({
        address: contracts.wnsRegistry.address,
        abi: contracts.wnsRegistry.abi,
        functionName: 'getNameOwner',
        args: [cleanName],
        authorizationList: [],
      } as any);


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
      const contracts = getContracts();
      const name = await this.getPublicClient().readContract({
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
      const contracts = getContracts();
      const isAvailable = await this.getPublicClient().readContract({
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
