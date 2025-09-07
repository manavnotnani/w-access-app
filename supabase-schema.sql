-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Wallets table (primary entity - no user authentication needed)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID DEFAULT uuid_generate_v4(), -- Auto-generated user ID
  session_id TEXT, -- Session identifier for wallet association
  name TEXT UNIQUE NOT NULL,
  address TEXT UNIQUE NOT NULL,
  seed_phrase_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery methods table (linked to wallets)
CREATE TABLE IF NOT EXISTS recovery_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'backup_codes')),
  value TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet settings table (linked to wallets)
CREATE TABLE IF NOT EXISTS wallet_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  security_level TEXT DEFAULT 'basic' CHECK (security_level IN ('basic', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_session_id ON wallets(session_id);
CREATE INDEX IF NOT EXISTS idx_wallets_name ON wallets(name);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_recovery_methods_wallet_id ON recovery_methods(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_settings_wallet_id ON wallet_settings(wallet_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_settings_updated_at BEFORE UPDATE ON wallet_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies - Simplified for wallet-centric approach
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_settings ENABLE ROW LEVEL SECURITY;

-- Development-friendly policies (allows all operations for development)
-- In production, these can be kept simple since wallets are the primary entities

-- Wallets policies - Allow all operations for development
CREATE POLICY "Allow all wallets operations for development" ON wallets
  FOR ALL USING (true);

-- Recovery methods policies - Allow all operations for development
CREATE POLICY "Allow all recovery methods operations for development" ON recovery_methods
  FOR ALL USING (true);

-- Wallet settings policies - Allow all operations for development
CREATE POLICY "Allow all wallet settings operations for development" ON wallet_settings
  FOR ALL USING (true);

-- Production-ready policies (commented out for development)
-- These can be simple since wallets are self-contained entities

-- -- Wallets policies
-- CREATE POLICY "Allow all wallet operations" ON wallets
--   FOR ALL USING (true);
-- 
-- -- Recovery methods policies
-- CREATE POLICY "Allow all recovery method operations" ON recovery_methods
--   FOR ALL USING (true);
-- 
-- -- Wallet settings policies
-- CREATE POLICY "Allow all wallet setting operations" ON wallet_settings
--   FOR ALL USING (true);

-- Public function to check wallet name availability
CREATE OR REPLACE FUNCTION check_wallet_name_availability(name_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM wallets WHERE name = name_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get wallet by address
CREATE OR REPLACE FUNCTION get_wallet_by_address(wallet_address TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  address TEXT,
  seed_phrase_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT w.id, w.user_id, w.name, w.address, w.seed_phrase_hash, w.created_at, w.updated_at
  FROM wallets w
  WHERE w.address = wallet_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 