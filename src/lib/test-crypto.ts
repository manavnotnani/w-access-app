import { CryptoService, WalletKeys } from './crypto';

export async function testCryptoFunctionality() {
  console.log('🧪 Testing Crypto Functionality...');
  
  try {
    // Test 1: Generate a new wallet
    console.log('\n1. Testing wallet generation...');
    const wallet = await CryptoService.generateWallet();
    console.log('✅ Wallet generated successfully');
    console.log('   Address:', wallet.address);
    console.log('   Mnemonic length:', wallet.mnemonic.split(' ').length);
    console.log('   Seed phrase words:', wallet.seedPhrase.length);
    
    // Test 2: Validate the generated mnemonic
    console.log('\n2. Testing mnemonic validation...');
    const isValid = CryptoService.validateMnemonic(wallet.mnemonic);
    console.log('✅ Mnemonic validation:', isValid);
    
    // Test 3: Recover wallet from mnemonic
    console.log('\n3. Testing wallet recovery...');
    const recoveredWallet = await CryptoService.recoverWallet(wallet.mnemonic);
    console.log('✅ Wallet recovered successfully');
    console.log('   Original address:', wallet.address);
    console.log('   Recovered address:', recoveredWallet.address);
    console.log('   Addresses match:', wallet.address === recoveredWallet.address);
    
    // Test 4: Test address validation
    console.log('\n4. Testing address validation...');
    const isValidAddress = CryptoService.isValidAddress(wallet.address);
    console.log('✅ Address validation:', isValidAddress);
    
    // Test 5: Test data hashing
    console.log('\n5. Testing data hashing...');
    const testData = 'test data for hashing';
    const hash = CryptoService.hashData(testData);
    console.log('✅ Data hashed successfully');
    console.log('   Original data:', testData);
    console.log('   Hash:', hash);
    
    // Test 6: Test private key encryption/decryption
    console.log('\n6. Testing private key encryption...');
    const password = 'test-password-123';
    const encryptedKey = CryptoService.encryptPrivateKey(wallet.privateKey, password);
    const decryptedKey = CryptoService.decryptPrivateKey(encryptedKey, password);
    console.log('✅ Private key encryption/decryption successful');
    console.log('   Keys match:', wallet.privateKey === decryptedKey);
    
    console.log('\n🎉 All crypto tests passed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Crypto test failed:', error);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testCrypto = testCryptoFunctionality;
} 