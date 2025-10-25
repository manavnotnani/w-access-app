# Announcement Bar Features

## Current Functionality

### **Network Status Display**
- **Message**: "🚀 Now live on W-Chain [Network]!"
- **Network Badge**: Shows current network (MAINNET/TESTNET)
- **Always Visible**: Network indicator shows on both production and development

### **Network Switching**
- **Switch Button**: "Switch to [Opposite Network]"
- **Functionality**: Redirects to opposite network domain
- **Visibility**: Always shows when URLs are configured
- **Styling**: Yellow/orange gradient for prominence

### **Contract Information**
- **Contract Button**: "View W-Access Registry Contract"
- **Link**: Opens W-Chain scan in new tab
- **Responsive**: Shows "Contract" on mobile

## Network-Specific Behavior

### **Mainnet (w-access.xyz)**
- **Message**: "🚀 Now live on W-Chain Mainnet!"
- **Badge**: "MAINNET"
- **Switch Button**: "Switch to Testnet"
- **Redirects to**: `https://testnet.w-access.xyz`

### **Testnet (testnet.w-access.xyz)**
- **Message**: "🚀 Now live on W-Chain Testnet!"
- **Badge**: "TESTNET"
- **Switch Button**: "Switch to Mainnet"
- **Redirects to**: `https://w-access.xyz`

## Visual Design

### **Background**
- **Gradient**: Blue → Purple → Gold
- **Animation**: Subtle pulse effect
- **Position**: Fixed at top of page

### **Elements**
- **Sparkles Icon**: Animated pulse
- **Network Badge**: White background with rounded corners
- **Switch Button**: Yellow/orange gradient with hover effects
- **Contract Button**: White/transparent with hover effects

### **Responsive Design**
- **Desktop**: Full text labels
- **Mobile**: Shortened labels
- **Icons**: Consistent sizing across devices

## Environment Variables Required

### **For Network Switching to Work**
```env
VITE_TESTNET_URL=https://testnet.w-access.xyz
VITE_MAINNET_URL=https://w-access.xyz
```

### **Optional**
```env
VITE_NETWORK_TYPE=mainnet  # or "testnet"
```

## Testing Checklist

- [ ] Network status shows correctly
- [ ] Network badge displays current network
- [ ] Switch button appears on both domains
- [ ] Switch button redirects to correct domain
- [ ] Contract button opens W-Chain scan
- [ ] Responsive design works on mobile
- [ ] Animations work smoothly
- [ ] Hover effects work properly

## Troubleshooting

### **Switch Button Not Showing**
1. Check environment variables are set
2. Verify `VITE_TESTNET_URL` and `VITE_MAINNET_URL`
3. Check `shouldShowNetworkSwitcher()` function
4. Verify URLs are not empty or null

### **Network Status Incorrect**
1. Check `getCurrentNetwork()` function
2. Verify environment variable `VITE_NETWORK_TYPE`
3. Check localStorage for `w-chain-network`
4. Verify network detection logic

### **Redirect Not Working**
1. Check `getOppositeNetworkUrl()` function
2. Verify environment variables are set correctly
3. Test URLs manually in browser
4. Check for JavaScript errors in console

## Future Enhancements

### **Potential Additions**
- Network status indicator (online/offline)
- Gas price display
- Network latency indicator
- User preference persistence
- Network-specific announcements

### **Advanced Features**
- Network health monitoring
- Real-time gas price updates
- Network statistics display
- User network preferences
- Network-specific features
