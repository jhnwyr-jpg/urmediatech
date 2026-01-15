import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const portfolioItems = [
  {
    title: "SaaS Platform Landing",
    category: "Landing Page",
    description: "Modern SaaS landing page with clean design and conversion-optimized layout.",
    url: "https://saas2413.netlify.app/",
  },
  {
    title: "Masala Restaurant",
    category: "E-commerce",
    description: "Restaurant website with online ordering and menu showcase.",
    url: "https://masalapage.netlify.app/",
  },
  {
    title: "Corporate Website",
    category: "Business",
    description: "Professional corporate website with services showcase.",
    url: "https://khgejurgur.netlify.app/",
  },
  {
    title: "T-Shirt Store",
    category: "E-commerce",
    description: "E-commerce landing page for custom t-shirt business.",
    url: "https://tshirtpagela.netlify.app/",
  },
];

const Portfolio = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Portfolio", url: "https://urmedia.tech/portfolio" },
  ]);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Portfolio - Our Work & Case Studies"
        description="Explore UR Media's portfolio of successful video editing and web design projects. See real results from our work with brands and creators."
        keywords="portfolio, case studies, video editing examples, web design portfolio, client work"
        canonical="https://urmedia.tech/portfolio"
        jsonLd={[breadcrumbs]}
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
              Our <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our latest projects and see how we've helped brands create 
              stunning visual content that drives results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {portfolioItems.map((item, index) => (
              <motion.a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {item.category}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    View Live Demo <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Want to See Your Project Here?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let's create something amazing together.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="rounded-full">
                Start Your Project <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Portfolio;
