import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Award, Users, Clock, Target, TrendingUp, Shield } from 'lucide-react'

const stats = [
  {
    icon: Clock,
    value: 5,
    suffix: '+',
    label: 'Años de experiencia',
    description: 'Desarrollando soluciones digitales de alta calidad',
  },
  {
    icon: Target,
    value: 99.9,
    suffix: '%',
    label: 'Casos de éxito',
    description: 'Proyectos entregados con total satisfacción',
  },
  {
    icon: Users,
    value: 250,
    suffix: '+',
    label: 'Clientes satisfechos',
    description: 'Empresas que confiaron en nosotros',
  },
  {
    icon: Award,
    value: 100,
    suffix: '%',
    label: 'Compromiso',
    description: 'Dedicación total a cada proyecto',
  },
]

const features = [
  {
    icon: TrendingUp,
    title: 'Crecimiento',
    description: 'Impulsamos el crecimiento digital de tu negocio',
  },
  {
    icon: Shield,
    title: 'Seguridad',
    description: 'Tus datos y sistemas siempre protegidos',
  },
]

function AnimatedNumber({ value, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-24 lg:py-32 bg-pure-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 lg:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
          >
            Nuestra trayectoria
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            Números que hablan por <span className="text-pure-gray-400">sí mismos</span>
          </motion.h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 border border-pure-gray-800 rounded-2xl hover:border-pure-gray-600 transition-colors duration-300"
            >
              <stat.icon className="w-8 h-8 text-pure-gray-400 mb-6" strokeWidth={1.5} />
              <div className="text-4xl sm:text-5xl font-bold mb-3">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="text-lg font-medium mb-2">{stat.label}</h3>
              <p className="text-sm text-pure-gray-500 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-6 p-8 bg-pure-gray-900/30 border border-pure-gray-800 rounded-2xl"
            >
              <div className="p-4 bg-pure-gray-800 rounded-xl">
                <feature.icon className="w-6 h-6 text-pure-white" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-pure-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-xl sm:text-2xl text-pure-gray-300 font-light italic max-w-3xl mx-auto">
            "La excelencia no es un acto, sino un hábito. Cada proyecto que desarrollamos 
            refleja nuestro compromiso con la calidad."
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
