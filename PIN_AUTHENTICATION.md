# PIN-Based Authentication System

This document explains the PIN-based authentication system implemented for secure wallet access without requiring users to input their private keys or mnemonics repeatedly.

## Overview

The system provides two levels of key storage:
1. **Session Storage**: Temporary storage (30 minutes) for immediate access
2. **Encrypted Storage**: Long-term storage encrypted with user PIN

## Key Components

### 1. KeyManagementService (`src/lib/key-management.ts`)

Enhanced with PIN-based encryption capabilities:

- `storeEncryptedKeys(walletId, keys, pin)`: Stores wallet keys encrypted with PIN
- `getKeysWithPin(walletId, pin)`: Decrypts and retrieves keys using PIN
- `hasEncryptedKeys(walletId)`: Checks if encrypted keys exist
- `getStorageStatus(walletId)`: Returns storage status information

### 2. TransactionService (`src/lib/transaction.ts`)

Updated to handle PIN authentication:

- `authenticateWithPin(walletId, pin)`: Authenticates with PIN and returns private key
- `requiresPinAuthentication(walletId)`: Checks if PIN is required
- Enhanced `getWalletPrivateKey()` to throw `PIN_REQUIRED` error when needed

### 3. UI Components

#### PinModal (`src/components/PinModal.tsx`)
- Secure PIN input with show/hide toggle
- Error handling and validation
- Loading states and user feedback

#### RememberDeviceModal (`src/components/RememberDeviceModal.tsx`)
- Optional device storage setup during wallet creation
- PIN creation and confirmation
- Clear explanation of security benefits

#### SendTransaction (`src/components/SendTransaction.tsx`)
- Integrated PIN authentication flow
- Automatic PIN prompt when needed
- Seamless transaction execution after authentication

## Security Features

### Encryption
- Uses Web Crypto API with AES-GCM encryption
- PBKDF2 key derivation with 100,000 iterations
- Random salt and IV for each encryption
- Keys never stored in plain text

### Session Management
- Session keys expire after 30 minutes
- Automatic cleanup of expired keys
- Session extension for active users

### User Experience
- PIN-only authentication (no private key/mnemonic input)
- Optional device storage during wallet creation
- Clear security explanations and warnings
- Fallback to session-only storage if PIN setup is skipped

## Usage Flow

### Wallet Creation
1. User creates wallet normally
2. After successful creation, "Remember Device" modal appears
3. User can choose to set up PIN-based storage
4. If chosen, user creates and confirms PIN
5. Keys are encrypted and stored locally

### Transaction Sending
1. User initiates transaction
2. System checks if PIN authentication is required
3. If required, PIN modal appears
4. User enters PIN to decrypt keys
5. Keys are stored in session for immediate use
6. Transaction proceeds normally

### Key Storage States
- **No Storage**: User must re-enter mnemonic
- **Session Only**: Keys stored temporarily (30 min)
- **Encrypted Storage**: Keys encrypted with PIN for long-term access
- **Both**: Session keys take precedence, encrypted as backup

## Security Considerations

1. **PIN Strength**: Minimum 4 characters (can be enhanced)
2. **Key Derivation**: Uses PBKDF2 with high iteration count
3. **Encryption**: AES-GCM with random IV for each encryption
4. **Storage**: Keys never stored in plain text
5. **Session Timeout**: Automatic cleanup prevents indefinite access
6. **Error Handling**: Graceful fallback if PIN authentication fails

## Future Enhancements

1. **Biometric Authentication**: Add fingerprint/face ID support
2. **Hardware Security**: Integration with hardware wallets
3. **Multi-Factor**: Additional authentication layers
4. **PIN Policies**: Configurable PIN requirements
5. **Session Management**: User-configurable session timeouts

## API Reference

### KeyManagementService

```typescript
// Store encrypted keys
await KeyManagementService.storeEncryptedKeys(walletId, keys, pin);

// Retrieve keys with PIN
const keys = await KeyManagementService.getKeysWithPin(walletId, pin);

// Check storage status
const status = KeyManagementService.getStorageStatus(walletId);
// Returns: { hasSessionKeys: boolean, hasEncryptedKeys: boolean, needsPin: boolean }
```

### TransactionService

```typescript
// Check if PIN is required
const needsPin = TransactionService.requiresPinAuthentication(walletId);

// Authenticate with PIN
const privateKey = await TransactionService.authenticateWithPin(walletId, pin);
```

This system provides a secure, user-friendly way to access wallet functionality without compromising security or requiring users to repeatedly enter sensitive information.
