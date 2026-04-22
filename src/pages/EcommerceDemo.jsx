import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Star,
  Filter,
  ChevronDown
} from 'lucide-react'

const products = [
  { id: 1, name: 'Vestido Minimal Negro', price: 189, category: 'Vestidos', image: 'bg-gradient-to-br from-pure-gray-800 to-pure-gray-900', rating: 4.9, reviews: 128, isNew: true, isBestseller: true, description: 'Vestido midi con corte minimalista. Tejido premium de algodón orgánico. Perfecto para cualquier ocasión.' },
  { id: 2, name: 'Blazer Oversized Gris', price: 245, category: 'Blazers', image: 'bg-gradient-to-br from-pure-gray-700 to-pure-gray-800', rating: 4.8, reviews: 96, isNew: false, isBestseller: true, description: 'Blazer oversized con hombros estructurados. Tejido de lana mezcla. Elegancia contemporánea.' },
  { id: 3, name: 'Pantalón Wide Leg Beige', price: 156, category: 'Pantalones', image: 'bg-gradient-to-br from-pure-gray-600 to-pure-gray-700', rating: 4.7, reviews: 84, isNew: false, isBestseller: false, description: 'Pantalón wide leg de talle alto. Corte fluido que alarga la silueta. Comodidad y estilo.' },
  { id: 4, name: 'Camisa Lino Blanco', price: 98, category: 'Camisas', image: 'bg-gradient-to-br from-pure-gray-500 to-pure-gray-600', rating: 4.9, reviews: 156, isNew: false, isBestseller: true, description: 'Camisa de lino 100% natural. Corte relajado, perfecta para el verano. Transpirable y elegante.' },
  { id: 5, name: 'Suéter Cashmere Premium', price: 298, category: 'Suéteres', image: 'bg-gradient-to-br from-pure-gray-400 to-pure-gray-500', rating: 5.0, reviews: 67, isNew: true, isBestseller: false, description: 'Suéter de cashmere mongol. Suavidad incomparable. Disponible en 4 colores exclusivos.' },
  { id: 6, name: 'Falda Midi Plisada', price: 134, category: 'Faldas', image: 'bg-gradient-to-br from-pure-gray-300 to-pure-gray-400', rating: 4.6, reviews: 112, isNew: false, isBestseller: false, description: 'Falda midi plisada con movimiento fluido. Tejido ligero que no se arruga. Elegancia en movimiento.' },
  { id: 7, name: 'Trench Coat Clásico', price: 345, category: 'Abrigos', image: 'bg-gradient-to-br from-pure-gray-800 to-black', rating: 4.9, reviews: 203, isNew: true, isBestseller: true, description: 'Trench coat impermeable con forro desmontable. Corte clásico reinventado. Esencial de armario.' },
  { id: 8, name: 'Top Crop Negro', price: 78, category: 'Tops', image: 'bg-gradient-to-br from-pure-gray-700 to-pure-gray-800', rating: 4.5, reviews: 89, isNew: false, isBestseller: false, description: 'Top crop de canalé con soporte integrado. Tejido elástico que moldea. Versátil y cómodo.' },
  { id: 9, name: 'Jeans Wide Leg Azul', price: 178, category: 'Jeans', image: 'bg-gradient-to-br from-pure-gray-600 to-pure-gray-700', rating: 4.7, reviews: 145, isNew: true, isBestseller: true, description: 'Jeans wide leg de denim premium. Lavado sostenible. Corte moderno que favorece.' },
  { id: 10, name: 'Cardigan Largo Gris', price: 165, category: 'Suéteres', image: 'bg-gradient-to-br from-pure-gray-500 to-pure-gray-600', rating: 4.8, reviews: 76, isNew: false, isBestseller: false, description: 'Cardigan largo de punto grueso. Botones de nácar. Perfecto capa intermedia.' },
  { id: 11, name: 'Vestido Slip Seda', price: 267, category: 'Vestidos', image: 'bg-gradient-to-br from-pure-gray-400 to-pure-gray-500', rating: 4.9, reviews: 54, isNew: true, isBestseller: false, description: 'Vestido slip de seda natural. Escote en V, tirantes ajustables. Lujo minimalista.' },
  { id: 12, name: 'Blusa Satinada Champagne', price: 145, category: 'Blusas', image: 'bg-gradient-to-br from-pure-gray-300 to-pure-gray-400', rating: 4.6, reviews: 98, isNew: false, isBestseller: true, description: 'Blusa satinada con lazo al cuello. Brillo sutil, caída impecable. De día a noche.' },
]

