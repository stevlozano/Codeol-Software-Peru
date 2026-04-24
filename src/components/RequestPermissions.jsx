import { useState, useEffect } from 'react'
import { Bell, Camera, Mic, MapPin, CheckCircle } from 'lucide-react'

export default function RequestPermissions() {
  const [showModal, setShowModal] = useState(false)
  const [permissions, setPermissions] = useState({
    notifications: false,
    camera: false,
    microphone: false,
    geolocation: false
  })

  useEffect(() => {
    // Check if already requested
    const requested = localStorage.getItem('codeol-permissions-requested')
    if (!requested) {
      // Show after 3 seconds
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tu navegador no soporta notificaciones')
      return
    }
    
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      setPermissions(prev => ({ ...prev, notifications: true }))
      // Show test notification
      new Notification('CODEOL Admin', {
        body: '¡Notificaciones activadas correctamente!',
        icon: '/images/logooriginal.png'
      })
    }
  }

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setPermissions(prev => ({ ...prev, camera: true }))
    } catch (err) {
      console.error('Camera permission denied:', err)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setPermissions(prev => ({ ...prev, microphone: true }))
    } catch (err) {
      console.error('Microphone permission denied:', err)
    }
  }

  const requestGeolocationPermission = () => {
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta geolocalización')
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissions(prev => ({ ...prev, geolocation: true }))
      },
      (err) => {
        console.error('Geolocation permission denied:', err)
      }
    )
  }

  const handleClose = () => {
    localStorage.setItem('codeol-permissions-requested', 'true')
    setShowModal(false)
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-pure-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-pure-gray-900 rounded-2xl border border-pure-gray-800 w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-2 text-center">Permisos de la App</h2>
        <p className="text-pure-gray-400 text-sm text-center mb-6">
          Para una mejor experiencia, necesitamos los siguientes permisos:
        </p>

        <div className="space-y-3">
          {/* Notifications */}
          <button
            onClick={requestNotificationPermission}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              permissions.notifications
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-pure-gray-800/50 border-pure-gray-700 hover:border-pure-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              permissions.notifications ? 'bg-emerald-500/20' : 'bg-pure-gray-700'
            }`}>
              {permissions.notifications ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <Bell size={20} className="text-pure-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">Notificaciones</p>
              <p className="text-xs text-pure-gray-500">
                {permissions.notifications ? 'Activadas' : 'Recibir alertas de pedidos'}
              </p>
            </div>
          </button>

          {/* Camera */}
          <button
            onClick={requestCameraPermission}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              permissions.camera
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-pure-gray-800/50 border-pure-gray-700 hover:border-pure-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              permissions.camera ? 'bg-emerald-500/20' : 'bg-pure-gray-700'
            }`}>
              {permissions.camera ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <Camera size={20} className="text-pure-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">Cámara</p>
              <p className="text-xs text-pure-gray-500">
                {permissions.camera ? 'Permitida' : 'Escanear documentos'}
              </p>
            </div>
          </button>

          {/* Microphone */}
          <button
            onClick={requestMicrophonePermission}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              permissions.microphone
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-pure-gray-800/50 border-pure-gray-700 hover:border-pure-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              permissions.microphone ? 'bg-emerald-500/20' : 'bg-pure-gray-700'
            }`}>
              {permissions.microphone ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <Mic size={20} className="text-pure-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">Micrófono</p>
              <p className="text-xs text-pure-gray-500">
                {permissions.microphone ? 'Permitido' : 'Notas de voz'}
              </p>
            </div>
          </button>

          {/* Geolocation */}
          <button
            onClick={requestGeolocationPermission}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
              permissions.geolocation
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-pure-gray-800/50 border-pure-gray-700 hover:border-pure-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              permissions.geolocation ? 'bg-emerald-500/20' : 'bg-pure-gray-700'
            }`}>
              {permissions.geolocation ? (
                <CheckCircle size={20} className="text-emerald-400" />
              ) : (
                <MapPin size={20} className="text-pure-gray-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">Ubicación</p>
              <p className="text-xs text-pure-gray-500">
                {permissions.geolocation ? 'Permitida' : 'Servicios locales'}
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={handleClose}
          className="w-full mt-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
