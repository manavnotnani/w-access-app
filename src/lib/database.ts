import { supabase, Wallet, User, RecoveryMethod, UserSettings } from './supabase'

// Wallet operations
export const walletService = {
  // Check if wallet name is available
  async checkNameAvailability(name: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('wallets')
      .select('name')
      .eq('name', name)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking name availability:', error)
      return false
    }
    
    return !data // If no data found, name is available
  },

  // Create a new wallet
  async createWallet(walletData: Omit<Wallet, 'id' | 'created_at' | 'updated_at'>): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .insert([walletData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating wallet:', error)
      return null
    }
    
    return data
  },

  // Get user's wallets
  async getUserWallets(userId: string): Promise<Wallet[]> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user wallets:', error)
      return []
    }
    
    return data || []
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
  }
}

// User operations
export const userService = {
  // Create or get user
  async createUser(userData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], { onConflict: 'id' })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return null
    }
    
    return data
  },

  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
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

  // Get user's recovery methods
  async getUserRecoveryMethods(userId: string): Promise<RecoveryMethod[]> {
    const { data, error } = await supabase
      .from('recovery_methods')
      .select('*')
      .eq('user_id', userId)
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

// Settings operations
export const settingsService = {
  // Get user settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user settings:', error)
      return null
    }
    
    return data
  },

  // Create or update user settings
  async upsertUserSettings(settingsData: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert([settingsData], { onConflict: 'user_id' })
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting user settings:', error)
      return null
    }
    
    return data
  }
} 