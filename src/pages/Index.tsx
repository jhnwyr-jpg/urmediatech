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
import AIChatBot from "@/components/ui/AIChatBot";
import TrackingPixels from "@/components/TrackingPixels";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema, professionalServiceSchema } from "@/lib/jsonLd";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="UR Media | Digital Solutions & Creative Services"
        description="UR Media provides expert digital marketing, branding, and creative solutions to grow your business online. Visit urmedia.tech to explore our services."
        keywords="digital marketing, branding, creative services, video editing, motion graphics, social media content, web design, digital agency, content creation, brand videos"
        canonical="https://urmedia.tech"
        ogImage="https://urmedia.tech/og-image.png"
        jsonLd={[organizationSchema, websiteSchema, professionalServiceSchema]}
      />
      <TrackingPixels currentPage="home" />
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
      <AIChatBot />
    </main>
  );
};

export default Index;
