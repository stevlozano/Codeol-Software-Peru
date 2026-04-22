import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import emailjs from 'emailjs-com'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'codeolsoftware@gmail.com',
    href: 'mailto:codeolsoftware@gmail.com',
  },
  {
    icon: Phone,
    label: 'Teléfono / WhatsApp',
    value: '+51 926 974 985',
    href: 'tel:+51926974985',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Lima, Perú',
    href: '#',
  },
  {
    icon: Clock,
    label: 'Horario de atención',
    value: 'Lunes - Viernes: 9am - 7pm',
    href: '#',
  },
]

const services = [
  'Página Web',
  'E-commerce',
  'Sistema Personalizado',
  'Aplicación Web',
  'Landing Page',
  'Otro',
]

export default function Contact() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  // Escuchar evento de Pricing para pre-seleccionar servicio y presupuesto
  useEffect(() => {
    const handlePricingSelect = (e) => {
      const { service, budget } = e.detail
      setFormState(prev => ({
        ...prev,
        service: service || prev.service,
        budget: budget || prev.budget,
      }))
    }
    window.addEventListener('pricing-select', handlePricingSelect)
    return () => window.removeEventListener('pricing-select', handlePricingSelect)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Configuración de EmailJS - Credenciales reales
      const serviceID = 'service_w84cg9j'
      const templateID = 'template_1o6t0zn'
      const userID = 'prx2va_2G9vqF5JD6'
      
      const templateParams = {
        nombre_a: formState.name,
        correo_electronico: formState.email,
        telefono: formState.phone || 'No proporcionado',
        producto: formState.service || 'No seleccionado',
        titulo: formState.budget || 'No especificado',
        empresa: formState.message,
        enviar_correo_electronico: formState.email
      }
      
      // Envío real con EmailJS - Correo para la empresa
      await emailjs.send(serviceID, templateID, templateParams, userID)
      
      // Envío de correo de bienvenida al usuario
      const welcomeTemplateID = 'template_k6bbucb'
      const welcomeParams = {
        nombre_a: formState.name,
        'correo_electrónico': formState.email,
        telefono: formState.phone || 'No proporcionado',
        producto: formState.service || 'No seleccionado',
        titulo: formState.budget || 'No especificado',
        empresa: formState.message,
        'enviar_correo_electrónico': formState.email,
        to_name: formState.name,
        to_email: formState.email
      }
      await emailjs.send(serviceID, welcomeTemplateID, welcomeParams, userID)
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Mostrar notificación de éxito
      setNotification({
        type: 'success',
        message: `¡Mensaje enviado! Se ha enviado un correo de confirmación a ${formState.email}`
      })
      
      // Reset after showing success
      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({
          name: '',
          email: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
        })
      }, 2000)
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      
    } catch (err) {
      setIsSubmitting(false)
      setError('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.')
      setNotification({
        type: 'error',
        message: 'Error al enviar el mensaje. Intenta nuevamente.'
      })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleChange = (e) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-24 lg:py-32 bg-pure-black relative"
    >
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-black' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={24} />
            ) : (
              <AlertCircle size={24} />
            )}
            <p className="font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
            >
              Contacto
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Hablemos de tu <span className="text-pure-gray-400">proyecto</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-pure-gray-400 leading-relaxed"
            >
              Estamos listos para convertir tus ideas en realidad. Cuéntanos 
              sobre tu proyecto y te respondemos en menos de 24 horas.
            </motion.p>
          </div>

          {/* Contact Info Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-6 border border-pure-gray-800 rounded-xl hover:border-pure-gray-600 transition-colors group"
                >
                  <div className="p-3 bg-pure-gray-900 rounded-lg group-hover:bg-pure-gray-800 transition-colors">
                    <item.icon size={20} className="text-pure-gray-400" />
                  </div>
                  <div>
                    <span className="text-xs text-pure-gray-500 uppercase tracking-wider block mb-1">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-pure-white group-hover:text-pure-gray-300 transition-colors">
                      {item.value}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border border-pure-gray-800 rounded-2xl p-8 lg:p-12"
        >
          {isSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">¡Mensaje enviado!</h3>
              <p className="text-pure-gray-400">Te contactaremos en menos de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name */}
              <div className="lg:col-span-1">
                <label htmlFor="name" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              {/* Email */}
              <div className="lg:col-span-1">
                <label htmlFor="email" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Phone */}
              <div className="lg:col-span-1">
                <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                  placeholder="+51 999 999 999"
                />
              </div>

              {/* Service */}
              <div className="lg:col-span-1">
                <label htmlFor="service" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Tipo de servicio *
                </label>
                <select
                  id="service"
                  name="service"
                  data-field="service"
                  value={formState.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white focus:outline-none focus:border-pure-gray-600 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona un servicio</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="lg:col-span-2">
                <label htmlFor="budget" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Presupuesto estimado
                </label>
                <select
                  id="budget"
                  name="budget"
                  data-field="budget"
                  value={formState.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white focus:outline-none focus:border-pure-gray-600 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecciona un rango</option>
                  <option value="1-2000">S/ 1,000 - S/ 2,000</option>
                  <option value="2000-5000">S/ 2,000 - S/ 5,000</option>
                  <option value="5000-10000">S/ 5,000 - S/ 10,000</option>
                  <option value="10000+">Más de S/ 10,000</option>
                  <option value="no-sure">Aún no estoy seguro</option>
                </select>
              </div>

              {/* Message */}
              <div className="lg:col-span-2">
                <label htmlFor="message" className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                  Cuéntanos sobre tu proyecto *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors resize-none"
                  placeholder="Describe tu proyecto, objetivos, y cualquier detalle importante..."
                />
              </div>

              {/* Submit */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-pure-white text-pure-black font-medium rounded-full hover:bg-pure-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
