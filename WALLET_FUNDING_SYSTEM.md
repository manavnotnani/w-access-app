# Wallet Funding System

This document describes the wallet funding system implemented in the W-Chain Gate application.

## Overview

The wallet funding system automatically funds newly created wallets with WCO tokens to make them immediately functional. This system uses a server-side private key to send initial funding to user wallets.

## Features

- **Automatic Funding**: Newly created wallets are automatically funded with a small amount of WCO tokens
- **Balance Checking**: Server account balance is monitored to ensure sufficient funds are available
- **Error Handling**: Clear error messages when funding fails due to insufficient server balance
- **User Feedback**: Real-time status updates and progress indicators during funding process

## Architecture

### Components

1. **FundingService** (`src/lib/funding.ts`)
   - Handles all funding-related operations
   - Manages server account balance checking
   - Executes funding transactions
   - Provides funding status information

2. **CompleteStep Component** (`src/components/wallet/CompleteStep.tsx`)
   - Displays funding status to users
   - Provides funding action button
   - Shows server balance and funding amount
   - Handles error states and user feedback

### Key Functions

#### FundingService Methods

- `getServerBalance()`: Gets current server account balance
- `hasSufficientBalance(amount)`: Checks if server has enough funds
- `getFundingStatus(walletAddress, amount)`: Gets comprehensive funding status
- `fundWallet(walletAddress, amount)`: Executes funding transaction
- `getServerAddress()`: Returns server account address
- `getMinimumFundingAmount()`: Returns minimum funding amount (0.01 WCO)
- `getRecommendedFundingAmount()`: Returns recommended funding amount (0.1 WCO)

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Private Key for Wallet Funding
# This should be a secure private key with sufficient WCO balance
VITE_SERVER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# W Chain Configuration
VITE_W_CHAIN_ID=71117
VITE_W_CHAIN_RPC_URL=https://rpc-testnet.w-chain.com
```

### Security Considerations

1. **Private Key Security**: The server private key should be stored securely and never committed to version control
2. **Balance Management**: Monitor server account balance regularly to ensure sufficient funds
3. **Access Control**: Limit access to the server private key to authorized personnel only
4. **Environment Separation**: Use different private keys for testnet and mainnet environments

## Usage

### For Users

1. Create a new wallet through the normal flow
2. On the "Complete" step, the system will automatically check funding status
3. If the wallet needs funding, click the "Fund Wallet" button
4. The system will send WCO tokens from the server account to the new wallet
5. Once funded, the wallet will show as "Funded" and ready to use

### For Developers

1. Set up the server private key in environment variables
2. Ensure the server account has sufficient WCO balance
3. The funding system will automatically activate for new wallet creation
4. Monitor server balance and refill as needed

## Error Handling

The system handles various error scenarios:

- **Insufficient Server Balance**: Shows clear error message to users
- **Network Issues**: Retries and shows appropriate error messages
- **Transaction Failures**: Provides detailed error information
- **Invalid Addresses**: Validates wallet addresses before funding

## Monitoring

### Server Balance Monitoring

- Check server balance regularly
- Set up alerts for low balance scenarios
- Maintain sufficient reserve for gas fees

### Transaction Monitoring

- Monitor funding transaction success rates
- Track gas usage and costs
- Log all funding activities for audit purposes

## Future Enhancements

1. **Dynamic Funding Amounts**: Allow configurable funding amounts based on user tier
2. **Multi-Currency Support**: Support funding with different tokens
3. **Batch Funding**: Optimize gas costs with batch transactions
4. **Analytics Dashboard**: Real-time monitoring of funding activities
5. **Auto-Refill**: Automatic server account refilling when balance is low

## Troubleshooting

### Common Issues

1. **"Server account has insufficient balance"**
   - Solution: Add more WCO tokens to the server account

2. **"Failed to fund wallet"**
   - Check network connectivity
   - Verify server private key is correct
   - Ensure sufficient gas for transaction

3. **"Invalid contract address deployed"**
   - Check smart contract deployment
   - Verify contract addresses in configuration

### Support

For technical support or questions about the funding system, please contact the development team or refer to the project documentation.
