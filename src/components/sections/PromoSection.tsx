import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Code, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const PromoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t, language } = useLanguage();

  const highlights = [
    { icon: Code, text: language === "bn" ? "ফুল কোডেড ওয়েবসাইট" : "Fully Coded Website" },
    { icon: Globe, text: language === "bn" ? "ফ্রি ডোমেইন + হোস্টিং" : "Free Domain + Hosting" },
    { icon: Rocket, text: language === "bn" ? "৭ দিনে ডেলিভারি" : "7 Days Delivery" },
  ];

  return (
    <section ref={ref} className="py-6 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(270,70%,60%)] to-[hsl(var(--gradient-end))]" />
          
          {/* Decorative elements */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full blur-3xl opacity-10"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full blur-3xl opacity-10"
          />

          <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Left - Main content */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold mb-3 backdrop-blur-sm">
                  {language === "bn" ? "🔥 লিমিটেড অফার" : "🔥 Limited Offer"}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                  {language === "bn" ? "ওয়েবসাইট শুরু মাত্র" : "Websites Starting From"}
                  <span className="block text-3xl md:text-4xl lg:text-5xl mt-1">
                    {language === "bn" ? "৳৪,০০০" : "৳4,000"}
                  </span>
                </h3>
                <p className="text-primary-foreground/80 text-sm md:text-base max-w-md">
                  {language === "bn" 
                    ? "ফুল কোডেড, রেসপন্সিভ ওয়েবসাইট — React, Next.js দিয়ে তৈরি। টেমপ্লেট না, কাস্টম ডিজাইন!" 
                    : "Fully coded, responsive website — built with React & Next.js. No templates, custom design!"}
                </p>
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start"
              >
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-primary-foreground/90 text-xs md:text-sm bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5"
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
              className="flex-shrink-0"
            >
              <a href="#contact">
                <Button
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg group font-bold"
                >
                  {language === "bn" ? "এখনই অর্ডার করুন" : "Order Now"}
                  <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSection;
