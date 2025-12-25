import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Award, Users, Clock, Smile } from "lucide-react";

const stats = [
  { icon: Award, value: 150, suffix: "+", label: "প্রজেক্ট সম্পন্ন" },
  { icon: Users, value: 120, suffix: "+", label: "সন্তুষ্ট ক্লায়েন্ট" },
  { icon: Clock, value: 5, suffix: " বছর", label: "অভিজ্ঞতা" },
  { icon: Smile, value: 98, suffix: "%", label: "ক্লায়েন্ট সন্তুষ্টি" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold gradient-text">
      {count}{suffix}
    </span>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 gradient-bg opacity-10 blur-[100px] rounded-full" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              আমাদের সম্পর্কে
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              কেন বেছে নেবেন <span className="gradient-text">ইউআর মিডিয়া</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              আমরা ডিজাইনার এবং ডেভেলপারদের একটি আবেগী দল যারা অসাধারণ 
              ডিজিটাল অভিজ্ঞতা তৈরি করতে নিবেদিত। আমাদের ফোকাস হল সুন্দর, 
              কার্যকর ওয়েবসাইট প্রদান করা যা ব্যবসা বৃদ্ধিতে সহায়তা করে।
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              বছরের অভিজ্ঞতা এবং উৎকর্ষতার প্রতি প্রতিশ্রুতি নিয়ে, আমরা 
              ধারণাগুলিকে অসাধারণ ডিজিটাল বাস্তবতায় রূপান্তর করি। প্রতিটি প্রজেক্ট 
              বিস্তারিত মনোযোগ এবং ফলাফলের উপর ফোকাস দিয়ে তৈরি করা হয়।
            </p>

            {/* Features list */}
            <div className="mt-8 space-y-4">
              {["পিক্সেল-পারফেক্ট ডিজাইন", "পরিষ্কার, রক্ষণাবেক্ষণযোগ্য কোড", "SEO অপ্টিমাইজড", "মোবাইল রেসপন্সিভ"].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 text-center card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
