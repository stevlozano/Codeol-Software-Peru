import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkSession()
  }, [navigate])

  const checkSession = async () => {
    if (!isSupabaseConfigured()) return
    
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      
      if (adminData) {
        navigate('/admin')
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado')
      setLoading(false)
      return
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      })
      
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()
      
      if (adminError || !adminData) {
        await supabase.auth.signOut()
        setError('Esta cuenta no tiene permisos de administrador')
        setLoading(false)
        return
      }
      
      navigate('/admin')
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pure-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-pure-gray-900 rounded-2xl p-8 border border-pure-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pure-white mb-2">Admin Panel</h1>
            <p className="text-pure-gray-400">Inicia sesión para acceder al dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-pure-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 bg-pure-gray-800 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="admin@codeol.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pure-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-pure-gray-800 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-pure-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
