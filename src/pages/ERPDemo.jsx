import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  Receipt,
  TrendingUp,
  ArrowLeft,
  Menu,
  X,
  DollarSign,
  ShoppingCart,
  ChefHat,
  Clock,
  Calendar,
  ChevronDown,
  Search,
  Bell,
  MoreVertical,
  Plus,
  Filter
} from 'lucide-react'

const branches = [
  { id: 1, name: 'Sucursal Lima Centro', manager: 'Carlos Ruiz', sales: 45600, orders: 342, status: 'active' },
  { id: 2, name: 'Sucursal Miraflores', manager: 'Ana García', sales: 52300, orders: 418, status: 'active' },
  { id: 3, name: 'Sucursal San Isidro', manager: 'Luis Torres', sales: 38900, orders: 298, status: 'active' },
  { id: 4, name: 'Sucursal Surco', manager: 'María López', sales: 41200, orders: 325, status: 'maintenance' },
  { id: 5, name: 'Sucursal La Molina', manager: 'Pedro Sánchez', sales: 47800, orders: 367, status: 'active' },
  { id: 6, name: 'Sucursal Barranco', manager: 'Diana Flores', sales: 35600, orders: 276, status: 'active' },
]

const inventory = [
  { id: 1, item: 'Pollo fresco', stock: 45, unit: 'kg', minStock: 20, supplier: 'Avícola Perú' },
  { id: 2, item: 'Papa amarilla', stock: 120, unit: 'kg', minStock: 50, supplier: 'AgroAndina' },
  { id: 3, item: 'Arroz', stock: 85, unit: 'kg', minStock: 30, supplier: 'Costa Norte' },
  { id: 4, item: 'Leche evaporada', stock: 24, unit: 'latas', minStock: 40, supplier: 'Gloria SA', low: true },
  { id: 5, item: 'Huevos', stock: 360, unit: 'unid', minStock: 200, supplier: 'Huevos del Norte' },
  { id: 6, item: 'Aceite vegetal', stock: 15, unit: 'lt', minStock: 25, supplier: 'Primor', low: true },
]

const recentOrders = [
  { id: 'ORD-7842', table: 'Mesa 12', items: 4, total: 156, status: 'completed', time: '10:23' },
  { id: 'ORD-7843', table: 'Mesa 8', items: 6, total: 234, status: 'preparing', time: '10:25' },
  { id: 'ORD-7844', table: 'Mesa 15', items: 2, total: 89, status: 'pending', time: '10:28' },
  { id: 'ORD-7845', table: 'Mesa 3', items: 3, total: 178, status: 'preparing', time: '10:30' },
]

const employees = [
  { id: 1, name: 'Juan Pérez', role: 'Chef Principal', branch: 'Miraflores', status: 'active' },
  { id: 2, name: 'María Santos', role: 'Mesera', branch: 'Lima Centro', status: 'active' },
  { id: 3, name: 'Luis Ramos', role: 'Cajero', branch: 'San Isidro', status: 'off' },
  { id: 4, name: 'Carmen Vega', role: 'Ayudante Cocina', branch: 'Miraflores', status: 'active' },
]

