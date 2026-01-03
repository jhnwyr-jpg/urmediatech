import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  CreditCard, 
  FileText, 
  MessageCircle, 
  Search, 
  Palette, 
  Github
} from "lucide-react";
import { Card3D } from "@/components/ui/AnimatedComponents";
import { useLanguage } from "@/contexts/LanguageContext";

const integrations = [
  { name: "Stripe", icon: CreditCard, color: "from-blue-500 to-indigo-600" },
  { name: "Notion", icon: FileText, color: "from-orange-400 to-rose-500" },
  { name: "Slack", icon: MessageCircle, color: "from-purple-500 to-pink-500" },
  { name: "Google", icon: Search, color: "from-cyan-500 to-blue-500" },
  { name: "Figma", icon: Palette, color: "from-pink-500 to-red-500" },
  { name: "GitHub", icon: Github, color: "from-gray-600 to-gray-800" },
];

const FloatingIcon = ({ 
  icon: Icon, 
  className, 
  delay = 0,
  color
}: { 
  icon: typeof CreditCard; 
  className: string; 
  delay?: number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    viewport={{ once: true }}
    className={`absolute ${className}`}
  >
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} shadow-lg flex items-center justify-center`}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.div>
  </motion.div>
);

const IntegrationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-32 bg-accent/20 relative overflow-hidden">
      {/* Floating icons around the section */}
      <FloatingIcon 
        icon={CreditCard} 
        className="top-20 left-[10%]" 
        delay={0}
        color="from-blue-400 to-cyan-500"
      />
      <FloatingIcon 
        icon={FileText} 
        className="top-32 left-[25%]" 
        delay={0.2}
        color="from-orange-400 to-pink-500"
      />
      <FloatingIcon 
        icon={MessageCircle} 
        className="bottom-24 left-[15%]" 
        delay={0.4}
        color="from-purple-400 to-violet-500"
      />
      <FloatingIcon 
        icon={Search} 
        className="top-24 right-[20%]" 
        delay={0.3}
        color="from-cyan-400 to-blue-500"
      />
      <FloatingIcon 
        icon={Palette} 
        className="bottom-32 right-[25%]" 
        delay={0.5}
        color="from-pink-400 to-rose-500"
      />
      <FloatingIcon 
        icon={Github} 
        className="bottom-20 right-[10%]" 
        delay={0.6}
        color="from-gray-500 to-gray-700"
      />

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Premium heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
          >
            {t("integrations.title1")}
          </motion.h2>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-2"
          >
            {t("integrations.title2")}
          </motion.h2>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
          >
            {t("integrations.title3")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg mb-16"
          >
            {t("integrations.subtitle")}
          </motion.p>

          {/* Integration icons grid */}
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, i) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 150 }}
              >
                <Card3D>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border/50 cursor-pointer relative overflow-hidden group"
                  >
                    {/* Hover gradient overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.15 }}
                      className={`absolute inset-0 bg-gradient-to-br ${integration.color}`}
                    />
                    
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      <integration.icon className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                    
                    {/* Shine effect on hover */}
                    <motion.div
                      initial={{ x: "-100%", opacity: 0 }}
                      whileHover={{ x: "100%", opacity: 0.3 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"
                    />
                  </motion.div>
                </Card3D>
                
                {/* Label on hover */}
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground mt-2 text-center"
                >
                  {integration.name}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
