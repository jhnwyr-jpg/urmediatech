import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";
import logo from "@/assets/logo.ico";

const footerLinks = {
  company: [
    { name: "আমাদের সম্পর্কে", href: "#about" },
    { name: "সেবাসমূহ", href: "#services" },
    { name: "প্রজেক্ট", href: "#projects" },
    { name: "যোগাযোগ", href: "#contact" },
  ],
  services: [
    { name: "ওয়েব ডিজাইন", href: "#services" },
    { name: "ডেভেলপমেন্ট", href: "#services" },
    { name: "ব্র্যান্ডিং", href: "#services" },
    { name: "SEO", href: "#services" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8 relative">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
      
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ইউআর মিডিয়া লোগো" className="w-10 h-10 invert" />
              <span className="font-bold text-xl">
                ইউআর <span className="gradient-text">মিডিয়া</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 max-w-sm mb-6">
              সুন্দর, উচ্চ-কর্মক্ষম ওয়েবসাইট তৈরি করি যা ব্যবসাকে 
              ডিজিটাল বিশ্বে বাড়তে এবং সফল হতে সাহায্য করে।
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:gradient-bg transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">কোম্পানি</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">সেবাসমূহ</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © ২০২৪ ইউআর মিডিয়া। সর্বস্বত্ব সংরক্ষিত।
          </p>
          
          {/* Back to top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
          >
            <span className="text-sm">উপরে যান</span>
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
