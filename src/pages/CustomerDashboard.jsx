import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Package, 
  Gift, 
  Star, 
  LogOut, 
  Edit2, 
  Save,
  ChevronRight,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Award,
  Users,
  Copy,
  Check
} from 'lucide-react'
import { useCustomerAuth, LOYALTY_LEVELS } from '../context/CustomerAuthContext'
import { jsPDF } from 'jspdf'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

export default function CustomerDashboard() {
  const { 
    customer, 
    isLoggedIn, 
    logout, 
    loyaltyLevel, 
    totalOrders, 
    totalSpent,
    getOrderHistory,
    updateProfile,
    getNextLevelProgress,
    calculateDiscount
  } = useCustomerAuth()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [copied, setCopied] = useState(false)
  
  const orderHistory = getOrderHistory()
  const nextLevelProgress = getNextLevelProgress()
  
  // Si no está logueado, redirigir o mostrar mensaje
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-pure-black text-pure-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8">
            <User size={64} className="mx-auto text-pure-gray-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Inicia sesión</h2>
            <p className="text-pure-gray-400 mb-4">Para ver tu cuenta, primero debes iniciar sesión</p>
            <button
              onClick={() => window.location.href = '/?login=true'}
              className="px-6 py-3 bg-pure-white text-pure-black font-semibold rounded-lg hover:bg-pure-gray-200 transition-colors"
            >
              Ir a la página principal
            </button>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </div>
    )
  }

  const handleEdit = () => {
    setEditData({
      nombre: customer.nombre,
      telefono: customer.telefono,
      empresa: customer.empresa || ''
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
  }

  const downloadOrderPDF = (order) => {
    const doc = new jsPDF()
    
    const black = [0, 0, 0]
    const darkGray = [30, 30, 30]
    const mediumGray = [100, 100, 100]
    const lightGray = [230, 230, 230]
    
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, 210, 297, 'F')
    
    doc.setFillColor(...darkGray)
    doc.rect(0, 0, 210, 45, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(' CODEOL', 20, 24)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('SOFTWARE PERÚ', 20, 32)
    
    doc.setFontSize(9)
    doc.text(`ORDEN #${order.id.slice(-6)}`, 150, 20)
    doc.text(new Date(order.createdAt).toLocaleDateString('es-PE'), 150, 26)
    
    const statusColor = order.status === 'approved' ? [34, 197, 94] : 
                        order.status === 'rejected' ? [239, 68, 68] : [234, 179, 8]
    doc.setFillColor(...statusColor)
    doc.roundedRect(150, 30, 40, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    const statusText = order.status === 'approved' ? 'APROBADO' : 
                       order.status === 'rejected' ? 'RECHAZADO' : 'PENDIENTE'
    doc.text(statusText, 170, 35, { align: 'center' })
    
    doc.setTextColor(...black)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DEL CLIENTE', 20, 65)
    
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
    
    y += 10
    doc.setTextColor(...black)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SERVICIOS CONTRATADOS', 20, y)
    doc.setDrawColor(...lightGray)
    doc.line(20, y + 3, 190, y + 3)
    
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
    
    y += 15
    doc.setDrawColor(...lightGray)
    doc.line(20, y - 5, 190, y - 5)
    
    const subtotal = order.totalPrice || 0
    const igv = subtotal * 0.18
    const total = subtotal + igv
    
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
    doc.setFillColor(...darkGray)
    doc.roundedRect(125, y - 6, 65, 12, 3, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL: S/ ${total.toFixed(2)}`, 157, y + 2, { align: 'center' })
    
    y += 20
    doc.setTextColor(...mediumGray)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Método de pago:', 20, y)
    doc.setTextColor(...black)
    doc.setFont('helvetica', 'bold')
    doc.text(order.paymentMethod?.toUpperCase() || 'N/A', 55, y)
    
    doc.setFillColor(...darkGray)
    doc.rect(0, 280, 210, 17, 'F')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('codeolsoftware@gmail.com  |  +51 916 895 252  |  codeolsoftware.work', 105, 290, { align: 'center' })
    doc.setFontSize(7)
    doc.text('Gracias por confiar en nosotros', 105, 294, { align: 'center' })
    
    doc.save(`comprobante-${order.id.slice(-6)}.pdf`)
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(customer.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={18} className="text-green-500" />
      case 'rejected': return <XCircle size={18} className="text-red-500" />
      default: return <Clock size={18} className="text-yellow-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprobado'
      case 'rejected': return 'Rechazado'
      default: return 'Pendiente'
    }
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header del Dashboard */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${loyaltyLevel.color}30`, border: `2px solid ${loyaltyLevel.color}` }}
            >
              <Award size={28} style={{ color: loyaltyLevel.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">¡Hola, {customer.nombre.split(' ')[0]}!</h1>
              <p className="text-pure-gray-400 flex items-center gap-2">
                Nivel 
                <span 
                  className="font-semibold px-2 py-0.5 rounded text-sm"
                  style={{ backgroundColor: `${loyaltyLevel.color}30`, color: loyaltyLevel.color }}
                >
                  {loyaltyLevel.name}
                </span>
                • {totalOrders} {totalOrders === 1 ? 'compra' : 'compras'}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-pure-gray-800 rounded-lg hover:bg-pure-gray-700 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-emerald-500" />
              </div>
              <span className="text-2xl font-bold">S/ {totalSpent.toFixed(0)}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Total gastado</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-blue-500" />
              </div>
              <span className="text-2xl font-bold">{totalOrders}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Órdenes aprobadas</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Gift size={20} className="text-purple-500" />
              </div>
              <span className="text-2xl font-bold">{(loyaltyLevel.discount * 100).toFixed(0)}%</span>
            </div>
            <p className="text-xs text-pure-gray-500">Tu descuento</p>
          </div>

          <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-yellow-500" />
              </div>
              <span className="text-lg font-bold truncate">{customer.referralCode}</span>
            </div>
            <p className="text-xs text-pure-gray-500">Tu código de referido</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-pure-gray-800">
          {[
            { id: 'overview', label: 'Resumen', icon: Star },
            { id: 'orders', label: 'Mis Compras', icon: Package },
            { id: 'profile', label: 'Mi Perfil', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-pure-white text-pure-white' 
                  : 'border-transparent text-pure-gray-400 hover:text-pure-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Resumen */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Próximo nivel */}
              {nextLevelProgress && (
                <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-emerald-500" />
                    Tu progreso
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-pure-gray-400">Actual: {loyaltyLevel.name}</span>
                      <span style={{ color: nextLevelProgress.level.color }}>Siguiente: {nextLevelProgress.level.name}</span>
                    </div>
                    <div className="h-3 bg-pure-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${nextLevelProgress.progressPercent}%`,
                          backgroundColor: loyaltyLevel.color
                        }}
                      />
                    </div>
                    <p className="text-xs text-pure-gray-500 mt-2">
                      Faltan {nextLevelProgress.ordersNeeded} compras más para subir a {nextLevelProgress.level.name}
                      (descuento del {(nextLevelProgress.level.discount * 100).toFixed(0)}%)
                    </p>
                  </div>
                </div>
              )}

              {/* Código de referido */}
              <div className="bg-gradient-to-r from-pure-gray-900 to-pure-gray-800 border border-pure-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Users size={20} className="text-yellow-500" />
                  Invita y Gana
                </h3>
                <p className="text-pure-gray-400 text-sm mb-4">
                  Comparte tu código con amigos. Cuando hagan su primera compra, ambos recibirán un descuento especial.
                </p>
                
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-4 py-3 bg-pure-black rounded-lg font-mono text-lg text-center">
                    {customer.referralCode}
                  </code>
                  <button
                    onClick={copyReferralCode}
                    className="p-3 bg-pure-white text-pure-black rounded-lg hover:bg-pure-gray-200 transition-colors"
                    title="Copiar código"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-500 mt-2">¡Código copiado!</p>
                )}
              </div>

              {/* Últimas órdenes */}
              <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Últimas compras</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-pure-gray-400 hover:text-pure-white flex items-center gap-1"
                  >
                    Ver todas <ChevronRight size={16} />
                  </button>
                </div>
                
                {orderHistory.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-pure-gray-800/50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">Orden #{order.id.slice(-6)}</p>
                        <p className="text-xs text-pure-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">S/ {((order.totalPrice || 0) * 1.18).toFixed(2)}</p>
                  </div>
                ))}
                
                {orderHistory.length === 0 && (
                  <p className="text-pure-gray-500 text-center py-4">
                    Aún no tienes compras. ¡Explora nuestros servicios!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mis Compras */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orderHistory.length === 0 ? (
                <div className="text-center py-12 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl">
                  <Package size={48} className="mx-auto text-pure-gray-600 mb-4" />
                  <p className="text-pure-gray-400">No tienes compras aún</p>
                </div>
              ) : (
                orderHistory.map(order => (
                  <div key={order.id} className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          order.status === 'approved' ? 'bg-green-500/20' :
                          order.status === 'rejected' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-semibold">Orden #{order.id.slice(-6)}</p>
                          <p className="text-xs text-pure-gray-500">
                            {new Date(order.createdAt).toLocaleString('es-PE')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm p-2 bg-pure-gray-800/30 rounded">
                          <span>{item.name} x{item.quantity}</span>
                          <span>S/ {item.customPrice ? (item.customPrice * item.quantity).toFixed(2) : 'Cotizar'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-pure-gray-800">
                      <p className="text-lg font-bold">Total: S/ {((order.totalPrice || 0) * 1.18).toFixed(2)}</p>
                      
                      {order.status === 'approved' && (
                        <button
                          onClick={() => downloadOrderPDF(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-pure-gray-800 rounded-lg hover:bg-pure-gray-700 transition-colors text-sm"
                        >
                          <Download size={16} />
                          Descargar comprobante
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Mi Perfil */}
          {activeTab === 'profile' && (
            <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User size={20} />
                  Información personal
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-pure-gray-800 rounded-lg hover:bg-pure-gray-700 transition-colors"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-lg hover:bg-pure-gray-200 transition-colors"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Nombre completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                      className="w-full px-4 py-2 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                    />
                  ) : (
                    <p className="font-medium">{customer.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Correo electrónico</label>
                  <p className="font-medium">{customer.email}</p>
                </div>

                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.telefono}
                      onChange={(e) => setEditData({...editData, telefono: e.target.value})}
                      className="w-full px-4 py-2 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                    />
                  ) : (
                    <p className="font-medium">{customer.telefono}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Empresa (opcional)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.empresa}
                      onChange={(e) => setEditData({...editData, empresa: e.target.value})}
                      className="w-full px-4 py-2 bg-pure-black border border-pure-gray-700 rounded-lg focus:outline-none focus:border-pure-white"
                      placeholder="Tu empresa"
                    />
                  ) : (
                    <p className="font-medium">{customer.empresa || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Miembro desde</label>
                  <p className="font-medium">
                    {new Date(customer.createdAt).toLocaleDateString('es-PE')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-pure-gray-500 mb-1">Código de referido</label>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-2 bg-pure-black rounded font-mono text-sm">
                      {customer.referralCode}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 hover:bg-pure-gray-800 rounded transition-colors"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  )
}
