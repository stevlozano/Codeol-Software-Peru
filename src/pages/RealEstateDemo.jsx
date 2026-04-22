import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Search, 
  MapPin, 
  BedDouble, 
  Bath, 
  Square,
  Heart,
  Filter,
  X,
  Menu,
  Home,
  Building2,
  Warehouse,
  Trees,
  ChevronDown,
  ChevronRight,
  Star,
  Phone,
  Mail,
  Share2,
  Maximize2,
  Check,
  Car,
  Wifi,
  Waves,
  Dumbbell,
  Shield,
  Zap,
  Droplets,
  Flame,
  Wind
} from 'lucide-react'

const properties = [
  {
    id: 1,
    title: 'Penthouse de Lujo en Miraflores',
    address: 'Av. Pardo 450, Miraflores',
    price: 1250000,
    type: 'venta',
    category: 'Departamento',
    beds: 4,
    baths: 3,
    sqft: 280,
    images: ['bg-gradient-to-br from-pure-gray-700 to-pure-gray-800', 'bg-gradient-to-br from-pure-gray-600 to-pure-gray-700'],
    features: ['Vista al mar', 'Terraza', 'Gimnasio', 'Cochera'],
    amenities: ['wifi', 'gym', 'pool', 'parking', 'security'],
    rating: 4.9,
    reviews: 24,
    agent: { name: 'Laura Sánchez', phone: '+51 999 123 456' },
    coordinates: { x: 30, y: 40 }
  },
  {
    id: 2,
    title: 'Casa Moderna en San Isidro',
    address: 'Calle Los Cedros 123, San Isidro',
    price: 2800,
    type: 'alquiler',
    category: 'Casa',
    beds: 5,
    baths: 4,
    sqft: 450,
    images: ['bg-gradient-to-br from-pure-gray-600 to-pure-gray-800', 'bg-gradient-to-br from-pure-gray-700 to-pure-gray-900'],
    features: ['Jardín privado', 'Piscina', 'Cuarto de servicio', 'Seguridad 24h'],
    amenities: ['pool', 'garden', 'parking', 'security', 'serv quarters'],
    rating: 4.8,
    reviews: 18,
    agent: { name: 'Carlos Ruiz', phone: '+51 999 234 567' },
    coordinates: { x: 45, y: 25 }
  },
  {
    id: 3,
    title: 'Oficina Ejecutiva en San Isidro',
    address: 'Av. Canaval y Moreyra 350, San Isidro',
    price: 3500,
    type: 'alquiler',
    category: 'Oficina',
    beds: 0,
    baths: 2,
    sqft: 180,
    images: ['bg-gradient-to-br from-pure-gray-800 to-pure-black', 'bg-gradient-to-br from-pure-gray-700 to-pure-gray-900'],
    features: ['Recepción', 'Sala de reuniones', 'Estacionamiento', 'Seguridad'],
    amenities: ['wifi', 'parking', 'security', 'meeting room'],
    rating: 4.7,
    reviews: 12,
    agent: { name: 'Ana Torres', phone: '+51 999 345 678' },
    coordinates: { x: 60, y: 30 }
  },
  {
    id: 4,
    title: 'Departamento Minimalista en Barranco',
    address: 'Av. Grau 890, Barranco',
    price: 485000,
    type: 'venta',
    category: 'Departamento',
    beds: 2,
    baths: 2,
    sqft: 95,
    images: ['bg-gradient-to-br from-pure-gray-500 to-pure-gray-700', 'bg-gradient-to-br from-pure-gray-600 to-pure-gray-800'],
    features: ['Balcón', 'Cocina equipada', 'Cerca del malecón', 'Seguridad'],
    amenities: ['wifi', 'security', 'balcony'],
    rating: 4.6,
    reviews: 31,
    agent: { name: 'Pedro Mendoza', phone: '+51 999 456 789' },
    coordinates: { x: 25, y: 60 }
  },
  {
    id: 5,
    title: 'Casa de Campo en La Molina',
    address: 'Camino Real 567, La Molina',
    price: 950000,
    type: 'venta',
    category: 'Casa',
    beds: 6,
    baths: 5,
    sqft: 600,
    images: ['bg-gradient-to-br from-pure-gray-600 to-pure-gray-700', 'bg-gradient-to-br from-pure-gray-500 to-pure-gray-800'],
    features: ['Amplio jardín', 'Piscina', 'Zona BBQ', 'Establo'],
    amenities: ['pool', 'garden', 'parking', 'security'],
    rating: 5.0,
    reviews: 8,
    agent: { name: 'María López', phone: '+51 999 567 890' },
    coordinates: { x: 70, y: 20 }
  },
  {
    id: 6,
    title: 'Departamento Estudio en Surco',
    address: 'Av. Tomás Marsano 234, Surco',
    price: 750,
    type: 'alquiler',
    category: 'Departamento',
    beds: 1,
    baths: 1,
    sqft: 45,
    images: ['bg-gradient-to-br from-pure-gray-700 to-pure-gray-900', 'bg-gradient-to-br from-pure-gray-600 to-pure-gray-800'],
    features: ['Amoblado', 'Cocina integral', 'Lavandería', 'Internet'],
    amenities: ['wifi', 'laundry', 'furnished'],
    rating: 4.5,
    reviews: 45,
    agent: { name: 'Juan Pérez', phone: '+51 999 678 901' },
    coordinates: { x: 55, y: 55 }
  },
  {
    id: 7,
    title: 'Local Comercial en Miraflores',
    address: 'Av. Larco 789, Miraflores',
    price: 4200,
    type: 'alquiler',
    category: 'Comercial',
    beds: 0,
    baths: 2,
    sqft: 220,
    images: ['bg-gradient-to-br from-pure-gray-800 to-pure-gray-900', 'bg-gradient-to-br from-pure-gray-700 to-pure-black'],
    features: ['Alta afluencia', 'Escaparate', 'Almacén', 'Baños'],
    amenities: ['wifi', 'parking', 'storage'],
    rating: 4.4,
    reviews: 15,
    agent: { name: 'Diana Flores', phone: '+51 999 789 012' },
    coordinates: { x: 35, y: 35 }
  },
  {
    id: 8,
    title: 'Terreno Residencial en La Planicie',
    address: 'La Planicie, La Molina',
    price: 580000,
    type: 'venta',
    category: 'Terreno',
    beds: 0,
    baths: 0,
    sqft: 1000,
    images: ['bg-gradient-to-br from-pure-gray-600 to-pure-gray-800', 'bg-gradient-to-br from-pure-gray-500 to-pure-gray-700'],
    features: ['Vista panorámica', 'Planicie', 'Servicios instalados', 'Seguridad'],
    amenities: ['security', 'view'],
    rating: 4.7,
    reviews: 6,
    agent: { name: 'Luis Ramos', phone: '+51 999 890 123' },
    coordinates: { x: 75, y: 45 }
  }
]

