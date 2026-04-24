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
import { jsPDF } from 'jspdf'
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
    
    const doc = new jsPDF()
    
    // Colores - estilo minimalista negro/blanco/gris
    const black = [0, 0, 0]
    const darkGray = [30, 30, 30]
    const mediumGray = [100, 100, 100]
    const lightGray = [230, 230, 230]
    
    // Fondo blanco
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, 210, 297, 'F')
    
    // Header con fondo negro
    doc.setFillColor(...darkGray)
    doc.rect(0, 0, 210, 45, 'F')
    
    // Logo placeholder - Agregar: doc.addImage(logoBase64, 'PNG', 15, 10, 25, 25)
    // Por ahora usamos texto estilizado como logo
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('◆ CODEOL', 20, 24)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('SOFTWARE PERÚ', 20, 32)
    
    // Info de orden en header (derecha)
    doc.setFontSize(9)
    doc.text(`ORDEN #${order.id.slice(-6)}`, 150, 20)
    doc.text(new Date(order.createdAt).toLocaleDateString('es-PE'), 150, 26)
    
    // Estado badge
    const statusColor = order.status === 'approved' ? [34, 197, 94] : 
                        order.status === 'rejected' ? [239, 68, 68] : [234, 179, 8]
    doc.setFillColor(...statusColor)
    doc.roundedRect(150, 30, 40, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    const statusText = order.status === 'approved' ? 'APROBADO' : 
                       order.status === 'rejected' ? 'RECHAZADO' : 'PENDIENTE'
    doc.text(statusText, 170, 35, { align: 'center' })
    
    // Sección Cliente
    doc.setTextColor(...black)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DEL CLIENTE', 20, 65)
    
    // Línea separadora
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(20, 68, 190, 68)
    
    doc.setTextColor(...mediumGray)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const clienteData = [
      ['Nombre:', order.customer?.nombre || 'N/A'],
      ['Email:', order.customer?.email || 'N/A'],
      ['Teléfono:', order.customer?.telefono || 'N/A'],
      ['Empresa:', order.customer?.empresa || 'N/A'],
      ['Dirección:', order.customer?.direccion || 'N/A'],
    ]
    
    let y = 78
    clienteData.forEach(([label, value]) => {
      doc.setTextColor(...mediumGray)
      doc.setFontSize(9)
      doc.text(label, 20, y)
      doc.setTextColor(...black)
      doc.setFont('helvetica', 'bold')
      doc.text(value, 55, y)
      doc.setFont('helvetica', 'normal')
      y += 8
    })
    
    // Sección Servicios
    y += 10
    doc.setTextColor(...black)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SERVICIOS CONTRATADOS', 20, y)
    doc.setDrawColor(...lightGray)
    doc.line(20, y + 3, 190, y + 3)
    
    // Tabla de servicios
    y += 15
    doc.setFillColor(250, 250, 250)
    doc.rect(20, y - 6, 170, 10, 'F')
    doc.setTextColor(...mediumGray)
    doc.setFontSize(9)
    doc.text('Ítem', 25, y)
    doc.text('Cantidad', 120, y)
    doc.text('Precio', 160, y)
    
    y += 12
    doc.setTextColor(...black)
    order.items?.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250)
        doc.rect(20, y - 5, 170, 8, 'F')
      }
      doc.setFontSize(10)
      doc.text(`${index + 1}. ${item.name}`, 25, y)
      doc.text(`${item.quantity}`, 125, y)
      doc.text(`S/ ${item.customPrice || 'Cotizar'}`, 165, y)
      y += 10
    })
    
    // Sección Totales
    y += 15
    doc.setDrawColor(...lightGray)
    doc.line(20, y - 5, 190, y - 5)
    
    const subtotal = order.totalPrice || 0
    const igv = subtotal * 0.18
    const total = subtotal + igv
    
    // Totales alineados a la derecha
    doc.setTextColor(...mediumGray)
    doc.setFontSize(10)
    doc.text('Subtotal:', 130, y)
    doc.setTextColor(...black)
    doc.setFont('helvetica', 'bold')
    doc.text(`S/ ${subtotal.toFixed(2)}`, 185, y, { align: 'right' })
    
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...mediumGray)
    doc.text('IGV (18%):', 130, y)
    doc.setTextColor(...black)
    doc.text(`S/ ${igv.toFixed(2)}`, 185, y, { align: 'right' })
    
    y += 12
    // Total destacado con fondo
    doc.setFillColor(...darkGray)
    doc.roundedRect(125, y - 6, 65, 12, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL: S/ ${total.toFixed(2)}`, 157, y + 2, { align: 'center' })
    
    // Método de pago
    y += 20
    doc.setTextColor(...mediumGray)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Método de pago:', 20, y)
    doc.setTextColor(...black)
    doc.setFont('helvetica', 'bold')
    doc.text(order.paymentMethod?.toUpperCase() || 'N/A', 55, y)
    
    // Footer minimalista
    doc.setFillColor(...darkGray)
    doc.rect(0, 280, 210, 17, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('codeolsoftware@gmail.com  |  +51 916 895 252  |  [TU-WEB-OFICIAL.COM]', 105, 290, { align: 'center' })
    doc.setFontSize(7)
    doc.text('Gracias por confiar en nosotros', 105, 294, { align: 'center' })
    
    doc.save(`comprobante-${order.id.slice(-6)}.pdf`)
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
