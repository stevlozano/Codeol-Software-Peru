// Componente para migrar usuarios de localStorage a Supabase
// Usar solo una vez para migrar datos existentes

import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Database, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function MigrateToSupabase() {
  const [status, setStatus] = useState('idle') // idle, migrating, success, error
  const [results, setResults] = useState({ migrated: 0, errors: [] })
  const [error, setError] = useState('')

  const migrateUsers = async () => {
    setStatus('migrating')
    setError('')
    setResults({ migrated: 0, errors: [] })

    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado')
      setStatus('error')
      return
    }

    // Obtener usuarios de localStorage
    const localUsers = JSON.parse(localStorage.getItem('codeol-customers') || '[]')
    
    if (localUsers.length === 0) {
      setError('No hay usuarios en localStorage para migrar')
      setStatus('error')
      return
    }

    let migrated = 0
    const errors = []

    for (const user of localUsers) {
      try {
        // Verificar si el usuario ya existe en Supabase
        const { data: existing } = await supabase
          .from('customers')
          .select('email')
          .eq('email', user.email)
          .maybeSingle()

        if (existing) {
          errors.push(`${user.email}: Ya existe en Supabase`)
          continue
        }

        // Crear usuario en auth de Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password
        })

        if (authError) {
          errors.push(`${user.email}: ${authError.message}`)
          continue
        }

        // Insertar en tabla customers
        const { error: insertError } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono || '',
            password: user.password,
            referralCode: user.referralCode || `CODEOL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            createdAt: user.createdAt || new Date().toISOString()
          })

        if (insertError) {
          errors.push(`${user.email}: ${insertError.message}`)
          continue
        }

        migrated++
      } catch (err) {
        errors.push(`${user.email}: ${err.message}`)
      }
    }

    setResults({ migrated, errors })
    setStatus(migrated > 0 ? 'success' : 'error')
    
    if (migrated > 0) {
      // Limpiar localStorage después de migración exitosa
      localStorage.removeItem('codeol-customers')
      localStorage.removeItem('codeol-customer')
    }
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-pure-gray-900/80 border border-pure-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Database size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Migrar a Supabase</h1>
            <p className="text-pure-gray-400">
              Mueve tus usuarios de localStorage a la base de datos en la nube
            </p>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <div className="p-4 bg-pure-gray-800/50 rounded-xl text-sm text-pure-gray-300">
                <p className="mb-2"><strong>¿Qué hará esto?</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Migrar usuarios de localStorage a Supabase</li>
                  <li>Crear cuentas de auth para cada usuario</li>
                  <li>Los usuarios podrán iniciar sesión desde cualquier dispositivo</li>
                  <li>Los datos se sincronizarán en la nube</li>
                </ul>
              </div>

              <button
                onClick={migrateUsers}
                className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRight size={20} />
                Iniciar migración
              </button>
            </div>
          )}

          {status === 'migrating' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-pure-gray-700 border-t-pure-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-pure-gray-400">Migrando usuarios...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-emerald-400" />
                  <span className="font-semibold text-emerald-400">¡Migración completada!</span>
                </div>
                <p className="text-sm text-pure-gray-300">
                  {results.migrated} usuarios migrados exitosamente a Supabase.
                </p>
                {results.errors.length > 0 && (
                  <p className="text-sm text-pure-gray-400 mt-2">
                    {results.errors.length} usuarios omitidos (ya existían o tuvieron errores)
                  </p>
                )}
              </div>

              <a
                href="/login"
                className="block w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all text-center"
              >
                Ir al login
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={20} className="text-red-400" />
                  <span className="font-semibold text-red-400">Error</span>
                </div>
                <p className="text-sm text-pure-gray-300">{error}</p>
              </div>

              {results.errors.length > 0 && (
                <div className="p-4 bg-pure-gray-800/50 rounded-xl max-h-40 overflow-y-auto">
                  <p className="text-xs uppercase tracking-wider text-pure-gray-500 mb-2">Detalles:</p>
                  {results.errors.map((err, i) => (
                    <p key={i} className="text-xs text-pure-gray-400">• {err}</p>
                  ))}
                </div>
              )}

              <button
                onClick={() => setStatus('idle')}
                className="w-full py-4 bg-pure-gray-800 text-pure-white font-semibold rounded-xl hover:bg-pure-gray-700 transition-all"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
