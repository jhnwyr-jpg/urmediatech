import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Crown, Zap, Globe, Server, Code, Headphones, Palette, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const plans = [
    {
      icon: Zap,
      name: t("pricing.starterName"),
      price: "১,৯৯৯",
      period: t("pricing.period"),
      badge: t("pricing.popular"),
      featured: true,
      features: [
        { icon: Globe, text: t("pricing.starterF1") },
        { icon: Server, text: t("pricing.starterF2") },
        { icon: Code, text: t("pricing.starterF3") },
        { icon: Shield, text: t("pricing.starterF4") },
      ],
      buttonText: t("pricing.orderBtn"),
    },
    {
      icon: Crown,
      name: t("pricing.premiumName"),
      price: "৩,৯৯৯",
      period: t("pricing.period"),
      badge: null,
      featured: false,
      features: [
        { icon: Globe, text: t("pricing.premiumF1") },
        { icon: Server, text: t("pricing.premiumF2") },
        { icon: Code, text: t("pricing.premiumF3") },
        { icon: Shield, text: t("pricing.premiumF4") },
        { icon: Headphones, text: t("pricing.premiumF5") },
        { icon: Palette, text: t("pricing.premiumF6") },
      ],
      buttonText: t("pricing.orderBtn"),
    },
  ];

  return (
    <section id="pricing" ref={ref} className="py-28 relative overflow-hidden">
      {/* Rich background */}
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
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-40 right-20 w-4 h-4 rounded-full bg-primary/20"
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-3 h-3 rounded-full bg-primary/15"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-60 left-1/4 w-2 h-2 rounded-full bg-primary/25"
          animate={{ y: [-8, 8, -8], x: [3, -3, 3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
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
            <span className="text-sm font-medium text-primary tracking-wider">
              {t("pricing.label")}
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6">
            {t("pricing.title")}{" "}
            <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto items-start">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              isInView={isInView}
              onOrder={scrollToContact}
            />
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
          <p className="text-muted-foreground text-sm">
            {t("pricing.note")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

interface PricingCardProps {
  plan: {
    icon: any;
    name: string;
    price: string;
    period: string;
    badge: string | null;
    featured: boolean;
    features: { icon: any; text: string }[];
    buttonText: string;
  };
  index: number;
  isInView: boolean;
  onOrder: () => void;
}

const PricingCard = ({ plan, index, isInView, onOrder }: PricingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group rounded-3xl overflow-hidden ${
        plan.featured ? "md:-mt-4" : ""
      }`}
    >
      {/* Card glass background */}
      <div
        className={`relative p-8 md:p-10 transition-all duration-500 ${
          plan.featured
            ? "border-2 border-primary/30"
            : "border border-border/50 hover:border-primary/20"
        }`}
        style={{
          background: plan.featured
            ? "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(255,255,255,0.95) 50%, rgba(139,92,246,0.05) 100%)"
            : "hsl(var(--card))",
          borderRadius: "1.5rem",
          boxShadow: plan.featured
            ? "0 20px 60px -15px rgba(139,92,246,0.2), 0 4px 25px -5px rgba(0,0,0,0.08)"
            : "0 4px 20px -5px rgba(0,0,0,0.06)",
        }}
      >
        {/* Shimmer effect for featured */}
        {plan.featured && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-40"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(139,92,246,0.15) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["-100% 0%", "200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1), transparent 70%)",
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Popular Badge */}
        {plan.badge && (
          <motion.div
            initial={{ scale: 0, y: -10 }}
            animate={isInView ? { scale: 1, y: 0 } : { scale: 0, y: -10 }}
            transition={{ type: "spring", delay: 0.4, stiffness: 200 }}
            className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span
              className="relative text-primary-foreground text-xs font-bold px-6 py-2 rounded-full shadow-lg shadow-primary/30 inline-flex items-center gap-1.5"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gradient-end)))",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🔥
              </motion.span>
              {plan.badge}
            </span>
          </motion.div>
        )}

        {/* Plan Header */}
        <div className={`text-center ${plan.badge ? "mt-4" : ""} mb-8`}>
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
              plan.featured ? "" : "bg-primary/10"
            }`}
            style={
              plan.featured
                ? {
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gradient-end)))",
                    boxShadow: "0 8px 25px -5px hsl(var(--primary) / 0.4)",
                  }
                : {}
            }
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <plan.icon className={`w-8 h-8 ${plan.featured ? "text-primary-foreground" : "text-primary"}`} />
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-5xl md:text-6xl font-extrabold ${
              plan.featured ? "gradient-text" : "text-foreground"
            }`}>
              ৳{plan.price}
            </span>
          </div>
          <span className="text-muted-foreground text-sm mt-1 block">/{plan.period}</span>
        </div>

        {/* Divider with gradient */}
        <div className={`h-px mb-8 ${
          plan.featured
            ? "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            : "bg-border"
        }`} />

        {/* Features */}
        <ul className="space-y-4 mb-10">
          {plan.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.3 + index * 0.15 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                plan.featured
                  ? "bg-primary/15"
                  : "bg-primary/10"
              }`}>
                <Check className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-foreground/80 text-sm leading-relaxed">{feature.text}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            id={`btn-pricing-${index === 0 ? "starter" : "premium"}`}
            variant={plan.featured ? "gradient" : "outline"}
            size="lg"
            className={`w-full rounded-xl py-6 text-base font-semibold group/btn ${
              plan.featured ? "shadow-lg shadow-primary/25" : ""
            }`}
            onClick={onOrder}
          >
            {plan.buttonText}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingSection;
