import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Layers, BarChart3, Zap, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "Organize and visualize everything",
    description: "Keep all your designs, assets, and workflows in one centralized platform.",
  },
  {
    icon: BarChart3,
    title: "Track performance metrics",
    description: "Monitor your website performance with real-time analytics and insights.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Work together seamlessly with your team on any project.",
  },
  {
    icon: Zap,
    title: "Lightning fast delivery",
    description: "Get your projects delivered quickly without compromising quality.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Top Feature Cards */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Organize and visualize
            <br />
            <span className="gradient-text">everything</span>
          </h2>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50 card-hover"
            >
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Developed by section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center max-w-2xl mx-auto"
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