import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://lqdkbibgsxuvlyqoaxmj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGtiaWJnc3h1dmx5cW9heG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODcwMjUsImV4cCI6MjA1Mjk2MzAyNX0.s-ZW1Z3qnr6I4rf6u8UwdZKXEo3YbrGd8J5eR9RLCQ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'your_supabase_url' && supabaseAnonKey !== 'your_supabase_anon_key'
}
