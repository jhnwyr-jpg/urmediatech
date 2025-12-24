import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Code, Zap, Layers } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive engagement with modern design principles.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Clean, performant code built with the latest technologies for fast, responsive websites.",
  },
  {
    icon: Zap,
    title: "Landing Pages",
    description: "High-converting landing pages optimized for maximum impact and lead generation.",
  },
  {
    icon: Layers,
    title: "Brand Identity",
    description: "Cohesive visual identities that tell your story and make your brand memorable.",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl p-8 border border-border/50 card-hover"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <service.icon className="w-7 h-7 text-primary-foreground" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {service.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {service.description}
      </p>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl gradient-bg opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </motion.div>
  );
};

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative">
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
