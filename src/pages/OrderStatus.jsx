import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  ArrowLeft,
  RefreshCw,
  Download,
  Bell
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

export default function OrderStatus() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Cargar última orden automáticamente
  useEffect(() => {
    const lastOrderId = localStorage.getItem('last-order-id')
    if (lastOrderId) {
      setOrderId(lastOrderId)
      fetchOrder(lastOrderId)
    }
  }, [])

  // Solicitar permiso de notificaciones
  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        alert('Notificaciones activadas. Te avisaremos cuando tu pago sea aprobado.')
      }
    }
  }

  // Verificar cambios de estado cada 10 segundos
  useEffect(() => {
    if (!order || !orderId) return

    const interval = setInterval(() => {
      const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
      const updatedOrder = orders.find(o => o.id === orderId)
      
      if (updatedOrder && updatedOrder.status !== order.status) {
        // Estado cambió
        setOrder(updatedOrder)
        
        // Notificar al cliente
        if (notificationsEnabled && 'Notification' in window) {
          if (updatedOrder.status === 'approved') {
            new Notification('¡Pago aprobado! 🎉', {
              body: `Tu orden #${orderId.slice(-6)} ha sido aprobada. Revisa tu PDF de confirmación.`,
              icon: '/images/logooriginal.png'
            })
          } else if (updatedOrder.status === 'rejected') {
            new Notification('Orden rechazada', {
              body: `Tu orden #${orderId.slice(-6)} no pudo ser procesada. Contacta con nosotros.`,
              icon: '/images/logooriginal.png'
            })
          }
        }
        
        // Alerta visual
        if (updatedOrder.status === 'approved') {
          alert('¡Tu pago ha sido aprobado! Ya puedes descargar tu comprobante.')
        } else if (updatedOrder.status === 'rejected') {
          alert('Tu orden fue rechazada. Por favor contacta con nosotros para más información.')
        }
      }
    }, 10000) // Verificar cada 10 segundos

    return () => clearInterval(interval)
  }, [order, orderId, notificationsEnabled])

  const fetchOrder = (id) => {
    setLoading(true)
    setError('')
    
    const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
    const found = orders.find(o => o.id === id)
    
    if (found) {
      setOrder(found)
    } else {
      setError('No se encontró la orden. Verifica el número.')
      setOrder(null)
    }
    
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (orderId.trim()) {
      fetchOrder(orderId.trim())
    }
  }

  const downloadPDF = () => {
    if (!order) return
    
    // Simular descarga de PDF
    const pdfContent = `
ORDEN DE SERVICIO - CODEOL SOFTWARE PERÚ
==========================================

Número de orden: ${order.id}
Fecha: ${new Date(order.createdAt).toLocaleString()}
Estado: ${order.status === 'pending' ? 'Pendiente' : order.status === 'approved' ? 'Aprobado' : 'Rechazado'}

INFORMACIÓN DEL CLIENTE
-----------------------
Nombre: ${order.customer?.nombre || 'N/A'}
Email: ${order.customer?.email || 'N/A'}
Teléfono: ${order.customer?.telefono || 'N/A'}
Empresa: ${order.customer?.empresa || 'N/A'}
RUC: ${order.customer?.ruc || 'N/A'}

SERVICIOS CONTRATADOS
---------------------
${order.items?.map(item => `- ${item.name} x${item.quantity}: S/ ${item.customPrice || 'Cotizar'}`).join('\n')}

TOTAL: S/ ${((order.totalPrice || 0) * 1.18).toFixed(2)} (IGV incluido)

Método de pago: ${order.paymentMethod || 'N/A'}

Gracias por confiar en Codeol Software Perú.
Contacto: 916 895 252 | codeolsoftware@gmail.com
    `
    
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orden-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={48} className="text-green-500" />
      case 'rejected':
        return <XCircle size={48} className="text-red-500" />
      default:
        return <Clock size={48} className="text-yellow-500 animate-pulse" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return { title: '¡Pago aprobado!', desc: 'Tu orden ha sido confirmada' }
      case 'rejected':
        return { title: 'Orden rechazada', desc: 'Contacta con nosotros para más información' }
      default:
        return { title: 'Pago pendiente', desc: 'Estamos verificando tu pago' }
    }
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-pure-gray-400 hover:text-pure-white mb-8">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <h1 className="text-3xl font-bold mb-2">Estado de tu orden</h1>
          <p className="text-pure-gray-400 mb-8">Consulta el estado de tu pago y descarga tu comprobante</p>

          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ingresa tu número de orden..."
              className="flex-1 px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white focus:outline-none focus:border-pure-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-pure-white text-pure-black rounded-lg font-medium hover:bg-pure-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Buscar'}
            </button>
          </form>

          {/* Activar notificaciones */}
          {!notificationsEnabled && 'Notification' in window && (
            <button
              onClick={enableNotifications}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-pure-gray-800 rounded-lg hover:bg-pure-gray-700 transition-colors"
            >
              <Bell size={18} />
              Activar notificaciones de estado
            </button>
          )}

          {notificationsEnabled && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Bell size={18} className="text-green-500" />
              <span className="text-sm">Recibirás una notificación cuando tu pago sea procesado</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Resultado */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl overflow-hidden"
            >
              {/* Header con estado */}
              <div className={`p-6 text-center border-b border-pure-gray-800 ${
                order.status === 'approved' ? 'bg-green-500/10' :
                order.status === 'rejected' ? 'bg-red-500/10' :
                'bg-yellow-500/10'
              }`}>
                <div className="flex justify-center mb-4">
                  {getStatusIcon(order.status)}
                </div>
                <h2 className="text-xl font-semibold">
                  {getStatusText(order.status).title}
                </h2>
                <p className="text-sm text-pure-gray-400">
                  {getStatusText(order.status).desc}
                </p>
              </div>

              {/* Detalles */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-pure-gray-400">Número de orden</span>
                  <span className="font-mono">#{order.id.slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pure-gray-400">Fecha</span>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pure-gray-400">Cliente</span>
                  <span>{order.customer?.nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pure-gray-400">Total</span>
                  <span className="text-xl font-bold">S/ {((order.totalPrice || 0) * 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pure-gray-400">Método de pago</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>

                {/* Servicios */}
                <div className="pt-4 border-t border-pure-gray-800">
                  <p className="text-sm text-pure-gray-500 mb-3">Servicios contratados:</p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>S/ {item.customPrice ? (item.customPrice * item.quantity).toFixed(2) : 'Cotizar'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descargar PDF (solo si está aprobado) */}
                {order.status === 'approved' && (
                  <button
                    onClick={downloadPDF}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
                  >
                    <Download size={18} />
                    Descargar comprobante
                  </button>
                )}

                {order.status === 'pending' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-sm text-yellow-400 text-center">
                      Tu pago está siendo verificado. Te notificaremos cuando sea procesado.
                    </p>
                  </div>
                )}

                {order.status === 'rejected' && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-400 text-center">
                      Tu orden fue rechazada. Contacta con nosotros al 916 895 252 para más información.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!order && !error && !loading && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-pure-gray-600 mb-4" />
              <p className="text-pure-gray-400">Ingresa tu número de orden para consultar el estado</p>
              <p className="text-sm text-pure-gray-500 mt-2">
                El número de orden se te mostró al completar tu compra
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
