import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import ProjectModal from './ProjectModal'
import { useCart } from '../context/CartContext'

const navLinks = [
  { name: 'Servicios', to: '/services' },
  { name: 'Portafolio', to: '/portfolio' },
  { name: 'Industrias', to: '/industries' },
  { name: 'Precios', to: '/pricing' },
  { name: 'Contacto', to: '/contact' },
]

export default function Navbar() {
  const location = useLocation()
  const { totalItems, setIsCartOpen } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const defaultPlan = {
    name: 'Proyecto personalizado',
    subtitle: 'Cuéntanos tu idea',
    price: 'Cotización personalizada',
    features: ['Diseño a medida', 'Desarrollo profesional', 'Soporte dedicado'],
    service: 'Otro'
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Main Navigation - Floating Pill Design */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-fit mx-auto">
          <div
            className={`flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500 ${
              isScrolled
                ? 'bg-pure-black/80 backdrop-blur-xl border border-pure-gray-800/50'
                : 'bg-pure-black/40 backdrop-blur-md'
            }`}
          >
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 px-4 py-2"
          >
            <img src="/images/logooriginal.png" alt="Codeol" className="w-7 h-7 object-contain" />
            <span className="text-sm font-medium tracking-[0.2em] text-pure-white hover:text-pure-gray-300 transition-colors duration-300">
              CODEOL
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors duration-300"
                >
                  <span className={`relative z-10 ${isActive ? 'text-pure-white' : 'text-pure-gray-400 hover:text-pure-white'}`}>
                    {link.name}
                  </span>
                  {(isActive || hoveredIndex === index) && (
                    <motion.span
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-pure-gray-800/50 rounded-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="hidden md:flex items-center gap-2 ml-2 px-3 py-2 text-xs tracking-[0.1em] uppercase bg-pure-gray-800 text-pure-white rounded-full hover:bg-pure-gray-700 transition-colors duration-300 cursor-pointer relative"
          >
            <ShoppingBag size={14} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pure-white text-pure-black text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* CTA Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-1 ml-2 px-4 py-2 text-xs tracking-[0.1em] uppercase bg-pure-white text-pure-black rounded-full hover:bg-pure-gray-200 transition-colors duration-300 group cursor-pointer"
          >
            <span>Iniciar</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full hover:bg-pure-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-px bg-pure-white block"
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-px bg-pure-white block"
            />
          </button>
        </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-pure-black md:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full px-6">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.to
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-4 text-3xl font-light tracking-[0.05em] transition-colors ${isActive ? 'text-pure-white' : 'text-pure-gray-400 hover:text-pure-white'}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                )
              })}
              
              <motion.button
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true) }}
                className="mt-12 inline-flex items-center gap-2 px-8 py-4 bg-pure-white text-pure-black text-sm tracking-[0.1em] uppercase rounded-full cursor-pointer"
              >
                Iniciar proyecto
                <ArrowUpRight size={16} />
              </motion.button>
              
              {/* Mobile Contact Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-12 left-0 right-0 text-center"
              >
                <p className="text-xs tracking-[0.2em] text-pure-gray-500 uppercase">Lima, Perú</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={defaultPlan}
      />
    </>
  )
}
