import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export default function AdminPWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('codeol-admin-pwa-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const oneDay = 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < oneDay) {
        return
      }
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowBanner(false)
      localStorage.removeItem('codeol-admin-pwa-dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // For admin manifest
    const link = document.createElement('link')
    link.rel = 'manifest'
    link.href = '/admin-manifest.json'
    document.head.appendChild(link)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('Admin PWA installed')
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('codeol-admin-pwa-dismissed', Date.now().toString())
  }

  if (isInstalled || !showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-pure-gray-900 border-t border-pure-gray-800 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Smartphone size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-pure-white font-medium text-sm">Instalar App de Admin</p>
            <p className="text-pure-gray-400 text-xs">Accede rápido a tu dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="p-2 text-pure-gray-400 hover:text-pure-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm font-medium"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Instalar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
