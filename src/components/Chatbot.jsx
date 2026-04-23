import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Phone, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const GEMINI_API_KEY = 'AIzaSyDJY2myyyQLlfFNr-yzW5Gf1T9B02_J6j8'

const SYSTEM_PROMPT = `Eres el asistente virtual de Codeol Software Perú, una empresa de desarrollo de software con 5 años de experiencia, 250+ clientes y 99.9% de éxito. 

Información clave:
- Servicios: Páginas Web (Desde S/ 1,200), Sistemas Personalizados (Cotización), E-commerce (Desde S/ 2,500), Aplicaciones Web (Desde S/ 3,000), Sistemas de Gestión ERP/CRM (Cotización), Landing Pages (Desde S/ 800)
- Planes: Web Esencial S/ 1,200, Web Profesional S/ 2,800, E-commerce S/ 4,500
- Contacto: +51 926 974 985, codeolsoftware@gmail.com
- Ubicación: Lima, Perú
- Tecnologías: React, Next.js, Node.js, PostgreSQL, Firebase, Docker, Stripe
- Entrega: 7-21 días según proyecto
- Todos los planes incluyen hosting gratis 1 año y dominio

Reglas:
- Responde en español, sé amable y profesional
- Si preguntan precios, menciona los rangos y sugiere contactar para cotización exacta
- Si preguntan algo fuera de tema, redirige a los servicios de Codeol
- Sé conciso, no más de 3-4 párrafos
- Nunca inventes información que no tengas`

