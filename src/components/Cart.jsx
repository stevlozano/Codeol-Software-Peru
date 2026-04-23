import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  CreditCard
} from 'lucide-react'

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalPrice,
    isCartOpen, 
    setIsCartOpen 
  } = useCart()

  const closeCart = () => setIsCartOpen(false)

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-pure-black border-l border-pure-gray-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-pure-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} />
                <div>
                  <h2 className="text-lg font-semibold">Tu Carrito</h2>
                  <p className="text-xs text-pure-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-pure-gray-600 mb-4" />
                  <p className="text-pure-gray-400 mb-2">Tu carrito está vacío</p>
                  <p className="text-sm text-pure-gray-500 mb-6">Explora nuestros servicios</p>
                  <Link
                    to="/services"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
                  >
                    Ver servicios
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 bg-pure-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon && <item.icon size={28} className="text-pure-white" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-pure-gray-500 mb-2">{item.subtitle}</p>
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-pure-gray-800 rounded transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-pure-gray-800 rounded transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-sm font-medium">
                            {item.price === 'Cotizar' ? 'Cotizar' : item.price}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-pure-gray-800 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
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

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
                >
                  <CreditCard size={18} />
                  Proceder al pago
                </Link>

                <p className="text-xs text-pure-gray-500 text-center">
                  Pago seguro. Múltiples métodos de pago disponibles.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
