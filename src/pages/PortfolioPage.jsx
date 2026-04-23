import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import Cart from '../components/Cart'
import Portfolio from '../sections/Portfolio'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Portfolio />
      </main>
      <Footer />
      <Chatbot />
      <Cart />
    </div>
  )
}
