import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Dotted Globe (pure CSS/SVG, rotates continuously) ─── */
const DottedGlobe = () => {
  return (
    <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl scale-110" />
      
      {/* Globe container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border border-border/30 bg-gradient-to-br from-muted/50 to-background shadow-2xl">
        {/* Rotating dot grid */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ perspective: 600, transformStyle: "preserve-3d" }}
        >
          <GlobeDots />
        </motion.div>

        {/* Inner highlight */}
        <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-[25%] h-[25%] rounded-full bg-accent/5 blur-2xl" />

        {/* Equator line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border/20" />
        {/* Meridian */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/20" />
      </div>
    </div>
  );
};

/* Generate dot positions for the globe */
const GlobeDots = () => {
  const dots: { x: number; y: number; opacity: number; size: number }[] = [];
  const rows = 18;
  const baseCols = 24;

  for (let row = 0; row < rows; row++) {
    const lat = (row / (rows - 1)) * Math.PI;
    const y = Math.cos(lat) * 0.5 + 0.5;
    const ringRadius = Math.sin(lat);
    const cols = Math.max(1, Math.round(baseCols * ringRadius));

    for (let col = 0; col < cols; col++) {
      const lon = (col / cols) * 2 * Math.PI;
      const x = 0.5 + ringRadius * Math.cos(lon) * 0.45;
      const depth = Math.sin(lon);
      const opacity = 0.15 + Math.max(0, depth) * 0.7;
      const size = 1.5 + Math.max(0, depth) * 1.5;

      dots.push({ x: x * 100, y: y * 100, opacity, size });
    }
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.size * 0.15}
          fill="currentColor"
          className="text-foreground"
          opacity={dot.opacity}
        />
      ))}
    </svg>
  );
};

/* ─── Floating country card ─── */
const CountryCard = ({
  country,
  code,
  delay,
  position,
}: {
  country: string;
  code: string;
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}) => (
  <motion.div
    className="absolute hidden md:flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2.5 shadow-lg z-10"
    style={position}
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
  >
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">New Client From</div>
      <div className="text-sm font-bold text-foreground">{country}</div>
    </div>
    <div className="text-xs font-mono text-muted-foreground bg-muted rounded-md px-2 py-1">{code}</div>
  </motion.div>
);

/* ─── Animated counter ─── */
const AnimatedCounter = ({ target, label, isInView }: { target: number; label: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView || hasRun.current) return;
    hasRun.current = true;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div className="text-center md:text-left">
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">{label}</div>
      <div className="text-3xl md:text-4xl font-extrabold text-foreground tabular-nums">
        {count.toLocaleString("en-US")}
      </div>
    </div>
  );
};

/* ─── Main Section ─── */
const GlobalReachSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { language } = useLanguage();

  const countries = [
    { country: "Japan", code: "JP", position: { top: "5%", right: "0%" } },
    { country: "USA", code: "US", position: { top: "22%", right: "-5%" } },
    { country: "UK", code: "GB", position: { top: "40%", right: "-8%" } },
    { country: "Germany", code: "DE", position: { top: "55%", right: "-3%" } },
    { country: "Brazil", code: "BR", position: { bottom: "18%", right: "5%" } },
    { country: "Australia", code: "AU", position: { bottom: "3%", right: "12%" } },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Subtle curved wave */}
      <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,120 C360,200 720,60 1080,140 C1260,180 1380,100 1440,120 L1440,0 L0,0 Z"
            fill="hsl(var(--primary) / 0.04)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: Text + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary tracking-widest uppercase">
                {language === "bn" ? "গ্লোবাল রিচ" : "Global Reach"}
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {language === "bn" ? (
                <>
                  বিশ্বব্যাপী বিশ্বস্ত
                  <br />
                  <span className="gradient-text italic">ক্লায়েন্টদের পছন্দ।</span>
                </>
              ) : (
                <>
                  Trusted by Leaders
                  <br />
                  <span className="gradient-text italic">Worldwide.</span>
                </>
              )}
            </h2>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-10">
              {language === "bn"
                ? "ঢাকা থেকে দুবাই — আমাদের ক্লায়েন্টরা সারাবিশ্ব থেকে আমাদের সেবায় সন্তুষ্ট।"
                : "From Dhaka to Dubai, clients across continents rely on us to power their digital presence."}
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              <AnimatedCounter
                target={580}
                label={language === "bn" ? "ক্লায়েন্ট" : "Clients"}
                isInView={isInView}
              />
              <AnimatedCounter
                target={12}
                label={language === "bn" ? "দেশ" : "Countries"}
                isInView={isInView}
              />
              <AnimatedCounter
                target={1200}
                label={language === "bn" ? "প্রজেক্ট" : "Projects"}
                isInView={isInView}
              />
            </motion.div>
          </motion.div>

          {/* Right: Globe + Country Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <DottedGlobe />

            {countries.map((c, i) => (
              <CountryCard
                key={c.code}
                country={c.country}
                code={c.code}
                delay={0.5 + i * 0.15}
                position={c.position}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReachSection;
