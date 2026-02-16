import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-0.5 px-1 py-1 rounded-full border border-border/40 text-sm font-medium overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Bengali option */}
      <motion.span
        animate={{
          backgroundColor: language === "bn" ? "hsl(var(--primary))" : "transparent",
          color: language === "bn" ? "#fff" : "hsl(var(--muted-foreground))",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative z-10 px-3 py-1 rounded-full text-xs font-semibold"
      >
        বাং
      </motion.span>

      {/* English option */}
      <motion.span
        animate={{
          backgroundColor: language === "en" ? "hsl(var(--primary))" : "transparent",
          color: language === "en" ? "#fff" : "hsl(var(--muted-foreground))",
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative z-10 px-3 py-1 rounded-full text-xs font-semibold"
      >
        EN
      </motion.span>
    </motion.button>
  );
};

export default LanguageToggle;
