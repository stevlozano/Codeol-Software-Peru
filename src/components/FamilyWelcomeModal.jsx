import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Star, History, Bell, Crown, UserPlus, LogIn, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export default function FamilyWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const navigate = useNavigate()
  const { register, login, isLoggedIn } = useCustomerAuth()

  // Mostrar modal al entrar por primera vez
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('codeol-family-modal-seen')
    
    if (!isLoggedIn && !hasSeenModal) {
      // Primera visita - mostrar después de 2 segundos
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn])

  const goToLogin = () => {
    closeModal()
    navigate('/login')
  }

  const goToRegister = () => {
    closeModal()
    navigate('/login')
  }

  const closeModal = () => {
    setIsOpen(false)
    sessionStorage.setItem('codeol-family-modal-seen', 'true')
  }

  const handleContinueAsGuest = () => {
    closeModal()
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    const result = register({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password
    })
    
    if (result.success) {
      setSuccess('¡Bienvenido a la Familia CODEOL!')
      setTimeout(() => {
        closeModal()
        window.location.href = '/mi-cuenta'
      }, 1500)
    } else {
      setError(result.error)
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    const result = login(loginData.email, loginData.password)
    
    if (result.success) {
      setSuccess('¡Bienvenido de vuelta!')
      setTimeout(() => {
        closeModal()
        window.location.href = '/mi-cuenta'
      }, 1500)
    } else {
      setError(result.error)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-pure-black border border-pure-gray-800 rounded-2xl overflow-hidden"
        >
          {/* Header con gradiente */}
          <div className="relative bg-gradient-to-r from-pure-gray-900 to-pure-black p-8 text-center">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="text-pure-gray-400" />
            </button>
            
            <div className="w-20 h-20 bg-pure-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={36} className="text-pure-black" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Únete a la Familia CODEOL
            </h2>
            <p className="text-pure-gray-400">
              Software Perú - Donde tu éxito es nuestro compromiso
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-green-500" />
                </div>
                <p className="text-xl font-semibold text-green-500">{success}</p>
              </div>
            ) : showRegister ? (
              // Formulario de Registro
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserPlus size={20} />
                  Crear tu cuenta
                </h3>
                
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                    required
                  />
                </div>
                
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                  required
                />
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-pure-white text-pure-black font-semibold rounded-lg hover:bg-pure-gray-200 transition-colors"
                >
                  Unirme a la Familia CODEOL
                </button>
                
                <button
                  type="button"
                  onClick={() => { setShowRegister(false); setShowLogin(false); setError('') }}
                  className="w-full py-2 text-pure-gray-400 hover:text-pure-white transition-colors"
                >
                  ← Volver atrás
                </button>
              </form>
            ) : showLogin ? (
              // Formulario de Login
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LogIn size={20} />
                  Iniciar sesión
                </h3>
                
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                  required
                />
                
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg focus:outline-none focus:border-pure-white"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full py-3 bg-pure-white text-pure-black font-semibold rounded-lg hover:bg-pure-gray-200 transition-colors"
                >
                  Iniciar sesión
                </button>
                
                <button
                  type="button"
                  onClick={() => { setShowRegister(false); setShowLogin(false); setError('') }}
                  className="w-full py-2 text-pure-gray-400 hover:text-pure-white transition-colors"
                >
                  ← Volver atrás
                </button>
              </form>
            ) : (
              // Vista principal con beneficios
              <>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <Gift size={24} className="text-emerald-500 mb-2" />
                    <h4 className="font-semibold mb-1">Descuentos Exclusivos</h4>
                    <p className="text-sm text-pure-gray-400">Hasta 15% de descuento por fidelidad</p>
                  </div>
                  
                  <div className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <History size={24} className="text-blue-500 mb-2" />
                    <h4 className="font-semibold mb-1">Historial de Compras</h4>
                    <p className="text-sm text-pure-gray-400">Todas tus órdenes en un lugar</p>
                  </div>
                  
                  <div className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <Bell size={24} className="text-yellow-500 mb-2" />
                    <h4 className="font-semibold mb-1">Notificaciones</h4>
                    <p className="text-sm text-pure-gray-400">Seguimiento de tus pedidos</p>
                  </div>
                  
                  <div className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <Star size={24} className="text-purple-500 mb-2" />
                    <h4 className="font-semibold mb-1">Niveles VIP</h4>
                    <p className="text-sm text-pure-gray-400">Bronce → Plata → Oro</p>
                  </div>
                  
                  <div className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <History size={24} className="text-blue-500 mb-2" />
                    <h4 className="font-semibold mb-1">Historial de Compras</h4>
                    <p className="text-sm text-pure-gray-400">Todas tus órdenes en un lugar</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
