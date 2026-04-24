import { createClient } from '@supabase/supabase-js'

// Estas variables deben configurarse en tu proyecto de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl.startsWith('https://') && 
         supabaseAnonKey.length > 20
}
