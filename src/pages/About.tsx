import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Users, Award, Clock, Star } from "lucide-react";

const About = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "About", url: "https://urmedia.tech/about" },
  ]);

  const stats = [
    { icon: Users, value: "150+", label: "Happy Clients" },
    { icon: Award, value: "500+", label: "Projects Completed" },
    { icon: Clock, value: "5+", label: "Years Experience" },
    { icon: Star, value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="About Us - Professional Video Editing Team"
        description="Meet the UR Media team. We're a passionate group of video editors and motion designers delivering high-quality content for brands worldwide."
        keywords="video editing team, about UR Media, professional editors, content creators"
        canonical="https://urmedia.tech/about"
        jsonLd={[organizationSchema, breadcrumbs]}
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
              About <span className="text-primary">UR Media</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're a team of passionate video editors and motion designers dedicated to 
              transforming your raw footage into compelling visual stories.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At UR Media, we believe every brand has a unique story to tell. Our mission 
                is to help you tell that story through stunning video content that captivates 
                your audience and drives results.
              </p>
              <p className="text-muted-foreground">
                We combine creativity with technical expertise to deliver videos that not 
                only look amazing but also achieve your business objectives.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Approach</h2>
              <p className="text-muted-foreground mb-4">
                We take the time to understand your brand, audience, and goals before 
                starting any project. This ensures every edit, transition, and effect 
                serves a purpose.
              </p>
              <p className="text-muted-foreground">
                From quick social media clips to full-length brand documentaries, we 
                approach every project with the same level of dedication and attention to detail.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
