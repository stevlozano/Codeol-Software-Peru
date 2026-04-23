import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  FileText, 
  LogOut, 
  DollarSign,
  Clock,
  User,
  ShoppingBag,
  Download,
  Trash2,
  Search,
  Filter,
  Menu,
  X
} from 'lucide-react'

// Configuración simple de autenticación
const ADMIN_PASSWORD = 'codeol2024' // Cambia esto por una contraseña segura

// Simulación de base de datos con localStorage
const getOrders = () => {
  const saved = localStorage.getItem('codeol-orders')
  return saved ? JSON.parse(saved) : []
}

const saveOrder = (order) => {
  const orders = getOrders()
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    status: 'pending', // pending, approved, rejected
    createdAt: new Date().toISOString(),
    pdfUrl: null
  }
  orders.unshift(newOrder)
  localStorage.setItem('codeol-orders', JSON.stringify(orders))
  return newOrder
}

const updateOrderStatus = (orderId, status) => {
  const orders = getOrders()
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o)
  localStorage.setItem('codeol-orders', JSON.stringify(updated))
  return updated.find(o => o.id === orderId)
}

const deleteOrder = (orderId) => {
  const orders = getOrders()
  const filtered = orders.filter(o => o.id !== orderId)
  localStorage.setItem('codeol-orders', JSON.stringify(filtered))
}

