import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Pill, UtensilsCrossed, Stethoscope, Building2, ShoppingBag, Car, GraduationCap, ShieldCheck, Globe, Code, Smartphone, Layout, Briefcase, Plane, ArrowUpRight } from 'lucide-react'
import ProjectModal from '../components/ProjectModal'

const national = [
  { title: 'Farmacias & Boticas', icon: Pill, desc: 'Sistema con control de lotes, vencimientos, receta digital, delivery y reportes para DIGEMID.', features: ['Control de lotes y vencimientos','Receta digital','Delivery','Reportes regulatorios'], service: 'Sistema Farmacia', price: 'Desde S/ 6,500' },
  { title: 'Veterinarias', icon: Stethoscope, desc: 'Historial clínico, control de vacunas, citas y e-commerce de productos para mascotas.', features: ['Historia clínica','Vacunas','E-commerce pet','Agenda citas'], service: 'Sistema Veterinaria', price: 'Desde S/ 4,800' },
  { title: 'Restaurantes & Delivery', icon: UtensilsCrossed, desc: 'Menú digital QR, panel cocina, delivery propio, gestión de mesas e inventario.', features: ['Menú QR','Panel cocina','Delivery propio','Gestión mesas'], service: 'App Restaurant', price: 'Desde S/ 5,200' },
  { title: 'Inmobiliarias', icon: Building2, desc: 'Portal de propiedades, CRM inmobiliario, contratos digitales y publicación automática.', features: ['Portal propiedades','CRM','Contratos','Pub. automática'], service: 'Portal Inmobiliario', price: 'Desde S/ 5,500' },
  { title: 'Retail & Tiendas', icon: ShoppingBag, desc: 'POS multi-sucursal, e-commerce, programa de fidelización y facturación SUNAT.', features: ['POS multi-sucursal','E-commerce','Fidelización','Factura SUNAT'], service: 'Sistema Retail', price: 'Desde S/ 6,000' },
  { title: 'Talleres & Automotriz', icon: Car, desc: 'Órdenes de trabajo, historial por vehículo, repuestos y recordatorios WhatsApp.', features: ['Órdenes trabajo','Historial vehículo','Repuestos','Recordatorios'], service: 'Sistema Taller', price: 'Desde S/ 4,200' },
  { title: 'Clínicas & Salud', icon: ShieldCheck, desc: 'Historias clínicas digitales, telemedicina, citas online y facturación asegurada.', features: ['Historia clínica','Telemedicina','Citas online','Facturación'], service: 'Sistema Clínica', price: 'Desde S/ 7,000' },
  { title: 'Colegios & Educativos', icon: GraduationCap, desc: 'Intranet, portal de padres, notas, pagos de pensiones y biblioteca virtual.', features: ['Portal padres','Notas online','Pagos','Biblioteca'], service: 'Plataforma Educativa', price: 'Desde S/ 6,800' },
]

const international = [
  { title: 'Web Corporativa', icon: Globe, desc: 'Sitio profesional multidioma, hosting CDN global, SEO internacional.', features: ['EN/ES/PT','CDN global','SEO intl','Analytics'], service: 'Página Web', price: 'From $350' },
  { title: 'E-commerce Global', icon: ShoppingBag, desc: 'Stripe, PayPal, shipping internacional, multi-currency y tax automático.', features: ['Stripe+PayPal','Multi-currency','Shipping','Tax auto'], service: 'E-commerce', price: 'From $1,200' },
  { title: 'SaaS Apps', icon: Code, desc: 'Aplicaciones escalables con auth, dashboards, API REST y cloud deploy.', features: ['React+Node','Auth+roles','API REST','Cloud'], service: 'Aplicación Web', price: 'From $2,000' },
  { title: 'Mobile Web Apps', icon: Smartphone, desc: 'PWA instalable en iOS/Android, push notifications y offline mode.', features: ['PWA installable','Push notif','Offline','Native UI'], service: 'App Web', price: 'From $1,800' },
  { title: 'Landing Pages', icon: Layout, desc: 'Páginas optimizadas para conversión. A/B testing, analytics, multi-campaign.', features: ['A/B testing','Analytics','Forms','Campaigns'], service: 'Landing Page', price: 'From $250' },
  { title: 'Enterprise ERP/CRM', icon: Briefcase, desc: 'Sistemas custom con integraciones Salesforce, HubSpot, SAP, BI reports.', features: ['ERP/CRM','Integraciones','Multi-user','BI reports'], service: 'Sistema ERP/CRM', price: 'From $5,000' },
]

