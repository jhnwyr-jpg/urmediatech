import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const { t, language } = useLanguage();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    navigation: [
      { name: t("footer.about"), sectionId: "about" },
      { name: t("nav.services"), sectionId: "services" },
      { name: t("footer.projects"), sectionId: "portfolio" },
      { name: t("nav.pricing"), sectionId: "pricing" },
      { name: t("nav.contact"), sectionId: "contact" },
    ],
    services: [
      { name: "Landing Page", sectionId: "pricing" },
      { name: "E-commerce Website", sectionId: "pricing" },
      { name: "Business Website", sectionId: "pricing" },
      { name: "Web Application", sectionId: "pricing" },
    ],
    social: [
      { name: "Facebook", href: "#" },
      { name: "Twitter/X", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "LinkedIn", href: "#" },
    ],
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient top band */}
      <div className="h-16 bg-gradient-to-b from-primary/10 to-primary/5" />

      {/* Main footer content */}
      <div className="relative bg-gradient-to-b from-primary/5 to-primary/15 pt-12 pb-8">
        {/* Giant watermark text */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none select-none">
          <span
            className="text-[18vw] font-black tracking-[0.05em] leading-none text-primary/[0.07] translate-y-[20%]"
            aria-hidden="true"
          >
            URMEDIA
          </span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* 5-column grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
            {/* Info & Address */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="flex items-center gap-2 font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {language === "bn" ? "তথ্য ও ঠিকানা" : "Info & Address"}
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Dhaka, Bangladesh</p>
                <p>
                  <a href="tel:+8801234567890" className="hover:text-foreground transition-colors">
                    +880 1234-567890
                  </a>
                </p>
                <p>
                  <a href="mailto:info@urmedia.tech" className="hover:text-foreground transition-colors">
                    info@urmedia.tech
                  </a>
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {language === "bn" ? "সোশ্যাল লিংক" : "Social Links"}
              </h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.social.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {language === "bn" ? "নেভিগেশন" : "Navigation"}
              </h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.navigation.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.sectionId)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {language === "bn" ? "সেবাসমূহ" : "Services"}
              </h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.sectionId)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal / Brand */}
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm tracking-[0.15em] uppercase text-foreground mb-5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {language === "bn" ? "আইনি" : "Legal"}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    {language === "bn" ? "প্রাইভেসি পলিসি" : "Privacy Policy"}
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    {language === "bn" ? "সেবার শর্তাবলী" : "Terms of Service"}
                  </button>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground/60 mt-6">
                {t("footer.copyright")}
              </p>
            </div>
          </div>

          {/* Bottom bar with back-to-top */}
          <div className="border-t border-border pt-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
              <img
                src={logo}
                alt="UR Media Logo"
                className="w-8 h-8"
                width={32}
                height={32}
                loading="lazy"
                decoding="async"
              />
              <span className="font-bold text-sm text-foreground whitespace-nowrap">
                UR <span className="text-primary">Media</span>
              </span>
            </Link>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <span>{t("footer.backToTop")}</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowUp className="w-4 h-4 text-primary" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