// Generar PDF
const generateOrderPDF = (order) => {
  const doc = new jsPDF()
  
  // Encabezado
  doc.setFontSize(20)
  doc.text('Codeol Software Perú', 20, 20)
  
  doc.setFontSize(12)
  doc.text('Orden de Servicio', 20, 30)
  doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString()}`, 20, 38)
  doc.text(`Estado: ${order.status === 'pending' ? 'Pendiente' : order.status === 'approved' ? 'Aprobado' : 'Rechazado'}`, 20, 46)
  
  // Línea separadora
  doc.line(20, 52, 190, 52)
  
  // Información del cliente
  doc.setFontSize(14)
  doc.text('Información del Cliente', 20, 62)
  doc.setFontSize(10)
  doc.text(`Nombre: ${order.customer?.nombre || 'N/A'}`, 20, 70)
  doc.text(`Email: ${order.customer?.email || 'N/A'}`, 20, 76)
  doc.text(`Teléfono: ${order.customer?.telefono || 'N/A'}`, 20, 82)
  doc.text(`Empresa: ${order.customer?.empresa || 'N/A'}`, 20, 88)
  doc.text(`RUC: ${order.customer?.ruc || 'N/A'}`, 20, 94)
  doc.text(`Dirección: ${order.customer?.direccion || 'N/A'}`, 20, 100)
  
  // Servicios
  doc.setFontSize(14)
  doc.text('Servicios Solicitados', 20, 115)
  
  let y = 125
  order.items?.forEach((item, index) => {
    doc.setFontSize(10)
    doc.text(`${index + 1}. ${item.name}`, 20, y)
    doc.text(`Cantidad: ${item.quantity}`, 120, y)
    doc.text(`Precio: S/ ${item.customPrice || 'Cotizar'}`, 160, y)
    y += 10
  })
  
  // Totales
  y += 10
  doc.line(20, y, 190, y)
  y += 10
  doc.setFontSize(12)
  doc.text(`Subtotal: S/ ${order.totalPrice || 0}`, 130, y)
  doc.text(`IGV (18%): S/ ${((order.totalPrice || 0) * 0.18).toFixed(2)}`, 130, y + 7)
  doc.text(`Total: S/ ${((order.totalPrice || 0) * 1.18).toFixed(2)}`, 130, y + 14)
  
  // Pie de página
  doc.setFontSize(8)
  doc.text('Gracias por confiar en Codeol Software Perú', 20, 280)
  doc.text('Contacto: 916 895 252 | codeolsoftware@gmail.com', 20, 285)
  
  return doc
}

// Notificaciones push
const sendPushNotification = async (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/images/logooriginal.png',
      badge: '/images/logooriginal.png',
      tag: 'new-order'
    })
  }
}

const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const previousOrdersRef = useRef([])

  // Verificar autenticación
  useEffect(() => {
    const auth = sessionStorage.getItem('codeol-admin-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  // Cargar órdenes y verificar nuevas
  useEffect(() => {
    if (!isAuthenticated) return

    const checkOrders = () => {
      const currentOrders = getOrders()
      
      // Detectar nuevas órdenes
      if (previousOrdersRef.current.length > 0) {
        const newOrders = currentOrders.filter(
          o => !previousOrdersRef.current.find(po => po.id === o.id)
        )
        
        if (newOrders.length > 0 && notificationsEnabled) {
          newOrders.forEach(order => {
            sendPushNotification(
              '¡Nuevo pedido recibido!',
              `Cliente: ${order.customer?.nombre || 'N/A'} - Total: S/ ${((order.totalPrice || 0) * 1.18).toFixed(2)}`
            )
          })
        }
      }
      
      previousOrdersRef.current = currentOrders
      setOrders(currentOrders)
    }

    checkOrders()
    const interval = setInterval(checkOrders, 3000) // Verificar cada 3 segundos

    return () => clearInterval(interval)
  }, [isAuthenticated, notificationsEnabled])

  // Solicitar permiso de notificaciones
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) {
      alert('Notificaciones activadas. Recibirás alertas cuando lleguen nuevos pedidos.')
    }
  }

  // Login
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('codeol-admin-auth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('codeol-admin-auth')
    setIsAuthenticated(false)
  }

  // Aprobar orden
  const approveOrder = (orderId) => {
    const order = updateOrderStatus(orderId, 'approved')
    setOrders(getOrders())
    
    // Generar PDF
    const pdf = generateOrderPDF(order)
    pdf.save(`orden-${orderId}.pdf`)
    
    // Notificación al admin
    if (notificationsEnabled) {
      sendPushNotification('Orden aprobada', `La orden #${orderId.slice(-6)} ha sido aprobada y el PDF descargado.`)
    }
    
    // Guardar en historial del cliente (simulado)
    const customerOrders = JSON.parse(localStorage.getItem(`customer-orders-${order.customer?.email}`) || '[]')
    customerOrders.push({ ...order, pdfGenerated: true })
    localStorage.setItem(`customer-orders-${order.customer?.email}`, JSON.stringify(customerOrders))
    
    alert('Orden aprobada. PDF generado y descargado.')
  }

  // Rechazar orden
  const rejectOrder = (orderId) => {
    updateOrderStatus(orderId, 'rejected')
    setOrders(getOrders())
    if (notificationsEnabled) {
      sendPushNotification('Orden rechazada', `La orden #${orderId.slice(-6)} ha sido rechazada.`)
    }
  }

  // Eliminar orden
  const handleDeleteOrder = (orderId) => {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      deleteOrder(orderId)
      setOrders(getOrders())
    }
  }

  // Descargar PDF manualmente
  const downloadPDF = (order) => {
    const pdf = generateOrderPDF(order)
    pdf.save(`orden-${order.id}.pdf`)
  }

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = 
      order.customer?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm)
    return matchesFilter && matchesSearch
  })

  // Estadísticas
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    totalRevenue: orders
      .filter(o => o.status === 'approved')
      .reduce((sum, o) => sum + ((o.totalPrice || 0) * 1.18), 0)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pure-black text-pure-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pure-white rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-pure-black" />
            </div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-pure-gray-400">Codeol Software Perú</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                Contraseña de administrador
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white focus:outline-none focus:border-pure-white"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
            >
              Ingresar al Dashboard
            </button>
          </form>

          <p className="text-xs text-pure-gray-500 text-center mt-4">
            Acceso exclusivo para administradores
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-pure-black/95 backdrop-blur border-b border-pure-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-pure-gray-800 rounded-lg lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pure-white rounded-full flex items-center justify-center">
                  <ShoppingBag size={16} className="text-pure-black" />
                </div>
                <span className="font-semibold hidden sm:block">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!notificationsEnabled && (
                <button
                  onClick={enableNotifications}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pure-gray-800 rounded-full text-sm hover:bg-pure-gray-700 transition-colors"
                >
                  <Bell size={16} />
                  Activar notificaciones
                </button>
              )}
              {notificationsEnabled && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm">
                  <Bell size={16} />
                  <span className="hidden sm:inline">Notificaciones activas</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-pure-gray-800 rounded-lg"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ShoppingBag size={20} className="text-blue-500" />
              </div>
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Total órdenes</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-yellow-500" />
              </div>
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Pendientes</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <span className="text-2xl font-bold">{stats.approved}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Aprobadas</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-emerald-500" />
              </div>
              <span className="text-2xl font-bold">S/ {stats.totalRevenue.toFixed(0)}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Ingresos aprobados</p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pure-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, email o número de orden..."
              className="w-full pl-10 pr-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white focus:outline-none focus:border-pure-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                  filter === f
                    ? 'bg-pure-white text-pure-black'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobadas' : 'Rechazadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de órdenes */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-pure-gray-900/50 border rounded-xl overflow-hidden ${
                  order.status === 'pending' ? 'border-yellow-500/30' :
                  order.status === 'approved' ? 'border-green-500/30' :
                  'border-red-500/30'
                }`}
              >
                {/* Header de la orden */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        order.status === 'pending' ? 'bg-yellow-500/20' :
                        order.status === 'approved' ? 'bg-green-500/20' :
                        'bg-red-500/20'
                      }`}>
                        {order.status === 'pending' ? <Clock size={24} className="text-yellow-500" /> :
                         order.status === 'approved' ? <CheckCircle size={24} className="text-green-500" /> :
                         <XCircle size={24} className="text-red-500" />}
                      </div>
                      <div>
                        <p className="font-medium">Orden #{order.id.slice(-6)}</p>
                        <p className="text-xs text-pure-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveOrder(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle size={16} />
                            Aprobar
                          </button>
                          <button
                            onClick={() => rejectOrder(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                          >
                            <XCircle size={16} />
                            Rechazar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => downloadPDF(order)}
                        className="p-2 hover:bg-pure-gray-800 rounded-lg"
                        title="Descargar PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-pure-gray-800/50 rounded-lg">
                      <p className="text-xs text-pure-gray-500 mb-1">Cliente</p>
                      <p className="font-medium">{order.customer?.nombre || 'N/A'}</p>
                      <p className="text-xs text-pure-gray-400">{order.customer?.email}</p>
                      <p className="text-xs text-pure-gray-400">{order.customer?.telefono}</p>
                    </div>
                    <div className="p-3 bg-pure-gray-800/50 rounded-lg">
                      <p className="text-xs text-pure-gray-500 mb-1">Total</p>
                      <p className="text-xl font-bold">S/ {((order.totalPrice || 0) * 1.18).toFixed(2)}</p>
                      <p className="text-xs text-pure-gray-400">
                        {order.items?.length || 0} item(s) - IGV incluido
                      </p>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-pure-gray-500">Servicios</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-pure-gray-800/30 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-xs text-pure-gray-500">x{item.quantity}</span>
                        </div>
                        <span className="text-sm">
                          S/ {item.customPrice ? (item.customPrice * item.quantity) : 'Cotizar'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Botón ver detalles */}
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="mt-4 text-sm text-pure-gray-400 hover:text-pure-white transition-colors"
                  >
                    {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver más detalles'}
                  </button>

                  {/* Detalles expandibles */}
                  <AnimatePresence>
                    {selectedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-pure-gray-800 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-pure-gray-500">Empresa</p>
                              <p className="text-sm">{order.customer?.empresa || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-pure-gray-500">RUC</p>
                              <p className="text-sm">{order.customer?.ruc || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-pure-gray-500">Dirección</p>
                              <p className="text-sm">{order.customer?.direccion || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-pure-gray-500">Método de pago</p>
                              <p className="text-sm capitalize">{order.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-pure-gray-600 mb-4" />
              <p className="text-pure-gray-400">No hay órdenes {filter !== 'all' ? 'con este filtro' : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
