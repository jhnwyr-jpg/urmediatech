import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import IntegrationsSection from "@/components/sections/IntegrationsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <main className={`min-h-screen bg-background ${isLoading ? 'overflow-hidden h-screen' : ''}`}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <PortfolioSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <AboutSection />
        <ContactSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default Index;