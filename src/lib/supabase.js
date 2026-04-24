import { createClient } from '@supabase/supabase-js'

// Credenciales de Supabase - Codeol Software Perú
// Primero intenta variables de entorno, luego usa valores por defecto
const DEFAULT_SUPABASE_URL = 'https://lqdkbibgsxuvlyqoaxmj.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGtiaWJnc3h1dmx5cW9heG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODE0ODMsImV4cCI6MjA5MjU1NzQ4M30.Vc9aCgaboY4hW_m6YJrtiBol25KWbMW-xpR8Qq7qKAQ'

// Soporta tanto VITE_ como NEXT_PUBLIC_ prefijos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    DEFAULT_SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                        import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                        DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl.startsWith('https://') && 
         supabaseAnonKey.length > 20
}
