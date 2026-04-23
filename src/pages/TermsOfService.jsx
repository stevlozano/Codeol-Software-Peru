import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Términos de Servicio
            </h1>
            <p className="text-pure-gray-400 text-lg">
              Última actualización: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-pure-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">1. Aceptación de Términos</h2>
              <p>
                Al acceder y utilizar los servicios de Codeol Software Perú, usted acepta estos términos de servicio. Si no está de acuerdo con estos términos, por favor no utilice nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">2. Servicios</h2>
              <p className="mb-4">
                Codeol Software Perú proporciona servicios de desarrollo de software, incluyendo pero no limitado a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Desarrollo de aplicaciones web y móviles</li>
                <li>Sistemas de gestión empresarial (ERP)</li>
                <li>Soluciones de comercio electrónico</li>
                <li>Consultoría tecnológica</li>
                <li>Mantenimiento y soporte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">3. Obligaciones del Cliente</h2>
              <p className="mb-4">
                Como cliente, usted se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar información precisa y completa</li>
                <li>Realizar los pagos según lo acordado</li>
                <li>Proporcionar acceso a recursos necesarios para el proyecto</li>
                <li>Responder a las comunicaciones en tiempo razonable</li>
                <li>Respetar los plazos acordados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">4. Propiedad Intelectual</h2>
              <p className="mb-4">
                Todos los derechos de propiedad intelectual sobre el software desarrollado por Codeol Software Perú pertenecen al cliente después del pago completo, salvo acuerdos específicos en contrario.
              </p>
              <p>
                Codeol Software Perú se reserva el derecho de utilizar componentes genéricos, bibliotecas y frameworks desarrollados internamente en múltiples proyectos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">5. Pagos</h2>
              <p className="mb-4">
                Los términos de pago se especifican en cada contrato o propuesta. Generalmente:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Anticipo del 30-50% al inicio del proyecto</li>
                <li>Pagos parciales según hitos acordados</li>
                <li>Pago final antes de la entrega completa</li>
              </ul>
              <p className="mt-4">
                Los pagos atrasados pueden resultar en la suspensión del trabajo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">6. Garantía y Soporte</h2>
              <p className="mb-4">
                Ofrecemos garantía sobre el trabajo entregado:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Garantía de 90 días para corrección de bugs</li>
                <li>Soporte técnico incluido según el plan contratado</li>
                <li>Documentación del sistema entregado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">7. Limitación de Responsabilidad</h2>
              <p>
                Codeol Software Perú no será responsable por daños indirectos, incidentales o consecuentes. Nuestra responsabilidad total se limita al monto pagado por los servicios específicos que causaron el reclamo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">8. Terminación</h2>
              <p>
                Cualquiera de las partes puede terminar el acuerdo si la otra parte incumple materialmente sus obligaciones. En caso de terminación, el cliente pagará por el trabajo completado hasta esa fecha.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">9. Ley Aplicable</h2>
              <p>
                Estos términos se rigen por las leyes del Perú. Cualquier disputa será resuelta en los tribunales de Lima, Perú.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-pure-white mb-4">10. Contacto</h2>
              <p>
                Para preguntas sobre estos términos, contáctenos en:
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
      <Chatbot />
    </div>
  )
}