export default function ERPDemo() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(branches[0])
  const [notifications, setNotifications] = useState(3)

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'branches', icon: Store, label: 'Sucursales' },
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'orders', icon: Receipt, label: 'Órdenes' },
    { id: 'employees', icon: Users, label: 'Empleados' },
  ]

  const totalSales = branches.reduce((sum, b) => sum + b.sales, 0)
  const totalOrders = branches.reduce((sum, b) => sum + b.orders, 0)
  const avgTicket = totalSales / totalOrders

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-pure-black/95 backdrop-blur-md border-b border-pure-gray-800">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-pure-gray-400 hover:text-pure-white transition-colors">
              <ArrowLeft size={20} />
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pure-white rounded-lg flex items-center justify-center">
                <ChefHat size={18} className="text-pure-black" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold">RestoManager</h1>
                <p className="text-xs text-pure-gray-500">ERP Demo</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-pure-gray-900 rounded-lg border border-pure-gray-800">
              <Store size={14} className="text-pure-gray-500" />
              <select 
                value={selectedBranch.id}
                onChange={(e) => setSelectedBranch(branches.find(b => b.id === parseInt(e.target.value)))}
                className="bg-transparent text-sm outline-none min-w-[120px]"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="relative p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-pure-gray-900/50 border-r border-pure-gray-800 flex-col">
        <nav className="p-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-pure-white text-pure-black' 
                    : 'hover:bg-pure-gray-800 text-pure-gray-400 hover:text-pure-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-pure-white rounded-r-full"
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-pure-gray-800">
          <div className="p-4 bg-pure-gray-800/50 rounded-xl">
            <p className="text-xs text-pure-gray-500 mb-2">Almacenamiento</p>
            <div className="h-2 bg-pure-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-pure-white rounded-full" />
            </div>
            <p className="text-xs mt-2">75% usado</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 lg:p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign size={20} className="text-green-400" />
                    </div>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp size={12} />
                      +12%
                    </span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">S/ {(totalSales / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-pure-gray-400 mt-1">Ventas hoy</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 lg:p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <ShoppingCart size={20} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-blue-400">+8%</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">{totalOrders}</p>
                  <p className="text-sm text-pure-gray-400 mt-1">Órdenes</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 lg:p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Receipt size={20} className="text-purple-400" />
                    </div>
                    <span className="text-xs text-purple-400">+5%</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">S/ {avgTicket.toFixed(0)}</p>
                  <p className="text-sm text-pure-gray-400 mt-1">Ticket promedio</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 lg:p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Clock size={20} className="text-orange-400" />
                    </div>
                    <span className="text-xs text-orange-400">-2min</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold">18m</p>
                  <p className="text-sm text-pure-gray-400 mt-1">Tiempo promedio</p>
                </motion.div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Ventas por hora</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-pure-gray-800 rounded-full">Hoy</button>
                      <button className="px-3 py-1 text-xs text-pure-gray-500 hover:bg-pure-gray-800 rounded-full transition-colors">Semana</button>
                    </div>
                  </div>
                  <div className="h-48 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 70, 85, 60].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-pure-white/20 hover:bg-pure-white/40 rounded-t-sm transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-pure-gray-500">
                    <span>8AM</span>
                    <span>12PM</span>
                    <span>4PM</span>
                    <span>8PM</span>
                    <span>10PM</span>
                  </div>
                </div>

                {/* Top Products */}
                <div className="p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl">
                  <h3 className="font-semibold mb-4">Platos más vendidos</h3>
                  <div className="space-y-3">
                    {['Lomo Saltado', 'Causa Limeña', 'Ají de Gallina', 'Papa a la Huancaína'].map((dish, i) => (
                      <div key={dish} className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-pure-gray-800 rounded text-xs">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{dish}</p>
                          <div className="h-1.5 bg-pure-gray-800 rounded-full mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${90 - i * 15}%` }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="h-full bg-pure-white rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-xs text-pure-gray-500">{120 - i * 25}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="p-6 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Órdenes recientes</h3>
                  <button className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">
                    Ver todas
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-pure-gray-500 border-b border-pure-gray-800">
                        <th className="pb-3 font-medium">Orden</th>
                        <th className="pb-3 font-medium">Mesa</th>
                        <th className="pb-3 font-medium">Items</th>
                        <th className="pb-3 font-medium">Total</th>
                        <th className="pb-3 font-medium">Estado</th>
                        <th className="pb-3 font-medium">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-pure-gray-800/50 last:border-0">
                          <td className="py-3 font-medium">{order.id}</td>
                          <td className="py-3 text-pure-gray-400">{order.table}</td>
                          <td className="py-3">{order.items}</td>
                          <td className="py-3">S/ {order.total}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'preparing' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-pure-gray-700 text-pure-gray-400'
                            }`}>
                              {order.status === 'completed' ? 'Completado' :
                               order.status === 'preparing' ? 'Preparando' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="py-3 text-pure-gray-500">{order.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Branches Tab */}
          {activeTab === 'branches' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Gestión de Sucursales</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-full text-sm font-medium"
                >
                  <Plus size={16} />
                  Nueva sucursal
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="p-5 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl cursor-pointer"
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-pure-gray-800 rounded-lg">
                        <Store size={20} />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        branch.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {branch.status === 'active' ? 'Activa' : 'Mantenimiento'}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{branch.name}</h3>
                    <p className="text-sm text-pure-gray-500 mb-4">Gerente: {branch.manager}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pure-gray-800">
                      <div>
                        <p className="text-lg font-bold">S/ {(branch.sales / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-pure-gray-500">Ventas hoy</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{branch.orders}</p>
                        <p className="text-xs text-pure-gray-500">Órdenes</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Control de Inventario</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-pure-gray-800 rounded-lg text-sm">
                    <Filter size={16} />
                    Filtrar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-lg text-sm font-medium">
                    <Plus size={16} />
                    Nuevo item
                  </button>
                </div>
              </div>

              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-pure-gray-800/50">
                    <tr className="text-left text-xs text-pure-gray-500">
                      <th className="p-4 font-medium">Producto</th>
                      <th className="p-4 font-medium">Stock actual</th>
                      <th className="p-4 font-medium">Mínimo</th>
                      <th className="p-4 font-medium">Proveedor</th>
                      <th className="p-4 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b border-pure-gray-800/50 last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              item.low ? 'bg-red-500/20' : 'bg-green-500/20'
                            }`}>
                              <Package size={16} className={item.low ? 'text-red-400' : 'text-green-400'} />
                            </div>
                            <span className="font-medium">{item.item}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={item.low ? 'text-red-400 font-semibold' : ''}>
                            {item.stock} {item.unit}
                          </span>
                        </td>
                        <td className="p-4 text-pure-gray-500">{item.minStock} {item.unit}</td>
                        <td className="p-4 text-pure-gray-400">{item.supplier}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.low 
                              ? 'bg-red-500/20 text-red-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {item.low ? 'Stock bajo' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-semibold mb-6">Gestión de Órdenes</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {['pending', 'preparing', 'completed'].map((status) => (
                  <div key={status} className="p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'pending' ? 'bg-pure-gray-500' :
                        status === 'preparing' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      <span className="text-sm text-pure-gray-400">
                        {status === 'pending' ? 'Pendientes' :
                         status === 'preparing' ? 'En preparación' :
                         'Completadas'}
                      </span>
                    </div>
                    <p className="text-2xl font-bold">
                      {recentOrders.filter(o => o.status === status).length}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center py-12 text-pure-gray-500">
                <Receipt size={48} className="mx-auto mb-4 opacity-50" />
                <p>Sistema de órdenes en tiempo real</p>
              </div>
            </motion.div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Gestión de Empleados</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-lg text-sm font-medium">
                  <Plus size={16} />
                  Nuevo empleado
                </button>
              </div>

              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl">
                {employees.map((emp, index) => (
                  <motion.div
                    key={emp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border-b border-pure-gray-800/50 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pure-gray-800 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-pure-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-sm text-pure-gray-500">{emp.role} • {emp.branch}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      emp.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-pure-gray-700 text-pure-gray-400'
                    }`}>
                      {emp.status === 'active' ? 'Activo' : 'Descanso'}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-pure-black lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pure-white rounded-lg flex items-center justify-center">
                    <ChefHat size={18} className="text-pure-black" />
                  </div>
                  <span className="font-semibold">RestoManager</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-pure-white text-pure-black' 
                          : 'text-pure-gray-400'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="font-medium text-lg">{item.label}</span>
                    </motion.button>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
