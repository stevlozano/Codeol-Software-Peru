import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, ArrowUpRight, Zap } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'

const plans = [
  {
    name: 'Web Esencial',
    subtitle: 'Para emprendedores',
    price: '1,200',
    description: 'Página web profesional para presentar tu negocio en línea.',
    features: [
      'Diseño personalizado (1 página)',
      '100% Responsive',
      'Formulario de contacto',
      'Optimización SEO básica',
      'Hosting gratis (1 año)',
      'Dominio .com.pe incluido',
      'Entrega en 7 días',
    ],
    notIncluded: [
      'Panel administrativo',
      'E-commerce',
      'Soporte prioritario',
    ],
    cta: 'Comenzar proyecto',
    popular: false,
  },
  {
    name: 'Web Profesional',
    subtitle: 'Para negocios en crecimiento',
    price: '2,800',
    description: 'Sitio web completo con múltiples secciones y funcionalidades.',
    features: [
      'Diseño premium (hasta 5 páginas)',
      '100% Responsive avanzado',
      'Blog integrado',
      'Optimización SEO completa',
      'Integración con redes sociales',
      'Google Analytics',
      'Hosting gratis (1 año)',
      'Dominio .com incluido',
      'Soporte por 3 meses',
      'Entrega en 14 días',
    ],
    notIncluded: [
      'E-commerce',
    ],
    cta: 'Comenzar proyecto',
    popular: true,
  },
  {
    name: 'E-commerce',
    subtitle: 'Tienda online completa',
    price: '4,500',
    description: 'Tienda virtual completa lista para vender tus productos.',
    features: [
      'Diseño premium ilimitado',
      'Catálogo de productos',
      'Carrito de compras',
      'Pasarela de pagos (Yape, Plin, tarjetas)',
      'Gestión de inventario',
      'Panel administrativo',
      'Reportes de ventas',
      'Optimización SEO avanzada',
      'Hosting gratis (1 año)',
      'Dominio .com incluido',
      'Soporte por 6 meses',
      'Entrega en 21 días',
    ],
    notIncluded: [],
    cta: 'Comenzar proyecto',
    popular: false,
  },
]

const customServices = [
  {
    title: 'Sistemas Personalizados',
    description: 'Desarrollo de software a medida según tus requerimientos específicos.',
    price: 'Desde S/ 5,000',
  },
  {
    title: 'Aplicaciones Web',
    description: 'Web apps progresivas con funcionalidades avanzadas y experiencia nativa.',
    price: 'Desde S/ 6,500',
  },
  {
    title: 'Landing Pages',
    description: 'Páginas de conversión optimizadas para campañas publicitarias.',
    price: 'Desde S/ 800',
  },
]

export default function Pricing() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            Precios transparentes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            Inversión acorde a tu <span className="text-pure-gray-400">presupuesto</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-pure-gray-400 leading-relaxed"
          >
            Precios competitivos del mercado nacional. Todos nuestros planes incluyen 
            diseño personalizado y optimización para resultados.
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

              {/* Price */}
              <div className="mb-8">
                <span className="text-sm text-pure-gray-500">Desde</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-pure-gray-500">S/</span>
                  <span className="text-4xl sm:text-5xl font-bold">{plan.price}</span>
                </div>
                <span className="text-sm text-pure-gray-500">pago único</span>
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

              {/* CTA */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`inline-flex items-center justify-center w-full gap-2 px-6 py-4 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                  plan.popular
                    ? 'bg-pure-white text-pure-black hover:bg-pure-gray-200'
                    : 'border border-pure-gray-700 text-pure-white hover:bg-pure-gray-800'
                }`}
              >
                {plan.cta}
                <ArrowUpRight size={14} />
              </button>
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
              <h3 className="text-2xl font-bold mb-2">Servicios personalizados</h3>
              <p className="text-pure-gray-400 text-sm">
                ¿Necesitas algo más específico? Cotizamos según tus requerimientos.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {customServices.map((service) => (
                  <div key={service.title} className="p-6 bg-pure-gray-900/30 rounded-xl">
                    <h4 className="font-semibold mb-2">{service.title}</h4>
                    <p className="text-xs text-pure-gray-500 mb-3">{service.description}</p>
                    <span className="text-sm font-medium text-pure-white">{service.price}</span>
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
          * Todos los precios son en soles peruanos (S/). Los precios pueden variar según requerimientos específicos.
          Contáctanos para una cotización personalizada.
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
