import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navLinks = [
    { name: t("nav.services"), href: "#services" },
    { name: t("nav.projects"), href: "#portfolio" },
    { name: t("nav.about"), href: "#about" },
  ];

  const scrollToSection = (href: string) => {
    const sectionId = href.replace("#", "");
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const goToChat = () => {
    navigate("/chat");
    setIsOpen(false);
  };

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
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 relative z-10"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img 
              src={logo} 
              alt="UR Media - Professional Video Editing Agency Logo" 
              className="w-8 h-8"
              width={32}
              height={32}
              loading="eager"
              decoding="async"
            />
            <span className="font-bold text-lg text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="flex items-center gap-1 relative z-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 transition-all duration-300 text-sm font-medium rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2 relative z-10">
            <LanguageToggle />
            <Button 
              variant="gradient" 
              size="sm" 
              className="rounded-full px-5 shadow-lg shadow-primary/25"
              onClick={goToChat}
            >
              {t("nav.contact")}
            </Button>
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
          <Link 
            to="/"
            className="flex items-center gap-2 relative z-10"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img 
              src={logo} 
              alt="UR Media - Professional Video Editing Agency Logo" 
              className="w-8 h-8"
              width={32}
              height={32}
              loading="eager"
              decoding="async"
            />
            <span className="font-bold text-lg text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </Link>

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
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className="transition-all duration-300 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
                
                {/* CTA Section */}
                <div className="pt-4 border-t border-white/10">
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="w-full rounded-full shadow-lg shadow-primary/25 py-3"
                    onClick={goToChat}
                  >
                    {t("nav.contact")}
                  </Button>
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