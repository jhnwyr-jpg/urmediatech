import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const integrations = [
  { name: "Google", logo: "https://www.google.com/favicon.ico", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" },
  { name: "Microsoft", logo: "", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png" },
  { name: "Slack", logo: "", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png" },
  { name: "Stripe", logo: "", logoUrl: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_logo_-_slate_sm.png" },
  { name: "Supabase", logo: "", logoUrl: "https://cf-assets.www.cloudflare.com/slt3lc6tev37/5vMYBRzMvkZS94KOljbUc5/e5db8e2832b9e6588e77bd04fce498b2/supabase_logo.png" },
  { name: "Firebase", logo: "", logoUrl: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99058d2a35571f64ad722ca9c7/firebase/images/touchicon-180.png" },
  { name: "Vercel", logo: "", logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
  { name: "Notion", logo: "", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/120px-Notion-logo.svg.png" },
  { name: "HubSpot", logo: "", logoUrl: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png" },
  { name: "Figma", logo: "", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/120px-Figma-logo.svg.png" },
  { name: "Salesforce", logo: "", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/120px-Salesforce.com_logo.svg.png" },
  { name: "GitHub", logo: "", logoUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" },
];

// Double the array for seamless loop
const doubledIntegrations = [...integrations, ...integrations];

const IntegrationsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
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
