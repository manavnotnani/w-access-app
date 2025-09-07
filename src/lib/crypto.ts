import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export interface WalletKeys {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
  seedPhrase: string[];
}

export interface KeyGenerationProgress {
  entropyGeneration: boolean;
  keyDerivation: boolean;
  securityValidation: boolean;
}

export class CryptoService {
  /**
   * Generate cryptographically secure entropy
   */
  private static generateEntropy(): Uint8Array {
    // Use Web Crypto API for secure random generation
    const entropy = new Uint8Array(32); // 256 bits for BIP39
    crypto.getRandomValues(entropy);
    return entropy;
  }

  /**
   * Generate a new wallet with proper cryptographic keys
   */
  static async generateWallet(): Promise<WalletKeys> {
    try {
      // Step 1: Generate entropy
      const entropy = this.generateEntropy();
      
      // Step 2: Create a random wallet using ethers
      const wallet = ethers.Wallet.createRandom();
      
      // Step 3: Get the mnemonic phrase
      const mnemonic = wallet.mnemonic?.phrase || '';
      
      // Step 4: Extract keys and address
      const privateKey = wallet.privateKey;
      const publicKey = wallet.publicKey || '';
      const address = wallet.address;
      
      // Step 5: Split mnemonic into words for display
      const seedPhrase = mnemonic.split(' ').filter(word => word.length > 0);
      
      return {
        mnemonic,
        privateKey,
        publicKey,
        address,
        seedPhrase
      };
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw new Error('Failed to generate secure wallet keys');
    }
  }

  /**
   * Validate a mnemonic phrase
   */
  static validateMnemonic(mnemonic: string): boolean {
    try {
      // Try to create a wallet from the mnemonic
      ethers.Wallet.fromPhrase(mnemonic);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Recover wallet from mnemonic
   */
  static async recoverWallet(mnemonic: string): Promise<WalletKeys> {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      
      return {
        mnemonic,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey || '',
        address: wallet.address,
        seedPhrase: mnemonic.split(' ')
      };
    } catch (error) {
      console.error('Error recovering wallet:', error);
      throw new Error('Failed to recover wallet from mnemonic');
    }
  }

  /**
   * Hash sensitive data for storage
   */
  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Encrypt private key for secure storage
   */
  static encryptPrivateKey(privateKey: string, password: string): string {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  }

  /**
   * Decrypt private key
   */
  static decryptPrivateKey(encryptedKey: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Verify wallet address format
   */
  static isValidAddress(address: string): boolean {
    try {
      ethers.getAddress(address);
      return true;
    } catch {
      return false;
    }
  }


} 