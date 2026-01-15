import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createServiceSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Share2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialMediaContent = () => {
  const serviceSchema = createServiceSchema({
    name: "Social Media Content Services",
    description: "Engaging short-form video content for TikTok, Instagram Reels, YouTube Shorts, and more.",
    url: "https://urmedia.tech/services/social-media-content",
  });

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Services", url: "https://urmedia.tech/services" },
    { name: "Social Media Content", url: "https://urmedia.tech/services/social-media-content" },
  ]);

  const features = [
    "Vertical video formatting (9:16)",
    "Auto-captions and subtitles",
    "Trending audio integration",
    "Platform-optimized exports",
    "Quick turnaround (24-48 hours)",
    "Hook optimization",
    "Engaging transitions",
    "Brand consistency",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Social Media Content - TikTok, Reels & Shorts"
        description="Professional social media video content for TikTok, Instagram Reels, and YouTube Shorts. Engaging short-form videos with quick turnaround and trending effects."
        keywords="social media video, TikTok editing, Instagram Reels, YouTube Shorts, short-form content, vertical video"
        canonical="https://urmedia.tech/services/social-media-content"
        jsonLd={[serviceSchema, breadcrumbs]}
      />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-primary">Services</Link>
              <span>/</span>
              <span className="text-foreground">Social Media Content</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Share2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Social Media Content
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-12">
              Dominate social platforms with scroll-stopping content. We create engaging 
              short-form videos optimized for maximum reach and engagement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Go Viral?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a free consultation and quote for your social media content.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="rounded-full">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SocialMediaContent;
