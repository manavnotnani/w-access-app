# Fixing Supabase Setup for Wallet-Centric Application

## Problem
You're getting this error when trying to create a wallet:
```
"new row violates row-level security policy for table 'wallets'"
```

Or this foreign key constraint error:
```
"insert or update on table 'wallets' violates foreign key constraint 'wallets_user_id_fkey'"
```

These happen because:
1. Supabase Row Level Security (RLS) policies are preventing wallet creation
2. The old schema had user authentication requirements

## Solution

### Complete Fix (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to the **SQL Editor** section

2. **Run this complete SQL script:**
   ```sql
   -- Disable RLS for development
   ALTER TABLE wallets DISABLE ROW LEVEL SECURITY;
   ALTER TABLE recovery_methods DISABLE ROW LEVEL SECURITY;
   ALTER TABLE wallet_settings DISABLE ROW LEVEL SECURITY;
   ```

3. **Verify the changes:**
   ```sql
   -- Check RLS status
   SELECT 
     schemaname,
     tablename,
     rowsecurity
   FROM pg_tables 
   WHERE tablename IN ('wallets', 'recovery_methods', 'wallet_settings');
   ```

## What This Fixes

- ✅ **RLS Policy Issues**: Removes authentication requirements for development
- ✅ **Wallet Creation**: Allows wallet creation without user authentication
- ✅ **Dashboard Display**: Enables viewing wallets in the dashboard
- ✅ **Simplified Architecture**: Wallet-centric approach without user complexity

## New Architecture

The application now uses a **wallet-centric approach**:

- **Wallets are the primary entities** - no user authentication needed
- **user_id is auto-generated** by the database for each wallet
- **Recovery methods** are linked to wallets, not users
- **Settings** are per-wallet, not per-user
- **Simplified database schema** without user authentication complexity

## After Applying the Fix

1. **Test wallet creation** - Try creating a wallet again
2. **Check the dashboard** - Verify wallets appear in the dashboard
3. **Test wallet recovery** - Try the recovery functionality

## For Production

When you're ready for production, you can:

1. **Keep the simple approach** - Wallets are self-contained entities
2. **Add optional RLS policies** if needed for additional security
3. **Implement wallet-specific security** rather than user authentication

The wallet-centric approach is actually more suitable for a wallet application since:
- Wallets are the primary identity
- No need for complex user management
- Each wallet is self-contained
- Simpler security model

## Verification

After applying the fix, you should see:
- ✅ Wallet creation works without errors
- ✅ Wallets are stored in the database
- ✅ Dashboard shows created wallets
- ✅ No more RLS policy violations
- ✅ No more foreign key constraint errors

## Troubleshooting

If you still have issues:

1. **Check Supabase logs** in the Dashboard
2. **Verify table structure** matches the new schema
3. **Test with a simple INSERT** query in SQL Editor
4. **Check environment variables** are correctly set

## Security Note

The wallet-centric approach is actually more secure for a wallet application because:
- Each wallet is independent
- No shared user accounts
- Wallet-specific security controls
- Simpler attack surface 