const localResponses = [
  { keywords: ['precio', 'cuesta', 'costo', 'cuánto', 'valor', 'tarifa', 'cobran'], response: 'Nuestros precios varían según el proyecto:\n\n• Landing Pages: Desde S/ 800\n• Páginas Web: Desde S/ 1,200\n• E-commerce: Desde S/ 2,500\n• Aplicaciones Web: Desde S/ 3,000\n• Sistemas Personalizados: Cotización personalizada\n\nPara una cotización exacta, contáctanos al +51 926 974 985 o codeolsoftware@gmail.com' },
  { keywords: ['servicio', 'ofrecen', 'hacen', 'desarrollan', 'crean'], response: 'Ofrecemos 6 servicios principales:\n\n1. Páginas Web Modernas - Desde S/ 1,200\n2. Sistemas Personalizados - Cotización\n3. E-commerce - Desde S/ 2,500\n4. Aplicaciones Web (PWA) - Desde S/ 3,000\n5. Sistemas de Gestión (ERP/CRM) - Cotización\n6. Landing Pages - Desde S/ 800\n\nTodos incluyen hosting gratis 1 año y dominio.' },
  { keywords: ['tiempo', 'entrega', 'demora', 'tardan', 'plazo', 'días'], response: 'Los tiempos de entrega son:\n\n• Landing Pages: 5-7 días\n• Páginas Web: 7-10 días\n• E-commerce: 14-21 días\n• Aplicaciones Web: 14-21 días\n• Sistemas Personalizados: 21-30 días\n\nTrabajamos con metodología ágil para entregas puntuales.' },
  { keywords: ['contacto', 'contactar', 'teléfono', 'email', 'correo', 'whatsapp', 'llamar'], response: 'Puedes contactarnos por:\n\n• Teléfono/WhatsApp: +51 926 974 985\n• Email: codeolsoftware@gmail.com\n• Ubicación: Lima, Perú\n\nTe respondemos en menos de 24 horas.' },
  { keywords: ['página web', 'web esencial', 'web profesional', 'sitio web'], response: 'Tenemos 2 planes de páginas web:\n\n• Web Esencial (S/ 1,200): 1 página, responsive, SEO básico, hosting 1 año, dominio .com.pe\n• Web Profesional (S/ 2,800): Hasta 5 páginas, blog, SEO completo, Analytics, soporte 3 meses\n\nAmbos con diseño personalizado y entrega rápida.' },
  { keywords: ['tienda', 'ecommerce', 'e-commerce', 'vender', 'comercio'], response: 'Nuestro plan E-commerce (S/ 4,500) incluye:\n\n• Catálogo de productos ilimitado\n• Carrito de compras\n• Pasarela de pagos (Yape, Plin, tarjetas)\n• Panel administrativo\n• Gestión de inventario\n• Reportes de ventas\n• Soporte 6 meses\n\nEntrega en 21 días.' },
  { keywords: ['erp', 'crm', 'sistema', 'gestión', 'inventario'], response: 'Desarrollamos sistemas personalizados:\n\n• ERP: Gestión de inventario, ventas, facturación\n• CRM: Gestión de clientes y seguimiento\n• Reportes en tiempo real\n• Múltiples usuarios y sucursales\n• Cotización personalizada según requerimientos\n\nContáctanos para una demo gratuita.' },
  { keywords: ['landing', 'campaña', 'conversión', 'publicidad'], response: 'Nuestras Landing Pages (Desde S/ 800):\n\n• Diseño persuasivo optimizado para conversiones\n• A/B testing\n• Formularios optimizados\n• Analytics integrado\n• Entrega en 5-7 días\n\nIdeal para campañas de Google Ads o Facebook Ads.' },
  { keywords: ['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches'], response: '¡Hola! 👋 Bienvenido a Codeol Software Perú. ¿En qué puedo ayudarte? Puedes preguntarme sobre nuestros servicios, precios, tiempos de entrega o cualquier consulta.' },
  { keywords: ['cotizar', 'cotización', 'presupuesto', 'cuánto saldría', 'cuanto saldria'], response: 'Para cotizar tu proyecto, necesitamos algunos detalles:\n\n1. Tipo de proyecto (web, tienda, sistema, app)\n2. Funcionalidades que necesitas\n3. Si ya tienes diseño o logo\n4. Tu presupuesto aproximado\n\nPuedes solicitar cotización directamente:\n• WhatsApp: +51 926 974 985\n• Email: codeolsoftware@gmail.com\n• O llena el formulario de contacto en nuestra web\n\nTe respondemos en menos de 24 horas con una propuesta detallada.' },
  { keywords: ['gracias', 'genial', 'perfecto', 'excelente'], response: '¡De nada! 😊 Si necesitas algo más, no dudes en preguntar. También puedes contactarnos directamente al +51 926 974 985 o codeolsoftware@gmail.com' },
  { keywords: ['app', 'aplicación', 'pwa', 'movil', 'móvil', 'celular'], response: 'Desarrollamos Aplicaciones Web Progresivas (PWA) desde S/ 3,000:\n\n• Instalable en cualquier dispositivo\n• Funciona sin conexión (offline)\n• Notificaciones push\n• Experiencia similar a app nativa\n• Más económico que una app nativa\n\nEntrega en 14-21 días. ¿Quieres saber más?' },
  { keywords: ['pago', 'yape', 'plin', 'tarjeta', 'pasarela', 'metodo', 'método'], response: 'Integramos múltiples métodos de pago:\n\n• Yape y Plin (los más usados en Perú)\n• Tarjetas de crédito/débito\n• Transferencias bancarias\n• PayPal\n• Stripe para pagos internacionales\n\nPara tiendas online, incluimos pasarela de pagos en todos los planes E-commerce.' },
  { keywords: ['hosting', 'dominio', 'servidor', 'ssl', 'certificado'], response: 'Todos nuestros planes incluyen:\n\n• Hosting gratis por 1 año\n• Dominio incluido (.com o .com.pe)\n• Certificado SSL (candado verde)\n• Soporte técnico\n\nDespués del primer año, el costo de renovación es mínimo. ¿Tienes otra consulta?' },
  { keywords: ['soporte', 'mantenimiento', 'actualización', 'cambio', 'modificación'], response: 'Ofrecemos soporte post-entrega:\n\n• Web Esencial: Soporte básico\n• Web Profesional: 3 meses de soporte\n• E-commerce: 6 meses de soporte\n• Sistemas: Soporte continuo\n\nTambién tenemos planes de mantenimiento mensual. Contáctanos para más detalles.' },
]

const getLocalResponse = (message) => {
  const lower = message.toLowerCase()
  for (const item of localResponses) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.response
    }
  }
  return null
}

const quickActions = [
  '¿Cuánto cuesta una página web?',
  '¿Qué servicios ofrecen?',
  '¿Cuál es el tiempo de entrega?',
  '¿Cómo puedo contactarlos?',
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy el asistente de Codeol Software Perú. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { totalItems, setIsCartOpen } = useCart()

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const callGemini = async (userMessage, retries = 2) => {
    try {
      const chatHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: [
              ...chatHistory,
              { role: 'user', parts: [{ text: userMessage }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      )

      if (response.status === 429 && retries > 0) {
        await new Promise(r => setTimeout(r, 2000))
        return callGemini(userMessage, retries - 1)
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text
      }
      
      return 'En este momento estoy con mucha demanda. Pero puedo ayudarte:\n\n• Escríbenos al WhatsApp: +51 926 974 985\n• Email: codeolsoftware@gmail.com\n• O usa el formulario de contacto\n\nTe respondemos en menos de 24 horas. ¡Gracias por tu paciencia!'
    } catch (error) {
      console.error('Gemini API error:', error)
      return 'Hubo un error de conexión. Por favor escríbenos al WhatsApp +51 926 974 985 o codeolsoftware@gmail.com'
    }
  }

  const handleSend = async (text = null) => {
    const message = text || input.trim()
    if (!message || isLoading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    // Intentar respuesta local primero (instantánea y sin rate limit)
    const localResponse = getLocalResponse(message)
    if (localResponse) {
      await new Promise(r => setTimeout(r, 500))
      setMessages(prev => [...prev, { role: 'assistant', content: localResponse }])
      setIsLoading(false)
      return
    }

    // Si no hay respuesta local, usar Gemini
    const response = await callGemini(message)
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setIsLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Mobile Cart Button - Only visible on mobile, above WhatsApp */}
      {totalItems > 0 && (
        <motion.button
          onClick={() => setIsCartOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring', duration: 0.6 }}
          className="md:hidden fixed bottom-[10rem] right-6 z-40 w-14 h-14 bg-pure-white text-pure-black rounded-full flex items-center justify-center shadow-2xl hover:shadow-white/20 hover:bg-pure-gray-200 transition-all duration-300 cursor-pointer"
        >
          <ShoppingBag size={22} />
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-pure-black text-pure-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-pure-white px-1">
            {totalItems}
          </span>
        </motion.button>
      )}

      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/51926974985?text=Hola%20Codeol%2C%20quiero%20cotizar%20un%20proyecto"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', duration: 0.6 }}
        className="fixed bottom-[5.5rem] right-6 z-40 w-14 h-14 bg-pure-black border border-pure-white text-pure-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-white/20 hover:bg-pure-gray-900 transition-all duration-300 cursor-pointer"
      >
        <Phone size={22} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-pure-black" />
      </motion.a>

      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', duration: 0.6 }}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-pure-white text-pure-black rounded-full flex items-center justify-center shadow-2xl hover:shadow-white/20 transition-all duration-300 cursor-pointer ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-3rem)] bg-pure-black border border-pure-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-pure-gray-800 bg-pure-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-pure-white text-pure-black rounded-full flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Codeol AI</h4>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                    En línea
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-pure-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' 
                      ? 'bg-pure-white text-pure-black' 
                      : 'bg-pure-gray-700 text-pure-white'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-pure-gray-900 text-pure-gray-200 rounded-tl-sm'
                      : 'bg-pure-white text-pure-black rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 bg-pure-white text-pure-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-pure-gray-900 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-pure-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-pure-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-pure-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSend(action)}
                      className="text-xs px-3 py-1.5 bg-pure-gray-900 border border-pure-gray-800 rounded-full text-pure-gray-300 hover:text-pure-white hover:border-pure-gray-600 transition-colors cursor-pointer"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-pure-gray-800">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-pure-gray-900 border border-pure-gray-800 rounded-full text-sm text-pure-white placeholder-pure-gray-600 focus:outline-none focus:border-pure-gray-600 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-pure-white text-pure-black rounded-full flex items-center justify-center hover:bg-pure-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
