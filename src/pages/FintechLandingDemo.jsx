import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft,
  Check, 
  Menu, 
  X, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe,
  Smartphone,
  CreditCard,
  Lock,
  Users,
  Award,
  Play,
  ChevronRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  ChevronDown
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Transferencias Instantáneas',
    description: 'Envía dinero en segundos, sin esperas ni complicaciones. Disponible 24/7.'
  },
  {
    icon: Shield,
    title: 'Seguridad Bancaria',
    description: 'Tus fondos protegidos con encriptación de nivel militar y autenticación biométrica.'
  },
  {
    icon: CreditCard,
    title: 'Tarjeta Virtual',
    description: 'Tarjeta de débito digital con control total. Congela, descongela y personaliza al instante.'
  },
  {
    icon: Globe,
    title: 'Sin Fronteras',
    description: 'Envía dinero a cualquier país con las mejores tasas de cambio del mercado.'
  }
]

const testimonials = [
  {
    name: 'María González',
    role: 'Emprendedora',
    content: 'PayFlow transformó mi negocio. Las transferencias instantáneas me permiten pagar a proveedores al instante. Mis ventas aumentaron un 40%.',
    rating: 5,
    avatar: 'M'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Freelancer',
    content: 'Recibo pagos internacionales sin comisiones excesivas. La mejor app financiera que he usado en mi carrera.',
    rating: 5,
    avatar: 'C'
  },
  {
    name: 'Ana Torres',
    role: 'CEO Startup',
    content: 'Mi equipo usa PayFlow para gestionar gastos. El control y visibilidad que nos da es incomparable.',
    rating: 5,
    avatar: 'A'
  }
]

const stats = [
  { value: '150K+', label: 'Usuarios activos' },
  { value: '$2.5B', label: 'Transaccionados' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '4.9', label: 'Rating en App Store' }
]

const pricingPlans = [
  {
    name: 'Personal',
    price: 'Gratis',
    description: 'Para uso individual',
    features: ['Transferencias nacionales', 'Tarjeta virtual', 'App móvil', 'Soporte 24/7'],
    popular: false
  },
  {
    name: 'Pro',
    price: 'S/ 29.90',
    period: '/mes',
    description: 'Para freelancers',
    features: ['Todo de Personal', 'Transferencias internacionales', 'Facturación', 'API access', 'Reportes avanzados'],
    popular: true
  },
  {
    name: 'Business',
    price: 'S/ 99.90',
    period: '/mes',
    description: 'Para empresas',
    features: ['Todo de Pro', 'Múltiples usuarios', 'Integraciones ERP', 'Soporte prioritario', 'Account manager'],
    popular: false
  }
]

const faqs = [
  {
    question: '¿Cuánto tiempo tarda una transferencia?',
    answer: 'Las transferencias entre usuarios de PayFlow son instantáneas. Transferencias a otros bancos toman hasta 24 horas hábiles.'
  },
  {
    question: '¿Es seguro usar PayFlow?',
    answer: 'Sí. Usamos encriptación de 256 bits, autenticación de dos factores, y cumplimos con PCI DSS nivel 1.'
  },
  {
    question: '¿Puedo usar PayFlow desde cualquier país?',
    answer: 'PayFlow está disponible en 15 países de Latinoamérica y está expandiéndose constantemente.'
  },
  {
    question: '¿Hay límites de transferencia?',
    answer: 'Los límites varían según tu plan. Personal: S/ 10,000/mes. Pro: S/ 100,000/mes. Business: Ilimitado.'
  }
]

