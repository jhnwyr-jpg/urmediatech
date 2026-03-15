import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import logoStripe from "@/assets/logo-stripe.png";

const integrations = [
  { name: "Google", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" },
  { name: "Microsoft", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png" },
  { name: "Slack", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png" },
  { name: "Stripe", logoUrl: logoStripe },
  { name: "Supabase", logoUrl: "https://supabase.com/_next/image?url=https%3A%2F%2Fobuldanrptloktxcffvn.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fimages%2Flogo%2Fsupabase-logo-icon.png&w=128&q=75" },
  { name: "Firebase", logoUrl: "/images/logo-firebase.svg" },
  { name: "Vercel", logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
  { name: "Notion", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/120px-Notion-logo.svg.png" },
  { name: "HubSpot", logoUrl: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png" },
  { name: "Figma", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/120px-Figma-logo.svg.png" },
  { name: "Salesforce", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/120px-Salesforce.com_logo.svg.png" },
  { name: "GitHub", logoUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" },
  { name: "React", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/120px-React-icon.svg.png" },
  { name: "Next.js", logoUrl: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" },
];

// Double the array for seamless loop
const doubledIntegrations = [...integrations, ...integrations];

const IntegrationsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-8 pb-4 md:pt-10 md:pb-6 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs md:text-sm font-semibold tracking-[0.25em] text-muted-foreground uppercase"
        >
          Seamlessly Integrates With
        </motion.p>
      </div>

      {/* Marquee slider */}
      <div className="relative w-full">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-accent/80 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-accent/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-10 md:gap-14 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {doubledIntegrations.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex items-center gap-3 shrink-0 group cursor-default"
            >
              <img
                src={item.logoUrl}
                alt={item.name}
                className="w-8 h-8 md:w-9 md:h-9 object-contain rounded-lg"
                loading="lazy"
              />
              <span className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
