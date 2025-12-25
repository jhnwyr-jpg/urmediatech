import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium transition-colors hover:bg-secondary"
    >
      <motion.span
        animate={{ opacity: language === "bn" ? 1 : 0.5 }}
        className="text-foreground"
      >
        বাং
      </motion.span>
      <span className="text-muted-foreground">/</span>
      <motion.span
        animate={{ opacity: language === "en" ? 1 : 0.5 }}
        className="text-foreground"
      >
        EN
      </motion.span>
      
      {/* Active indicator */}
      <motion.div
        layoutId="langIndicator"
        className="absolute bottom-0 h-0.5 bg-primary rounded-full"
        initial={false}
        animate={{
          left: language === "bn" ? "8px" : "auto",
          right: language === "en" ? "8px" : "auto",
          width: language === "bn" ? "20px" : "16px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.button>
  );
};

export default LanguageToggle;
