import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Zap, BarChart3, User, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AIAgentSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { language } = useLanguage();

  // Multiple messages that cycle
  const messages = language === "bn"
    ? [
        "আমি মেইন হলটি সন্ধ্যা ৭টায় পেয়েছি। আমাদের Tier 2 প্যাকেজ ৳৭৯/জন, ককটেল সহ",
        "আপনার অর্ডারটি কনফার্ম হয়েছে। ডেলিভারি ৩ দিনের মধ্যে হবে ✅",
        "আজকের ভিজিটর সংখ্যা ৩৫০+, গতকালের চেয়ে ১২% বেশি 📊",
        "নতুন লিড পেয়েছেন রাহুল থেকে। তিনি ই-কমার্স ওয়েবসাইট চান 🔔",
        "আপনার সাইটের স্পিড স্কোর ৯৮/১০০, পারফরম্যান্স চমৎকার ⚡",
      ]
    : [
        "I have the Main Hall available at 7pm. We have a Tier 2 package at $79pp including cocktails",
        "Your order has been confirmed. Delivery will be within 3 business days ✅",
        "Today's visitor count: 350+, that's 12% more than yesterday 📊",
        "New lead received from Rahul. He's looking for an e-commerce website 🔔",
        "Your site speed score: 98/100, performance is excellent ⚡",
      ];

  const [displayText, setDisplayText] = useState("");
  const [latency, setLatency] = useState(24);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const currentMsg = messages[msgIndex];
    setDisplayText("");

    const typeInterval = setInterval(() => {
      if (i < currentMsg.length) {
        setDisplayText(currentMsg.slice(0, i + 1));
        i++;
        setLatency(Math.floor(Math.random() * 15) + 18);
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2500);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [isInView, msgIndex, language]);

  // Audio wave animation
  const AudioWave = () => (
    <div className="flex items-end gap-[3px] h-8">
      {[0.5, 0.9, 0.6, 1, 0.4].map((scale, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          animate={isInView ? {
            height: ["6px", `${scale * 32}px`, "6px"],
          } : {}}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <section ref={ref} className="py-24 md:py-36 bg-background overflow-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pt-4 lg:pt-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary">
                {language === "bn" ? "পারফরম্যান্স বেঞ্চমার্ক" : "Performance Benchmarks"}
              </span>
            </motion.div>

            {/* Large Heading - matching reference sizing */}
            <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.2rem] font-bold leading-[1.05] mb-10 text-foreground tracking-[-0.02em]">
              {language === "bn" ? (
                <>
                  পারফরম্যান্সের
                  <br />
                  <span className="text-primary">নতুন স্ট্যান্ডার্ড।</span>
                </>
              ) : (
                <>
                  The New Standard
                  <br />
                  <span className="text-primary">of Performance.</span>
                </>
              )}
            </h2>

            {/* Subtitle label */}
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              {language === "bn" ? "কেন আমাদের AI Agent" : "Why Our AI Wins"}
            </p>

            {/* Description - matching reference paragraph style */}
            <p className="text-base text-muted-foreground leading-[1.8] max-w-md">
              {language === "bn"
                ? "সাধারণ এজেন্সি সময় বিক্রি করে। সফটওয়্যার কোম্পানি টুলস বিক্রি করে। আমরা ফলাফল বিক্রি করি। দেখুন কেন শীর্ষ ১% ব্যবসা আমাদের AI Agent ব্যবহার করছে।"
                : "Traditional agencies sell hours. Software companies sell tools. We sell outcomes. See why the top 1% of businesses are switching to our AI Agent ecosystem."}
            </p>
          </motion.div>

          {/* Right - Live Interaction Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[420px]">
              {/* Card */}
              <motion.div
                className="bg-card rounded-2xl shadow-2xl shadow-foreground/5 border border-border/60 p-7 relative"
                animate={isInView ? { y: [0, -8, 0] } : {}}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                      {language === "bn" ? "লাইভ ইন্টারঅ্যাকশন" : "Live Interaction"}
                    </span>
                  </div>
                  <motion.span
                    className="text-[10px] font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
                    key={latency}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                  >
                    Latency: {latency}ms
                  </motion.span>
                </div>

                {/* Icons Row - wider spacing like reference */}
                <div className="flex items-center justify-between px-8 mb-8">
                  {/* Client Icon */}
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {language === "bn" ? "ক্লায়েন্ট" : "Client"}
                    </span>
                  </motion.div>

                  {/* Audio Wave */}
                  <AudioWave />

                  {/* AI Agent Icon */}
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-primary">
                      AI Agent
                    </span>
                  </motion.div>
                </div>

                {/* Chat Bubble - larger, centered text like reference */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                  className="bg-muted/40 rounded-xl p-5 border border-border/50"
                >
                  <p className="text-[15px] text-foreground font-medium leading-relaxed text-center min-h-[3.5rem]">
                    "{displayText}
                    <motion.span
                      className="inline-block w-[2px] h-5 bg-primary ml-0.5 align-middle rounded-full"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.53, repeat: Infinity }}
                    />
                    "
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentSection;
