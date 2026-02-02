import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Globe, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card3D, ScrollReveal } from "@/components/ui/AnimatedComponents";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

type Project = {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  category_en: string;
  category_bn: string;
  demo_url: string;
  gradient: string;
};

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title_en, title_bn, description_en, description_bn, category_en, category_bn, demo_url, gradient")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setProjects(data as Project[]);
      }
    };

    fetchProjects();
  }, []);

  // Fallback to hardcoded projects if none in DB
  const displayProjects =
    projects.length > 0
      ? projects.map((p) => ({
          id: p.id,
          title: language === "bn" ? p.title_bn : p.title_en,
          category: language === "bn" ? p.category_bn : p.category_en,
          description: language === "bn" ? (p.description_bn ?? "") : (p.description_en ?? ""),
          demoUrl: p.demo_url,
          gradient: p.gradient,
        }))
      : [
          {
            id: "1",
            title: t("portfolio.saas"),
            category: t("portfolio.saasCategory"),
            description: t("portfolio.saasDesc"),
            demoUrl: "https://saas2413.netlify.app/",
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            id: "2",
            title: t("portfolio.masala"),
            category: t("portfolio.masalaCategory"),
            description: t("portfolio.masalaDesc"),
            demoUrl: "https://masalapage.netlify.app/",
            gradient: "from-orange-500 to-red-500",
          },
          {
            id: "3",
            title: t("portfolio.khejur"),
            category: t("portfolio.khejurCategory"),
            description: t("portfolio.khejurDesc"),
            demoUrl: "https://khgejurgur.netlify.app/",
            gradient: "from-amber-500 to-orange-500",
          },
          {
            id: "4",
            title: t("portfolio.tshirt"),
            category: t("portfolio.tshirtCategory"),
            description: t("portfolio.tshirtDesc"),
            demoUrl: "https://tshirtpagela.netlify.app/",
            gradient: "from-green-500 to-teal-500",
          },
        ];

  return (
    <section id="projects" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 gradient-bg opacity-10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-32 h-32 gradient-bg opacity-10 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-primary uppercase tracking-wider"
          >
            {t("portfolio.label")}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6"
          >
            {t("portfolio.title")}{" "}
            <motion.span 
              className="gradient-text inline-block"
              whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
              transition={{ duration: 0.3 }}
            >
              {t("portfolio.titleHighlight")}
            </motion.span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg"
          >
            {t("portfolio.subtitle")}
          </motion.p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  t,
  language,
}: {
  project: { id: string; title: string; category: string; description: string; demoUrl: string; gradient: string };
  index: number;
  t: (key: string) => string;
  language: string;
}) => {
  return (
    <ScrollReveal delay={index * 0.15} direction={index % 2 === 0 ? "left" : "right"}>
      <Card3D className="h-full">
        <motion.div
          whileHover={{ y: -10 }}
          className="group relative bg-card rounded-2xl p-8 border border-border/50 h-full overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 0.1, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} blur-xl pointer-events-none`}
          />

          {/* Category badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 mb-6 relative z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </motion.div>
            <span className="text-xs font-medium text-secondary-foreground">
              {project.category}
            </span>
          </motion.div>

          {/* Title with hover effect */}
          <motion.h3 
            className="text-2xl font-bold text-foreground mb-3 relative z-10"
            whileHover={{ x: 5 }}
          >
            <span className="group-hover:gradient-text transition-all duration-300">
              {project.title}
            </span>
          </motion.h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
            {project.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 relative z-10">
            <Link to={`/projects/${project.id}`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="gradient" size="default" className="group/btn gap-2 relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-white/20 pointer-events-none"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <Eye className="w-4 h-4" />
                  {t("portfolio.viewDemo")}
                </Button>
              </motion.div>
            </Link>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" className="relative">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </motion.div>
            </a>
          </div>

          {/* Subtle hint text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground/70 mt-3 flex items-center gap-1 relative z-10"
          >
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-500 pointer-events-none" 
            />
            {language === "bn" ? "ক্লিক করে বিস্তারিত দেখুন" : "Click to view details"}
          </motion.p>

          {/* Decorative gradient corner */}
          <motion.div 
            initial={{ opacity: 0.05 }}
            whileHover={{ opacity: 0.15, scale: 1.2 }}
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${project.gradient} rounded-bl-full rounded-tr-2xl pointer-events-none`}
          />
        </motion.div>
      </Card3D>
    </ScrollReveal>
  );
};

export default PortfolioSection;
