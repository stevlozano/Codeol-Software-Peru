import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, LogIn, Eye, EyeOff, ArrowLeft, Crown, Gift, History, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const { login, register, isLoggedIn } = useCustomerAuth()
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })

  // Check if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/mi-cuenta')
    }
  }, [isLoggedIn, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    const result = await login(loginData.email, loginData.password)
    
    setIsLoading(false)
    if (result.success) {
      navigate('/mi-cuenta')
    } else {
      setError(result.error)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }
    
    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }
    
    const result = await register({
      nombre: registerData.nombre,
      email: registerData.email,
      telefono: registerData.telefono,
      password: registerData.password
    })
    
    setIsLoading(false)
    if (result.success) {
      setSuccess('¡Bienvenido a la Familia CODEOL!')
      setTimeout(() => {
        navigate('/mi-cuenta')
      }, 1500)
    } else {
      setError(result.error)
    }
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
        className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left side - Benefits */}
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <Crown size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Únete a la <span className="text-emerald-400">Familia CODEOL</span>
            </h1>
            <p className="text-xl text-pure-gray-400">
              Software Perú - Donde tu éxito es nuestro compromiso
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Gift size={24} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Descuentos Exclusivos</h3>
                <p className="text-pure-gray-400">Hasta 15% de descuento por fidelidad en todos nuestros servicios</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <History size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Historial de Compras</h3>
                <p className="text-pure-gray-400">Todas tus órdenes en un solo lugar con seguimiento en tiempo real</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Star size={24} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Niveles VIP</h3>
                <p className="text-pure-gray-400">Bronce → Plata → Oro. Más compras, más beneficios exclusivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="bg-pure-gray-900/80 backdrop-blur border border-pure-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-pure-gray-800 to-pure-gray-900 p-8 text-center">
            <div className="absolute top-4 left-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-pure-gray-400 hover:text-pure-white transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Volver
              </Link>
            </div>
            
            <div className="w-16 h-16 bg-pure-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown size={28} className="text-pure-black" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h2>
            <p className="text-pure-gray-400 text-sm">
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Únete a la Familia CODEOL'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
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
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 pr-12 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
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
                  disabled={isLoading}
                  className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-pure-black/30 border-t-pure-black rounded-full animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Iniciar sesión
                    </>
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-pure-gray-500 text-sm mb-2">¿No tienes cuenta?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false)
                      setError('')
                    }}
                    className="text-pure-white hover:text-pure-gray-300 transition-colors text-sm font-medium"
                  >
                    Crear cuenta gratis →
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={registerData.nombre}
                      onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                      className="w-full px-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={registerData.telefono}
                      onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                      className="w-full px-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="+51 999 999 999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full px-4 pr-10 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                      Confirmar
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-4 bg-pure-black border border-pure-gray-700 rounded-xl focus:outline-none focus:border-pure-white focus:ring-1 focus:ring-pure-white transition-all"
                      placeholder="Repite contraseña"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-pure-gray-500 hover:text-pure-white transition-colors flex items-center gap-1"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-pure-white text-pure-black font-semibold rounded-xl hover:bg-pure-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-pure-black/30 border-t-pure-black rounded-full animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Unirme a la Familia
                    </>
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-pure-gray-500 text-sm mb-2">¿Ya tienes cuenta?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true)
                      setError('')
                    }}
                    className="text-pure-white hover:text-pure-gray-300 transition-colors text-sm font-medium"
                  >
                    ← Iniciar sesión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="fixed bottom-4 left-0 right-0 text-center text-pure-gray-500 text-sm">
        Codeol Software Perú © {new Date().getFullYear()}
      </p>
    </div>
  )
}
