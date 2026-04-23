import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Globe, 
  Layout, 
  ShoppingCart, 
  Smartphone, 
  Database, 
  Code2, 
  ArrowUpRight,
  Check,
  Plus
} from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import { useCart, MIN_PRICE } from '../context/CartContext'

const services = [
  {
    id: 'web-moderna',
    icon: Layout,
    title: 'Páginas Web Modernas',
    subtitle: 'Diseño minimalista y profesional',
    description: 'Creamos páginas web con diseños modernos, minimalistas y totalmente responsivos que capturan la esencia de tu marca y generan resultados.',
    features: ['Diseño UI/UX personalizado', '100% Responsive', 'Optimización SEO', 'Alto rendimiento'],
    price: 'Cotizar',
    popular: true,
  },
  {
    id: 'sistemas-personalizados',
    icon: Code2,
    title: 'Sistemas Personalizados',
    subtitle: 'Soluciones a medida',
    description: 'Desarrollamos sistemas y aplicaciones web personalizadas según las necesidades específicas de tu negocio, adaptadas a tu presupuesto.',
    features: ['Análisis de requerimientos', 'Desarrollo ágil', 'Integración con APIs', 'Soporte continuo'],
    price: 'Cotizar',
    popular: false,
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-commerce',
    subtitle: 'Tiendas online que venden',
    description: 'Diseñamos y desarrollamos tiendas virtuales optimizadas para convertir visitantes en clientes, con pasarelas de pago integradas.',
    features: ['Catálogo de productos', 'Pasarela de pagos', 'Gestión de inventario', 'Panel administrativo'],
    price: 'Cotizar',
    popular: false,
  },
  {
    id: 'aplicaciones-web',
    icon: Smartphone,
    title: 'Aplicaciones Web',
    subtitle: 'Web apps progresivas',
    description: 'Creamos aplicaciones web progresivas (PWA) que funcionan como apps nativas, accesibles desde cualquier dispositivo.',
    features: ['Instalable en dispositivos', 'Funciona offline', 'Notificaciones push', 'Experiencia nativa'],
    price: 'Cotizar',
    popular: false,
  },
  {
    id: 'sistemas-gestion',
    icon: Database,
    title: 'Sistemas de Gestión',
    subtitle: 'ERP y CRM personalizados',
    description: 'Sistemas integrales para gestionar tu empresa: inventario, clientes, ventas, facturación y más, todo en un solo lugar.',
    features: ['Gestión de inventario', 'CRM integrado', 'Reportes en tiempo real', 'Múltiples usuarios'],
    price: 'Cotizar',
    popular: false,
  },
  {
    id: 'landing-pages',
    icon: Globe,
    title: 'Landing Pages',
    subtitle: 'Páginas de conversión',
    description: 'Landing pages diseñadas para maximizar conversiones, ideales para campañas publicitarias y lanzamientos de productos.',
    features: ['Diseño persuasivo', 'A/B testing', 'Formularios optimizados', 'Analytics integrado'],
    price: 'Cotizar',
    popular: false,
  },
]

export default function Services() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [selectedService, setSelectedService] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customPrices, setCustomPrices] = useState({})
  const { addToCart, setIsCartOpen } = useCart()

  const handlePriceChange = (serviceId, value) => {
    const price = Math.max(MIN_PRICE, parseFloat(value) || MIN_PRICE)
    setCustomPrices(prev => ({ ...prev, [serviceId]: price }))
  }

  const handleAddToCart = (service) => {
    const customPrice = customPrices[service.id]
    addToCart({
      id: service.id,
      name: service.title,
      subtitle: service.subtitle,
      price: service.price,
      icon: service.icon
    }, customPrice)
    setIsCartOpen(true)
  }

  const handleSolicitar = (service) => {
    const serviceMap = {
      'Páginas Web Modernas': 'Página Web',
      'Sistemas Personalizados': 'Sistema Personalizado',
      'E-commerce': 'E-commerce',
      'Aplicaciones Web': 'Aplicación Web',
      'Sistemas de Gestión': 'Sistema Personalizado',
      'Landing Pages': 'Landing Page'
    }
    setSelectedService({
      name: service.title,
      subtitle: service.subtitle,
      price: service.price,
      features: service.features,
      service: serviceMap[service.title] || service.title
    })
    setIsModalOpen(true)
  }

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-24 lg:py-32 bg-pure-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
            >
              Nuestros servicios
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              Soluciones digitales para <span className="text-pure-gray-400">todo negocio</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-pure-gray-400 leading-relaxed"
            >
              Desde páginas web elegantes hasta sistemas empresariales complejos. 
              Trabajamos a nivel nacional y regional, adaptándonos a tu presupuesto.
            </motion.p>
          </div>
          
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 text-sm text-pure-white hover:text-pure-gray-400 transition-colors whitespace-nowrap"
          >
            Ver todos los servicios
            <ArrowUpRight size={16} />
          </motion.a>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`group relative p-8 border rounded-2xl transition-all duration-300 ${
                service.popular
                  ? 'border-pure-white bg-pure-gray-900/50'
                  : 'border-pure-gray-800 hover:border-pure-gray-600 bg-transparent'
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-8 px-3 py-1 bg-pure-white text-pure-black text-xs font-medium rounded-full">
                  Popular
                </span>
              )}
              
              {/* Icon */}
              <div className={`p-4 rounded-xl mb-6 inline-block ${
                service.popular ? 'bg-pure-white text-pure-black' : 'bg-pure-gray-800 text-pure-white'
              }`}>
                <service.icon size={24} strokeWidth={1.5} />
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
              <p className="text-sm text-pure-gray-500 mb-4">{service.subtitle}</p>
              
              {/* Description */}
              <p className="text-sm text-pure-gray-400 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-pure-gray-400">
                    <Check size={14} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price & CTA */}
              <div className="pt-6 border-t border-pure-gray-800">
                <p className="text-lg font-semibold mb-2">{service.price}</p>
                
                {/* Custom Price Input */}
                <div className="mb-4">
                  <label className="text-xs text-pure-gray-500 block mb-1">Tu presupuesto (mín. S/ {MIN_PRICE})</label>
                  <div className="flex items-center gap-2">
                    <span className="text-pure-gray-400">S/</span>
                    <input
                      type="number"
                      min={MIN_PRICE}
                      value={customPrices[service.id] || ''}
                      onChange={(e) => handlePriceChange(service.id, e.target.value)}
                      placeholder={MIN_PRICE.toString()}
                      className="flex-1 px-3 py-2 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-sm text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(service)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-full bg-pure-gray-800 text-pure-white hover:bg-pure-gray-700 transition-all duration-300 cursor-pointer"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                  <button
                    onClick={() => handleSolicitar(service)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                      service.popular
                        ? 'bg-pure-white text-pure-black hover:bg-pure-gray-200'
                        : 'border border-pure-gray-700 text-pure-white hover:bg-pure-gray-800'
                    }`}
                  >
                    Cotizar
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedService}
      />
    </section>
  )
}
