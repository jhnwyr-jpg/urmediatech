import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const integrations = [
  { name: "Google", color: "#4285F4", icon: "G" },
  { name: "Microsoft", color: "#00A4EF", icon: "⊞" },
  { name: "Slack", color: "#4A154B", icon: "#" },
  { name: "Stripe", color: "#635BFF", icon: "S" },
  { name: "Salesforce", color: "#00A1E0", icon: "☁" },
  { name: "Notion", color: "#000000", icon: "N" },
  { name: "HubSpot", color: "#FF7A59", icon: "⚙" },
  { name: "Figma", color: "#F24E1E", icon: "F" },
];

const IntegrationsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-accent/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs md:text-sm font-semibold tracking-[0.25em] text-muted-foreground mb-10 uppercase"
        >
          {t("integrations.subtitle")}
        </motion.p>

        {/* Logos row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-2.5 group cursor-default"
            >
              <div
                className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <span className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {item.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
