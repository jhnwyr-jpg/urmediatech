import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { name: t("nav.services"), href: "#services" },
    { name: t("nav.projects"), href: "#projects" },
    { name: t("nav.about"), href: "#about" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="max-w-4xl mx-auto">
        {/* Desktop Navbar - Apple Liquid Glass Style */}
        <motion.div 
          className="hidden md:flex items-center justify-between gap-2 px-2 py-2 rounded-full relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Animated liquid gradient overlay */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.1) 25%, rgba(6,182,212,0.1) 50%, rgba(139,92,246,0.1) 75%, transparent 100%)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["-100% 0%", "200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => smoothScroll(e, "#home")}
            className="flex items-center gap-2 px-4 relative z-10"
          >
            <img src={logo} alt="UR Media Logo" className="w-8 h-8" />
            <span className="font-bold text-lg text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </a>

          {/* Center Navigation */}
          <div className="flex items-center gap-1 relative z-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium rounded-full hover:bg-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 relative z-10">
            <LanguageToggle />
            <a href="#contact" onClick={(e) => smoothScroll(e, "#contact")}>
              <Button variant="gradient" size="sm" className="rounded-full px-5 shadow-lg shadow-primary/25">
                {t("nav.contact")}
              </Button>
            </a>
            <a 
              href="#contact" 
              onClick={(e) => smoothScroll(e, "#contact")}
              className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
            >
              {t("nav.signin")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Mobile Navbar - Liquid Glass */}
        <motion.div 
          className="md:hidden flex items-center justify-between px-4 py-3 rounded-full relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-30"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["-100% 0%", "200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => smoothScroll(e, "#home")}
            className="flex items-center gap-2 relative z-10"
          >
            <img src={logo} alt="UR Media Logo" className="w-8 h-8" />
            <span className="font-bold text-lg text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </a>

          <div className="flex items-center gap-2 relative z-10">
            <LanguageToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground relative z-[60] touch-manipulation rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Navigation Dropdown - Liquid Glass */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 overflow-hidden rounded-3xl relative"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.12) 100%)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              <div className="px-6 py-6 space-y-2 relative z-10">
                {/* Navigation Links Row */}
                <div className="flex items-center justify-center gap-6 pb-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        smoothScroll(e, link.href);
                        setIsOpen(false);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                
                {/* CTA Section */}
                <div className="pt-4 space-y-3 border-t border-white/10">
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      smoothScroll(e, "#contact");
                      setIsOpen(false);
                    }}
                  >
                    <Button variant="gradient" size="sm" className="w-full rounded-full shadow-lg shadow-primary/25 py-3">
                      {t("nav.contact")}
                    </Button>
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      smoothScroll(e, "#contact");
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1 w-full py-3 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
                  >
                    {t("nav.signin")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
