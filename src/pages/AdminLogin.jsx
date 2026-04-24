import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, UserPlus, LogIn, Eye, EyeOff, ArrowLeft, Download, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hasAdmin, setHasAdmin] = useState(false)
  
  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Check if already logged in and if admin exists
  useEffect(() => {
    checkSession()
    checkAdminExists()
    
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true
      if (isStandalone) {
        setIsInstalled(true)
      }
      return isStandalone
    }
    
    // If already in standalone mode, don't try to install
    if (checkInstalled()) return
    
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e)
      setIsInstallable(true)
    }
    
    // Check if we already captured the event globally (it fires early)
    if (window.deferredInstallPrompt) {
      setDeferredPrompt(window.deferredInstallPrompt)
      setIsInstallable(true)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [navigate])

  const checkSession = async () => {
    if (!isSupabaseConfigured()) return
    
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // Check if user is admin
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
    
    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado')
      return
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      })
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()
      
      if (adminError || !adminData) {
        await supabase.auth.signOut()
        setError('Esta cuenta no tiene permisos de administrador')
        return
      }
      
      // Set sessionStorage for AdminDashboard compatibility
      sessionStorage.setItem('codeol-admin-auth', 'true')
      navigate('/admin')
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado')
      return
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (hasAdmin) {
      setError('Ya existe una cuenta de administrador')
      return
    }
    
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password
      })
      
      if (authError) {
        setError(authError.message)
        return
      }
      
      // Step 2: Sign in to get active session (required for RLS policy)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: registerData.email,
        password: registerData.password
      })
      
      if (signInError) {
        setError('Error al iniciar sesión: ' + signInError.message)
        return
      }
      
      // Step 3: Create admin profile (now with active session)
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          id: authData.user.id,
          nombre: registerData.nombre,
          email: registerData.email,
          created_at: new Date().toISOString()
        })
      
      if (insertError) {
        setError('Error al crear perfil: ' + insertError.message)
        return
      }
      
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...')
      setTimeout(() => {
        sessionStorage.setItem('codeol-admin-auth', 'true')
        navigate('/admin')
      }, 1500)
    } catch (err) {
      setError('Error en el registro: ' + err.message)
    }
  }

  // Handle PWA install
  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsInstalled(true)
    } else {
      console.log('User dismissed the install prompt')
    }
    
    // Clear the prompt
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-pure-gray-900/80 backdrop-blur border border-pure-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-pure-gray-800 to-pure-gray-900 p-8 text-center">
            <div className="absolute top-4 left-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-pure-gray-400 hover:text-pure-white transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Volver
              </button>
            </div>
            
            <div className="w-20 h-20 bg-pure-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield size={40} className="text-pure-black" />
            </div>
            
            <h1 className="text-2xl font-bold mb-1">
              {isLogin ? 'Panel Administrativo' : 'Registro Admin'}
            </h1>
            <p className="text-pure-gray-400 text-sm">
              {isLogin ? 'Codeol Software Perú' : 'Crear cuenta de administrador'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* PWA Install Button - Solo mostrar si es instalable y no está instalada */}
            {isInstallable && !isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-400 mb-1">
                      Descarga la app
                    </p>
                    <p className="text-xs text-pure-gray-400 mb-3">
                      Instala CODEOL Admin como una aplicación real en tu dispositivo para acceso rápido sin necesidad de navegador.
                    </p>
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Instalar aplicación
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manual Install Instructions - Mostrar si no es instalable automáticamente */}
            {!isInstallable && !isInstalled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-400 mb-1">
                      Instala la app manualmente
                    </p>
                    <p className="text-xs text-pure-gray-400 mb-3">
                      Tu navegador no muestra el botón automático. Sigue estas instrucciones:
                    </p>
                    
                    {/* Android / Chrome */}
                    <div className="mb-3 p-3 bg-pure-gray-800/50 rounded-lg">
                      <p className="text-xs font-medium text-pure-white mb-1">📱 Android (Chrome):</p>
                      <ol className="text-xs text-pure-gray-400 list-decimal list-inside space-y-1">
                        <li>Toca el menú (⋮) arriba a la derecha</li>
                        <li>Selecciona "Agregar a pantalla de inicio"</li>
                        <li>Confirma "Agregar"</li>
                      </ol>
                    </div>
                    
                    {/* iOS / Safari */}
                    <div className="mb-3 p-3 bg-pure-gray-800/50 rounded-lg">
                      <p className="text-xs font-medium text-pure-white mb-1">🍎 iPhone/iPad (Safari):</p>
                      <ol className="text-xs text-pure-gray-400 list-decimal list-inside space-y-1">
                        <li>Toca el botón Compartir (⬆️)</li>
                        <li>Desplaza y toca "Agregar a pantalla de inicio"</li>
                        <li>Confirma "Agregar"</li>
                      </ol>
                    </div>
                    
                    {/* Desktop */}
                    <div className="p-3 bg-pure-gray-800/50 rounded-lg">
                      <p className="text-xs font-medium text-pure-white mb-1">💻 Computadora (Chrome/Edge):</p>
                      <ol className="text-xs text-pure-gray-400 list-decimal list-inside space-y-1">
                        <li>Mira el icono ➕ en la barra de direcciones</li>
                        <li>O presiona Ctrl+Shift+J y busca "Install"</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show if already installed */}
            {isInstalled && (
              <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                <Smartphone size={16} className="text-emerald-400" />
                <p className="text-sm text-emerald-400">
                  ✅ App instalada - Modo standalone activo
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex mb-6 bg-pure-gray-800 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                  isLogin 
                    ? 'bg-pure-white text-pure-black' 
                    : 'text-pure-gray-400 hover:text-pure-white'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                  !isLogin 
                    ? 'bg-pure-white text-pure-black' 
                    : 'text-pure-gray-400 hover:text-pure-white'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
              >
                <p className="text-emerald-400 text-sm text-center">{success}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <LogIn size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="admin@codeol.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-pure-gray-500 hover:text-pure-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <LogIn size={20} />
                  Iniciar sesión
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <UserPlus size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type="text"
                      value={registerData.nombre}
                      onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <LogIn size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="admin@codeol.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-pure-gray-500 hover:text-pure-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="Repite tu contraseña"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  Crear cuenta
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-pure-gray-500 hover:text-pure-white transition-colors text-sm"
                  >
                    ← Volver al login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-pure-gray-500 text-sm mt-6">
          Codeol Software Perú © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}
