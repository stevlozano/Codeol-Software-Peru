import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pure-black"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pure-gray-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pure-gray-700/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-pure-gray-700 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-pure-gray-400 uppercase tracking-wider">
                Disponibles para proyectos
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Creamos
              <br />
              <span className="text-pure-gray-400">experiencias</span>
              <br />
              digitales
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl text-pure-gray-400 max-w-xl leading-relaxed mb-10"
            >
              Especialistas en páginas web modernas y sistemas personalizados 
              para todo tipo de negocios. 5 años transformando ideas en 
              soluciones digitales de éxito.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-pure-white text-pure-black font-medium rounded-full hover:bg-pure-gray-200 transition-all duration-300"
              >
                Iniciar proyecto
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 px-8 py-4 border border-pure-gray-700 text-pure-white font-medium rounded-full hover:bg-pure-gray-900 transition-all duration-300"
              >
                Ver portafolio
              </a>
            </motion.div>
          </div>

          {/* Right Column - Stats Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 p-6 border border-pure-gray-800 rounded-2xl bg-pure-gray-900/30">
                <span className="text-5xl sm:text-6xl font-bold">99.9%</span>
                <p className="text-pure-gray-400 text-sm mt-2">Casos de éxito</p>
              </div>
              <div className="p-6 border border-pure-gray-800 rounded-2xl bg-pure-gray-900/30">
                <span className="text-4xl font-bold">5+</span>
                <p className="text-pure-gray-400 text-sm mt-2">Años de experiencia</p>
              </div>
              <div className="p-6 border border-pure-gray-800 rounded-2xl bg-pure-gray-900/30">
                <span className="text-4xl font-bold">250+</span>
                <p className="text-pure-gray-400 text-sm mt-2">Clientes satisfechos</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#stats"
            className="flex flex-col items-center gap-2 text-pure-gray-500 hover:text-pure-white transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowDown size={20} />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
