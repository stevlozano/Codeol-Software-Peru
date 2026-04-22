import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Stats from './sections/Stats'
import Services from './sections/Services'
import Portfolio from './sections/Portfolio'
import IndustryServices from './sections/IndustryServices'
import Pricing from './sections/Pricing'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import EcommerceDemo from './pages/EcommerceDemo'
import ERPDemo from './pages/ERPDemo'
import FintechLandingDemo from './pages/FintechLandingDemo'
import RealEstateDemo from './pages/RealEstateDemo'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

function HomePage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Portfolio />
        <IndustryServices />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/ecommerce-moda" element={<EcommerceDemo />} />
        <Route path="/demo/sistema-erp" element={<ERPDemo />} />
        <Route path="/demo/landing-fintech" element={<FintechLandingDemo />} />
        <Route path="/demo/portal-inmobiliario" element={<RealEstateDemo />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </Router>
  )
}

export default App
