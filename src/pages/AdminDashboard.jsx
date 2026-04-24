import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
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
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Gift,
  Tag,
  Plus,
  Crown,
  Medal
} from 'lucide-react'

// Get orders from Supabase with fallback to localStorage
const getOrders = async () => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        // Transform data to match expected format
        return data.map(order => ({
          ...order,
          customer: {
            nombre: order.customer_name,
            email: order.customer_email,
            telefono: order.customer_phone,
            empresa: order.customer_company,
            ruc: order.customer_ruc,
            direccion: order.customer_address
          },
          totalPrice: order.total_price,
          paymentMethod: order.payment_method,
          createdAt: order.created_at
        }))
      }
    } catch (err) {
      console.error('Error fetching orders from Supabase:', err)
    }
  }
  
  // Fallback to localStorage
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

const updateOrderStatus = async (orderId, status) => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      
      if (!error) {
        // Return updated order
        const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
        if (data) {
          return {
            ...data,
            customer: {
              nombre: data.customer_name,
              email: data.customer_email,
              telefono: data.customer_phone,
              empresa: data.customer_company,
              ruc: data.customer_ruc,
              direccion: data.customer_address
            },
            totalPrice: data.total_price,
            paymentMethod: data.payment_method,
            createdAt: data.created_at
          }
        }
      }
    } catch (err) {
      console.error('Error updating order in Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o)
  localStorage.setItem('codeol-orders', JSON.stringify(updated))
  return updated.find(o => o.id === orderId)
}

const deleteOrder = async (orderId) => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)
      
      if (!error) return
    } catch (err) {
      console.error('Error deleting order from Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
  const filtered = orders.filter(o => o.id !== orderId)
  localStorage.setItem('codeol-orders', JSON.stringify(filtered))
}

// Funciones para clientes
const getCustomers = () => {
  const saved = localStorage.getItem('codeol-customers')
  return saved ? JSON.parse(saved) : []
}

const getCustomerStats = async (email) => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .eq('status', 'approved')
      
      if (!error && data) {
        return {
          totalOrders: data.length,
          totalSpent: data.reduce((sum, o) => sum + ((o.total_price || 0) * 1.18), 0)
        }
      }
    } catch (err) {
      console.error('Error fetching customer stats from Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
  const customerOrders = orders.filter(o => 
    o.customer?.email === email && o.status === 'approved'
  )
  return {
    totalOrders: customerOrders.length,
    totalSpent: customerOrders.reduce((sum, o) => sum + ((o.totalPrice || 0) * 1.18), 0)
  }
}

// Funciones para promociones
const getPromotions = async () => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        // Transform to match expected format
        return data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          discountPercent: p.discount_percent,
          minPurchase: p.min_purchase,
          code: p.code,
          validUntil: p.valid_until,
          isActive: p.is_active,
          createdAt: p.created_at
        }))
      }
    } catch (err) {
      console.error('Error fetching promotions from Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const saved = localStorage.getItem('codeol-promotions')
  return saved ? JSON.parse(saved) : []
}

const savePromotion = async (promotion) => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert({
          title: promotion.title,
          description: promotion.description,
          discount_percent: promotion.discountPercent,
          min_purchase: promotion.minPurchase || 0,
          code: promotion.code,
          valid_until: promotion.validUntil || null,
          is_active: true
        })
        .select()
        .single()
      
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          discountPercent: data.discount_percent,
          minPurchase: data.min_purchase,
          code: data.code,
          validUntil: data.valid_until,
          isActive: data.is_active,
          createdAt: data.created_at
        }
      }
    } catch (err) {
      console.error('Error saving promotion to Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const promotions = await getPromotions()
  const newPromo = {
    ...promotion,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isActive: true
  }
  promotions.unshift(newPromo)
  localStorage.setItem('codeol-promotions', JSON.stringify(promotions))
  return newPromo
}

const deletePromotion = async (promoId) => {
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promoId)
      
      if (!error) return
    } catch (err) {
      console.error('Error deleting promotion from Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const promotions = JSON.parse(localStorage.getItem('codeol-promotions') || '[]')
  const filtered = promotions.filter(p => p.id !== promoId)
  localStorage.setItem('codeol-promotions', JSON.stringify(filtered))
}

const togglePromotionStatus = async (promoId) => {
  // Get current promotion
  const promotions = await getPromotions()
  const promo = promotions.find(p => p.id === promoId)
  if (!promo) return
  
  const newStatus = !promo.isActive
  
  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: newStatus })
        .eq('id', promoId)
      
      if (!error) return
    } catch (err) {
      console.error('Error updating promotion status in Supabase:', err)
    }
  }
  
  // Fallback to localStorage
  const updated = promotions.map(p => 
    p.id === promoId ? { ...p, isActive: newStatus } : p
  )
  localStorage.setItem('codeol-promotions', JSON.stringify(updated))
}

