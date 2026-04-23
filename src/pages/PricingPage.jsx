import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import Cart from '../components/Cart'
import Pricing from '../sections/Pricing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
      <Chatbot />
      <Cart />
    </div>
  )
}
