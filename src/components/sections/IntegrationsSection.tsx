import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const integrations = [
  { name: "Stripe", icon: "💳" },
  { name: "Notion", icon: "📝" },
  { name: "Slack", icon: "💬" },
  { name: "Google", icon: "🔍" },
  { name: "Figma", icon: "🎨" },
  { name: "GitHub", icon: "🐙" },
];

const IntegrationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-accent/30 relative overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {integrations.map((int, i) => (
          <motion.div
            key={int.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
            className="absolute text-4xl"
            style={{
              top: `${20 + (i % 3) * 30}%`,
              left: `${10 + (i * 15)}%`,
            }}
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="block"
            >
              {int.icon}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Connect your
            <br />
            <span className="gradient-text">marketing & sales</span>
            <br />
            stack
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Seamlessly integrate with the tools you already use to streamline 
            your workflow and maximize efficiency.
          </p>

          {/* Integration logos */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {integrations.map((int, i) => (
              <motion.div
                key={int.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="w-16 h-16 rounded-2xl bg-card shadow-lg flex items-center justify-center text-2xl border border-border/50 card-hover"
              >
                {int.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;