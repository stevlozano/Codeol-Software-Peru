import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import Services from '../sections/Services'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Services />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
