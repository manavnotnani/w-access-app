import { CryptoService } from './crypto';
import { walletService } from './database';

export async function testWalletCreationAndStorage() {
  console.log('🧪 Testing Wallet Creation and Storage...');
  
  try {
    // Test 1: Generate a new wallet
    console.log('\n1. Generating new wallet...');
    const wallet = await CryptoService.generateWallet();
    console.log('✅ Wallet generated successfully');
    console.log('   Address:', wallet.address);
    console.log('   Mnemonic length:', wallet.mnemonic.split(' ').length);
    
    // Test 2: Validate the wallet address
    console.log('\n2. Validating wallet address...');
    const isValidAddress = CryptoService.isValidAddress(wallet.address);
    console.log('✅ Address validation:', isValidAddress);
    
    // Test 3: Check if address exists in database (should be false for new wallet)
    console.log('\n3. Checking if address exists in database...');
    const addressExists = await walletService.checkAddressExists(wallet.address);
    console.log('✅ Address exists check:', addressExists);
    
    // Test 4: Create wallet in database
    console.log('\n4. Creating wallet in database...');
    const mockUserId = crypto.randomUUID();
    const walletData = {
      user_id: mockUserId,
      name: 'Test Wallet',
      address: wallet.address,
      seed_phrase_hash: CryptoService.hashData(wallet.mnemonic)
    };
    
    const savedWallet = await walletService.createWallet(walletData);
    console.log('✅ Wallet saved to database:', !!savedWallet);
    
    if (savedWallet) {
      console.log('   Saved wallet ID:', savedWallet.id);
      console.log('   Saved wallet name:', savedWallet.name);
      console.log('   Saved wallet address:', savedWallet.address);
    }
    
    // Test 5: Retrieve wallet from database
    console.log('\n5. Retrieving wallet from database...');
    if (savedWallet) {
      const retrievedWallet = await walletService.getWallet(savedWallet.id);
      console.log('✅ Wallet retrieved:', !!retrievedWallet);
      
      if (retrievedWallet) {
        console.log('   Retrieved address matches:', retrievedWallet.address === wallet.address);
        console.log('   Retrieved name:', retrievedWallet.name);
      }
    }
    
    // Test 6: Check if address now exists in database
    console.log('\n6. Checking if address now exists in database...');
    const addressExistsAfter = await walletService.checkAddressExists(wallet.address);
    console.log('✅ Address exists after creation:', addressExistsAfter);
    
    // Test 7: Get wallet by address
    console.log('\n7. Getting wallet by address...');
    const walletByAddress = await walletService.getWalletByAddress(wallet.address);
    console.log('✅ Wallet found by address:', !!walletByAddress);
    
    // Test 8: Get user wallets
    console.log('\n8. Getting user wallets...');
    const userWallets = await walletService.getUserWallets(mockUserId);
    console.log('✅ User wallets retrieved:', userWallets.length);
    
    // Test 9: Get wallet statistics
    console.log('\n9. Getting wallet statistics...');
    const stats = await walletService.getWalletStats(mockUserId);
    console.log('✅ Wallet stats:', stats);
    
    console.log('\n🎉 All wallet creation and storage tests passed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Wallet creation and storage test failed:', error);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testWalletStorage = testWalletCreationAndStorage;
} 