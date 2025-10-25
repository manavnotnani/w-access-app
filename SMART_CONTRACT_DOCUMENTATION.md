# W-Access Smart Contract Documentation

## Table of Contents
1. [Contract Overview](#contract-overview)
2. [Deployment Information](#deployment-information)
3. [Contract Specifications](#contract-specifications)
4. [ABI Documentation](#abi-documentation)
5. [Security Audit](#security-audit)
6. [Usage Examples](#usage-examples)
7. [Gas Optimization](#gas-optimization)
8. [Event Documentation](#event-documentation)

## Contract Overview

The W-Access platform consists of four main smart contracts deployed on both W-Chain Testnet and Mainnet:

1. **WalletFactory** - Creates new smart contract wallets using EIP-1167 minimal proxies
2. **WalletImplementation** - Core wallet functionality with advanced security features
3. **WNSRegistry** - Human-readable name service for wallet addresses
4. **RecoveryManager** - Manages social recovery processes and guardian coordination

## Deployment Information

### W-Chain Testnet (Chain ID: 71117)

| Contract | Address | Deployment Date | Gas Used | Transaction Hash |
|----------|---------|----------------|----------|-------------------|
| WalletFactory | `0x52d50D41FABB1A2C3434cA79d9a3963D9140C7De` | [Date] | [Gas] | [TxHash] |
| WalletImplementation | `0x440Df1c316041B15F08298Da6c267B38Dcd3aE7c` | [Date] | [Gas] | [TxHash] |
| WNSRegistry | `0x269ca8D0fB38Fe18435B2AC70911487ED340B2F3` | [Date] | [Gas] | [TxHash] |
| RecoveryManager | `0x7C2930C0AA1E7A17694EdF82e6d1Ae4E6ef3f607` | [Date] | [Gas] | [TxHash] |

### W-Chain Mainnet (Chain ID: 171717)

| Contract | Address | Deployment Date | Gas Used | Transaction Hash |
|----------|---------|----------------|----------|-------------------|
| WalletFactory | `0x440Df1c316041B15F08298Da6c267B38Dcd3aE7c` | [Date] | [Gas] | [TxHash] |
| WalletImplementation | `0x269ca8D0fB38Fe18435B2AC70911487ED340B2F3` | [Date] | [Gas] | [TxHash] |
| WNSRegistry | `0xbcBC65828Afea72b83C8a07666226d3319739b62` | [Date] | [Gas] | [TxHash] |
| RecoveryManager | `0x52d50D41FABB1A2C3434cA79d9a3963D9140C7De` | [Date] | [Gas] | [TxHash] |

### Network Configuration

**Testnet**:
- RPC URL: `https://rpc-testnet.w-chain.com`
- Explorer: `https://explorer.w-chain.com`
- Chain ID: 71117
- Currency: WETH

**Mainnet**:
- RPC URL: `https://rpc.w-chain.com`
- Explorer: `https://explorer.w-chain.com`
- Chain ID: 171717
- Currency: WETH

## Contract Specifications

### 1. WalletFactory Contract

**Purpose**: Creates new smart contract wallets using EIP-1167 minimal proxies for gas efficiency.

**Key Features**:
- Gas-efficient wallet creation using minimal proxies
- Deterministic address prediction
- Event emission for wallet creation tracking
- Owner and name initialization

**Core Functions**:

#### `createWallet(string calldata _name) external returns (address)`
Creates a new smart contract wallet with the specified name.

**Parameters**:
- `_name`: Human-readable name for the wallet (must not be empty)

**Returns**:
- `address`: The address of the newly created wallet

**Events**:
- `WalletCreated(address indexed wallet, address indexed owner, string name)`

**Gas Cost**: ~150,000 gas

#### `predictWalletAddress(string calldata _name, address _owner) external view returns (address)`
Predicts the address of a wallet that would be created with the given parameters.

**Parameters**:
- `_name`: The name for the wallet
- `_owner`: The owner address

**Returns**:
- `address`: The predicted wallet address

**Gas Cost**: View function (no gas)

### 2. WalletImplementation Contract

**Purpose**: Core wallet functionality with advanced security features including social recovery and batch transactions.

**Key Features**:
- EIP-1271 signature validation
- Social recovery system with guardian management
- Batch transaction execution
- Nonce-based transaction ordering
- Guardian management (up to 10 guardians)
- Recovery cooldown period (2 days)

**Core Functions**:

#### `execute(address dest, uint256 value, bytes calldata func, bytes calldata signature) external returns (bytes memory)`
Executes a single transaction from the wallet.

**Parameters**:
- `dest`: Destination address for the transaction
- `value`: ETH value to send (in wei)
- `func`: Encoded function call data
- `signature`: ECDSA signature from the wallet owner

**Returns**:
- `bytes memory`: Return data from the transaction

**Gas Cost**: Variable (depends on target contract)

#### `executeBatch(address[] calldata destinations, uint256[] calldata values, bytes[] calldata functionCalls, bytes calldata signature) external returns (bytes[] memory)`
Executes multiple transactions in a single batch.

**Parameters**:
- `destinations`: Array of destination addresses
- `values`: Array of ETH values to send
- `functionCalls`: Array of encoded function call data
- `signature`: ECDSA signature from the wallet owner

**Returns**:
- `bytes[] memory`: Array of return data from each transaction

**Gas Cost**: Variable (depends on batch size and target contracts)

#### `initiateRecovery(address newOwner) external`
Initiates the social recovery process to transfer ownership to a new address.

**Parameters**:
- `newOwner`: The address that will become the new owner

**Requirements**:
- Caller must be a guardian
- New owner must be different from current owner
- No active recovery process

**Gas Cost**: ~50,000 gas

#### `completeRecovery() external`
Completes the social recovery process after the cooldown period.

**Requirements**:
- Recovery must be initiated
- Cooldown period (2 days) must have elapsed
- Recovery must not be canceled

**Gas Cost**: ~30,000 gas

#### `addGuardian(address guardian) external`
Adds a new guardian to the wallet.

**Parameters**:
- `guardian`: Address to add as guardian

**Requirements**:
- Caller must be the wallet owner
- Guardian must not already be a guardian
- Maximum 10 guardians allowed

**Gas Cost**: ~40,000 gas

#### `removeGuardian(address guardian) external`
Removes a guardian from the wallet.

**Parameters**:
- `guardian`: Address to remove as guardian

**Requirements**:
- Caller must be the wallet owner
- Guardian must exist
- At least one guardian must remain

**Gas Cost**: ~35,000 gas

### 3. WNSRegistry Contract

**Purpose**: Human-readable name service for wallet addresses, similar to ENS but for W-Chain.

**Key Features**:
- Name registration and resolution
- Name-to-address mapping
- Name transfer between wallets
- Name availability checking
- Minimum 4 character names

**Core Functions**:

#### `registerName(string calldata _name, address _wallet) external`
Registers a human-readable name for a wallet address.

**Parameters**:
- `_name`: The name to register (minimum 4 characters)
- `_wallet`: The wallet address to associate with the name

**Requirements**:
- Name must be at least 4 characters
- Name must not already be taken
- Wallet address must be valid

**Gas Cost**: ~60,000 gas

#### `updateName(string calldata _newName) external`
Updates the name associated with the caller's wallet.

**Parameters**:
- `_newName`: The new name to register

**Requirements**:
- Caller must have a registered name
- New name must be available
- New name must be at least 4 characters

**Gas Cost**: ~50,000 gas

#### `transferName(address _newWallet) external`
Transfers the caller's name to a different wallet.

**Parameters**:
- `_newWallet`: The wallet to transfer the name to

**Requirements**:
- Caller must have a registered name
- New wallet must be different from current wallet
- New wallet must be valid

**Gas Cost**: ~45,000 gas

#### `isNameAvailable(string calldata _name) external view returns (bool)`
Checks if a name is available for registration.

**Parameters**:
- `_name`: The name to check

**Returns**:
- `bool`: True if name is available, false otherwise

**Gas Cost**: View function (no gas)

### 4. RecoveryManager Contract

**Purpose**: Manages social recovery processes and guardian coordination across multiple wallets.

**Key Features**:
- Guardian management for multiple wallets
- Recovery request handling
- Cooldown period enforcement (2 days)
- Recovery execution and cancellation
- Guardian validation

**Core Functions**:

#### `addGuardian(address wallet, address guardian) external`
Adds a guardian for a specific wallet.

**Parameters**:
- `wallet`: The wallet address
- `guardian`: The guardian address to add

**Requirements**:
- Caller must be the wallet owner
- Guardian must not already be a guardian
- Guardian cannot be the wallet owner

**Gas Cost**: ~45,000 gas

#### `initiateRecovery(address wallet, address newOwner) external`
Initiates recovery for a wallet.

**Parameters**:
- `wallet`: The wallet to recover
- `newOwner`: The new owner address

**Requirements**:
- Caller must be a guardian of the wallet
- New owner must be different from current owner
- No active recovery process

**Gas Cost**: ~55,000 gas

#### `completeRecovery(address wallet) external`
Completes the recovery process for a wallet.

**Parameters**:
- `wallet`: The wallet to complete recovery for

**Requirements**:
- Recovery must be initiated
- Cooldown period must have elapsed
- Recovery must not be canceled

**Gas Cost**: ~40,000 gas

## ABI Documentation

### WalletFactory ABI
```json
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_implementation",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "WalletCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "createWallet",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "predictWalletAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "walletImplementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

## Security Audit

### Security Features Implemented

1. **Signature Validation**: All transactions require valid ECDSA signatures
2. **Nonce Protection**: Prevents replay attacks with incrementing nonces
3. **Guardian System**: Multiple guardians for social recovery
4. **Cooldown Periods**: 2-day cooldown for recovery processes
5. **Input Validation**: All inputs are validated before processing
6. **Access Control**: Proper ownership and guardian checks

### Security Considerations

1. **Private Key Security**: Private keys are never stored on-chain
2. **Guardian Trust**: Guardians must be trusted parties
3. **Recovery Process**: 2-day cooldown prevents immediate recovery
4. **Signature Replay**: Nonce-based protection prevents signature reuse

### Audit Recommendations

1. Regular security audits of smart contracts
2. Guardian key management best practices
3. Recovery process documentation for users
4. Regular testing of recovery scenarios

## Usage Examples

### Creating a New Wallet

```javascript
// Connect to the factory contract
const factory = new ethers.Contract(
  factoryAddress,
  factoryABI,
  signer
);

// Create a new wallet
const tx = await factory.createWallet("MyWallet");
const receipt = await tx.wait();
const walletAddress = receipt.events[0].args.wallet;

console.log("New wallet created:", walletAddress);
```

### Executing a Transaction

```javascript
// Connect to the wallet contract
const wallet = new ethers.Contract(
  walletAddress,
  walletImplementationABI,
  provider
);

// Prepare transaction data
const to = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const value = ethers.utils.parseEther("0.1");
const data = "0x";

// Create transaction hash
const txHash = ethers.utils.solidityKeccak256(
  ["uint256", "address", "address", "uint256", "bytes", "uint256"],
  [chainId, walletAddress, to, value, data, nonce]
);

// Sign the transaction
const signature = await signer.signMessage(ethers.utils.arrayify(txHash));

// Execute the transaction
const tx = await wallet.execute(to, value, data, signature);
const receipt = await tx.wait();

console.log("Transaction executed:", receipt.transactionHash);
```

### Adding a Guardian

```javascript
// Connect to the wallet contract
const wallet = new ethers.Contract(
  walletAddress,
  walletImplementationABI,
  signer
);

// Add a guardian
const guardianAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const tx = await wallet.addGuardian(guardianAddress);
const receipt = await tx.wait();

console.log("Guardian added:", receipt.transactionHash);
```

### Registering a WNS Name

```javascript
// Connect to the WNS registry
const wnsRegistry = new ethers.Contract(
  wnsRegistryAddress,
  wnsRegistryABI,
  signer
);

// Register a name
const name = "mywallet";
const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const tx = await wnsRegistry.registerName(name, walletAddress);
const receipt = await tx.wait();

console.log("Name registered:", receipt.transactionHash);
```

## Gas Optimization

### Gas Costs Summary

| Operation | Gas Cost | Optimization |
|-----------|----------|--------------|
| Create Wallet | ~150,000 | EIP-1167 minimal proxy |
| Execute Transaction | Variable | Batch transactions |
| Add Guardian | ~40,000 | Efficient storage |
| Register Name | ~60,000 | Optimized mappings |
| Initiate Recovery | ~50,000 | Event-based logging |

### Optimization Techniques

1. **Minimal Proxies**: EIP-1167 for gas-efficient wallet creation
2. **Batch Operations**: Multiple transactions in single call
3. **Event Logging**: Efficient event emission
4. **Storage Optimization**: Packed structs and efficient mappings
5. **Function Optimization**: Inline assembly for critical operations

## Event Documentation

### WalletFactory Events

#### `WalletCreated`
```solidity
event WalletCreated(address indexed wallet, address indexed owner, string name);
```

**Emitted when**: A new wallet is created
**Parameters**:
- `wallet`: The address of the created wallet
- `owner`: The owner of the wallet
- `name`: The name of the wallet

### WalletImplementation Events

#### `Initialized`
```solidity
event Initialized(address indexed owner, string name);
```

**Emitted when**: A wallet is initialized
**Parameters**:
- `owner`: The owner of the wallet
- `name`: The name of the wallet

#### `ExecutionSuccess`
```solidity
event ExecutionSuccess(bytes32 indexed txHash, address indexed to, uint256 value);
```

**Emitted when**: A transaction is successfully executed
**Parameters**:
- `txHash`: The transaction hash
- `to`: The destination address
- `value`: The ETH value sent

#### `RecoveryInitiated`
```solidity
event RecoveryInitiated(address indexed newOwner, address indexed guardian);
```

**Emitted when**: Recovery is initiated
**Parameters**:
- `newOwner`: The new owner address
- `guardian`: The guardian who initiated recovery

### WNSRegistry Events

#### `NameRegistered`
```solidity
event NameRegistered(string indexed name, address indexed wallet);
```

**Emitted when**: A name is registered
**Parameters**:
- `name`: The registered name
- `wallet`: The wallet address

### RecoveryManager Events

#### `RecoveryInitiated`
```solidity
event RecoveryInitiated(address indexed wallet, address indexed newOwner, address indexed initiator, uint256 unlockTime);
```

**Emitted when**: Recovery is initiated
**Parameters**:
- `wallet`: The wallet address
- `newOwner`: The new owner address
- `initiator`: The guardian who initiated recovery
- `unlockTime`: The time when recovery can be completed

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Contract Version**: 1.0  
**Audit Status**: Pending
