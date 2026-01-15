import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createServiceSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Video, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoEditing = () => {
  const serviceSchema = createServiceSchema({
    name: "Video Editing Services",
    description: "Professional video editing for YouTube, commercials, documentaries, and more. Expert color grading, sound design, and post-production.",
    url: "https://urmedia.tech/services/video-editing",
  });

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Services", url: "https://urmedia.tech/services" },
    { name: "Video Editing", url: "https://urmedia.tech/services/video-editing" },
  ]);

  const features = [
    "Professional color grading and correction",
    "Audio enhancement and sound design",
    "Seamless transitions and effects",
    "Text animation and lower thirds",
    "Multi-camera editing",
    "4K and 8K support",
    "Fast turnaround times",
    "Unlimited revisions",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Video Editing Services - Professional Post-Production"
        description="Professional video editing services for YouTube, commercials, and documentaries. Expert color grading, sound design, and seamless post-production with fast turnaround."
        keywords="video editing, post-production, color grading, sound design, YouTube editing, commercial editing"
        canonical="https://urmedia.tech/services/video-editing"
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
              <span className="text-foreground">Video Editing</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Video Editing
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-12">
              Transform your raw footage into polished, professional content that captivates 
              your audience. Our expert editors bring your vision to life with precision and creativity.
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
              Ready to Transform Your Content?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a free consultation and quote for your video editing project.
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

export default VideoEditing;
