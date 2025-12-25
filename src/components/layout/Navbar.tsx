import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.ico";

const navLinks = [
  { name: "Features", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Integrations", href: "#about" },
];

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="max-w-4xl mx-auto">
        {/* Desktop Navbar - Floating Pill Style */}
        <div className="hidden md:flex items-center justify-between gap-2 px-2 py-2 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/10">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => smoothScroll(e, "#home")}
            className="flex items-center gap-2 px-4"
          >
            <img src={logo} alt="UR Media Logo" className="w-8 h-8" />
            <span className="font-bold text-lg text-white">
              UR <span className="text-primary">Media</span>
            </span>
          </a>

          {/* Center Navigation */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium rounded-full hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <a href="#contact" onClick={(e) => smoothScroll(e, "#contact")}>
              <Button variant="gradient" size="sm" className="rounded-full px-5">
                Start Free Trial
              </Button>
            </a>
            <a 
              href="#contact" 
              onClick={(e) => smoothScroll(e, "#contact")}
              className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => smoothScroll(e, "#home")}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="UR Media Logo" className="w-8 h-8" />
            <span className="font-bold text-lg text-white">
              UR <span className="text-primary">Media</span>
            </span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white relative z-[60] touch-manipulation rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            type="button"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      smoothScroll(e, link.href);
                      setIsOpen(false);
                    }}
                    className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-300 text-sm font-medium rounded-xl"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-3 space-y-2 border-t border-white/10 mt-3">
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      smoothScroll(e, "#contact");
                      setIsOpen(false);
                    }}
                  >
                    <Button variant="gradient" size="sm" className="w-full rounded-full">
                      Start Free Trial
                    </Button>
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      smoothScroll(e, "#contact");
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-1 w-full py-2 text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    Sign In
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