// Generar PDF con estilo minimalista
const generateOrderPDF = (order) => {
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
  doc.text(' CODEOL', 20, 24)
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
  doc.text('codeolsoftware@gmail.com  |  +51 916 895 252  |  codeolsoftware.work', 105, 290, { align: 'center' })
  doc.setFontSize(7)
  doc.text('Gracias por confiar en nosotros', 105, 294, { align: 'center' })
  
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
  const [activeView, setActiveView] = useState('orders') // 'orders' | 'calendar' | 'customers' | 'promotions'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const previousOrdersRef = useRef([])
  
  // Estados para clientes
  const [customers, setCustomers] = useState([])
  const [customerSearch, setCustomerSearch] = useState('')
  
  // Estados para promociones
  const [promotions, setPromotions] = useState([])
  const [showPromoForm, setShowPromoForm] = useState(false)
  const [promoFormData, setPromoFormData] = useState({
    title: '',
    description: '',
    discountPercent: '',
    minPurchase: '',
    validUntil: '',
    code: ''
  })

  // Verificar autenticación
  useEffect(() => {
    const auth = sessionStorage.getItem('codeol-admin-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    
    // Cargar estado de notificaciones desde localStorage
    const savedNotifications = localStorage.getItem('codeol-notifications-enabled')
    if (savedNotifications === 'true') {
      setNotificationsEnabled(true)
    }
  }, [])

  // Cargar órdenes y verificar nuevas
  useEffect(() => {
    if (!isAuthenticated) return

    const checkOrders = async () => {
      const currentOrders = await getOrders()
      
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

  // Cargar clientes y promociones
  useEffect(() => {
    if (!isAuthenticated) return
    
    const loadData = async () => {
      // Cargar clientes con estadísticas
      const allCustomers = getCustomers()
      const customersWithStats = await Promise.all(
        allCustomers.map(async (c) => ({
          ...c,
          stats: await getCustomerStats(c.email)
        }))
      )
      customersWithStats.sort((a, b) => b.stats.totalSpent - a.stats.totalSpent)
      setCustomers(customersWithStats)
      
      // Cargar promociones
      const promos = await getPromotions()
      setPromotions(promos)
    }
    
    loadData()
    const interval = setInterval(loadData, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Manejar formulario de promociones
  const handlePromoSubmit = async (e) => {
    e.preventDefault()
    
    if (!promoFormData.title || !promoFormData.discountPercent || !promoFormData.code) {
      alert('Por favor completa los campos obligatorios')
      return
    }
    
    await savePromotion({
      ...promoFormData,
      discountPercent: parseInt(promoFormData.discountPercent),
      minPurchase: parseFloat(promoFormData.minPurchase) || 0
    })
    
    const promos = await getPromotions()
    setPromotions(promos)
    setShowPromoForm(false)
    setPromoFormData({
      title: '',
      description: '',
      discountPercent: '',
      minPurchase: '',
      validUntil: '',
      code: ''
    })
    
    alert('¡Promoción creada exitosamente!')
  }

  const handleDeletePromo = async (promoId) => {
    if (confirm('¿Estás seguro de eliminar esta promoción?')) {
      await deletePromotion(promoId)
      const promos = await getPromotions()
      setPromotions(promos)
    }
  }

  const handleTogglePromo = async (promoId) => {
    await togglePromotionStatus(promoId)
    const promos = await getPromotions()
    setPromotions(promos)
  }

  // Toggle notificaciones (activar/desactivar)
  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Desactivar
      setNotificationsEnabled(false)
      localStorage.setItem('codeol-notifications-enabled', 'false')
      alert('Notificaciones desactivadas.')
    } else {
      // Activar
      const granted = await requestNotificationPermission()
      setNotificationsEnabled(granted)
      localStorage.setItem('codeol-notifications-enabled', granted ? 'true' : 'false')
      if (granted) {
        alert('Notificaciones activadas. Recibirás alertas cuando lleguen nuevos pedidos.')
      }
    }
  }

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('codeol-admin-auth')
    setIsAuthenticated(false)
  }

  // Componente para redirigir al login
  function RedirectToLogin() {
    const navigate = useNavigate()
    useEffect(() => {
      navigate('/admin-login', { replace: true })
    }, [navigate])
    return null
  }

  // Aprobar orden
  const approveOrder = async (orderId) => {
    const order = await updateOrderStatus(orderId, 'approved')
    const updatedOrders = await getOrders()
    setOrders(updatedOrders)
    
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
  const rejectOrder = async (orderId) => {
    await updateOrderStatus(orderId, 'rejected')
    const updatedOrders = await getOrders()
    setOrders(updatedOrders)
    if (notificationsEnabled) {
      sendPushNotification('Orden rechazada', `La orden #${orderId.slice(-6)} ha sido rechazada.`)
    }
  }

  // Eliminar orden
  const handleDeleteOrder = async (orderId) => {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      await deleteOrder(orderId)
      const updatedOrders = await getOrders()
      setOrders(updatedOrders)
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

  // Funciones para el calendario de ventas
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Domingo
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getSalesByDay = (year, month) => {
    const salesByDay = {}
    
    orders.filter(o => o.status === 'approved').forEach(order => {
      const orderDate = new Date(order.createdAt)
      const orderYear = orderDate.getFullYear()
      const orderMonth = orderDate.getMonth()
      const orderDay = orderDate.getDate()
      
      if (orderYear === year && orderMonth === month) {
        if (!salesByDay[orderDay]) {
          salesByDay[orderDay] = { count: 0, total: 0 }
        }
        salesByDay[orderDay].count += 1
        salesByDay[orderDay].total += (order.totalPrice || 0) * 1.18
      }
    })
    
    return salesByDay
  }

  const getWeeklyTotal = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return orders
      .filter(o => o.status === 'approved' && new Date(o.createdAt) >= weekAgo)
      .reduce((sum, o) => sum + ((o.totalPrice || 0) * 1.18), 0)
  }

  const getMonthlyTotal = (year, month) => {
    return orders
      .filter(o => {
        const orderDate = new Date(o.createdAt)
        return o.status === 'approved' && 
               orderDate.getFullYear() === year && 
               orderDate.getMonth() === month
      })
      .reduce((sum, o) => sum + ((o.totalPrice || 0) * 1.18), 0)
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <RedirectToLogin />
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
              {/* Toggle Views */}
              <div className="flex items-center bg-pure-gray-800 rounded-full p-1 flex-wrap gap-1">
                <button
                  onClick={() => setActiveView('orders')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeView === 'orders' 
                      ? 'bg-pure-white text-pure-black' 
                      : 'text-pure-gray-400 hover:text-pure-white'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span className="hidden sm:inline">Órdenes</span>
                </button>
                <button
                  onClick={() => setActiveView('calendar')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeView === 'calendar' 
                      ? 'bg-pure-white text-pure-black' 
                      : 'text-pure-gray-400 hover:text-pure-white'
                  }`}
                >
                  <Calendar size={14} />
                  <span className="hidden sm:inline">Calendario</span>
                </button>
                <button
                  onClick={() => setActiveView('customers')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeView === 'customers' 
                      ? 'bg-pure-white text-pure-black' 
                      : 'text-pure-gray-400 hover:text-pure-white'
                  }`}
                >
                  <Users size={14} />
                  <span className="hidden sm:inline">Clientes</span>
                </button>
                <button
                  onClick={() => setActiveView('promotions')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeView === 'promotions' 
                      ? 'bg-pure-white text-pure-black' 
                      : 'text-pure-gray-400 hover:text-pure-white'
                  }`}
                >
                  <Gift size={14} />
                  <span className="hidden sm:inline">Promos</span>
                </button>
              </div>

              <button
                onClick={toggleNotifications}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  notificationsEnabled
                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                <Bell size={16} />
                {notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
              </button>
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

        {/* Vista de Órdenes */}
        {activeView === 'orders' && (
          <>
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
          </>
        )}

        {/* Vista de Calendario */}
        {activeView === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header del calendario */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-pure-gray-800 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-pure-gray-800 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Resumen Semanal y Mensual */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-pure-gray-500">Total Semanal</p>
                  <p className="text-lg font-bold text-emerald-500">S/ {getWeeklyTotal().toFixed(0)}</p>
                </div>
                <div className="w-px h-10 bg-pure-gray-700" />
                <div className="text-right">
                  <p className="text-xs text-pure-gray-500">Total del Mes</p>
                  <p className="text-lg font-bold text-pure-white">S/ {getMonthlyTotal(currentMonth.getFullYear(), currentMonth.getMonth()).toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Calendario Grid */}
            <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4 sm:p-6">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs text-pure-gray-500 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
                  const salesByDay = getSalesByDay(year, month)
                  const days = []
                  
                  // Espacios vacíos antes del primer día
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square" />)
                  }
                  
                  // Días del mes
                  for (let day = 1; day <= daysInMonth; day++) {
                    const daySales = salesByDay[day]
                    const hasSales = daySales && daySales.count > 0
                    
                    days.push(
                      <div
                        key={day}
                        className={`aspect-square p-2 rounded-lg border transition-all ${
                          hasSales 
                            ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' 
                            : 'bg-pure-gray-800/30 border-pure-gray-700/50 hover:bg-pure-gray-800/50'
                        }`}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <span className={`text-sm font-medium ${
                            hasSales ? 'text-emerald-400' : 'text-pure-gray-400'
                          }`}>
                            {day}
                          </span>
                          {hasSales && (
                            <div className="text-right">
                              <p className="text-xs font-bold text-emerald-400">
                                S/ {daySales.total.toFixed(0)}
                              </p>
                              <p className="text-[10px] text-pure-gray-500">
                                {daySales.count} venta{daySales.count > 1 ? 's' : ''}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                  
                  return days
                })()}
              </div>
            </div>

            {/* Detalle de ventas del mes */}
            <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />
                Resumen de Ventas - {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              {(() => {
                const { year, month } = getDaysInMonth(currentMonth)
                const salesByDay = getSalesByDay(year, month)
                const daysWithSales = Object.entries(salesByDay).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
                
                if (daysWithSales.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Calendar size={48} className="mx-auto text-pure-gray-600 mb-4" />
                      <p className="text-pure-gray-400">No hay ventas este mes</p>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-3">
                    {daysWithSales.map(([day, data]) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-pure-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-emerald-400">{day}</span>
                          </div>
                          <div>
                            <p className="font-medium">{new Date(year, month, parseInt(day)).toLocaleDateString('es-PE', { weekday: 'long' })}</p>
                            <p className="text-xs text-pure-gray-500">{data.count} orden{data.count > 1 ? 'es' : ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-400">S/ {data.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Total del mes */}
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mt-4">
                      <p className="font-semibold">Total del mes</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        S/ {getMonthlyTotal(year, month).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}

        {/* Vista de Clientes */}
        {activeView === 'customers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats de clientes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold">{customers.length}</span>
                </div>
                <p className="text-xs text-pure-gray-500">Total clientes</p>
              </div>

              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Crown size={20} className="text-emerald-500" />
                  </div>
                  <span className="text-2xl font-bold">
                    {customers.filter(c => c.stats.totalOrders >= 6).length}
                  </span>
                </div>
                <p className="text-xs text-pure-gray-500">Clientes Oro</p>
              </div>

              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Medal size={20} className="text-purple-500" />
                  </div>
                  <span className="text-2xl font-bold">
                    {customers.filter(c => c.stats.totalOrders >= 2 && c.stats.totalOrders < 6).length}
                  </span>
                </div>
                <p className="text-xs text-pure-gray-500">Clientes Plata</p>
              </div>

              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={20} className="text-yellow-500" />
                  </div>
                  <span className="text-2xl font-bold">
                    S/ {customers.reduce((sum, c) => sum + c.stats.totalSpent, 0).toFixed(0)}
                  </span>
                </div>
                <p className="text-xs text-pure-gray-500">Total facturado</p>
              </div>
            </div>

            {/* Top 5 clientes más fieles */}
            <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crown size={20} className="text-yellow-500" />
                Top 5 Clientes más Fieles
              </h3>
              
              {customers.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-pure-gray-800/50 rounded-xl mb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                      index === 1 ? 'bg-gray-400/20 text-gray-400' :
                      index === 2 ? 'bg-orange-600/20 text-orange-600' :
                      'bg-pure-gray-700 text-pure-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{customer.nombre}</p>
                      <p className="text-xs text-pure-gray-500">{customer.email}</p>
                      <p className="text-xs text-pure-gray-400">
                        {customer.stats.totalOrders} compras • 
                        <span className={
                          customer.stats.totalOrders >= 6 ? 'text-yellow-500' :
                          customer.stats.totalOrders >= 2 ? 'text-gray-400' : 'text-orange-600'
                        }>
                          {customer.stats.totalOrders >= 6 ? 'Oro' : 
                           customer.stats.totalOrders >= 2 ? 'Plata' : 'Bronce'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      S/ {customer.stats.totalSpent.toFixed(0)}
                    </p>
                    <p className="text-xs text-pure-gray-500">Total gastado</p>
                  </div>
                </div>
              ))}

              {customers.length === 0 && (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-pure-gray-600 mb-4" />
                  <p className="text-pure-gray-400">Aún no hay clientes registrados</p>
                </div>
              )}
            </div>

            {/* Lista completa de clientes */}
            <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Todos los Clientes</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-pure-black border border-pure-gray-700 rounded-lg text-sm focus:outline-none focus:border-pure-white"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {customers
                  .filter(c => 
                    c.nombre.toLowerCase().includes(customerSearch.toLowerCase()) ||
                    c.email.toLowerCase().includes(customerSearch.toLowerCase())
                  )
                  .map(customer => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-pure-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pure-gray-700 rounded-full flex items-center justify-center">
                          <User size={18} className="text-pure-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.nombre}</p>
                          <p className="text-xs text-pure-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{customer.stats.totalOrders} compras</p>
                        <p className="text-xs text-emerald-400">S/ {customer.stats.totalSpent.toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Vista de Promociones */}
        {activeView === 'promotions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Botón crear promoción */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Promociones</h2>
              <button
                onClick={() => setShowPromoForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-lg hover:bg-pure-gray-200 transition-colors"
              >
                <Plus size={18} />
                Crear Promoción
              </button>
            </div>

            {/* Formulario de promoción */}
            {showPromoForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  Nueva Promoción
                </h3>
                
                <form onSubmit={handlePromoSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre de la promoción *"
                      value={promoFormData.title}
                      onChange={(e) => setPromoFormData({...promoFormData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Código de descuento * (ej: VERANO20)"
                      value={promoFormData.code}
                      onChange={(e) => setPromoFormData({...promoFormData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                      required
                    />
                  </div>

                  <textarea
                    placeholder="Descripción de la promoción"
                    value={promoFormData.description}
                    onChange={(e) => setPromoFormData({...promoFormData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white h-20 resize-none"
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-pure-gray-500 mb-1">% Descuento *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="20"
                        value={promoFormData.discountPercent}
                        onChange={(e) => setPromoFormData({...promoFormData, discountPercent: e.target.value})}
                        className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-pure-gray-500 mb-1">Compra mínima (S/)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={promoFormData.minPurchase}
                        onChange={(e) => setPromoFormData({...promoFormData, minPurchase: e.target.value})}
                        className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-pure-gray-500 mb-1">Válido hasta</label>
                      <input
                        type="date"
                        value={promoFormData.validUntil}
                        onChange={(e) => setPromoFormData({...promoFormData, validUntil: e.target.value})}
                        className="w-full px-4 py-3 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-pure-white text-pure-black font-semibold rounded-lg hover:bg-pure-gray-200 transition-colors"
                    >
                      Crear Promoción
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPromoForm(false)}
                      className="px-6 py-3 bg-pure-gray-800 rounded-lg hover:bg-pure-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Lista de promociones */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map(promo => (
                <div 
                  key={promo.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    promo.isActive 
                      ? 'bg-pure-gray-900/50 border-pure-gray-800' 
                      : 'bg-pure-gray-900/30 border-pure-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift size={20} className={promo.isActive ? 'text-emerald-500' : 'text-pure-gray-500'} />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        promo.isActive 
                          ? 'bg-emerald-500/20 text-emerald-500' 
                          : 'bg-pure-gray-700 text-pure-gray-400'
                      }`}>
                        {promo.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleTogglePromo(promo.id)}
                        className="p-1.5 hover:bg-pure-gray-800 rounded transition-colors"
                        title={promo.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {promo.isActive ? <X size={16} /> : <CheckCircle size={16} className="text-emerald-500" />}
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{promo.title}</h3>
                  <p className="text-sm text-pure-gray-400 mb-3">{promo.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="px-3 py-1.5 bg-pure-black rounded-lg font-mono text-emerald-400">
                      {promo.code}
                    </code>
                    <span className="text-2xl font-bold text-emerald-500">
                      {promo.discountPercent}%
                    </span>
                    <span className="text-sm text-pure-gray-500">OFF</span>
                  </div>

                  <div className="text-xs text-pure-gray-500 space-y-1">
                    {promo.minPurchase > 0 && (
                      <p>Compra mínima: S/ {promo.minPurchase}</p>
                    )}
                    {promo.validUntil && (
                      <p>Válida hasta: {new Date(promo.validUntil).toLocaleDateString('es-PE')}</p>
                    )}
                    <p>Creada: {new Date(promo.createdAt).toLocaleDateString('es-PE')}</p>
                  </div>
                </div>
              ))}

              {promotions.length === 0 && (
                <div className="col-span-full text-center py-12 bg-pure-gray-900/30 border border-pure-gray-800/50 rounded-xl">
                  <Gift size={48} className="mx-auto text-pure-gray-600 mb-4" />
                  <p className="text-pure-gray-400">No hay promociones creadas</p>
                  <p className="text-sm text-pure-gray-500 mt-1">Crea tu primera promoción con el botón de arriba</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
