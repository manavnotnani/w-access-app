import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('wallets')
      .select('count')
      .limit(1)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err }
  }
} 