# Network Testing Guide

This guide explains how to test the network switching functionality locally.

## How It Works Now

### 1. **Persistent Network Choice**
- When you switch networks, the choice is saved in `localStorage`
- The app remembers your network choice across page refreshes
- No need to manually switch networks on each page

### 2. **Automatic Network Detection**
- The app automatically detects which network to use on startup
- Priority: Environment Variable → localStorage → Default (testnet)

### 3. **Visual Network Indicator**
- In development mode, you'll see a network badge in the announcement bar
- Shows "TESTNET" or "MAINNET" to confirm which network is active

## Testing Steps

### **Step 1: Switch to Mainnet from Landing Page**
1. Go to the landing page (`/`)
2. Open browser console (F12)
3. Type: `setMainnet()`
4. Press Enter
5. Wait for page refresh
6. You should see "MAINNET" badge in the announcement bar

### **Step 2: Create Wallet with Mainnet**
1. Click "Create Wallet" button
2. Go through the wallet creation process
3. Check Network tab in DevTools
4. You should see requests to `rpc.w-chain.com` (mainnet RPC)
5. **No need to switch networks again!**

### **Step 3: Switch Back to Testnet**
1. Go back to landing page
2. In console, type: `setTestnet()`
3. Press Enter
4. Wait for page refresh
5. You should see "TESTNET" badge

### **Step 4: Verify Persistence**
1. Refresh the page
2. The network choice should persist
3. Go to create wallet - should use the same network

## Console Commands

```javascript
// Switch to mainnet
setMainnet()

// Switch to testnet  
setTestnet()

// Check current network
getCurrentNetwork()

// Check current chain ID
getCurrentChainId()

// Initialize network (runs automatically)
initializeNetwork()
```

## What Happens Behind the Scenes

1. **Network Switch**: Updates `localStorage` and `window.__W_CHAIN_ID__`
2. **Page Refresh**: Ensures all modules pick up the new network
3. **Persistence**: Network choice is remembered across sessions
4. **Dynamic Clients**: All blockchain calls use the correct network

## Production Behavior

In production (Vercel deployments):
- **Testnet deployment**: Always uses testnet (no switching)
- **Mainnet deployment**: Always uses mainnet (no switching)
- **Network switcher**: Redirects between subdomains

## Troubleshooting

### Network Not Switching
- Check console for errors
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R

### Still Seeing Testnet RPC
- Make sure you called `setMainnet()` and page refreshed
- Check the network badge shows "MAINNET"
- Verify localStorage has `w-chain-network: mainnet`

### Network Badge Not Showing
- Make sure you're in development mode
- Check `process.env.NODE_ENV === 'development'`

## Expected Network Calls

### Testnet
- RPC: `rpc-testnet.w-chain.com`
- Chain ID: 71117
- Contracts: Testnet addresses

### Mainnet  
- RPC: `rpc.w-chain.com`
- Chain ID: 171717
- Contracts: Mainnet addresses

The network switching now works seamlessly from the landing page and persists throughout your session! 🎉
