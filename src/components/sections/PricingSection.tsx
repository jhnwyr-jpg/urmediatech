import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Check, Crown, Zap, Globe, Server, Code, Headphones, Palette, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = { Zap, Crown, Globe, Server, Code, Headphones, Palette, Shield, Sparkles, Check, ArrowRight };

const bnDigits = "০১২৩৪৫৬৭৮৯";
const toBnDigit = (d: number) => bnDigits[d] || d;

const parseBnPrice = (val: string): number => {
  const latin = val.replace(/[০-৯]/g, (ch) => String(bnDigits.indexOf(ch)));
  return parseInt(latin.replace(/[^\d]/g, ""), 10) || 0;
};

const formatBn = (n: number): string => {
  // Format with Bangla comma style (Indian grouping) and Bangla digits
  const str = n.toLocaleString("en-IN"); // gives 1,900 / 2,900 etc
  return str.replace(/\d/g, (d) => toBnDigit(Number(d)) as string);
};

/** Single digit roller — each digit rolls down from top */
const RollingDigit = ({ digit, delay }: { digit: string; delay: number }) => {
  return (
    <motion.span
      key={digit}
      initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay 
      }}
      className="inline-block"
    >
      {digit}
    </motion.span>
  );
};

const AnimatedPrice = ({ value, isInView, isFeatured, index }: { value: string; isInView: boolean; isFeatured: boolean; index: number }) => {
  const numericValue = parseBnPrice(value);
  const stepsBack = 5;
  const startValue = Math.max(0, numericValue - stepsBack);
  const [count, setCount] = useState(startValue);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || hasRun.current) return;
    hasRun.current = true;

    const baseDelay = index * 200;
    const stepDuration = 160;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let step = 1; step <= stepsBack; step++) {
      const t = setTimeout(() => {
        setCount(startValue + step);
      }, baseDelay + step * stepDuration);
      timers.push(t);
    }

    return () => timers.forEach(clearTimeout);
  }, [isInView, numericValue, index, startValue, stepsBack]);

  const formatted = formatBn(count);
  const chars = `৳${formatted}`.split("");

  return (
    <span
      className={`text-5xl md:text-6xl font-extrabold inline-flex overflow-hidden ${isFeatured ? "gradient-text" : "text-foreground"}`}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.45,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: i * 0.06,
          }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
};

interface PlanData {
  id: string;
  plan_key: string;
  name_bn: string;
  name_en: string;
  price: string;
  period_bn: string;
  period_en: string;
  icon: string;
  is_featured: boolean;
  sort_order: number;
  features: { id: string; text_bn: string; text_en: string; icon: string; sort_order: number }[];
}

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data: plansData } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!plansData) return;

      const { data: featuresData } = await supabase
        .from("pricing_features")
        .select("*")
        .order("sort_order");

      const mapped = plansData.map((plan) => ({
        ...plan,
        features: (featuresData || []).filter((f) => f.plan_id === plan.id),
      }));
      setPlans(mapped);
    };
    fetchPlans();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" ref={ref} className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
        <motion.div
          className="absolute top-32 left-10 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08), transparent)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.3), transparent)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary tracking-wider">{t("pricing.label")}</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6">
            {t("pricing.title")} <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t("pricing.subtitle")}</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} isInView={isInView} onOrder={scrollToContact} language={language} cardDelay={index * 0.35} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          <Shield className="w-4 h-4 text-primary/60" />
          <p className="text-muted-foreground text-sm">{t("pricing.note")}</p>
        </motion.div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan, index, isInView, onOrder, language, cardDelay = 0 }: { plan: PlanData; index: number; isInView: boolean; onOrder: () => void; language: string; cardDelay?: number }) => {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const PlanIcon = iconMap[plan.icon] || Zap;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.7, delay: cardDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group rounded-3xl overflow-hidden h-full ${plan.is_featured ? "md:-mt-4" : ""}`}
    >
      <div
        className={`relative p-8 md:p-10 transition-all duration-500 h-full flex flex-col ${
          plan.is_featured ? "border-2 border-primary/30" : "border border-border/50 hover:border-primary/20"
        }`}
        style={{
          background: plan.is_featured
            ? "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(255,255,255,0.95) 50%, rgba(139,92,246,0.05) 100%)"
            : "hsl(var(--card))",
          borderRadius: "1.5rem",
          boxShadow: plan.is_featured
            ? "0 20px 60px -15px rgba(139,92,246,0.2), 0 4px 25px -5px rgba(0,0,0,0.08)"
            : "0 4px 20px -5px rgba(0,0,0,0.06)",
        }}
      >
        {plan.is_featured && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-40"
            style={{ background: "linear-gradient(105deg, transparent 40%, rgba(139,92,246,0.15) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
            animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
        )}

        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1), transparent 70%)" }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="text-center mb-8">
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${plan.is_featured ? "" : "bg-primary/10"}`}
            style={plan.is_featured ? { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gradient-end)))", boxShadow: "0 8px 25px -5px hsl(var(--primary) / 0.4)" } : {}}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PlanIcon className={`w-8 h-8 ${plan.is_featured ? "text-primary-foreground" : "text-primary"}`} />
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-3">{language === "bn" ? plan.name_bn : plan.name_en}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <AnimatedPrice value={plan.price} isInView={cardInView} isFeatured={plan.is_featured} index={index} />
          </div>
          <span className="text-muted-foreground text-sm mt-1 block">/{language === "bn" ? plan.period_bn : plan.period_en}</span>
        </div>

        <div className={`h-px mb-8 ${plan.is_featured ? "bg-gradient-to-r from-transparent via-primary/30 to-transparent" : "bg-border"}`} />

        <ul className="space-y-4 mb-10 flex-1">
          {plan.features.map((feature, i) => {
            const FeatureIcon = iconMap[feature.icon] || Check;
            return (
              <motion.li
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.3 + index * 0.15 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.is_featured ? "bg-primary/15" : "bg-primary/10"}`}>
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-foreground/80 text-sm leading-relaxed">{language === "bn" ? feature.text_bn : feature.text_en}</span>
              </motion.li>
            );
          })}
        </ul>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            id={`btn-pricing-${plan.plan_key}`}
            variant={plan.is_featured ? "gradient" : "outline"}
            size="lg"
            className={`w-full rounded-xl py-6 text-base font-semibold group/btn ${plan.is_featured ? "shadow-lg shadow-primary/25" : ""}`}
            onClick={onOrder}
          >
            {t("pricing.orderBtn")}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingSection;
