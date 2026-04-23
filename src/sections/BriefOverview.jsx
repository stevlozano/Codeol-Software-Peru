import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Layout, ShoppingCart, Globe, BarChart3, MessageSquare, ArrowUpRight } from 'lucide-react'

const overviewCards = [
  {
    icon: Layout,
    title: 'Servicios',
    description: 'Páginas web, sistemas personalizados y más',
    to: '/services',
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    icon: Globe,
    title: 'Portafolio',
    description: 'Proyectos que han transformado negocios',
    to: '/portfolio',
    color: 'from-purple-500/20 to-purple-600/20'
  },
  {
    icon: BarChart3,
    title: 'Industrias',
    description: 'Soluciones para cada sector',
    to: '/industries',
    color: 'from-green-500/20 to-green-600/20'
  },
  {
    icon: ShoppingCart,
    title: 'Precios',
    description: 'Planes adaptados a tu presupuesto',
    to: '/pricing',
    color: 'from-orange-500/20 to-orange-600/20'
  },
  {
    icon: MessageSquare,
    title: 'Contacto',
    description: 'Hablemos de tu proyecto',
    to: '/contact',
    color: 'from-pink-500/20 to-pink-600/20'
  },
]

export default function BriefOverview() {
  return (
    <section className="py-24 lg:py-32 bg-pure-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            ¿Qué necesitas?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-pure-gray-400 leading-relaxed"
          >
            Explora nuestras soluciones y encuentra la perfecta para tu negocio.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={card.to}
                className="group relative p-8 border border-pure-gray-800 rounded-2xl bg-gradient-to-br from-pure-gray-900/50 to-pure-gray-900/30 hover:border-pure-gray-600 transition-all duration-300 block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className="p-4 bg-pure-gray-800 rounded-xl inline-block mb-6 group-hover:bg-pure-gray-700 transition-colors">
                    <card.icon size={24} className="text-pure-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-pure-gray-400 mb-4">{card.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-pure-white group-hover:gap-3 transition-all">
                    <span>Ver más</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
