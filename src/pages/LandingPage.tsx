import NavBar from '../components/NavBar'
import HeroSection from '../components/HeroSection'
import ProductPreviewSection from '../components/ProductPreviewSection'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorks from '../components/HowItWorks'
import SecurityTrustSection from '../components/SecurityTrustSection'
import AboutSection from '../components/AboutSection'
import UseCasesSection from '../components/UseCasesSection'
import FinalCtaSection from '../components/FinalCtaSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'

export default function PublicLandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(77,214,255,0.06),_transparent_40%),linear-gradient(180deg,#0B0F14_0%,#111827_100%)] text-vaulix-main-text">
      <NavBar onLaunch={onLaunch} />
      <main>
        <HeroSection onLaunch={onLaunch} />
        <ProductPreviewSection />
        <FeaturesSection />
        <HowItWorks />
        <SecurityTrustSection />
        <AboutSection />
        <UseCasesSection />
        <FinalCtaSection onLaunch={onLaunch} />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
 
