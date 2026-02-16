import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-0.5 px-1 py-1 rounded-full border border-black/5 text-sm font-medium overflow-hidden h-11"
      style={{
        background: "rgba(0,0,0,0.03)",
      }}
    >
      {/* Bengali option */}
      <motion.span
        animate={{
          backgroundColor: language === "bn" ? "hsl(var(--primary))" : "transparent",
          color: language === "bn" ? "#fff" : "hsl(var(--muted-foreground))",
          boxShadow: language === "bn" ? "0 2px 10px -2px hsl(var(--primary) / 0.4)" : "none",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
      >
        বাং
      </motion.span>

      {/* English option */}
      <motion.span
        animate={{
          backgroundColor: language === "en" ? "hsl(var(--primary))" : "transparent",
          color: language === "en" ? "#fff" : "hsl(var(--muted-foreground))",
          boxShadow: language === "en" ? "0 2px 10px -2px hsl(var(--primary) / 0.4)" : "none",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
      >
        EN
      </motion.span>
    </motion.button>
  );
};

export default LanguageToggle;
