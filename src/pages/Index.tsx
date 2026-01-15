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
        title="UR Media | Professional Video Editing Agency"
        description="Professional video editing services for brands and creators. Expert motion graphics, social media content, and brand videos with fast turnaround and premium quality."
        keywords="video editing, motion graphics, social media content, brand videos, YouTube editing, TikTok content, professional video editor"
        canonical="https://urmedia.tech"
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
