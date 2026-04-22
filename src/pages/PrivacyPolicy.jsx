import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-pure-gray-400 text-lg">
              Última actualización: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-pure-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">1. Información que Recopilamos</h2>
              <p className="mb-4">
                En Codeol Software Perú, recopilamos información personal que usted nos proporciona directamente, como:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nombre y datos de contacto</li>
                <li>Información de facturación</li>
                <li>Detalles del proyecto</li>
                <li>Historial de comunicaciones</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">2. Uso de la Información</h2>
              <p className="mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar nuestros servicios de desarrollo de software</li>
                <li>Comunicarnos sobre su proyecto</li>
                <li>Mejorar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">3. Protección de Datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, alteración o destrucción. Utilizamos cifrado SSL, servidores seguros y protocolos de seguridad estándar de la industria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">4. Compartición de Información</h2>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros para sus fines de marketing. Solo compartimos información cuando es necesario para proporcionar nuestros servicios o cuando lo exige la ley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">5. Sus Derechos</h2>
              <p className="mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acceder a sus datos personales</li>
                <li>Solicitar la corrección de sus datos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">6. Cookies</h2>
              <p>
                Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">7. Contacto</h2>
              <p>
                Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, contáctenos en:
              </p>
              <p className="mt-2 text-pure-white">
                Email: contacto@codeol.pe
              </p>
            </section>
          </div>

          <div className="pt-8 border-t border-pure-gray-800">
            <Link to="/" className="text-pure-gray-400 hover:text-pure-white transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
