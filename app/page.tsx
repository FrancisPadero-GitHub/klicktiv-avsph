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
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
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