export default function FintechLandingDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)
  const [email, setEmail] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setShowNotification(true)
      setEmail('')
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-pure-white origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-black px-6 py-3 rounded-full font-medium shadow-lg"
          >
            ¡Gracias! Te contactaremos pronto.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-pure-black/90 backdrop-blur-xl border-b border-pure-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2 text-pure-gray-400 hover:text-pure-white transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm">Volver</span>
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pure-white rounded-lg flex items-center justify-center">
                <span className="text-pure-black font-bold text-sm">PF</span>
              </div>
              <span className="font-bold tracking-tight">PayFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">Características</a>
              <a href="#testimonials" className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">Testimonios</a>
              <a href="#pricing" className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">Precios</a>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:block text-sm text-pure-gray-400 hover:text-pure-white transition-colors">
                Iniciar sesión
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
              >
                Comenzar
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
              >
                <Menu size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pure-gray-800/30 via-pure-black to-pure-black" />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-32 w-96 h-96 bg-pure-gray-800/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pure-gray-700/20 rounded-full blur-3xl"
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pure-gray-900/50 border border-pure-gray-800 rounded-full mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-pure-gray-300">Nuevo: Transferencias internacionales</span>
              <ChevronRight size={14} className="text-pure-gray-500" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Tu dinero,{' '}
              <span className="bg-gradient-to-r from-pure-white via-pure-gray-300 to-pure-gray-500 bg-clip-text text-transparent">
                sin límites
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-pure-gray-400 max-w-2xl mx-auto mb-10"
            >
              La banca digital que entiende tu ritmo. Transferencias instantáneas, 
              tarjetas virtuales y seguridad biométrica. Todo en una app.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
              >
                Crear cuenta gratis
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 border border-pure-gray-700 rounded-full font-medium hover:bg-pure-gray-900 transition-colors"
              >
                <Play size={18} className="fill-current" />
                Ver demo
              </motion.button>
            </motion.div>

            {/* App Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-b from-pure-gray-800 to-pure-gray-900 rounded-2xl border border-pure-gray-700 overflow-hidden shadow-2xl">
                {/* App UI Mockup */}
                <div className="absolute inset-0 p-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-8 h-8 bg-pure-white rounded-lg" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-pure-gray-700 rounded-lg" />
                      <div className="w-8 h-8 bg-pure-gray-700 rounded-lg" />
                    </div>
                  </div>
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-pure-white/10 to-pure-white/5 rounded-xl p-6 mb-6">
                    <p className="text-sm text-pure-gray-400 mb-2">Balance total</p>
                    <p className="text-3xl font-bold">S/ 12,450.80</p>
                    <div className="flex gap-4 mt-4">
                      <div className="flex-1 h-10 bg-pure-gray-800 rounded-lg" />
                      <div className="flex-1 h-10 bg-pure-gray-800 rounded-lg" />
                    </div>
                  </div>
                  {/* Transactions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg" />
                        <div>
                          <p className="text-sm font-medium">Transferencia recibida</p>
                          <p className="text-xs text-pure-gray-500">Hace 2 min</p>
                        </div>
                      </div>
                      <p className="text-green-400">+S/ 500</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg" />
                        <div>
                          <p className="text-sm font-medium">Pago a tienda</p>
                          <p className="text-xs text-pure-gray-500">Hace 1 hora</p>
                        </div>
                      </div>
                      <p className="text-red-400">-S/ 89.50</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-8 top-1/4 p-4 bg-pure-gray-900/90 backdrop-blur border border-pure-gray-700 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+150%</p>
                    <p className="text-xs text-pure-gray-500">Conversiones</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-8 bottom-1/3 p-4 bg-pure-gray-900/90 backdrop-blur border border-pure-gray-700 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pure-white/10 rounded-full flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">50K+</p>
                    <p className="text-xs text-pure-gray-500">Nuevos usuarios</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-pure-gray-600 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-pure-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-pure-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-pure-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Todo lo que necesitas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-pure-gray-400 max-w-2xl mx-auto"
            >
              Herramientas diseñadas para hacer que manejar tu dinero sea 
              rápido, seguro y sin complicaciones.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group p-8 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl hover:border-pure-gray-600 transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-pure-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pure-white/20 transition-colors">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-pure-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-pure-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-50">
            {['TechCrunch', 'Forbes', 'Bloomberg', 'Wired', 'The Verge'].map((brand) => (
              <span key={brand} className="text-xl lg:text-2xl font-bold tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-pure-gray-400">
              Más de 150,000 personas confían en PayFlow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-pure-gray-900/50 border border-pure-gray-800 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote size={24} className="text-pure-gray-600 mb-4" />
                <p className="text-pure-gray-300 leading-relaxed mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pure-white to-pure-gray-600 rounded-full flex items-center justify-center text-pure-black font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-pure-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Planes simples y transparentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-pure-gray-400"
            >
              Sin contratos, sin comisiones ocultas. Cancela cuando quieras.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl ${
                  plan.popular 
                    ? 'bg-pure-white text-pure-black' 
                    : 'bg-pure-gray-900/50 border border-pure-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-pure-black text-pure-white text-xs font-medium rounded-full">
                      Más popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-pure-gray-600' : 'text-pure-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className={plan.popular ? 'text-pure-gray-600' : 'text-pure-gray-500'}>{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check size={18} className={plan.popular ? 'text-green-600' : 'text-green-400'} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-full font-medium transition-colors ${
                    plan.popular
                      ? 'bg-pure-black text-pure-white hover:bg-pure-gray-800'
                      : 'bg-pure-white text-pure-black hover:bg-pure-gray-200'
                  }`}
                >
                  {plan.price === 'Gratis' ? 'Comenzar gratis' : 'Elegir plan'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-pure-gray-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            Preguntas frecuentes
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-6 text-pure-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-pure-gray-800 to-pure-gray-900 rounded-3xl text-center overflow-hidden"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pure-white/10 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                ¿Listo para transformar tus finanzas?
              </h2>
              <p className="text-lg text-pure-gray-400 mb-8 max-w-xl mx-auto">
                Únete a 150,000+ personas que ya usan PayFlow. 
                Tu cuenta gratuita te espera.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-pure-white text-pure-black rounded-full font-medium hover:bg-pure-gray-200 transition-colors"
              >
                Crear cuenta gratis
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pure-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pure-white rounded-lg flex items-center justify-center">
                  <span className="text-pure-black font-bold text-sm">PF</span>
                </div>
                <span className="font-bold">PayFlow</span>
              </div>
              <p className="text-sm text-pure-gray-500 mb-4">
                La banca digital que entiende tu ritmo.
              </p>
              <div className="flex gap-4">
                <Instagram size={18} className="text-pure-gray-500 hover:text-pure-white cursor-pointer transition-colors" />
                <Twitter size={18} className="text-pure-gray-500 hover:text-pure-white cursor-pointer transition-colors" />
                <Linkedin size={18} className="text-pure-gray-500 hover:text-pure-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-pure-gray-500">
                <li className="hover:text-pure-white cursor-pointer transition-colors">Características</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Precios</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">API</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Seguridad</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-pure-gray-500">
                <li className="hover:text-pure-white cursor-pointer transition-colors">Sobre nosotros</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Carreras</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Prensa</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-pure-gray-500">
                <li className="hover:text-pure-white cursor-pointer transition-colors">Centro de ayuda</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Contacto</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Estado del sistema</li>
                <li className="hover:text-pure-white cursor-pointer transition-colors">Términos</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-pure-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-pure-gray-500">
              © 2025 PayFlow. Todos los derechos reservados.
            </p>
            <p className="text-sm text-pure-gray-500">
              Demo creada por Codeol Software Perú
            </p>
          </div>
        </div>
      </footer>

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
                    <span className="text-pure-black font-bold text-sm">PF</span>
                  </div>
                  <span className="font-bold">PayFlow</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-pure-gray-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {['Características', 'Testimonios', 'Precios', 'FAQ'].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-4 text-xl text-pure-gray-400 hover:text-pure-white transition-colors border-b border-pure-gray-800"
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>

              <div className="space-y-3 pt-6">
                <button className="w-full py-3 border border-pure-gray-700 rounded-full font-medium">
                  Iniciar sesión
                </button>
                <button className="w-full py-3 bg-pure-white text-pure-black rounded-full font-medium">
                  Crear cuenta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
