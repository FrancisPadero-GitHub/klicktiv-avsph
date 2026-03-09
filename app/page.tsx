import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import PainSection from "@/components/landing/pain-section";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Stats from "@/components/landing/stats";
import WhoSection from "@/components/landing/who-section";
import CTASection from "@/components/landing/cta-section";
import AVSSection from "@/components/landing/avs-section";
import Footer from "@/components/landing/footer";
import BackToTop from "@/components/landing/back-to-top";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <Features />
        <HowItWorks />
        <Stats />
        <WhoSection />
        <CTASection />
        <AVSSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
