# Network Switcher Deployment Guide

This guide explains how to deploy your W-Chain application to both testnet and mainnet subdomains with network switching functionality.

## Overview

- **Same Codebase**: One repository, two deployments
- **Separate Data**: Each network uses different Supabase databases
- **Subdomain Setup**: `testnet.w-access.xyz` and `w-access.xyz`
- **Network Switching**: Users can switch between networks via the announcement bar

## Prerequisites

1. Domain with DNS access
2. Vercel account
3. Two Supabase projects (optional but recommended)

## Step 1: Prepare Supabase Projects (Optional)

### Create Testnet Database
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: `w-chain-testnet`
3. Note the URL and anon key
4. Run your database migrations

### Create Mainnet Database
1. Create another project: `w-chain-mainnet`
2. Note the URL and anon key
3. Run your database migrations

## Step 2: Deploy Testnet Version

### In Vercel Dashboard
1. Create new project
2. Connect to your GitHub repository
3. Project name: `w-chain-testnet`

### Environment Variables for Testnet
```
VITE_NETWORK_TYPE=testnet
VITE_W_CHAIN_ID=71117
VITE_TESTNET_URL=https://testnet.yourdomain.com
VITE_MAINNET_URL=https://mainnet.yourdomain.com
VITE_SUPABASE_URL=<testnet-supabase-url>
VITE_SUPABASE_ANON_KEY=<testnet-supabase-key>
ZEPTO_ZOHO_TOKEN=<your-token>
VITE_SERVER_PRIVATE_KEY=<your-key>
VITE_W_CHAIN_RPC_URL=https://rpc-testnet.w-chain.com
VITE_API_URL=https://testnet.w-access.xyz/api/send-email
VITE_LOGO_URL=https://testnet.w-access.xyz/w-access-logo.svg
```

### Deploy and Configure Domain
1. Deploy the project
2. Go to Settings → Domains
3. Add custom domain: `testnet.w-access.xyz`
4. Update DNS with the provided CNAME record

## Step 3: Deploy Mainnet Version

### In Vercel Dashboard
1. Create another new project
2. Connect to the **same** GitHub repository
3. Project name: `w-chain-mainnet`

### Environment Variables for Mainnet
```
VITE_NETWORK_TYPE=mainnet
VITE_W_CHAIN_ID=171717
VITE_TESTNET_URL=https://testnet.yourdomain.com
VITE_MAINNET_URL=https://mainnet.yourdomain.com
VITE_SUPABASE_URL=<mainnet-supabase-url>
VITE_SUPABASE_ANON_KEY=<mainnet-supabase-key>
ZEPTO_ZOHO_TOKEN=<your-token>
VITE_SERVER_PRIVATE_KEY=<your-key>
VITE_W_CHAIN_RPC_URL=https://rpc.w-chain.com
VITE_API_URL=https://w-access.xyz/api/send-email
VITE_LOGO_URL=https://w-access.xyz/w-access-logo.svg
```

### Deploy and Configure Domain
1. Deploy the project
2. Go to Settings → Domains
3. Add custom domain: `w-access.xyz`
4. Update DNS with the provided CNAME record

## Step 4: DNS Configuration

In your domain provider's DNS settings, add:

```
Type: CNAME
Name: testnet
Value: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: mainnet
Value: cname.vercel-dns.com
TTL: 3600
```

Wait 5-10 minutes for DNS propagation.

## Step 5: Email Service Configuration

### Email API Endpoints
Each deployment needs its own email API endpoint:

**Testnet Email API**: `https://testnet.yourdomain.com/api/send-email`
**Mainnet Email API**: `https://mainnet.yourdomain.com/api/send-email`

### Email Service Considerations

1. **Same ZeptoMail Token**: Both deployments can use the same `ZEPTO_ZOHO_TOKEN`
2. **Domain-Specific URLs**: Each deployment points to its own API endpoint
3. **CORS Configuration**: The `api/send-email.js` file needs to allow both domains

### Update Email API CORS Settings
**File: `api/send-email.js`**
Update the `allowedOrigins` array to include both domains:

