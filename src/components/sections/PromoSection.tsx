import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Code, Globe, Rocket, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconList = [Code, Globe, Rocket];

const PromoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { language } = useLanguage();
  const { get } = useSiteContent();

  const badge = get(
    language === "bn" ? "promo_badge_bn" : "promo_badge_en",
    language === "bn" ? "🔥 লিমিটেড অফার" : "🔥 Limited Offer"
  );

  const websiteTitle = language === "bn" ? "ওয়েবসাইট শুরু মাত্র" : "Website Starting From";
  const websitePrice = language === "bn" ? "৳৪,০০০" : "৳4,000";
  const websiteDesc = language === "bn"
    ? "ফুল কোডেড, রেসপন্সিভ ওয়েবসাইট — React, Next.js দিয়ে তৈরি। আপনার চাহিদা মতো দাম নির্ধারণ হবে, শুরু এই দাম থেকে!"
    : "Fully coded, responsive website — built with React & Next.js. Price varies based on your requirements, starting from this price!";
  const websiteHighlights = language === "bn"
    ? ["ফুল কোডেড ওয়েবসাইট", "ফ্রি ডোমেইন + হোস্টিং", "৭ দিনে ডেলিভারি"]
    : ["Fully Coded Website", "Free Domain + Hosting", "7 Days Delivery"];

  const landingTitle = language === "bn" ? "ল্যান্ডিং পেজ শুরু মাত্র" : "Landing Page Starting From";
  const landingPrice = language === "bn" ? "৳১,৯০০" : "৳1,900";
  const landingDesc = language === "bn"
    ? "প্রফেশনাল ল্যান্ডিং পেজ — দ্রুত ডেলিভারি, মোবাইল রেসপন্সিভ, কনভার্সন অপ্টিমাইজড!"
    : "Professional landing page — fast delivery, mobile responsive, conversion optimized!";
  const landingHighlights = language === "bn"
    ? ["রেসপন্সিভ ডিজাইন", "দ্রুত ডেলিভারি", "কনভার্সন ফোকাসড"]
    : ["Responsive Design", "Fast Delivery", "Conversion Focused"];

  const ctaText = get(
    language === "bn" ? "promo_cta_bn" : "promo_cta_en",
    language === "bn" ? "এখনই অর্ডার করুন" : "Order Now"
  );

  return (
    <section ref={ref} className="py-6 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Website Promo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(270,70%,60%)] to-[hsl(var(--gradient-end))]" />

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground rounded-full blur-3xl opacity-10"
            />

            <div className="relative z-10 px-6 py-8 md:px-8 md:py-8 flex flex-col justify-between h-full">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold mb-3 backdrop-blur-sm">
                  {badge}
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground mb-1">
                  {websiteTitle}
                  <span className="block text-3xl md:text-4xl lg:text-5xl mt-1">{websitePrice}</span>
                </h3>
                <p className="text-primary-foreground/80 text-sm max-w-sm mt-2">
                  {websiteDesc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {websiteHighlights.map((text, i) => {
                  const Icon = iconList[i % iconList.length];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-primary-foreground/90 text-xs bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg group font-bold"
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Landing Page Promo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(200,80%,50%)] via-[hsl(220,70%,55%)] to-[hsl(250,60%,55%)]" />

            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full blur-3xl opacity-10"
            />

            <div className="relative z-10 px-6 py-8 md:px-8 md:py-8 flex flex-col justify-between h-full">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold mb-3 backdrop-blur-sm">
                  <Layout className="w-3 h-3" />
                  {language === "bn" ? "⚡ জনপ্রিয়" : "⚡ Popular"}
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground mb-1">
                  {landingTitle}
                  <span className="block text-3xl md:text-4xl lg:text-5xl mt-1">{landingPrice}</span>
                </h3>
                <p className="text-primary-foreground/80 text-sm max-w-sm mt-2">
                  {landingDesc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {landingHighlights.map((text, i) => {
                  const icons = [Layout, Rocket, Globe];
                  const Icon = icons[i % icons.length];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-primary-foreground/90 text-xs bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-1.5"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg group font-bold"
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
