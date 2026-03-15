import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PromoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { language } = useLanguage();

  const offers = [
    {
      label: language === "bn" ? "ওয়েবসাইট" : "Website",
      price: language === "bn" ? "৳৪,০০০" : "৳4,000",
      note: language === "bn" ? "থেকে শুরু" : "starting from",
    },
    {
      label: language === "bn" ? "ল্যান্ডিং পেজ" : "Landing Page",
      price: language === "bn" ? "৳১,৯০০" : "৳1,900",
      note: language === "bn" ? "থেকে শুরু" : "starting from",
    },
  ];

  return (
    <section ref={ref} className="py-10 md:py-14 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Minimal headline */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-6">
            {language === "bn" ? "আমাদের প্রাইসিং" : "Our Pricing"}
          </p>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {language === "bn" ? (
              <>প্রিমিয়াম কোয়ালিটি, <span className="text-primary">সাশ্রয়ী দামে।</span></>
            ) : (
              <>Premium Quality, <span className="text-primary">Affordable Price.</span></>
            )}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-10">
            {language === "bn"
              ? "React, Next.js দিয়ে ফুল কোডেড — টেমপ্লেট না, কাস্টম ডিজাইন। ফ্রি ডোমেইন + হোস্টিং সহ।"
              : "Fully coded with React & Next.js — not templates, custom design. Free domain + hosting included."}
          </p>

          {/* Price display - clean, side by side */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-10">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  {offer.label}
                </p>
                <p className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  {offer.price}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{offer.note}</p>
              </motion.div>
            ))}
          </div>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <a href="#contact">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity group">
                {language === "bn" ? "এখনই অর্ডার করুন" : "Order Now"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSection;
