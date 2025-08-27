-- Supabase Setup Script for W-Chain Gate Development
-- Run this in your Supabase SQL Editor to fix RLS policy issues

-- Option 1: Disable RLS for development (simplest approach)
ALTER TABLE wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_settings DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, use these development-friendly policies
-- (Uncomment the lines below and comment out Option 1 above)

-- -- Drop existing policies if they exist
-- DROP POLICY IF EXISTS "Allow all wallets operations for development" ON wallets;
-- DROP POLICY IF EXISTS "Allow all recovery methods operations for development" ON recovery_methods;
-- DROP POLICY IF EXISTS "Allow all wallet settings operations for development" ON wallet_settings;

-- -- Create development-friendly policies
-- CREATE POLICY "Allow all wallets operations for development" ON wallets
--   FOR ALL USING (true);

-- CREATE POLICY "Allow all recovery methods operations for development" ON recovery_methods
--   FOR ALL USING (true);

-- CREATE POLICY "Allow all wallet settings operations for development" ON wallet_settings
--   FOR ALL USING (true);

-- Verify the changes
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('wallets', 'recovery_methods', 'wallet_settings');

-- Show existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('wallets', 'recovery_methods', 'wallet_settings');

-- Test wallet creation (optional)
-- INSERT INTO wallets (name, address, seed_phrase_hash) 
-- VALUES ('test-wallet', '0x1234567890123456789012345678901234567890', 'test-hash')
-- ON CONFLICT (address) DO NOTHING; 