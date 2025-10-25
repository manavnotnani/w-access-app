# Domain Configuration Summary

## Current Setup

### **Mainnet Deployment**
- **Domain**: `https://w-access.xyz`
- **Vercel Project**: `w-chain-mainnet`
- **Environment Variables**:
  ```env
  VITE_NETWORK_TYPE=mainnet
  VITE_W_CHAIN_ID=171717
  VITE_TESTNET_URL=https://testnet.w-access.xyz
  VITE_MAINNET_URL=https://w-access.xyz
  VITE_SUPABASE_URL=<mainnet-supabase-url>
  VITE_SUPABASE_ANON_KEY=<mainnet-supabase-key>
  ZEPTO_ZOHO_TOKEN=<your-token>
  VITE_SERVER_PRIVATE_KEY=<your-key>
  VITE_W_CHAIN_RPC_URL=https://rpc.w-chain.com
  VITE_API_URL=https://w-access.xyz/api/send-email
  VITE_LOGO_URL=https://w-access.xyz/w-access-logo.svg
  ```

### **Testnet Deployment**
- **Domain**: `https://testnet.w-access.xyz`
- **Vercel Project**: `w-chain-testnet`
- **Environment Variables**:
  ```env
  VITE_NETWORK_TYPE=testnet
  VITE_W_CHAIN_ID=71117
  VITE_TESTNET_URL=https://testnet.w-access.xyz
  VITE_MAINNET_URL=https://w-access.xyz
  VITE_SUPABASE_URL=<testnet-supabase-url>
  VITE_SUPABASE_ANON_KEY=<testnet-supabase-key>
  ZEPTO_ZOHO_TOKEN=<your-token>
  VITE_SERVER_PRIVATE_KEY=<your-key>
  VITE_W_CHAIN_RPC_URL=https://rpc-testnet.w-chain.com
  VITE_API_URL=https://testnet.w-access.xyz/api/send-email
  VITE_LOGO_URL=https://testnet.w-access.xyz/w-access-logo.svg
  ```

## Network Switching Behavior

### **From Mainnet (w-access.xyz)**
- **Switch Button**: "Switch to Testnet"
- **Redirects to**: `https://testnet.w-access.xyz`

### **From Testnet (testnet.w-access.xyz)**
- **Switch Button**: "Switch to Mainnet"
- **Redirects to**: `https://w-access.xyz`

## Email Service Configuration

### **CORS Settings**
The email service (`api/send-email.js`) is configured to allow requests from:
- `https://w-access.xyz`
- `https://www.w-access.xyz`
- `https://testnet.w-access.xyz`
- `http://localhost:8080` (development)
- `http://localhost:3000` (development)

### **API Endpoints**
- **Mainnet**: `https://w-access.xyz/api/send-email`
- **Testnet**: `https://testnet.w-access.xyz/api/send-email`

## DNS Configuration

### **GoDaddy DNS Records**
```
Type: CNAME
Name: testnet
Value: cname.vercel-dns.com
TTL: 600

Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 600
```

## Testing Checklist

- [ ] Mainnet domain loads correctly
- [ ] Testnet domain loads correctly
- [ ] Network switching works in both directions
- [ ] Email service works on both domains
- [ ] SSL certificates are valid
- [ ] RPC calls use correct network
- [ ] Server balances show correct values

## Troubleshooting

### **Email Service Issues**
1. Check CORS configuration in `api/send-email.js`
2. Verify domain is in allowed origins
3. Check SSL certificate validity
4. Test API endpoint directly

### **Network Switching Issues**
1. Check environment variables
2. Verify `VITE_TESTNET_URL` and `VITE_MAINNET_URL`
3. Test localStorage persistence
4. Check console for errors

### **DNS Issues**
1. Wait for DNS propagation (up to 24 hours)
2. Check DNS records in GoDaddy
3. Verify CNAME records point to Vercel
4. Test domain resolution
