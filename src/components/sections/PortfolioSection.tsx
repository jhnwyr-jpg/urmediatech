import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "SaaS Dashboard",
    category: "Web Application",
    description: "Modern SaaS platform with intuitive dashboard and analytics features.",
    demoUrl: "https://saas2413.netlify.app/",
  },
  {
    id: 2,
    title: "Masala Restaurant",
    category: "Business Website",
    description: "Elegant restaurant website with menu showcase and online presence.",
    demoUrl: "https://masalapage.netlify.app/",
  },
  {
    id: 3,
    title: "Creative Portfolio",
    category: "Portfolio Website",
    description: "Stunning portfolio showcasing creative work with modern design.",
    demoUrl: "https://khgejurgur.netlify.app/",
  },
  {
    id: 4,
    title: "T-Shirt Store",
    category: "E-commerce",
    description: "Stylish e-commerce landing page for fashion and apparel brand.",
    demoUrl: "https://tshirtpagela.netlify.app/",
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl p-8 border border-border/50 card-hover"
    >
      {/* Category badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 mb-6">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-secondary-foreground">
          {project.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-6">
        {project.description}
      </p>

      {/* Demo button */}
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Button variant="gradient" size="default" className="group/btn gap-2">
          <Globe className="w-4 h-4" />
          View Live Demo
          <ExternalLink className="w-4 h-4 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Button>
      </a>

      {/* Subtle hint text */}
      <p className="text-xs text-muted-foreground/70 mt-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Opens in a new tab
      </p>

      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 gradient-bg opacity-5 rounded-bl-full rounded-tr-2xl group-hover:opacity-10 transition-opacity duration-300" />
    </motion.div>
  );
};

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 bg-muted/30 relative">
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
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Recent <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our latest work. Click on any project to see the live demo in action.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
