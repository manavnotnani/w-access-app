import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Wallet {
  id: string
  user_id: string
  name: string
  address: string
  seed_phrase_hash: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email?: string
  created_at: string
  updated_at: string
}

export interface RecoveryMethod {
  id: string
  user_id: string
  type: 'email' | 'phone' | 'backup_codes'
  value: string
  is_verified: boolean
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  notifications_enabled: boolean
  security_level: 'basic' | 'advanced'
  created_at: string
  updated_at: string
} 