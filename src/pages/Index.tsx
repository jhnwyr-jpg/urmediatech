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
import SupportChatWidget from "@/components/ui/SupportChatWidget";
import TrackingPixels from "@/components/TrackingPixels";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema, professionalServiceSchema } from "@/lib/jsonLd";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="UR Media | Professional Web Development Agency"
        description="UR Media is a professional web development agency specializing in React, Next.js, and Node.js. We build fast, scalable, and modern web applications for businesses."
        keywords="web development, web design, React development, Next.js, Node.js, full-stack development, e-commerce solutions, custom web applications, responsive websites, web agency Bangladesh"
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
      <SupportChatWidget />
    </main>
  );
};

export default Index;
