import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import { motion } from 'framer-motion'
import { CreditCard, Wallet, Building2, Smartphone, CheckCircle, Copy } from 'lucide-react'
import { useState } from 'react'

const paymentMethods = [
  {
    id: 'tarjeta',
    icon: CreditCard,
    title: 'Tarjeta de crédito/débito',
    description: 'Aceptamos todas las tarjetas Visa, Mastercard, American Express',
    details: ['Pago seguro mediante pasarela encriptada', 'Cuotas disponibles según banco'],
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'yape',
    icon: Smartphone,
    title: 'Yape',
    description: 'Pago instantáneo con Yape',
    details: ['Escanea el QR o busca por número', 'Confirmación inmediata'],
    color: 'from-purple-500/20 to-purple-600/20',
    qrAvailable: true
  },
  {
    id: 'plin',
    icon: Wallet,
    title: 'Plin',
    description: 'Transferencia rápida con Plin',
    details: ['Compatible con múltiples bancos', 'Notificación instantánea'],
    color: 'from-green-500/20 to-green-600/20'
  },
  {
    id: 'lemon',
    icon: Wallet,
    title: 'Lemon Cash',
    description: 'Pago con Lemon Cash',
    details: ['Transferencia desde tu billetera Lemon', 'Ideal para pagos en dólares'],
    color: 'from-yellow-500/20 to-yellow-600/20'
  }
]

const bankAccounts = [
  {
    bank: 'Yape',
    account: 'Celular: 999 999 999',
    owner: 'Codeol Software Perú',
    type: 'Yape'
  },
  {
    bank: 'Caja Arequipa',
    account: 'Cuenta P51: 123-4567890123',
    owner: 'Codeol Software Perú S.A.C.',
    type: 'Cuenta de Ahorros'
  },
  {
    bank: 'Scotiabank',
    account: 'Cuenta Corriente: 009-1234567',
    owner: 'Codeol Software Perú S.A.C.',
    type: 'Cuenta Corriente'
  }
]

export default function PaymentMethodsPage() {
  const [copied, setCopied] = useState(null)

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
            >
              Pagos seguros
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              Métodos de <span className="text-pure-gray-400">pago</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-pure-gray-400 leading-relaxed"
            >
              Ofrecemos múltiples opciones de pago para tu comodidad. 
              Elige el método que prefieras.
            </motion.p>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-8 border border-pure-gray-800 rounded-2xl bg-gradient-to-br from-pure-gray-900/50 to-pure-gray-900/30"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-10 rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-pure-gray-800 rounded-xl">
                      <method.icon size={24} className="text-pure-white" />
                    </div>
                    <h3 className="text-xl font-semibold">{method.title}</h3>
                  </div>
                  
                  <p className="text-pure-gray-400 mb-4">{method.description}</p>
                  
                  <ul className="space-y-2">
                    {method.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-pure-gray-300">
                        <CheckCircle size={14} className="text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {method.qrAvailable && (
                    <div className="mt-6 p-4 bg-pure-gray-800/50 rounded-xl text-center">
                      <p className="text-sm text-pure-gray-400 mb-2">QR de Yape</p>
                      <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center">
                        <span className="text-pure-black text-xs">QR Placeholder</span>
                      </div>
                      <p className="text-xs text-pure-gray-500 mt-2">Escanea para pagar</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bank Accounts Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border border-pure-gray-800 rounded-2xl p-8 lg:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-pure-gray-800 rounded-xl">
                <Building2 size={24} className="text-pure-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Cuentas bancarias</h2>
                <p className="text-pure-gray-400">Transferencia directa</p>
              </div>
            </div>

            <div className="space-y-4">
              {bankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-pure-gray-900/50 rounded-xl border border-pure-gray-800"
                >
                  <div className="mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{account.bank}</span>
                      <span className="text-xs text-pure-gray-500">({account.type})</span>
                    </div>
                    <p className="text-sm text-pure-gray-400">{account.owner}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <code className="px-3 py-2 bg-pure-gray-800 rounded-lg text-sm font-mono">
                      {account.account}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.account, index)}
                      className="p-2 hover:bg-pure-gray-800 rounded-lg transition-colors"
                      title="Copiar"
                    >
                      {copied === index ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-pure-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-pure-gray-900/30 rounded-xl border border-pure-gray-800">
              <p className="text-sm text-pure-gray-400">
                <span className="text-pure-white font-medium">Nota:</span> Después de realizar el pago, 
                envía el comprobante a nuestro WhatsApp o correo para confirmar tu transacción.
              </p>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-pure-gray-400 mb-4">¿Tienes dudas sobre el pago?</p>
            <a
              href="https://wa.me/51999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
            >
              <Smartphone size={18} />
              Escríbenos por WhatsApp
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
