import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

const projects = [
  {
    id: '01',
    title: 'E-commerce Moda',
    category: 'Tienda Online',
    description: 'Plataforma de comercio electrónico para marca de ropa peruana con más de 500 productos.',
    image: 'bg-pure-gray-800',
    tags: ['React', 'Node.js', 'Stripe'],
  },
  {
    id: '02',
    title: 'Sistema ERP',
    category: 'Sistema Personalizado',
    description: 'Sistema integral de gestión empresarial para cadena de restaurantes con 12 sucursales.',
    image: 'bg-pure-gray-700',
    tags: ['Next.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: '03',
    title: 'Landing Startup',
    category: 'Landing Page',
    description: 'Página de aterrizaje para startup fintech que aumentó conversiones en 150%.',
    image: 'bg-pure-gray-600',
    tags: ['Next.js', 'Framer Motion', 'Vercel'],
  },
  {
    id: '04',
    title: 'Portal Inmobiliario',
    category: 'Web App',
    description: 'Plataforma de búsqueda de propiedades con mapa interactivo y filtros avanzados.',
    image: 'bg-pure-gray-500',
    tags: ['React', 'Mapbox', 'Firebase'],
  },
]

export default function Portfolio() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="py-24 lg:py-32 bg-pure-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block"
            >
              Portafolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              Proyectos que hablan<br />por <span className="text-pure-gray-400 ">sí mismos</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-pure-gray-400 leading-relaxed max-w-2xl"
            >
              Una selección de nuestros trabajos recientes. Cada proyecto refleja 
              nuestro compromiso con la calidad y la innovación.
            </motion.p>
          </div>
          
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 text-base text-pure-white hover:text-pure-gray-400 transition-colors whitespace-nowrap"
          >
            Ver todos los proyectos
            <ArrowUpRight size={18} />
          </motion.a>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group cursor-pointer"
            >
              {/* Project Card */}
              <div className="relative overflow-hidden rounded-2xl border border-pure-gray-800 hover:border-pure-gray-600 transition-all duration-500">
                {/* Project Number */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-6xl sm:text-7xl font-bold text-pure-white/10 group-hover:text-pure-white/20 transition-colors">
                    {project.id}
                  </span>
                </div>

                {/* Image Placeholder */}
                <div className={`relative aspect-[16/10] ${project.image} overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent opacity-60" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-pure-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {index === 0 ? (
                      <a 
                        href="/demo/ecommerce-moda"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
                      >
                        Ver demo en vivo
                        <ExternalLink size={14} />
                      </a>
                    ) : index === 1 ? (
                      <a 
                        href="/demo/sistema-erp"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
                      >
                        Ver demo en vivo
                        <ExternalLink size={14} />
                      </a>
                    ) : index === 2 ? (
                      <a 
                        href="/demo/landing-fintech"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
                      >
                        Ver demo en vivo
                        <ExternalLink size={14} />
                      </a>
                    ) : index === 3 ? (
                      <a 
                        href="/demo/portal-inmobiliario"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full text-sm font-medium hover:bg-pure-gray-200 transition-colors"
                      >
                        Ver demo en vivo
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-pure-white text-pure-black rounded-full text-sm font-medium">
                        Ver proyecto
                        <ExternalLink size={14} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs text-pure-gray-500 uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-semibold mt-1 group-hover:text-pure-gray-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight 
                      size={24} 
                      className="text-pure-gray-500 group-hover:text-pure-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" 
                    />
                  </div>
                  
                  <p className="text-pure-gray-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-pure-gray-800 text-pure-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-pure-gray-400 mb-6">
            ¿Tienes un proyecto en mente?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-pure-white text-pure-black font-medium rounded-full hover:bg-pure-gray-200 transition-colors"
          >
            Hablemos de tu proyecto
            <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
