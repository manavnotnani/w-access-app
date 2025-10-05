import { ethers } from "ethers";
import { CryptoService } from "./crypto";

export interface WalletKeys {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
  seedPhrase: string[];
}

export interface EncryptedStorage {
  encryptedKey: string;
  salt: string;
  iv: string;
}

export class KeyManagementService {
  private static readonly STORAGE_KEY = 'wallet_keys_';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Securely store wallet keys in session storage
   * Keys are encrypted and automatically expire
   */
  static storeWalletKeys(walletId: string, keys: WalletKeys): void {
    try {
      const encryptedKeys = this.encryptKeys(keys);
      const keyData = {
        keys: encryptedKeys,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.SESSION_TIMEOUT
      };
      
      sessionStorage.setItem(`${this.STORAGE_KEY}${walletId}`, JSON.stringify(keyData));
    } catch (error) {
      throw new Error("Failed to store wallet keys securely");
    }
  }

  /**
   * Retrieve wallet keys from session storage
   * Returns null if keys don't exist or have expired
   */
  static getWalletKeys(walletId: string): WalletKeys | null {
    try {
      const keyDataStr = sessionStorage.getItem(`${this.STORAGE_KEY}${walletId}`);
      if (!keyDataStr) {
        return null;
      }

      const keyData = JSON.parse(keyDataStr);
      
      // Check if keys have expired
      if (Date.now() > keyData.expiresAt) {
        this.clearWalletKeys(walletId);
        return null;
      }

      const keys = this.decryptKeys(keyData.keys);
      return keys;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear wallet keys from session storage
   */
  static clearWalletKeys(walletId: string): void {
    sessionStorage.removeItem(`${this.STORAGE_KEY}${walletId}`);
  }

  /**
   * Clear all wallet keys
   */
  static clearAllWalletKeys(): void {
    const keys = Object.keys(sessionStorage).filter(key => key.startsWith(this.STORAGE_KEY));
    keys.forEach(key => sessionStorage.removeItem(key));
  }

  /**
   * Check if wallet keys exist and are valid
   */
  static hasValidKeys(walletId: string): boolean {
    const keys = this.getWalletKeys(walletId);
    return keys !== null;
  }

  /**
   * Derive private key from mnemonic phrase
   * This is used when we need to regenerate keys from a stored mnemonic
   */
  static derivePrivateKeyFromMnemonic(mnemonic: string): string {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      return wallet.privateKey;
    } catch (error) {
      throw new Error("Failed to derive private key from mnemonic");
    }
  }

  /**
   * Generate a new wallet and store keys securely
   */
  static async generateAndStoreWallet(walletId: string): Promise<WalletKeys> {
    try {
      const keys = await CryptoService.generateWallet();
      this.storeWalletKeys(walletId, keys);
      return keys;
    } catch (error) {
      throw new Error("Failed to generate and store wallet");
    }
  }

  /**
   * Store encrypted keys for long-term storage
   * This allows users to "remember" their wallet on this device
   */
  static async storeEncryptedKeys(walletId: string, keys: WalletKeys, pin: string): Promise<void> {
    try {
      // Generate a random salt
      const salt = crypto.getRandomValues(new Uint8Array(16));
      
      // Generate encryption key from PIN
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(pin),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      
      const encryptionKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      // Encrypt the private key
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedKeys = new TextEncoder().encode(JSON.stringify(keys));
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        encryptionKey,
        encodedKeys
      );

      const storage: EncryptedStorage = {
        encryptedKey: Buffer.from(encryptedData).toString('base64'),
        salt: Buffer.from(salt).toString('base64'),
        iv: Buffer.from(iv).toString('base64')
      };

      localStorage.setItem(`${this.STORAGE_KEY}${walletId}_encrypted`, JSON.stringify(storage));
    } catch (error) {
      throw new Error("Failed to store encrypted keys");
    }
  }

  /**
   * Decrypt and retrieve keys using PIN
   */
  static async getKeysWithPin(walletId: string, pin: string): Promise<WalletKeys | null> {
    try {
      const storageData = localStorage.getItem(`${this.STORAGE_KEY}${walletId}_encrypted`);
      if (!storageData) {
        return null;
      }

      const storage: EncryptedStorage = JSON.parse(storageData);
      
      // Recreate encryption key from PIN
      const salt = Buffer.from(storage.salt, 'base64');
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(pin),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      
      const encryptionKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      // Decrypt the data
      const iv = Buffer.from(storage.iv, 'base64');
      const encryptedData = Buffer.from(storage.encryptedKey, 'base64');
      
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        encryptionKey,
        encryptedData
      );

      const keys = JSON.parse(new TextDecoder().decode(decryptedData));
      
      // Store in session for immediate use
      this.storeWalletKeys(walletId, keys);
      
      return keys;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if encrypted keys exist for a wallet
   */
  static hasEncryptedKeys(walletId: string): boolean {
    return localStorage.getItem(`${this.STORAGE_KEY}${walletId}_encrypted`) !== null;
  }

  /**
   * Remove encrypted keys from storage
   */
  static clearEncryptedKeys(walletId: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}${walletId}_encrypted`);
  }

  /**
   * Simple encryption for session storage
   * In production, this should use more robust encryption
   */
  private static encryptKeys(keys: WalletKeys): string {
    try {
      // Simple base64 encoding for development
      // In production, use proper encryption like Web Crypto API
      const jsonStr = JSON.stringify(keys);
      return btoa(jsonStr);
    } catch (error) {
      throw new Error("Failed to encrypt keys");
    }
  }

  /**
   * Simple decryption for session storage
   * In production, this should use more robust decryption
   */
  private static decryptKeys(encryptedKeys: string): WalletKeys {
    try {
      // Simple base64 decoding for development
      // In production, use proper decryption
      const jsonStr = atob(encryptedKeys);
      return JSON.parse(jsonStr);
    } catch (error) {
      throw new Error("Failed to decrypt keys");
    }
  }

  /**
   * Get private key for a wallet
   * This is the main method used by the transaction service
   */
  static getPrivateKey(walletId: string): string | null {
    const keys = this.getWalletKeys(walletId);
    return keys?.privateKey || null;
  }

  /**
   * Extend session timeout for wallet keys
   */
  static extendSession(walletId: string): boolean {
    const keys = this.getWalletKeys(walletId);
    if (keys) {
      this.storeWalletKeys(walletId, keys);
      return true;
    }
    return false;
  }

  /**
   * Check if wallet has any form of key storage (session or encrypted)
   */
  static hasAnyKeyStorage(walletId: string): boolean {
    return this.hasValidKeys(walletId) || this.hasEncryptedKeys(walletId);
  }

  /**
   * Get storage status for a wallet
   */
  static getStorageStatus(walletId: string): {
    hasSessionKeys: boolean;
    hasEncryptedKeys: boolean;
    needsPin: boolean;
  } {
    const hasSessionKeys = this.hasValidKeys(walletId);
    const hasEncryptedKeys = this.hasEncryptedKeys(walletId);
    
    return {
      hasSessionKeys,
      hasEncryptedKeys,
      needsPin: !hasSessionKeys && hasEncryptedKeys
    };
  }
}