function IndustryCard({ item, index, isInView, onCotizar }) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative p-6 rounded-2xl border border-pure-gray-800 bg-pure-gray-900/30 hover:border-pure-gray-600 hover:bg-pure-gray-900/60 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-pure-gray-800 flex items-center justify-center group-hover:bg-pure-white group-hover:text-pure-black transition-all duration-300">
          <Icon size={20} />
        </div>
        <span className="text-xs font-medium text-pure-gray-500 bg-pure-gray-800/50 px-3 py-1 rounded-full">{item.price}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
      <p className="text-sm text-pure-gray-400 mb-4 leading-relaxed">{item.desc}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {item.features.map(f => (
          <span key={f} className="text-xs text-pure-gray-500 bg-pure-gray-800/40 px-2 py-1 rounded-md">{f}</span>
        ))}
      </div>
      <button
        onClick={() => onCotizar(item)}
        className="inline-flex items-center gap-1 text-xs text-pure-white hover:text-pure-gray-300 transition-colors cursor-pointer"
      >
        Cotizar ahora <ArrowUpRight size={12} />
      </button>
    </motion.div>
  )
}

export default function IndustryServices() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  const handleCotizar = (item) => {
    setSelectedService({
      name: item.title,
      subtitle: item.service,
      price: item.price,
      features: item.features,
      service: item.service,
      description: item.desc
    })
    setIsModalOpen(true)
  }

  return (
    <section id="industries" ref={ref} className="py-24 lg:py-32 bg-pure-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-xs uppercase tracking-widest text-pure-gray-500 mb-4 block">Servicios por sector</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">Soluciones para <span className="text-pure-gray-400">todo negocio</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-pure-gray-400 leading-relaxed">
            Software a medida para los sectores más demandados del Perú y Latinoamérica. Conocemos tu rubro y sus necesidades.
          </motion.p>
        </div>

        <motion.h3 initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }} className="text-sm uppercase tracking-widest text-pure-gray-500 mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-pure-gray-700" /> Rubros Nacionales — Perú & Latinoamérica
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {national.map((item, i) => <IndustryCard key={item.title} item={item} index={i} isInView={isInView} onCotizar={handleCotizar} />)}
        </div>

        <motion.h3 initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }} className="text-sm uppercase tracking-widest text-pure-gray-500 mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-pure-gray-700" /> Servicios Internacionales — Global
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {international.map((item, i) => <IndustryCard key={item.title} item={item} index={i + 8} isInView={isInView} onCotizar={handleCotizar} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="text-center mt-16 p-8 border border-pure-gray-800 rounded-2xl bg-pure-gray-900/20">
          <p className="text-pure-gray-400 text-sm max-w-2xl mx-auto">
            ¿No encuentras tu rubro? Desarrollamos software para cualquier sector. Contáctanos y te damos una solución personalizada.
          </p>
          <button
            onClick={() => handleCotizar({ title: 'Proyecto personalizado', service: 'Otro', desc: 'Cotización personalizada para cualquier rubro', features: [], price: 'Cotización' })}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-pure-white text-pure-black text-sm font-medium rounded-full hover:bg-pure-gray-200 transition-colors cursor-pointer"
          >
            Cotizar proyecto personalizado <ArrowUpRight size={14} />
          </button>
        </motion.div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedService || { name: 'Proyecto personalizado', subtitle: 'Cuéntanos tu idea', price: 'Cotización personalizada', features: ['Diseño a medida', 'Desarrollo profesional', 'Soporte dedicado'], service: 'Otro' }}
      />
    </section>
  )
}
