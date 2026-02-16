import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
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
    { name: t("nav.projects"), href: "#projects" },
    { name: t("nav.pricing"), href: "#pricing" },
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

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="max-w-6xl mx-auto">
        {/* Desktop Navbar - Apple Liquid Glass Style */}
        <motion.div 
          className="hidden md:flex items-center justify-between gap-2 px-2 py-2 rounded-full relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 relative z-10 group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="bg-white p-1 rounded-lg shadow-sm border border-border/50 group-hover:scale-110 transition-transform">
              <img 
                src={logo} 
                alt="UR Media" 
                className="w-8 h-8 object-contain"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-extrabold text-base tracking-tight text-foreground">UR</span>
              <span className="font-bold text-base tracking-tight text-primary">Media</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 relative z-10 px-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 transition-all duration-300 text-sm font-semibold rounded-full hover:bg-black/5 text-muted-foreground hover:text-foreground"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 relative z-10 pr-2">
            <LanguageToggle />
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-6 border-primary/30 hover:bg-primary/5 text-primary h-11 transition-all"
              onClick={() => navigate("/client/login")}
            >
              <User size={18} className="mr-2" />
              <span className="font-semibold">{t("nav.clientLogin")}</span>
            </Button>
            <Button 
              variant="gradient" 
              size="sm" 
              className="rounded-full px-7 h-11 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold"
              onClick={scrollToContact}
            >
              {t("nav.contact")}
            </Button>
          </div>
        </motion.div>

        {/* Mobile Navbar - Liquid Glass */}
        <motion.div 
          className="md:hidden flex items-center justify-between px-4 py-3 rounded-full relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-2 relative z-10"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="bg-white p-1 rounded-lg shadow-sm border border-border/50">
              <img 
                src={logo} 
                alt="UR Media" 
                className="w-7 h-7 object-contain"
                width={28}
                height={28}
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-extrabold text-sm tracking-tight text-foreground">UR</span>
              <span className="font-bold text-sm tracking-tight text-primary">Media</span>
            </div>
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
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-full border-primary/30 hover:bg-primary/10 py-3"
                    onClick={() => {
                      navigate("/client/login");
                      setIsOpen(false);
                    }}
                  >
                    <User size={16} className="mr-1.5" />
                    {t("nav.clientLogin")}
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="w-full rounded-full shadow-lg shadow-primary/25 py-3"
                    onClick={scrollToContact}
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