const categories = ['Todos', 'Vestidos', 'Blazers', 'Pantalones', 'Camisas', 'Suéteres', 'Faldas', 'Abrigos', 'Tops', 'Jeans', 'Blusas']

const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Under S/ 100', min: 0, max: 100 },
  { label: 'S/ 100 - 200', min: 100, max: 200 },
  { label: 'S/ 200 - 300', min: 200, max: 300 },
  { label: 'Over S/ 300', min: 300, max: Infinity },
]

const sortOptions = [
  { label: 'Más relevantes', value: 'relevance' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Mejor valorados', value: 'rating' },
  { label: 'Más recientes', value: 'newest' },
]

export default function EcommerceDemo() {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [sortBy, setSortBy] = useState('relevance')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'moda20') {
      setDiscount(0.20)
    } else {
      setDiscount(0)
    }
  }

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = cartSubtotal * discount
  const cartTotal = cartSubtotal - discountAmount
  const shipping = cartSubtotal > 500 ? 0 : 25
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Filter and sort products
  let filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory
    const matchesPrice = p.price >= selectedPriceRange.min && p.price < selectedPriceRange.max
    const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesPrice && matchesSearch
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price
      case 'price-desc': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-pure-black/95 backdrop-blur-md border-b border-pure-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Back Button */}
            <a 
              href="/" 
              className="flex items-center gap-2 text-sm text-pure-gray-400 hover:text-pure-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Volver</span>
            </a>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-[0.2em]">MODA</span>
              <span className="text-xs px-2 py-1 bg-pure-gray-800 rounded text-pure-gray-400">DEMO</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setIsSearchOpen(true)}
                className="relative p-2 hover:bg-pure-gray-800 rounded-full transition-colors group"
              >
                <motion.div
                  animate={{ rotate: isSearchOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search size={20} className="group-hover:text-pure-white transition-colors" />
                </motion.div>
                <motion.span
                  className="absolute inset-0 rounded-full bg-pure-gray-700/50"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pure-white text-pure-black text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter - Desktop */}
        <div className="hidden lg:block border-t border-pure-gray-800">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-8 h-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm transition-colors ${
                    selectedCategory === cat 
                      ? 'text-pure-white font-medium' 
                      : 'text-pure-gray-400 hover:text-pure-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-pure-gray-500 mb-4 block">
              Colección 2024
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Elegancia<br />
              <span className="text-pure-gray-400">Minimalista</span>
            </h1>
            <p className="text-lg text-pure-gray-400 leading-relaxed mb-8">
              Descubre nuestra colección de piezas atemporales diseñadas 
              para la mujer moderna. Calidad premium, estilo inigualable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#productos"
                className="px-8 py-4 bg-pure-white text-pure-black font-medium rounded-full hover:bg-pure-gray-200 transition-colors"
              >
                Ver colección
              </a>
              <span className="text-sm text-pure-gray-500">
                Envío gratis en pedidos +S/ 500
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="productos" className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          {/* Mobile Filter */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 text-sm rounded-full border transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-pure-white text-pure-black border-pure-white' 
                      : 'border-pure-gray-700 text-pure-gray-400 hover:border-pure-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                {/* Image */}
                <div className={`relative aspect-[3/4] ${product.image} rounded-2xl overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex-1 py-3 bg-pure-white text-pure-black text-sm font-medium rounded-full hover:bg-pure-gray-200 transition-colors"
                    >
                      Añadir al carrito
                    </button>
                    <button className="p-3 bg-pure-gray-800/80 rounded-full hover:bg-pure-gray-700 transition-colors">
                      <Heart size={18} />
                    </button>
                  </div>

                  {/* Badge */}
                  {product.rating === 5.0 && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-pure-white text-pure-black text-xs font-medium rounded-full">
                      Nuevo
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <span className="text-xs text-pure-gray-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-medium group-hover:text-pure-gray-300 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-pure-white text-pure-white" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                    <span className="text-pure-gray-500 text-sm">({product.reviews})</span>
                  </div>
                  <p className="text-lg font-semibold">S/ {product.price}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-pure-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-3 sm:px-6 z-50"
            >
              <div className="bg-pure-gray-900 border border-pure-gray-700 rounded-2xl p-3 sm:p-4 shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Search size={20} className="text-pure-gray-400 sm:w-6 sm:h-6" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-lg sm:text-xl text-pure-white placeholder-pure-gray-500 outline-none min-w-0"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSearchQuery('')
                      setIsSearchOpen(false)
                    }}
                    className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors flex-shrink-0"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
                
                {/* Search Results Preview */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-pure-gray-800 max-h-[60vh] sm:max-h-80 overflow-y-auto"
                  >
                    <p className="text-xs sm:text-sm text-pure-gray-500 mb-3">
                      {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {filteredProducts.slice(0, 5).map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 sm:gap-4 p-3 hover:bg-pure-gray-800/50 rounded-xl cursor-pointer transition-colors active:bg-pure-gray-800"
                        onClick={() => {
                          setIsSearchOpen(false)
                          document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${product.image} rounded-lg flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base truncate">{product.name}</h4>
                          <p className="text-xs sm:text-sm text-pure-gray-400">{product.category} • S/ {product.price}</p>
                        </div>
                        <ArrowLeft size={14} className="text-pure-gray-500 rotate-180 sm:w-4 sm:h-4 flex-shrink-0" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {!searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-pure-gray-800"
                  >
                    <p className="text-xs sm:text-sm text-pure-gray-500 mb-3">Categorías populares</p>
                    <div className="flex flex-wrap gap-2">
                      {['Vestidos', 'Blazers', 'Suéteres', 'Jeans'].map((cat, index) => (
                        <motion.button
                          key={cat}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + index * 0.05, type: 'spring', stiffness: 300 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedCategory(cat)
                            setIsSearchOpen(false)
                          }}
                          className="relative px-3 sm:px-4 py-2 bg-pure-gray-800 hover:bg-pure-gray-700 rounded-full text-xs sm:text-sm transition-colors overflow-hidden group"
                        >
                          <motion.span
                            className="absolute inset-0 bg-pure-white/10 rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ scale: 2, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">{cat}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-pure-black/60 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-pure-black border-l border-pure-gray-800 z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-pure-gray-800">
                  <h2 className="text-lg font-semibold">Carrito ({cartCount})</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
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
                      <p className="text-pure-gray-400">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-pure-gray-900/50 rounded-xl">
                          <div className={`w-20 h-24 ${item.image} rounded-lg flex-shrink-0`} />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{item.name}</h4>
                            <p className="text-sm text-pure-gray-400 mb-3">S/ {item.price}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1 hover:bg-pure-gray-800 rounded transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1 hover:bg-pure-gray-800 rounded transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-pure-gray-500 hover:text-pure-white transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-pure-gray-800 space-y-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>S/ {cartTotal}</span>
                    </div>
                    <button className="w-full py-4 bg-pure-white text-pure-black font-medium rounded-full hover:bg-pure-gray-200 transition-colors">
                      Finalizar compra
                    </button>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 border border-pure-gray-700 rounded-full hover:bg-pure-gray-800 transition-colors"
                    >
                      Seguir comprando
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-bold tracking-[0.2em]">MODA</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 bg-pure-gray-900 border border-pure-gray-700 rounded-xl px-4 py-3">
                  <Search size={20} className="text-pure-gray-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-base text-pure-white placeholder-pure-gray-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 hover:bg-pure-gray-800 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Mobile Search Results */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 max-h-48 overflow-y-auto"
                  >
                    <p className="text-xs text-pure-gray-500 mb-2">
                      {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    {filteredProducts.slice(0, 3).map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-2 hover:bg-pure-gray-800/50 rounded-lg cursor-pointer"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <div className={`w-10 h-10 ${product.image} rounded-lg flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{product.name}</h4>
                          <p className="text-xs text-pure-gray-400">S/ {product.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              <nav className="flex-1 overflow-y-auto">
                <p className="text-xs text-pure-gray-500 uppercase tracking-wider mb-3">Categorías</p>
                {categories.map((cat, index) => (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => {
                      setSelectedCategory(cat)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`block w-full text-left py-3 text-lg border-b border-pure-gray-800 ${
                      selectedCategory === cat ? 'text-pure-white font-medium' : 'text-pure-gray-400'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
