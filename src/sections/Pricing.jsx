import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, ArrowUpRight, Zap, TrendingUp, Users, Globe, Plus } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'
import { useCart, MIN_PRICE } from '../context/CartContext'

const plans = [
  {
    id: 'plan-web-esencial',
    name: 'Web Esencial',
    subtitle: 'Para emprendedores',
    price: 'Cotizar',
    description: 'Tu primera presencia digital profesional que genera confianza desde el primer día.',
    features: [
      'Diseño personalizado que conecta con tu marca',
      '100% Responsive en todos los dispositivos',
      'Formulario de contacto que convierte visitantes',
      'Optimización SEO para aparecer en Google',
      'Hosting y dominio incluidos por 1 año',
      'Entrega en 7 días',
    ],
    results: [
      'Mayor visibilidad online',
      'Clientes te encuentran fácilmente',
      'Imagen profesional desde el inicio',
    ],
    cta: 'Cotizar ahora',
    popular: false,
  },
  {
    id: 'plan-web-profesional',
    name: 'Web Profesional',
    subtitle: 'Para negocios en crecimiento',
    price: 'Cotizar',
    description: 'Sitio web completo que posiciona tu marca y genera leads cualificados.',
    features: [
      'Diseño premium hasta 5 páginas',
      'Blog para generar contenido de valor',
      'SEO completo para posicionamiento orgánico',
      'Integración con redes sociales',
      'Google Analytics para medir resultados',
      'Hosting y dominio incluidos por 1 año',
      'Soporte dedicado por 3 meses',
      'Entrega en 14 días',
    ],
    results: [
      'Posicionamiento en Google',
      'Aumento de leads cualificados',
      'Autoridad en tu industria',
    ],
    cta: 'Cotizar ahora',
    popular: true,
  },
  {
    id: 'plan-ecommerce',
    name: 'E-commerce',
    subtitle: 'Tienda online completa',
    price: 'Cotizar',
    description: 'Tienda virtual optimizada para maximizar tus ventas 24/7.',
    features: [
      'Diseño premium para conversión',
      'Catálogo de productos ilimitado',
      'Pasarela de pagos (Yape, Plin, tarjetas)',
      'Gestión de inventario automatizada',
      'Panel administrativo intuitivo',
      'Reportes de ventas en tiempo real',
      'SEO avanzado para productos',
      'Hosting y dominio incluidos por 1 año',
      'Soporte dedicado por 6 meses',
      'Entrega en 21 días',
    ],
    results: [
      'Ventas automatizadas 24/7',
      'Mayor ticket promedio',
      'Retención de clientes',
    ],
    cta: 'Cotizar ahora',
    popular: false,
  },
]

const customServices = [
  {
    title: 'Sistemas Personalizados',
    description: 'Software a medida que optimiza tus procesos internos.',
    icon: <TrendingUp size={20} />,
  },
  {
    title: 'Aplicaciones Web',
    description: 'Web apps con funcionalidades avanzadas y experiencia nativa.',
    icon: <Globe size={20} />,
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de alta conversión para campañas publicitarias.',
    icon: <Users size={20} />,
  },
]

export default function Pricing() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customPrices, setCustomPrices] = useState({})
  const { addToCart, setIsCartOpen } = useCart()

  const handlePriceChange = (planId, value) => {
    const price = Math.max(MIN_PRICE, parseFloat(value) || MIN_PRICE)
    setCustomPrices(prev => ({ ...prev, [planId]: price }))
  }

  const handleAddToCart = (plan) => {
    const customPrice = customPrices[plan.id]
    addToCart({
      id: plan.id,
      name: plan.name,
      subtitle: plan.subtitle,
      price: plan.price,
      icon: Zap
    }, customPrice)
    setIsCartOpen(true)
  }

  const handleSelectPlan = (plan) => {
    const serviceMap = {
      'Web Esencial': 'Página Web',
      'Web Profesional': 'Página Web',
      'E-commerce': 'E-commerce'
    }
    setSelectedPlan({
      ...plan,
      service: serviceMap[plan.name] || plan.name
    })
    setIsModalOpen(true)
  }

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="py-24 lg:py-32 bg-pure-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
          >
            Soluciones que impulsan tu negocio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            Resultados que <span className="text-pure-gray-400">transforman</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-pure-gray-400 leading-relaxed"
          >
            Cada solución está diseñada para generar valor real: más visibilidad, más clientes, más ventas.
            Cotizamos según tus necesidades específicas.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-pure-white bg-pure-gray-900/50 scale-105 lg:scale-110 z-10'
                  : 'border-pure-gray-800 hover:border-pure-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-pure-white text-pure-black text-xs font-semibold rounded-full">
                    <Zap size={12} />
                    Más popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <span className="text-xs text-pure-gray-500 uppercase tracking-wider">
                  {plan.subtitle}
                </span>
                <h3 className="text-2xl font-bold mt-1">{plan.name}</h3>
                <p className="text-sm text-pure-gray-400 mt-2">{plan.description}</p>
              </div>

              {/* Price - CTA focused */}
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-pure-white">{plan.price}</span>
                <p className="text-sm text-pure-gray-500 mt-1">Personalizado según tu proyecto</p>
              </div>

              {/* Custom Price Input */}
              <div className="mb-6">
                <label className="text-xs text-pure-gray-500 block mb-1">Tu presupuesto (mín. S/ {MIN_PRICE})</label>
                <div className="flex items-center gap-2">
                  <span className="text-pure-gray-400">S/</span>
                  <input
                    type="number"
                    min={MIN_PRICE}
                    value={customPrices[plan.id] || ''}
                    onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                    placeholder={MIN_PRICE.toString()}
                    className="flex-1 px-3 py-2 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-sm text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="mb-6 p-4 bg-pure-gray-900/50 rounded-xl">
                <p className="text-xs text-pure-gray-500 uppercase tracking-wider mb-3">Resultados que obtienes</p>
                <ul className="space-y-2">
                  {plan.results.map((result) => (
                    <li key={result} className="flex items-start gap-2 text-sm text-pure-gray-300">
                      <TrendingUp size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-pure-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart(plan)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-full bg-pure-gray-800 text-pure-white hover:bg-pure-gray-700 transition-all duration-300 cursor-pointer"
                >
                  <Plus size={16} />
                  Agregar
                </button>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                    plan.popular
                      ? 'bg-pure-white text-pure-black hover:bg-pure-gray-200'
                      : 'border border-pure-gray-700 text-pure-white hover:bg-pure-gray-800'
                  }`}
                >
                  Cotizar
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border border-pure-gray-800 rounded-2xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold mb-2">¿Necesitas algo más específico?</h3>
              <p className="text-pure-gray-400 text-sm">
                Desarrollamos soluciones a medida según tus requerimientos únicos.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {customServices.map((service) => (
                  <div key={service.title} className="p-6 bg-pure-gray-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-pure-white">
                      {service.icon}
                      <h4 className="font-semibold">{service.title}</h4>
                    </div>
                    <p className="text-xs text-pure-gray-500 mb-4">{service.description}</p>
                    <button
                      onClick={() => handleSelectPlan({ name: service.title, description: service.description, service: 'Otro' })}
                      className="text-sm text-pure-white hover:text-pure-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Cotizar <ArrowUpRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-xs text-pure-gray-500 mt-8"
        >
          * Cada proyecto es único. La cotización se personaliza según tus requerimientos específicos, alcance y plazos. Contáctanos para una evaluación detallada.
        </motion.p>
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
      />
    </section>
  )
}
