import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import emailjs from 'emailjs-com'
import { 
  X, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react'

export default function ProjectModal({ isOpen, onClose, plan }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const serviceID = 'service_w84cg9j'
      const userID = 'prx2va_2G9vqF5JD6'

      // Correo para la empresa
      const templateParams = {
        nombre_a: formState.name,
        correo_electronico: formState.email,
        telefono: formState.phone || 'No proporcionado',
        producto: plan.service || plan.name,
        titulo: plan.price || 'Cotización personalizada',
        empresa: formState.message,
        enviar_correo_electronico: formState.email
      }
      await emailjs.send(serviceID, 'template_1o6t0zn', templateParams, userID)

      // Correo de bienvenida al usuario
      const welcomeParams = {
        nombre_a: formState.name,
        'correo_electrónico': formState.email,
        telefono: formState.phone || 'No proporcionado',
        producto: plan.service || plan.name,
        titulo: plan.price || 'Cotización personalizada',
        empresa: formState.message,
        'enviar_correo_electrónico': formState.email,
        to_name: formState.name,
        to_email: formState.email
      }
      await emailjs.send(serviceID, 'template_k6bbucb', welcomeParams, userID)

      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormState({ name: '', email: '', phone: '', message: '' })
        onClose()
      }, 3000)
    } catch (err) {
      setIsSubmitting(false)
      setError('Error al enviar. Intenta nuevamente.')
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSubmitted(false)
      setError(null)
      setFormState({ name: '', email: '', phone: '', message: '' })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && plan && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-pure-black border border-pure-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-pure-gray-800">
                <div>
                  <p className="text-xs uppercase tracking-widest text-pure-gray-500 mb-1">
                    Iniciar proyecto
                  </p>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-pure-gray-400 mt-1">{plan.subtitle}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-pure-gray-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.6 }}
                    >
                      <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
                    </motion.div>
                    <h4 className="text-xl font-bold mb-2">¡Proyecto iniciado!</h4>
                    <p className="text-pure-gray-400 text-sm">
                      Hemos recibido tu solicitud. Te contactaremos en menos de 24 horas.
                    </p>
                    <p className="text-pure-gray-500 text-xs mt-3">
                      Se envió un correo de confirmación a {formState.email}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Plan summary */}
                    <div className="bg-pure-gray-900/50 border border-pure-gray-800 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-pure-gray-400">Plan seleccionado</span>
                        <span className="text-sm font-semibold">{plan.price}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.features && plan.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs bg-pure-gray-800 text-pure-gray-300 px-2 py-1 rounded-full">
                            {f}
                          </span>
                        ))}
                        {plan.features && plan.features.length > 4 && (
                          <span className="text-xs text-pure-gray-500">+{plan.features.length - 4} más</span>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
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
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Teléfono / WhatsApp
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors"
                          placeholder="+51 999 999 999"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-pure-gray-500 mb-2">
                          Cuéntanos sobre tu proyecto *
                        </label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-4 py-3 bg-pure-gray-900 border border-pure-gray-800 rounded-lg text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors resize-none"
                          placeholder="Describe tu proyecto, objetivos y cualquier detalle importante..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center w-full gap-2 px-6 py-4 text-sm font-medium rounded-full bg-pure-white text-pure-black hover:bg-pure-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Iniciar proyecto
                            <ArrowUpRight size={14} />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-pure-gray-600 text-center">
                        Te responderemos en menos de 24 horas
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
