import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Stats from './sections/Stats'
import BriefOverview from './sections/BriefOverview'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import Cart from './components/Cart'
import EcommerceDemo from './pages/EcommerceDemo'
import ERPDemo from './pages/ERPDemo'
import FintechLandingDemo from './pages/FintechLandingDemo'
import RealEstateDemo from './pages/RealEstateDemo'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import IndustriesPage from './pages/IndustriesPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './pages/AdminDashboard'
import OrderStatus from './pages/OrderStatus'
import { CartProvider } from './context/CartContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import CustomerDashboard from './pages/CustomerDashboard'
import FamilyWelcomeModal from './components/FamilyWelcomeModal'

function HomePage() {
  return (
    <div className="min-h-screen bg-pure-black text-pure-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BriefOverview />
      </main>
      <Footer />
      <Chatbot />
      <Cart />
      <FamilyWelcomeModal />
    </div>
  )
}

function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/mi-cuenta" element={<CustomerDashboard />} />
            <Route path="/demo/ecommerce-moda" element={<EcommerceDemo />} />
            <Route path="/demo/sistema-erp" element={<ERPDemo />} />
            <Route path="/demo/landing-fintech" element={<FintechLandingDemo />} />
            <Route path="/demo/portal-inmobiliario" element={<RealEstateDemo />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </Router>
      </CartProvider>
    </CustomerAuthProvider>
  )
}

export default App