const categories = [
  { id: 'all', label: 'Todas', icon: Home },
  { id: 'Departamento', label: 'Departamentos', icon: Building2 },
  { id: 'Casa', label: 'Casas', icon: Warehouse },
  { id: 'Oficina', label: 'Oficinas', icon: Building2 },
  { id: 'Terreno', label: 'Terrenos', icon: Trees },
  { id: 'Comercial', label: 'Comercial', icon: Building2 }
]

const amenityIcons = {
  wifi: Wifi,
  pool: Waves,
  gym: Dumbbell,
  parking: Car,
  security: Shield,
  garden: Trees,
  'serv quarters': Home,
  'meeting room': Building2,
  laundry: Droplets,
  furnished: Check,
  balcony: Maximize2,
  storage: Warehouse,
  view: Star
}

export default function RealEstateDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [favorites, setFavorites] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [hoveredProperty, setHoveredProperty] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  // Filter properties
  const filteredProperties = properties.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesType = selectedType === 'all' || p.type === selectedType
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesPrice && matchesSearch
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    )
  }

  const formatPrice = (price, type) => {
    if (price >= 1000000) {
      return `S/ ${(price / 1000000).toFixed(2)}M`
    }
    if (price >= 1000) {
      return `S/ ${(price / 1000).toFixed(0)}K${type === 'alquiler' ? '/mes' : ''}`
    }
    return `S/ ${price}${type === 'alquiler' ? '/mes' : ''}`
  }

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
                <Building2 size={18} className="text-pure-black" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base">InmoPerú</h1>
                <p className="text-xs text-pure-gray-500 hidden sm:block">Portal Inmobiliario</p>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pure-gray-500" />
              <input
                type="text"
                placeholder="Buscar por ubicación o propiedad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pure-gray-900 border border-pure-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-pure-gray-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-sm hover:bg-pure-gray-800 transition-colors"
            >
              <Filter size={16} />
              <span className="hidden lg:inline">Filtros</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-sm hover:bg-pure-gray-800 transition-colors"
            >
              <MapPin size={16} />
              <span className="hidden lg:inline">{viewMode === 'grid' ? 'Mapa' : 'Lista'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="border-t border-pure-gray-800 px-4 lg:px-6">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-pure-white text-pure-black' 
                      : 'bg-pure-gray-900 text-pure-gray-400 hover:bg-pure-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-6 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search - Mobile */}
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pure-gray-500" />
              <input
                type="text"
                placeholder="Buscar propiedades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pure-gray-900 border border-pure-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl p-4 lg:p-6">
                  <div className="flex flex-wrap gap-6">
                    {/* Type Filter */}
                    <div>
                      <p className="text-sm text-pure-gray-500 mb-3">Tipo de operación</p>
                      <div className="flex gap-2">
                        {[
                          { id: 'all', label: 'Todos' },
                          { id: 'venta', label: 'Venta' },
                          { id: 'alquiler', label: 'Alquiler' }
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedType === type.id
                                ? 'bg-pure-white text-pure-black'
                                : 'bg-pure-gray-800 text-pure-gray-400 hover:bg-pure-gray-700'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-sm text-pure-gray-500 mb-3">
                        Rango de precio: S/ {(priceRange[0] / 1000).toFixed(0)}K - S/ {(priceRange[1] / 1000000).toFixed(1)}M
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        step="50000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-pure-gray-800 rounded-full appearance-none cursor-pointer accent-pure-white"
                      />
                    </div>

                    {/* Sort */}
                    <div>
                      <p className="text-sm text-pure-gray-500 mb-3">Ordenar por</p>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-pure-gray-800 border border-pure-gray-700 rounded-lg px-4 py-2 text-sm outline-none"
                      >
                        <option value="relevance">Relevancia</option>
                        <option value="price-asc">Precio: menor a mayor</option>
                        <option value="price-desc">Precio: mayor a menor</option>
                        <option value="rating">Mejor calificación</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-pure-gray-400">
              <span className="text-pure-white font-semibold">{sortedProperties.length}</span> propiedades encontradas
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-pure-white text-pure-black' : 'text-pure-gray-400 hover:bg-pure-gray-800'}`}
              >
                <Home size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-pure-white text-pure-black' : 'text-pure-gray-400 hover:bg-pure-gray-800'}`}
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {sortedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                  onMouseEnter={() => setHoveredProperty(property.id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className={`absolute inset-0 ${property.images[0]} transition-transform duration-500 ${hoveredProperty === property.id ? 'scale-110' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-pure-black/60 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.type === 'venta' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-pure-black/50 backdrop-blur">
                        {property.category}
                      </span>
                    </div>

                    {/* Favorite */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(property.id)
                      }}
                      className="absolute top-3 right-3 p-2 bg-pure-black/50 backdrop-blur rounded-full transition-colors"
                    >
                      <Heart size={16} className={favorites.includes(property.id) ? 'fill-red-500 text-red-500' : ''} />
                    </motion.button>

                    {/* Price */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-2xl font-bold">{formatPrice(property.price, property.type)}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-pure-gray-300 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-pure-gray-500 mb-3 line-clamp-1">{property.address}</p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-pure-gray-400">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-1">
                          <BedDouble size={14} />
                          <span>{property.beds}</span>
                        </div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath size={14} />
                          <span>{property.baths}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Square size={14} />
                        <span>{property.sqft} m²</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-pure-gray-800">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{property.rating}</span>
                        <span className="text-xs text-pure-gray-500">({property.reviews})</span>
                      </div>
                      <span className="text-xs text-pure-gray-500">{property.agent.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-pure-gray-900 rounded-2xl overflow-hidden border border-pure-gray-800">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pure-gray-800 via-pure-gray-900 to-pure-black">
                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* Streets */}
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-pure-gray-700/30" />
                <div className="absolute top-3/4 left-0 right-0 h-1 bg-pure-gray-700/30" />
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-pure-gray-700/30" />
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-pure-gray-700/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-pure-gray-700/20" />
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-pure-gray-700/20" />
              </div>

              {/* Property Pins */}
              {sortedProperties.map((property) => (
                <motion.button
                  key={property.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  onClick={() => setSelectedProperty(property)}
                  onMouseEnter={() => setHoveredProperty(property.id)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  style={{ left: `${property.coordinates.x}%`, top: `${property.coordinates.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className={`relative px-3 py-2 rounded-xl font-semibold text-sm shadow-xl transition-colors ${
                    hoveredProperty === property.id 
                      ? 'bg-pure-white text-pure-black' 
                      : 'bg-pure-gray-900 text-pure-white border border-pure-gray-700'
                  }`}>
                    {formatPrice(property.price, property.type)}
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                      hoveredProperty === property.id ? 'bg-pure-white' : 'bg-pure-gray-900 border-r border-b border-pure-gray-700'
                    }`} />
                  </div>
                </motion.button>
              ))}

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-pure-gray-900 border border-pure-gray-800 rounded-lg flex items-center justify-center hover:bg-pure-gray-800 transition-colors">
                  <span className="text-lg font-bold">+</span>
                </button>
                <button className="w-10 h-10 bg-pure-gray-900 border border-pure-gray-800 rounded-lg flex items-center justify-center hover:bg-pure-gray-800 transition-colors">
                  <span className="text-lg font-bold">−</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-pure-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 lg:inset-0 lg:flex lg:items-center lg:justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full lg:max-w-4xl lg:max-h-[90vh] bg-pure-gray-900 lg:rounded-2xl overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-pure-black/50 backdrop-blur rounded-full hover:bg-pure-black/70 transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="lg:flex lg:h-[90vh]">
                  {/* Image Gallery */}
                  <div className="lg:w-1/2 relative">
                    <div className={`aspect-square lg:aspect-auto lg:h-full ${selectedProperty.images[activeImage]}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-pure-black/60 via-transparent to-transparent" />
                    </div>
                    
                    {/* Image Navigation */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      {selectedProperty.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`flex-1 h-1 rounded-full transition-colors ${
                            idx === activeImage ? 'bg-pure-white' : 'bg-pure-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        selectedProperty.type === 'venta' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {selectedProperty.type === 'venta' ? 'En Venta' : 'En Alquiler'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{selectedProperty.title}</h2>
                        <div className="flex items-center gap-1 text-pure-gray-400">
                          <MapPin size={16} />
                          <span className="text-sm">{selectedProperty.address}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{formatPrice(selectedProperty.price, selectedProperty.type)}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-pure-gray-800">
                      <div className="flex items-center gap-1">
                        <Star size={18} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{selectedProperty.rating}</span>
                      </div>
                      <span className="text-pure-gray-500">•</span>
                      <span className="text-pure-gray-400">{selectedProperty.reviews} reseñas</span>
                      <span className="text-pure-gray-500">•</span>
                      <span className="text-pure-gray-400">{selectedProperty.category}</span>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-pure-gray-800">
                      {selectedProperty.beds > 0 && (
                        <div className="text-center p-4 bg-pure-gray-800/50 rounded-xl">
                          <BedDouble size={24} className="mx-auto mb-2 text-pure-gray-400" />
                          <p className="font-semibold">{selectedProperty.beds}</p>
                          <p className="text-xs text-pure-gray-500">Habitaciones</p>
                        </div>
                      )}
                      {selectedProperty.baths > 0 && (
                        <div className="text-center p-4 bg-pure-gray-800/50 rounded-xl">
                          <Bath size={24} className="mx-auto mb-2 text-pure-gray-400" />
                          <p className="font-semibold">{selectedProperty.baths}</p>
                          <p className="text-xs text-pure-gray-500">Baños</p>
                        </div>
                      )}
                      <div className="text-center p-4 bg-pure-gray-800/50 rounded-xl">
                        <Square size={24} className="mx-auto mb-2 text-pure-gray-400" />
                        <p className="font-semibold">{selectedProperty.sqft}</p>
                        <p className="text-xs text-pure-gray-500">m²</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6 pb-6 border-b border-pure-gray-800">
                      <h3 className="font-semibold mb-3">Características</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.features.map((feature) => (
                          <span key={feature} className="px-3 py-1.5 bg-pure-gray-800 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6 pb-6 border-b border-pure-gray-800">
                      <h3 className="font-semibold mb-3">Amenidades</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProperty.amenities.map((amenity) => {
                          const Icon = amenityIcons[amenity] || Check
                          return (
                            <div key={amenity} className="flex items-center gap-2 text-sm">
                              <Icon size={16} className="text-pure-gray-400" />
                              <span className="capitalize">{amenity.replace('-', ' ')}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Agent */}
                    <div className="flex items-center justify-between p-4 bg-pure-gray-800/50 rounded-xl mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pure-white to-pure-gray-600 rounded-full flex items-center justify-center text-pure-black font-bold">
                          {selectedProperty.agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{selectedProperty.agent.name}</p>
                          <p className="text-sm text-pure-gray-500">Agente inmobiliario</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-pure-gray-700 rounded-full transition-colors">
                          <Phone size={18} />
                        </button>
                        <button className="p-2 hover:bg-pure-gray-700 rounded-full transition-colors">
                          <Mail size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
                      >
                        Contactar agente
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleFavorite(selectedProperty.id)}
                        className="p-3 border border-pure-gray-700 rounded-full hover:bg-pure-gray-800 transition-colors"
                      >
                        <Heart size={20} className={favorites.includes(selectedProperty.id) ? 'fill-red-500 text-red-500' : ''} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-3 border border-pure-gray-700 rounded-full hover:bg-pure-gray-800 transition-colors"
                      >
                        <Share2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
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
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-pure-white rounded-lg flex items-center justify-center">
                    <Building2 size={20} className="text-pure-black" />
                  </div>
                  <div>
                    <h1 className="font-bold">InmoPerú</h1>
                    <p className="text-xs text-pure-gray-500">Portal Inmobiliario</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pure-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar propiedades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-pure-gray-900 border border-pure-gray-800 rounded-xl pl-10 pr-4 py-3 outline-none"
                />
              </div>

              {/* Mobile Filters */}
              <div className="space-y-4 overflow-y-auto">
                <div>
                  <p className="text-sm text-pure-gray-500 mb-3">Tipo de operación</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'venta', label: 'Venta' },
                      { id: 'alquiler', label: 'Alquiler' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type.id
                            ? 'bg-pure-white text-pure-black'
                            : 'bg-pure-gray-900 text-pure-gray-400'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-pure-gray-500 mb-3">Categorías</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-pure-white text-pure-black'
                              : 'bg-pure-gray-900 text-pure-gray-400'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm">{cat.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-pure-gray-500 mb-3">
                    Precio máximo: S/ {(priceRange[1] / 1000000).toFixed(1)}M
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-pure-gray-800 rounded-full accent-pure-white"
                  />
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 bg-pure-white text-pure-black rounded-full font-medium"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
