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
  DollarSign,
  Users
} from 'lucide-react'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [activeView, setActiveView] = useState('orders') // orders, calendar
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
    if (isAuthenticated) {
      loadOrders()
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
      // Update in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
      
      if (error) throw error
      
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
    const today = new Date()
    const monthOrders = []
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i)
      const dayOrders = getOrdersByDate(date)
      if (dayOrders.length > 0) {
        monthOrders.push({
          date,
          orders: dayOrders,
          total: dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)
        })
      }
    }
    
    return monthOrders
  }

  const totalRevenue = orders
    .filter(o => o.status === 'approved')
    .reduce((sum, order) => sum + (order.total_price || 0), 0)

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const approvedOrders = orders.filter(o => o.status === 'approved').length

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-pure-black flex items-center justify-center">
      <div className="text-pure-white">Cargando...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-pure-gray-900 text-pure-white">
      {/* Header */}
      <div className="bg-pure-gray-800 border-b border-pure-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-pure-gray-400 text-sm">Gestión de pedidos y ventas</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-pure-gray-400 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold">S/ {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ShoppingBag size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-pure-gray-400 text-sm">Pedidos Totales</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-pure-gray-400 text-sm">Pendientes</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-pure-gray-400 text-sm">Aprobados</p>
                <p className="text-2xl font-bold">{approvedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveView('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'orders'
                ? 'bg-emerald-500 text-pure-white'
                : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
            }`}
          >
            <ShoppingBag size={18} />
            Pedidos
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'calendar'
                ? 'bg-emerald-500 text-pure-white'
                : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
            }`}
          >
            <Calendar size={18} />
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
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-emerald-500 text-pure-white'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-500 text-pure-white'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'approved'
                    ? 'bg-green-500 text-pure-white'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                Aprobados
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'rejected'
                    ? 'bg-red-500 text-pure-white'
                    : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                }`}
              >
                Rechazados
              </button>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-12 text-pure-gray-400">Cargando pedidos...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-pure-gray-400">No hay pedidos</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : order.status === 'approved'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.status === 'pending' ? 'Pendiente' : 
                             order.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                          </span>
                          <span className="text-pure-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">
                          {order.customer_email || 'Cliente sin email'}
                        </h3>
                        <p className="text-pure-gray-400 text-sm">
                          {order.items?.length || 0} productos - Total: S/ {(order.total_price || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'approved')}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-pure-white rounded-lg transition-colors"
                            >
                              <Check size={18} />
                              Aceptar
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'rejected')}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-pure-white rounded-lg transition-colors"
                            >
                              <X size={18} />
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
            {/* Weekly View */}
            <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-emerald-400" />
                Ventas Semanales
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {getWeeklyOrders().map((day, index) => (
                  <div
                    key={index}
                    className="bg-pure-gray-900 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-pure-gray-400 mb-1">
                      {day.date.toLocaleDateString('es-PE', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-pure-white">
                      {day.orders.length}
                    </p>
                    <p className="text-xs text-emerald-400">
                      S/ {day.total.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly View */}
            <div className="bg-pure-gray-800 rounded-xl p-6 border border-pure-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-400" />
                Ventas Mensuales
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm text-pure-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {getMonthlyOrders().map((day, index) => (
                  <div
                    key={index}
                    className="bg-pure-gray-900 rounded-lg p-2 text-center hover:bg-pure-gray-700 transition-colors cursor-pointer"
                  >
                    <p className="text-sm text-pure-white mb-1">
                      {day.date.getDate()}
                    </p>
                    {day.orders.length > 0 && (
                      <>
                        <p className="text-xs text-emerald-400">
                          {day.orders.length}
                        </p>
                        <p className="text-xs text-pure-gray-400">
                          S/ {day.total.toFixed(0)}
                        </p>
                      </>
                    )}
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
