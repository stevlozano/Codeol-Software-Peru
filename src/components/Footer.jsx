import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  servicios: [
    { name: 'Páginas Web', href: '#services' },
    { name: 'Sistemas Personalizados', href: '#services' },
    { name: 'E-commerce', href: '#services' },
    { name: 'Aplicaciones Web', href: '#services' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '#stats' },
    { name: 'Portafolio', href: '#portfolio' },
    { name: 'Precios', href: '#pricing' },
    { name: 'Contacto', href: '#contact' },
  ],
  legal: [
    { name: 'Política de Privacidad', href: '#' },
    { name: 'Términos de Servicio', href: '#' },
  ],
}

const socialLinks = [
  { name: 'LinkedIn', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-pure-black border-t border-pure-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5">
              <a href="#hero" className="inline-flex items-center gap-3 mb-6">
                <img src="/images/logooriginal.png" alt="Codeol" className="w-9 h-9 object-contain" />
                <span className="text-2xl font-bold tracking-tight">
                  CODEOL<span className="text-pure-gray-500">®</span>
                </span>
              </a>
              <p className="text-pure-gray-400 text-sm leading-relaxed max-w-md mb-8">
                Especialistas en desarrollo de páginas web modernas y sistemas personalizados 
                para empresas de todo tipo. Transformamos tus ideas en soluciones digitales 
                que impulsan tu negocio.
              </p>
              
              <div className="space-y-3">
                <a href="mailto:codeolsoftware@gmail.com" className="flex items-center gap-3 text-pure-gray-400 hover:text-pure-white transition-colors text-sm">
                  <Mail size={16} />
                  codeolsoftware@gmail.com
                </a>
                <a href="tel:+51926974985" className="flex items-center gap-3 text-pure-gray-400 hover:text-pure-white transition-colors text-sm">
                  <Phone size={16} />
                  +51 926 974 985
                </a>
                <div className="flex items-center gap-3 text-pure-gray-400 text-sm ">
                  <MapPin size={16} />
                  Lima, Perú
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pure-gray-500 mb-4">
                    Servicios
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.servicios.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pure-gray-500 mb-4">
                    Empresa
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.empresa.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-pure-gray-500 mb-4">
                    Legal
                  </h4>
                  <ul className="space-y-3 ">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm text-pure-gray-400 hover:text-pure-white transition-colors">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-pure-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-pure-gray-500">
              © {new Date().getFullYear()} Codeol Software Perú. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-xs text-pure-gray-500 hover:text-pure-white transition-colors flex items-center gap-1">
                  {link.name}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
