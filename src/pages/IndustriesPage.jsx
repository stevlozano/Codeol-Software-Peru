import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import IndustryServices from '../sections/IndustryServices'

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <IndustryServices />
      </main>
      <Footer />
    </div>
  )
}