```javascript
const allowedOrigins = [
  'https://testnet.yourdomain.com',
  'https://mainnet.yourdomain.com',
  'https://www.w-access.xyz',
  'https://w-access.xyz',
  // Add your actual domains here
];
```

## Step 6: Testing

### Test Testnet Deployment
1. Visit `https://testnet.yourdomain.com`
2. Verify announcement shows "Testnet"
3. **Test Email Functionality**:
   - Try to create a wallet with email recovery
   - Verify OTP emails are sent from testnet domain
   - Check email templates show correct branding
4. Create a test wallet
5. Click "Switch to Mainnet" button
6. Should redirect to mainnet URL

### Test Mainnet Deployment
1. Visit `https://mainnet.yourdomain.com`
2. Verify announcement shows "Mainnet"
3. **Test Email Functionality**:
   - Try to create a wallet with email recovery
   - Verify OTP emails are sent from mainnet domain
   - Check email templates show correct branding
4. Verify wallet data is separate (empty)
5. Click "Switch to Testnet" button
6. Should redirect to testnet URL

### Email Testing Checklist
- [ ] Testnet emails sent successfully
- [ ] Mainnet emails sent successfully
- [ ] Email templates show correct network branding
- [ ] Email links point to correct domain
- [ ] No CORS errors in browser console
- [ ] Email delivery rates are good

## How It Works

### Network Detection
- The app detects its network via `VITE_NETWORK_TYPE` environment variable
- Announcement bar shows current network name
- Network switcher only appears if both URLs are configured

### Data Isolation
- Each deployment uses different Supabase databases
- Wallet data is completely separate between networks
- Users must create wallets separately on each network

### Network Switching
- Users click the switcher button in the announcement bar
- App redirects to the opposite network's URL
- No data is shared between networks

## Maintenance

### Code Updates
- Any code changes automatically deploy to both networks
- No need to maintain separate codebases
- Just push to your main branch

### Environment Updates
- Update environment variables in both Vercel projects
- Redeploy if needed

## Troubleshooting

### Network Switcher Not Showing
- Check that both `VITE_MAINNET_URL` and `VITE_TESTNET_URL` are set
- Verify the URLs are accessible

### DNS Issues
- Wait for DNS propagation (up to 24 hours)
- Check CNAME records are correct
- Verify domain is properly configured in Vercel

### Data Not Isolated
- Ensure different Supabase projects are used
- Check environment variables are set correctly
- Verify database connections are separate

### Email Service Issues
- **CORS Errors**: Check that both domains are in `allowedOrigins` array
- **Email Not Sending**: Verify `ZEPTO_ZOHO_TOKEN` is set correctly
- **Wrong API Endpoint**: Check `VITE_API_URL` points to correct domain
- **Email Template Issues**: Verify `VITE_LOGO_URL` is accessible from both domains

### Testing Considerations

#### Email Testing
1. **Test with Real Email Addresses**: Use your own email for testing
2. **Check Spam Folders**: ZeptoMail emails might go to spam initially
3. **Monitor Email Delivery**: Check ZeptoMail dashboard for delivery stats
4. **Test Both Networks**: Ensure emails work on both testnet and mainnet

#### Wallet Testing
1. **Separate Wallets**: Create different wallets on each network
2. **Recovery Testing**: Test email recovery on both networks
3. **Transaction Testing**: Test transactions on both networks
4. **Data Isolation**: Verify no data leaks between networks

#### Performance Testing
1. **Load Testing**: Test both deployments under load
2. **Email Rate Limits**: Check ZeptoMail rate limits
3. **Database Performance**: Monitor Supabase performance on both projects
4. **CDN Performance**: Verify static assets load quickly on both domains

## Security Considerations

1. **Separate Databases**: Each network has its own Supabase project
2. **Environment Isolation**: Different API keys and secrets per network
3. **Domain Security**: Use HTTPS for both subdomains
4. **Data Privacy**: No cross-network data sharing

## Cost Considerations

- **Vercel**: Two projects (both on same plan)
- **Supabase**: Two projects (separate billing)
- **Domain**: One domain with subdomains (no additional cost)

This setup provides complete network isolation while maintaining a single codebase for easy maintenance.
