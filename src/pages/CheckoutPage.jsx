import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { 
  ArrowLeft, 
  Smartphone, 
  Wallet, 
  Building2,
  CheckCircle,
  Loader2,
  Lock
} from 'lucide-react'

const paymentMethods = [
  { id: 'yape', name: 'Yape', icon: Smartphone, color: 'bg-purple-500' },
  { id: 'lemon', name: 'Lemon Cash', icon: Wallet, color: 'bg-yellow-500' },
  { id: 'transferencia', name: 'Transferencia bancaria', icon: Building2, color: 'bg-pure-gray-600' },
]

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    ruc: '',
    direccion: '',
  })

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Save order to localStorage for admin dashboard
    const order = {
      customer: formData,
      items: cart,
      totalPrice: totalPrice,
      paymentMethod: selectedPayment,
      status: 'pending'
    }
    
    const orders = JSON.parse(localStorage.getItem('codeol-orders') || '[]')
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    orders.unshift(newOrder)
    localStorage.setItem('codeol-orders', JSON.stringify(orders))
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsCompleted(true)
    clearCart()
    
    // Store order reference for customer tracking
    localStorage.setItem('last-order-id', newOrder.id)
    
    setTimeout(() => navigate('/order-status'), 5000)
  }

  if (cart.length === 0 && !isCompleted) {
    return (
      <div className="min-h-screen bg-pure-black text-pure-white">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-pure-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={32} className="text-pure-gray-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Carrito vacío</h1>
            <p className="text-pure-gray-400 mb-6">No hay servicios en tu carrito para pagar.</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
            >
              Ver servicios
            </Link>
          </div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-pure-black text-pure-white">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="max-w-md mx-auto px-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-green-500" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">¡Orden recibida!</h1>
            <p className="text-pure-gray-400 mb-2">
              Hemos recibido tu pedido. Te contactaremos en menos de 24 horas para confirmar el pago y los detalles del proyecto.
            </p>
            <p className="text-sm text-pure-gray-500 mb-6">
              Se envió un resumen a {formData.email}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/services" className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-sm text-pure-gray-400">Completa tu orden</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pure-white' : 'text-pure-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-pure-white text-pure-black' : 'bg-pure-gray-800'}`}>
                1
              </div>
              <span className="text-sm hidden sm:inline">Datos</span>
            </div>
            <div className="flex-1 h-px bg-pure-gray-800" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pure-white' : 'text-pure-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-pure-white text-pure-black' : 'bg-pure-gray-800'}`}>
                2
              </div>
              <span className="text-sm hidden sm:inline">Pago</span>
            </div>
            <div className="flex-1 h-px bg-pure-gray-800" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-pure-white' : 'text-pure-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-pure-white text-pure-black' : 'bg-pure-gray-800'}`}>
                3
              </div>
              <span className="text-sm hidden sm:inline">Confirmación</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-pure-gray-900/30 border border-pure-gray-800 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-semibold mb-6">Información de contacto</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Correo electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                        placeholder="+51 999 999 999"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Empresa (opcional)
                        </label>
                        <input
                          type="text"
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="Nombre de tu empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          RUC (opcional)
                        </label>
                        <input
                          type="text"
                          name="ruc"
                          value={formData.ruc}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="20123456789"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                        Dirección (opcional)
                      </label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                        placeholder="Av. Principal 123, Lima"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.nombre || !formData.email || !formData.telefono}
                    className="w-full mt-6 py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar al pago
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-pure-gray-900/30 border border-pure-gray-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-6">Método de pago</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${
                            selectedPayment === method.id
                              ? 'border-pure-white bg-pure-gray-800'
                              : 'border-pure-gray-800 hover:border-pure-gray-600'
                          }`}
                        >
                          <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                            <method.icon size={20} className="text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{method.name}</p>
                          </div>
                          <div className="ml-auto">
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              selectedPayment === method.id
                                ? 'border-pure-white bg-pure-white'
                                : 'border-pure-gray-600'
                            }`}>
                              {selectedPayment === method.id && (
                                <div className="w-2 h-2 bg-pure-black rounded-full m-1" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details Based on Selection */}
                  {selectedPayment === 'yape' && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                      <h3 className="font-semibold mb-4">Pago con Yape</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src="/src/sections/pagos/yape/yape.png" 
                            alt="QR Yape" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-pure-gray-400 mb-1">Escanea el QR o busca:</p>
                          <p className="text-lg font-mono font-medium">916 895 252</p>
                          <p className="text-sm text-pure-gray-400">Codeol Software</p>
                        </div>
                      </div>
                      <p className="text-xs text-pure-gray-500">
                        Después de pagar, envía el comprobante por WhatsApp para confirmar tu orden.
                      </p>
                    </div>
                  )}

                  {selectedPayment === 'lemon' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                      <h3 className="font-semibold mb-4">Pago con Lemon Cash</h3>
                      <div className="p-4 bg-pure-gray-800/50 rounded-lg mb-4">
                        <p className="text-xs text-pure-gray-500 mb-1">CVU / Alias</p>
                        <p className="font-mono text-sm break-all">92200300000265853293</p>
                        <p className="text-xs text-pure-gray-500 mt-2">Codeol Software Perú</p>
                      </div>
                      <p className="text-xs text-pure-gray-500">
                        Transfiere desde tu app de Lemon Cash. Envía el comprobante por WhatsApp para confirmar.
                      </p>
                    </div>
                  )}

                  {selectedPayment === 'transferencia' && (
                    <div className="bg-pure-gray-900/30 border border-pure-gray-800 rounded-2xl p-6">
                      <h3 className="font-semibold mb-4">Transferencia bancaria</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-pure-gray-800/50 rounded-lg">
                          <p className="text-xs text-pure-gray-500">Caja Arequipa - P51</p>
                          <p className="font-mono text-sm">80304300536509700194</p>
                          <p className="text-xs text-pure-gray-500">Codeol Software Perú S.A.C.</p>
                        </div>
                        <div className="p-3 bg-pure-gray-800/50 rounded-lg">
                          <p className="text-xs text-pure-gray-500">Scotiabank</p>
                          <p className="font-mono text-sm">00919620211027751077</p>
                          <p className="text-xs text-pure-gray-500">Codeol Software Perú S.A.C.</p>
                        </div>
                      </div>
                      <p className="text-xs text-pure-gray-500 mt-4">
                        Después de transferir, envía el comprobante por WhatsApp para confirmar tu orden.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-pure-gray-700 rounded-full font-medium hover:bg-pure-gray-800 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={!selectedPayment || isProcessing}
                      className="flex-1 py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          Pagar S/ {(totalPrice * 1.18).toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-pure-gray-900/30 border border-pure-gray-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Resumen de orden</h2>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-pure-gray-400">
                        {item.name} x{item.quantity}
                      </span>
                      <span>
                        {item.price === 'Cotizar' ? 'Cotizar' : item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-pure-gray-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-pure-gray-400">Subtotal</span>
                    <span>S/ {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-pure-gray-400">IGV (18%)</span>
                    <span>S/ {(totalPrice * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-pure-gray-800">
                    <span>Total</span>
                    <span>S/ {(totalPrice * 1.18).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-pure-gray-800">
                  <div className="flex items-center gap-2 text-xs text-pure-gray-500">
                    <Lock size={12} />
                    <span>Pago seguro encriptado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
