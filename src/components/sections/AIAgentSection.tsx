import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Bot, Zap, BarChart3, User, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AIAgentSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { language } = useLanguage();

  // Typing animation state
  const [displayText, setDisplayText] = useState("");
  const [latency, setLatency] = useState(24);
  const fullText = language === "bn"
    ? "আমি আপনার ওয়েবসাইটের জন্য সাহায্য করতে পারি..."
    : "I can help optimize your website...";

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    setDisplayText("");
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
        setLatency(Math.floor(Math.random() * 15) + 18);
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [isInView, fullText]);

  // Audio wave animation
  const AudioWave = () => (
    <div className="flex items-end gap-[3px] h-8">
      {[0.6, 1, 0.7, 1, 0.5].map((scale, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={isInView ? {
            height: ["8px", `${scale * 28}px`, "8px"],
          } : {}}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                {language === "bn" ? "এআই পারফরম্যান্স" : "AI Performance"}
              </span>
            </motion.div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-foreground">
              {language === "bn" ? (
                <>
                  আপনার ওয়েবসাইটে{" "}
                  <span className="text-primary">AI Agent</span>{" "}
                  যুক্ত করুন
                </>
              ) : (
                <>
                  Add{" "}
                  <span className="text-primary">AI Agent</span>{" "}
                  to Your Website
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
              {language === "bn" ? "কেন AI Agent দরকার" : "Why AI Agent Matters"}
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
              {language === "bn"
                ? "সাধারণ চ্যাটবট নয়, আমরা স্মার্ট AI Agent তৈরি করি যা আপনার ব্যবসার প্রয়োজন বুঝে কাস্টমারদের সাথে কথা বলে। ২৪/৭ সাপোর্ট, লিড জেনারেশন, এবং কাস্টমার এক্সপেরিয়েন্স — সব এক জায়গায়।"
                : "Not just chatbots — we build smart AI Agents that understand your business and talk to customers naturally. 24/7 support, lead generation, and customer experience — all in one place."}
            </p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex gap-8 mt-8"
            >
              {[
                { value: "24/7", label: language === "bn" ? "সাপোর্ট" : "Support" },
                { value: "3x", label: language === "bn" ? "বেশি লিড" : "More Leads" },
                { value: "<1s", label: language === "bn" ? "রেসপন্স" : "Response" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Live Interaction Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              {/* Card */}
              <motion.div
                className="bg-card rounded-2xl shadow-xl border border-border p-6 relative"
                animate={isInView ? { y: [0, -6, 0] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                      {language === "bn" ? "লাইভ ইন্টারঅ্যাকশন" : "Live Interaction"}
                    </span>
                  </div>
                  <motion.span
                    className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                    key={latency}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                  >
                    Latency: {latency}ms
                  </motion.span>
                </div>

                {/* Icons Row */}
                <div className="flex items-center justify-center gap-8 mb-6">
                  {/* Client Icon */}
                  <motion.div
                    className="flex flex-col items-center gap-1.5"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {language === "bn" ? "ক্লায়েন্ট" : "Client"}
                    </span>
                  </motion.div>

                  {/* Audio Wave */}
                  <AudioWave />

                  {/* AI Agent Icon */}
                  <motion.div
                    className="flex flex-col items-center gap-1.5"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-primary">
                      AI Agent
                    </span>
                  </motion.div>
                </div>

                {/* Chat Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                  className="bg-muted/50 rounded-xl p-4 border border-border"
                >
                  <p className="text-sm text-foreground font-medium min-h-[2.5rem]">
                    "{displayText}
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                    "
                  </p>
                </motion.div>

                {/* Activity Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2 }}
                  className="flex items-center gap-2 mt-4"
                >
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">
                    {language === "bn" ? "AI Agent সক্রিয় আছে" : "AI Agent is active"}
                  </span>
                </motion.div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.4 }}
                className="relative -mt-2 ml-4"
              >
                <div className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 shadow-md">
                  <BarChart3 className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-foreground">
                    {language === "bn" ? "৯৮% সন্তুষ্টি" : "98% Satisfaction"}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentSection;
