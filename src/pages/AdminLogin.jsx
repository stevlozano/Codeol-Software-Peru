import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function AdminLogin() {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [hasAdmin, setHasAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkSession()
    checkAdminExists()
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

  const checkAdminExists = async () => {
    if (!isSupabaseConfigured()) return
    
    const { count } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })
    
    setHasAdmin(count > 0)
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
      
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()
      
      if (!adminData) {
        await supabase.auth.signOut()
        setError('Esta cuenta no tiene permisos de administrador')
        setLoading(false)
        return
      }
      
      navigate('/admin')
    } catch (err) {
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado')
      setLoading(false)
      return
    }
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password
      })
      
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      
      if (!authData.user) {
        setError('Error al crear usuario')
        setLoading(false)
        return
      }
      
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          id: authData.user.id,
          nombre: registerData.nombre,
          email: registerData.email,
          created_at: new Date().toISOString()
        })
      
      if (insertError) {
        setError('Error al crear perfil de admin')
        setLoading(false)
        return
      }
      
      setSuccess('Admin registrado correctamente')
      setTimeout(() => navigate('/admin'), 1500)
    } catch (err) {
      setError('Error en el registro')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pure-black flex items-center justify-center">
      <div className="w-full h-screen">
        <div className="grid md:grid-cols-2 h-full">
          {/* Left Column - Logo */}
          <div className="bg-pure-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center border-r border-pure-gray-800 p-8">
            <div className="w-48 h-48 mb-8">
              <img 
                src="/images/logooriginal.png" 
                alt="CODEOL Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold text-pure-white mb-3 tracking-tight text-center">
              CODEOL
            </h1>
            <p className="text-pure-gray-400 text-base tracking-wide text-center">
              Software Perú
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="flex flex-col justify-center p-8 md:p-16">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-pure-white mb-3 tracking-tight">
                {showRegister ? 'Registrar Admin' : 'Admin Panel'}
              </h2>
              <p className="text-pure-gray-400 text-base tracking-wide">
                {showRegister ? 'Crea el primer administrador' : 'Acceso al panel de control'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {success}
              </div>
            )}

            {showRegister ? (
              <form onSubmit={handleRegister} className="space-y-5 max-w-md">
                <div>
                  <input
                    type="text"
                    value={registerData.nombre}
                    onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                    className="w-full px-5 py-4 bg-pure-gray-800/50 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-base"
                    placeholder="Nombre"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-pure-gray-800/50 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-base"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-5 py-4 bg-pure-gray-800/50 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-base"
                    placeholder="Contraseña"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg transition-all text-base tracking-wide disabled:opacity-50 mt-8"
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="w-full py-4 text-pure-gray-400 hover:text-pure-white transition-colors text-base"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5 max-w-md">
                <div>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-pure-gray-800/50 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-base"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-5 py-4 bg-pure-gray-800/50 border border-pure-gray-700 rounded-lg text-pure-white placeholder-pure-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all text-base"
                    placeholder="Contraseña"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg transition-all text-base tracking-wide disabled:opacity-50 mt-8"
                >
                  {loading ? 'Iniciando...' : 'Entrar'}
                </button>
                {!hasAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="w-full py-4 text-pure-gray-400 hover:text-pure-white transition-colors text-base"
                  >
                    Registrar primer admin
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
