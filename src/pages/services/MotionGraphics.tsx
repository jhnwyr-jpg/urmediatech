import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createServiceSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MotionGraphics = () => {
  const serviceSchema = createServiceSchema({
    name: "Motion Graphics Services",
    description: "Eye-catching animated graphics, logo animations, kinetic typography, and visual effects for your videos.",
    url: "https://urmedia.tech/services/motion-graphics",
  });

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Services", url: "https://urmedia.tech/services" },
    { name: "Motion Graphics", url: "https://urmedia.tech/services/motion-graphics" },
  ]);

  const features = [
    "Custom logo animations",
    "Kinetic typography",
    "Animated infographics",
    "Visual effects (VFX)",
    "Intro and outro sequences",
    "Lower thirds and titles",
    "2D and 3D animations",
    "Brand-consistent designs",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Motion Graphics Services - Animation & Visual Effects"
        description="Professional motion graphics and animation services. Custom logo animations, kinetic typography, infographics, and VFX to make your content stand out."
        keywords="motion graphics, animation, logo animation, kinetic typography, visual effects, VFX, 2D animation"
        canonical="https://urmedia.tech/services/motion-graphics"
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
              <span className="text-foreground">Motion Graphics</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Motion Graphics
              </h1>
            </div>

            <p className="text-lg text-muted-foreground mb-12">
              Add visual impact to your content with stunning motion graphics. 
              From animated logos to complex visual effects, we bring your ideas to life.
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
              Ready to Animate Your Brand?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a free consultation and quote for your motion graphics project.
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

export default MotionGraphics;
