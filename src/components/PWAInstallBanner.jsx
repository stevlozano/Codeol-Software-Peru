import { useState, useEffect } from 'react'
import { Download, Smartphone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true
      if (isStandalone) {
        setIsInstalled(true)
      }
      return isStandalone
    }
    
    if (checkInstalled()) return
    
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
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
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable || isInstalled || isDismissed) return null

  return (
    <AnimatePresence>
      {isInstallable && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-pure-gray-900/95 backdrop-blur border-t border-pure-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone size={24} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-pure-white mb-1">
                    Instala CODEOL como app
                  </p>
                  <p className="text-xs text-pure-gray-400">
                    Acceso rápido sin navegador
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-pure-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Instalar</span>
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-2 hover:bg-pure-gray-800 rounded-lg transition-colors text-pure-gray-400 hover:text-pure-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
