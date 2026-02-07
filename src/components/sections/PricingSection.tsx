import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Crown, Zap, Globe, Server, Code, Headphones, Palette, Shield } from "lucide-react";
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
      priceEn: "1,999",
      period: t("pricing.period"),
      badge: null,
      features: [
        { icon: Globe, text: t("pricing.starterF1") },
        { icon: Server, text: t("pricing.starterF2") },
        { icon: Code, text: t("pricing.starterF3") },
        { icon: Shield, text: t("pricing.starterF4") },
      ],
      buttonText: t("pricing.orderBtn"),
      variant: "outline" as const,
    },
    {
      icon: Crown,
      name: t("pricing.premiumName"),
      price: "৩,৯৯৯",
      priceEn: "3,999",
      period: t("pricing.period"),
      badge: t("pricing.popular"),
      features: [
        { icon: Globe, text: t("pricing.premiumF1") },
        { icon: Server, text: t("pricing.premiumF2") },
        { icon: Code, text: t("pricing.premiumF3") },
        { icon: Shield, text: t("pricing.premiumF4") },
        { icon: Headphones, text: t("pricing.premiumF5") },
        { icon: Palette, text: t("pricing.premiumF6") },
      ],
      buttonText: t("pricing.orderBtn"),
      variant: "gradient" as const,
    },
  ];

  return (
    <section id="pricing" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            {t("pricing.label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            {t("pricing.title")}{" "}
            <span className="gradient-text">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative group rounded-3xl p-8 md:p-10 border transition-all duration-500 ${
                plan.badge
                  ? "bg-card border-primary/30 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 scale-[1.02]"
                  : "bg-card border-border/50 hover:border-primary/20 hover:shadow-lg"
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="gradient-bg text-primary-foreground text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  plan.badge ? "gradient-bg" : "bg-primary/10"
                }`}>
                  <plan.icon className={`w-7 h-7 ${plan.badge ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-foreground">
                    ৳{plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px mb-8 ${plan.badge ? "bg-primary/20" : "bg-border"}`} />

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.badge ? "bg-primary/15" : "bg-primary/10"
                    }`}>
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-sm leading-relaxed">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                id={`btn-pricing-${index === 0 ? "starter" : "premium"}`}
                variant={plan.variant}
                size="lg"
                className="w-full rounded-xl py-6 text-base font-semibold"
                onClick={scrollToContact}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground text-sm mt-10"
        >
          {t("pricing.note")}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
