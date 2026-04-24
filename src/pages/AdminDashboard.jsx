import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  Check, 
  Clock, 
  X,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellRing
} from 'lucide-react'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [activeView, setActiveView] = useState('orders') // orders, calendar
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayDetails, setShowDayDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
    if (isAuthenticated) {
      loadOrders()
      loadNotifications()
      subscribeToNotifications()
    }
  }, [isAuthenticated, filter])

  const checkAuth = async () => {
    if (!isSupabaseConfigured()) return
    
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      
      if (adminData) {
        setIsAuthenticated(true)
      } else {
        navigate('/admin-login')
      }
    } else {
      navigate('/admin-login')
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Fallback to localStorage if Supabase fails
      if (!data || data.length === 0) {
        const localOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
        setOrders(localOrders)
      } else {
        setOrders(data)
      }
    } catch (err) {
      console.error('Error loading orders:', err)
      const localOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
      setOrders(localOrders)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Get order details first
      const order = orders.find(o => o.id === orderId)
      
      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
    
      if (error) throw error
      
      // Create notification for customer
      if (order && order.customer_id) {
        const statusText = newStatus === 'approved' ? 'aceptado' : newStatus === 'rejected' ? 'rechazado' : 'actualizado'
        const title = newStatus === 'approved' ? '¡Pedido Aprobado!' : newStatus === 'rejected' ? 'Pedido Rechazado' : 'Estado Actualizado'
        const message = `Tu pedido #${orderId.slice(-6)} ha sido ${statusText}. Total: S/ ${(order.total_price || 0).toFixed(2)}`
        
        await createNotification(order.customer_id, title, message, 'order-status')
      }
    
      // Also update localStorage
      const localOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
      const updatedOrders = localOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('codeol-orders', JSON.stringify(updatedOrders))
    
      loadOrders()
    } catch (err) {
      console.error('Error updating order:', err)
      // Fallback to localStorage only
      const localOrders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
      const updatedOrders = localOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('codeol-orders', JSON.stringify(updatedOrders))
      loadOrders()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.read).length)
    } catch (err) {
      console.error('Error loading notifications:', err)
    }
  }

  const subscribeToNotifications = () => {
    const subscription = supabase
      .channel('admin-notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
      
      if (error) throw error
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const createNotification = async (customerId, title, message, type = 'order-status') => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          customer_id: customerId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
    } catch (err) {
      console.error('Error creating notification:', err)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  // Calendar calculations
  const getOrdersByDate = (date) => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.toDateString() === date.toDateString()
    })
  }

  const getWeeklyOrders = () => {
    const today = new Date()
    const weekOrders = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayOrders = getOrdersByDate(date)
      weekOrders.push({
        date,
        orders: dayOrders,
        total: dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)
      })
    }
    
    return weekOrders
  }

  const getMonthlyOrders = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const monthDays = []
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      monthDays.push(null)
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const dayOrders = getOrdersByDate(date)
      monthDays.push({
        date,
        orders: dayOrders,
        total: dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)
      })
    }
    
    return monthDays
  }

  const getMonthStats = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getFullYear() === year && orderDate.getMonth() === month
    })
    
    return {
      total: monthOrders.length,
      approved: monthOrders.filter(o => o.status === 'approved').length,
      pending: monthOrders.filter(o => o.status === 'pending').length,
      revenue: monthOrders
        .filter(o => o.status === 'approved')
        .reduce((sum, order) => sum + (order.total_price || 0), 0)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDayClick = (dayData) => {
    if (dayData && dayData.orders.length > 0) {
      setSelectedDate(dayData)
      setShowDayDetails(true)
    }
  }

  const totalRevenue = orders
    .filter(o => o.status === 'approved')
    .reduce((sum, order) => sum + (order.total_price || 0), 0)

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const approvedOrders = orders.filter(o => o.status === 'approved').length

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-pure-black flex items-center justify-center">
      <div className="text-pure-white text-sm tracking-wide">Cargando...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      {/* Header */}
      <div className="border-b border-pure-gray-800 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-pure-gray-400 text-sm tracking-wide">Gestión de pedidos</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-2 px-4 py-2 bg-pure-gray-800/50 hover:bg-pure-gray-800 text-pure-gray-400 hover:text-pure-white rounded-lg transition-all text-sm relative"
              >
                {unreadCount > 0 ? <BellRing size={16} className="text-emerald-400" /> : <Bell size={16} />}
                <span className="hidden sm:inline">Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-pure-gray-900 rounded-xl border border-pure-gray-800 shadow-xl z-50 max-h-96 overflow-auto">
                  <div className="p-4 border-b border-pure-gray-800">
                    <h3 className="font-bold text-sm">Notificaciones</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-pure-gray-400 text-sm">
                      No hay notificaciones
                    </div>
                  ) : (
                    <div className="divide-y divide-pure-gray-800">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`w-full p-4 text-left hover:bg-pure-gray-800/50 transition-all ${
                            !notification.read ? 'bg-pure-gray-800/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              !notification.read ? 'bg-emerald-400' : 'bg-pure-gray-600'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-pure-white' : 'text-pure-gray-400'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-pure-gray-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-pure-gray-600 mt-1">
                                {new Date(notification.created_at).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-pure-gray-800/50 hover:bg-pure-gray-800 text-pure-gray-400 hover:text-pure-white rounded-lg transition-all text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
            <p className="text-pure-gray-400 text-xs tracking-wide mb-2">Ingresos</p>
            <p className="text-2xl font-bold tracking-tight">S/ {totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
            <p className="text-pure-gray-400 text-xs tracking-wide mb-2">Pedidos</p>
            <p className="text-2xl font-bold tracking-tight">{orders.length}</p>
          </div>

          <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
            <p className="text-pure-gray-400 text-xs tracking-wide mb-2">Pendientes</p>
            <p className="text-2xl font-bold tracking-tight text-yellow-400">{pendingOrders}</p>
          </div>

          <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
            <p className="text-pure-gray-400 text-xs tracking-wide mb-2">Aprobados</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-400">{approvedOrders}</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
              activeView === 'orders'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
            }`}
          >
            <ShoppingBag size={16} />
            Pedidos
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
              activeView === 'calendar'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
            }`}
          >
            <Calendar size={16} />
            Calendario
          </button>
        </div>

        {/* Orders View */}
        {activeView === 'orders' && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
                  filter === 'all'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
                  filter === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
                  filter === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
                }`}
              >
                Aprobados
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg transition-all text-sm tracking-wide ${
                  filter === 'rejected'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-pure-gray-900/50 text-pure-gray-400 hover:bg-pure-gray-900'
                }`}
              >
                Rechazados
              </button>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-12 text-pure-gray-400 text-sm">Cargando pedidos...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-pure-gray-400 text-sm">No hay pedidos</div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                            order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : order.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.status === 'pending' ? 'Pendiente' : 
                             order.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </span>
                          <span className="text-pure-gray-400 text-xs">
                            {new Date(order.created_at).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1 tracking-tight">
                          {order.customer_email || 'Cliente sin email'}
                        </h3>
                        <p className="text-pure-gray-400 text-sm">
                          {order.items?.length || 0} productos · S/ {(order.total_price || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all text-sm tracking-wide"
                            >
                              <Check size={16} />
                              Aceptar
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm tracking-wide"
                            >
                              <X size={16} />
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="space-y-6">
            {/* Monthly Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(() => {
                const stats = getMonthStats()
                return (
                  <>
                    <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-pure-gray-800">
                      <p className="text-pure-gray-400 text-xs tracking-wide mb-1">Total Mes</p>
                      <p className="text-xl font-bold tracking-tight">{stats.total}</p>
                    </div>
                    <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-pure-gray-800">
                      <p className="text-pure-gray-400 text-xs tracking-wide mb-1">Aprobados</p>
                      <p className="text-xl font-bold tracking-tight text-emerald-400">{stats.approved}</p>
                    </div>
                    <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-pure-gray-800">
                      <p className="text-pure-gray-400 text-xs tracking-wide mb-1">Pendientes</p>
                      <p className="text-xl font-bold tracking-tight text-yellow-400">{stats.pending}</p>
                    </div>
                    <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-pure-gray-800">
                      <p className="text-pure-gray-400 text-xs tracking-wide mb-1">Ingresos</p>
                      <p className="text-xl font-bold tracking-tight">S/ {stats.revenue.toFixed(0)}</p>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Full Calendar */}
            <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-400" />
                  {currentMonth.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 bg-pure-gray-800/50 hover:bg-pure-gray-800 rounded-lg transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 bg-pure-gray-800/50 hover:bg-pure-gray-800 rounded-lg transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-xs text-pure-gray-400 py-2 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {getMonthlyOrders().map((dayData, index) => (
                  <div key={index}>
                    {dayData === null ? (
                      <div className="aspect-square min-h-[40px] sm:min-h-[60px] md:min-h-[80px]" />
                    ) : (
                      <button
                        onClick={() => handleDayClick(dayData)}
                        className={`w-full aspect-square min-h-[40px] sm:min-h-[60px] md:min-h-[80px] rounded-lg p-1 sm:p-2 flex flex-col items-center justify-center transition-all ${
                          dayData.orders.length > 0
                            ? 'bg-pure-gray-800/50 hover:bg-pure-gray-800 cursor-pointer'
                            : 'bg-pure-gray-900/30'
                        }`}
                      >
                        <span className={`text-xs sm:text-sm font-medium ${
                          dayData.orders.length > 0 ? 'text-pure-white' : 'text-pure-gray-500'
                        }`}>
                          {dayData.date.getDate()}
                        </span>
                        {dayData.orders.length > 0 && (
                          <div className="mt-0.5 sm:mt-1 text-center hidden sm:block">
                            <span className="text-[10px] sm:text-xs text-emerald-400 font-medium block">
                              {dayData.orders.length} ped
                            </span>
                            <span className="text-[10px] sm:text-xs text-pure-gray-400 block">
                              S/ {dayData.total.toFixed(0)}
                            </span>
                          </div>
                        )}
                        {/* Mobile indicator */}
                        {dayData.orders.length > 0 && (
                          <div className="sm:hidden mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full block"></span>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly View */}
            <div className="bg-pure-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-pure-gray-800">
              <h2 className="text-lg font-bold mb-4 tracking-tight flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                Últimos 7 Días
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {getWeeklyOrders().map((day, index) => (
                  <div
                    key={index}
                    className="bg-pure-gray-800/50 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-pure-gray-400 mb-1">
                      {day.date.toLocaleDateString('es-PE', { weekday: 'short' })}
                    </p>
                    <p className="text-xs text-pure-gray-500 mb-1">
                      {day.date.getDate()}
                    </p>
                    <p className="text-lg font-bold text-pure-white tracking-tight">
                      {day.orders.length}
                    </p>
                    <p className="text-xs text-emerald-400">
                      S/ {day.total.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Day Details Modal */}
        {showDayDetails && selectedDate && (
          <div className="fixed inset-0 bg-pure-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-pure-gray-900 rounded-xl border border-pure-gray-800 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-pure-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {selectedDate.date.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-pure-gray-400 text-sm mt-1">
                    {selectedDate.orders.length} pedidos · S/ {selectedDate.total.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDayDetails(false)}
                  className="p-2 hover:bg-pure-gray-800 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {selectedDate.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-pure-gray-800/50 rounded-lg p-4 border border-pure-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : order.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status === 'pending' ? 'Pendiente' : 
                         order.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                      <span className="text-pure-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{order.customer_email || 'Cliente sin email'}</p>
                    <p className="text-pure-gray-400 text-sm">
                      {order.items?.length || 0} productos · S/ {(order.total_price || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
