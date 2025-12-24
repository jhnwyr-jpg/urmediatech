import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Code, Zap, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D, ScrollReveal, MagneticButton } from "@/components/ui/AnimatedComponents";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive engagement.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Clean, performant code built with the latest technologies.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Landing Pages",
    description: "High-converting landing pages optimized for maximum impact.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Layers,
    title: "Brand Identity",
    description: "Cohesive visual identities that make your brand memorable.",
    color: "from-purple-500 to-violet-500",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5"
      >
        <div className="w-full h-full border-2 border-primary rounded-full" />
        <div className="absolute inset-8 border-2 border-primary rounded-full" />
        <div className="absolute inset-16 border-2 border-primary rounded-full" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block text-sm font-medium text-primary uppercase tracking-wider"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6"
          >
            Everything You Need to{" "}
            <motion.span 
              className="gradient-text inline-block"
              whileHover={{ scale: 1.05 }}
            >
              Stand Out
            </motion.span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg"
          >
            We offer comprehensive design and development services to bring your vision to life.
          </motion.p>
        </motion.div>

        {/* Feature Grid with 3D cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1}>
              <Card3D className="h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group bg-card rounded-2xl p-6 border border-border/50 h-full relative overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${service.color}`}
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 relative z-10`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-foreground mb-2 relative z-10">{service.title}</h3>
                  <p className="text-sm text-muted-foreground relative z-10">{service.description}</p>
                  
                  {/* Animated border on hover */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} origin-left`}
                  />
                </motion.div>
              </Card3D>
            </ScrollReveal>
          ))}
        </div>

        {/* Developed by section with 3D effect */}
        <ScrollReveal delay={0.4}>
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center max-w-2xl mx-auto mt-16 p-8 rounded-2xl bg-card border border-border/50 shadow-card relative overflow-hidden"
          >
            {/* Animated background pattern */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 gradient-bg opacity-10 rounded-full blur-2xl"
            />
            
            <div className="inline-flex items-center gap-2 mb-4 relative z-10">
              <motion.h3 
                className="text-2xl md:text-3xl font-bold"
                whileHover={{ scale: 1.02 }}
              >
                Developed by experts
              </motion.h3>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
            <p className="text-muted-foreground mb-8 relative z-10">
              Our team of designers and developers work together to create 
              exceptional digital experiences that drive results.
            </p>
            <MagneticButton className="inline-block">
              <a href="#projects">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="gradient" size="lg" className="relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    Try Now →
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturesSection;