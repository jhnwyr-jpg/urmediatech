import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Code, Zap, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive engagement.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Clean, performant code built with the latest technologies.",
  },
  {
    icon: Zap,
    title: "Landing Pages",
    description: "High-converting landing pages optimized for maximum impact.",
  },
  {
    icon: Layers,
    title: "Brand Identity",
    description: "Cohesive visual identities that make your brand memorable.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Stand Out</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer comprehensive design and development services to bring your vision to life.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 border border-border/50 card-hover"
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Developed by section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center max-w-2xl mx-auto mt-16 p-8 rounded-2xl bg-card border border-border/50 shadow-card"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              Developed by experts
            </h3>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-8">
            Our team of designers and developers work together to create 
            exceptional digital experiences that drive results.
          </p>
          <Button variant="gradient" size="lg">
            Try Now →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;