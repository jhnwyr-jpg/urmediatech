import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { professionalServiceSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Video, Sparkles, Share2, ArrowRight, Clapperboard, Film, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    slug: "video-editing",
    icon: Video,
    title: "Video Editing",
    description: "Professional video editing services for YouTube, commercials, documentaries, and more.",
    features: ["Color Grading", "Sound Design", "Transitions", "Text Animation"],
  },
  {
    slug: "motion-graphics",
    icon: Sparkles,
    title: "Motion Graphics",
    description: "Eye-catching animated graphics, intros, outros, and visual effects for your videos.",
    features: ["Logo Animation", "Kinetic Typography", "Infographics", "VFX"],
  },
  {
    slug: "social-media-content",
    icon: Share2,
    title: "Social Media Content",
    description: "Engaging short-form content optimized for TikTok, Instagram Reels, and YouTube Shorts.",
    features: ["Vertical Videos", "Captions", "Trending Effects", "Quick Turnaround"],
  },
  {
    slug: "brand-videos",
    icon: Clapperboard,
    title: "Brand Videos",
    description: "Compelling brand stories and promotional videos that showcase your business.",
    features: ["Storytelling", "Corporate Videos", "Product Demos", "Testimonials"],
  },
  {
    slug: "youtube-content",
    icon: Film,
    title: "YouTube Content",
    description: "Full-service YouTube video production from editing to thumbnails and optimization.",
    features: ["Long-form Editing", "Thumbnails", "SEO Titles", "End Screens"],
  },
  {
    slug: "ad-creatives",
    icon: Tv,
    title: "Ad Creatives",
    description: "High-converting video ads for Facebook, Instagram, YouTube, and TikTok.",
    features: ["A/B Testing", "Hook Optimization", "CTA Design", "Platform Specific"],
  },
];

const Services = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Services", url: "https://urmedia.tech/services" },
  ]);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Our Services - Video Editing & Motion Graphics"
        description="Explore UR Media's professional video editing services including motion graphics, social media content, brand videos, and ad creatives. Quality content that converts."
        keywords="video editing services, motion graphics, social media video, brand videos, ad creatives, YouTube editing"
        canonical="https://urmedia.tech/services"
        jsonLd={[professionalServiceSchema, breadcrumbs]}
      />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From quick social clips to full-scale productions, we offer comprehensive 
              video editing solutions tailored to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/services/${service.slug}`}>
                  <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                    <service.icon className="w-10 h-10 text-primary mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get in touch for a free consultation and quote.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="rounded-full">
                Contact Us <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;
