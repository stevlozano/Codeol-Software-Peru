import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Contact from '../sections/Contact'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
