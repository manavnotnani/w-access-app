import { supabase, Wallet, RecoveryMethod, WalletSettings } from './supabase'
import { walletSession } from './session'

// Development mode flag - set to true when Supabase is offline
const DEVELOPMENT_MODE = false

// Wallet operations
export const walletService = {
  // Check if wallet name is available
  async checkNameAvailability(name: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('wallets')
      .select('name')
      // Use case-insensitive comparison so names like "Alice" and "alice" are considered the same
      .ilike('name', name)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking name availability:', error)
      return false
    }
    
    return !data // If no data found, name is available
  },

  // Create a new wallet
  async createWallet(walletData: Omit<Wallet, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Wallet | null> {
    if (DEVELOPMENT_MODE) {
      // Development mode: skip session tracking
      console.log('Creating wallet without session tracking (Development mode)')
      
      const walletDataWithoutSession = {
        name: walletData.name,
        address: walletData.address,
        seed_phrase_hash: walletData.seed_phrase_hash
      }
      
      const { data, error } = await supabase
        .from('wallets')
        .insert([walletDataWithoutSession])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating wallet:', error)
        return null
      }
      
      return data
    } else {
      // Production mode: use session tracking
      const sessionId = walletSession.getSessionId()
      const walletWithSession = {
        ...walletData,
        session_id: sessionId
      }
      
      const { data, error } = await supabase
        .from('wallets')
        .insert([walletWithSession])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating wallet:', error)
        return null
      }
      
      return data
    }
  },

  // Get all wallets (for development/demo purposes)
  async getAllWallets(): Promise<Wallet[]> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching wallets:', error)
      return []
    }
    
    return data || []
  },

  // Get wallets for current session
  async getWalletsBySession(): Promise<Wallet[]> {
    if (DEVELOPMENT_MODE) {
      // Development mode: return all wallets
      console.log('Fetching all wallets (Development mode)')
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching wallets:', error)
        return []
      }
      
      return data || []
    } else {
      // Production mode: filter by session
      const sessionId = walletSession.getSessionId()
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching session wallets:', error)
        return []
      }
      
      return data || []
    }
  },

  // Get wallet by ID
  async getWallet(walletId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', walletId)
      .single()
    
    if (error) {
      console.error('Error fetching wallet:', error)
      return null
    }
    
    return data
  },

  // Get wallet by address
  async getWalletByAddress(address: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('address', address)
      .single()
    
    if (error) {
      console.error('Error fetching wallet by address:', error)
      return null
    }
    
    return data
  },

  // Check if wallet address exists
  async checkAddressExists(address: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('wallets')
      .select('address')
      .eq('address', address)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking address existence:', error)
      return false
    }
    
    return !!data
  },

  // Find wallets which have a verified recovery email matching the supplied email
  async getWalletsByRecoveryEmail(email: string): Promise<Pick<Wallet, 'id' | 'name' | 'address' | 'created_at'>[]> {
    // Join via RPC-like select to fetch referenced wallet rows
    const { data, error } = await supabase
      .from('recovery_methods')
      .select('wallets:wallet_id ( id, name, address, created_at )')
      .eq('type', 'email')
      .eq('value', email)
      .eq('is_verified', true)

    if (error) {
      console.error('Error fetching wallets by recovery email:', error)
      return []
    }

    const wallets = (data || []).map((row: any) => row.wallets).filter(Boolean)
    return wallets
  },

  // Re-associate given wallets to current session (so they appear in this browser)
  async rebindWalletsToCurrentSession(walletIds: string[]): Promise<boolean> {
    if (!walletIds || walletIds.length === 0) return true
    const sessionId = walletSession.getSessionId()
    const { error } = await supabase
      .from('wallets')
      .update({ session_id: sessionId })
      .in('id', walletIds)
    if (error) {
      console.error('Error rebinding wallets to session:', error)
      return false
    }
    return true
  },

  // Update wallet
  async updateWallet(walletId: string, updates: Partial<Wallet>): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .update(updates)
      .eq('id', walletId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating wallet:', error)
      return null
    }
    
    return data
  },

  // Delete wallet
  async deleteWallet(walletId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', walletId)
    
    if (error) {
      console.error('Error deleting wallet:', error)
      return false
    }
    
    return true
  },

  // Get wallet statistics
  async getWalletStats(): Promise<{ total: number; active: number }> {
    const { data, error } = await supabase
      .from('wallets')
      .select('id')
    
    if (error) {
      console.error('Error fetching wallet stats:', error)
      return { total: 0, active: 0 }
    }
    
    return {
      total: data?.length || 0,
      active: data?.length || 0 // Assuming all wallets are active
    }
  }
}

// Recovery methods operations
export const recoveryService = {
  // Add recovery method
  async addRecoveryMethod(recoveryData: Omit<RecoveryMethod, 'id' | 'created_at'>): Promise<RecoveryMethod | null> {
    const { data, error } = await supabase
      .from('recovery_methods')
      .insert([recoveryData])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding recovery method:', error)
      return null
    }
    
    return data
  },

  // Get wallet's recovery methods
  async getWalletRecoveryMethods(walletId: string): Promise<RecoveryMethod[]> {
    const { data, error } = await supabase
      .from('recovery_methods')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching recovery methods:', error)
      return []
    }
    
    return data || []
  },

  // Verify recovery method
  async verifyRecoveryMethod(methodId: string): Promise<boolean> {
    const { error } = await supabase
      .from('recovery_methods')
      .update({ is_verified: true })
      .eq('id', methodId)
    
    if (error) {
      console.error('Error verifying recovery method:', error)
      return false
    }
    
    return true
  }
}

// Wallet settings operations
export const settingsService = {
  // Get wallet settings
  async getWalletSettings(walletId: string): Promise<WalletSettings | null> {
    const { data, error } = await supabase
      .from('wallet_settings')
      .select('*')
      .eq('wallet_id', walletId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching wallet settings:', error)
      return null
    }
    
    return data
  },

  // Create or update wallet settings
  async upsertWalletSettings(settingsData: Omit<WalletSettings, 'id' | 'created_at' | 'updated_at'>): Promise<WalletSettings | null> {
    const { data, error } = await supabase
      .from('wallet_settings')
      .upsert([settingsData], { onConflict: 'wallet_id' })
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting wallet settings:', error)
      return null
    }
    
    return data
  }
} 