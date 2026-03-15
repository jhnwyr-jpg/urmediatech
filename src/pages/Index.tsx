import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import PromoSection from "@/components/sections/PromoSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AIAgentSection from "@/components/sections/AIAgentSection";
import IntegrationsSection from "@/components/sections/IntegrationsSection";
import GlobalReachSection from "@/components/sections/GlobalReachSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import AIChatBot from "@/components/ui/AIChatBot";
import SupportChatWidget from "@/components/ui/SupportChatWidget";
import TrackingPixels from "@/components/TrackingPixels";
import DynamicScripts from "@/components/DynamicScripts";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, websiteSchema, professionalServiceSchema } from "@/lib/jsonLd";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="UrMedia | Landing Pages & Websites That Convert"
        description="UrMedia builds high-converting landing pages, business websites & digital solutions. Modern design, fast delivery, real results. Get started today!"
        keywords="landing page design, high-converting website, digital agency Bangladesh, web design, business website, e-commerce website, lead generation, conversion optimization, UrMedia, urmedia.tech"
        canonical="https://urmedia.tech"
        ogImage="https://urmedia.tech/og-image.png"
        jsonLd={[organizationSchema, websiteSchema, professionalServiceSchema]}
      />
      <TrackingPixels currentPage="home" />
      <DynamicScripts />
      <Navbar />
      <HeroSection />
      <PromoSection />
      <IntegrationsSection />
      <FeaturesSection />
      <ShowcaseSection />
      <AIAgentSection />
      <PortfolioSection />
      <PricingSection />
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
