# Smart Contract Wallet Signature Fix

## Problem
The smart contract wallet was reverting with "execution reverted" error due to two issues:
1. Invalid signature generation (double-hashing the message)
2. Wrong transaction sender (using owner's address instead of wallet address)

## Root Cause
The smart contract wallet implements EIP-1271 signature validation and requires:
1. Transaction hash to be signed directly by the owner
2. Transaction to be sent from the smart contract wallet address
3. Gas fees to be paid by the owner's address

## Solution Implemented

### 1. Nonce Retrieval
```typescript
private static async getWalletNonce(walletAddress: string): Promise<bigint> {
  const nonce = await this.publicClient.readContract({
    address: walletAddress as `0x${string}`,
    abi: contracts.walletImplementation.abi,
    functionName: 'nonce',
    authorizationList: [],
  });
  return nonce as bigint;
}
```

### 2. Signature Generation
```typescript
private static async generateExecuteSignature(
  account: any,
  walletAddress: string,
  dest: string,
  value: bigint,
  func: string,
  nonce: bigint
): Promise<string> {
  // Create transaction hash as per smart contract
  const packedData = encodePacked(
    ['uint256', 'address', 'address', 'uint256', 'bytes', 'uint256'],
    [chainId, walletAddress, dest, value, func, nonce]
  );

  // Create the transaction hash
  const txHash = keccak256(packedData);

  // Sign the hash directly - viem will apply EIP-191 prefix
  const walletClient = createWalletClient({
    account,
    chain: activeChain,
    transport: http(),
  });

  return await walletClient.signMessage({
    account,
    message: { raw: txHash }
  });
}
```

### 3. Updated Transaction Flow
```typescript
// Get current nonce
const nonce = await this.getWalletNonce(wallet.address);

// Generate signature
const signature = await this.generateExecuteSignature(
  account,
  wallet.address,
  request.toAddress,
  amountWei,
  '0x',
  nonce
);

// Create execute function call with signature
const executeData = encodeFunctionData({
  abi: contracts.walletImplementation.abi,
  functionName: 'execute',
  args: [request.toAddress, amountWei, '0x', signature],
});

// Estimate gas using wallet address as sender
const gasEstimate = await this.publicClient.estimateGas({
  account: wallet.address, // Use wallet address as sender
  to: wallet.address,
  data: executeData,
});

// Send transaction using owner's address for gas payment
const transaction = {
  account: account.address, // Use owner's address to pay for gas
  to: wallet.address,
  data: executeData,
  gas: gasLimit,
  gasPrice,
};

const hash = await walletClient.sendTransaction(transaction);
```

## How It Works

### 1. Smart Contract Validation
The smart contract validates the signature:
```solidity
bytes32 txHash = keccak256(
  abi.encodePacked(
    block.chainid,
    address(this),
    dest,
    value,
    func,
    nonce++
  )
).toEthSignedMessageHash();

address signer = txHash.recover(signature);
require(signer == owner, "Invalid signature");
```

### 2. Transaction Flow
1. **Owner Signs**: Creates and signs transaction hash
2. **Gas Estimation**: Uses wallet address as sender
3. **Transaction Sending**: Uses owner's address for gas payment
4. **Smart Contract**: Validates signature and executes transfer

## Benefits

### Security
- **Owner Validation**: Only wallet owner can execute transactions
- **Nonce Protection**: Prevents replay attacks
- **EIP-1271 Compliance**: Standard signature validation

### Functionality
- **Proper Execution**: Transactions execute successfully
- **Gas Payment**: Owner pays gas fees from their account
- **Asset Movement**: WCO transfers from smart contract wallet
- **Explorer Accuracy**: Shows smart contract as sender

## Technical Details

### Hash Creation Process
1. **Pack Parameters**: Use viem's `encodePacked` to match Solidity
2. **Create Hash**: Single `keccak256` hash of packed data
3. **Sign Hash**: Let viem handle EIP-191 prefix

### Transaction Process
1. **Get Nonce**: Read current nonce from smart contract
2. **Generate Signature**: Owner signs transaction hash
3. **Estimate Gas**: Use wallet address as sender
4. **Send Transaction**: Owner's address pays gas fees
5. **Smart Contract**: Validates and executes

This fix ensures that smart contract wallet transactions work properly by:
1. Generating valid signatures that match the smart contract's validation
2. Using the correct addresses for transaction sending and gas payment
3. Maintaining proper security and functionality throughout the process
