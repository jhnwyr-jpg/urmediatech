import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t("testimonials.name1"),
      role: t("testimonials.role1"),
      content: t("testimonials.content1"),
      avatar: t("testimonials.name1").charAt(0),
      color: "from-violet-500 to-purple-600",
    },
    {
      name: t("testimonials.name2"),
      role: t("testimonials.role2"),
      content: t("testimonials.content2"),
      avatar: t("testimonials.name2").charAt(0),
      color: "from-cyan-500 to-blue-600",
    },
    {
      name: t("testimonials.name3"),
      role: t("testimonials.role3"),
      content: t("testimonials.content3"),
      avatar: t("testimonials.name3").charAt(0),
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#0f0a2e]">
      {/* Premium background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1045] via-[#0f0a2e] to-[#0a0520]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Trust badge with premium styling */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-white/70 text-sm uppercase tracking-widest">
              {t("testimonials.badge")}
            </span>
          </motion.div>
          
          {/* Animated stars */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Star className="w-7 h-7 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                </motion.div>
              </motion.div>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white/60 text-lg"
          >
            <span className="text-white font-semibold">4.9</span> {t("testimonials.rating")}{" "}
            <span className="text-white font-semibold">200+</span> {t("testimonials.reviews")}
          </motion.p>
        </motion.div>

        {/* Testimonial Cards with slide-in effect */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.name} 
              testimonial={testimonial} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Premium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 1.1, type: "spring" }}
          >
            {t("testimonials.join")}{" "}
            <motion.span
              className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              120+
            </motion.span>{" "}
            {t("testimonials.happyClients")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.3 }}
            className="text-white/50 text-xl"
          >
            {t("testimonials.plus")}{" "}
            <motion.span 
              className="text-white font-semibold"
              whileHover={{ scale: 1.1 }}
              style={{ display: "inline-block" }}
            >
              {t("testimonials.you")}
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial, index, isInView }: { testimonial: any; index: number; isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -15 : 15 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -15 : 15 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.2, type: "spring", stiffness: 50 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
      style={{ perspective: "1000px" }}
    >
      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={`absolute -inset-1 bg-gradient-to-r ${testimonial.color} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
      />
      
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden h-full">
        {/* Quote icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 0.1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.5 + index * 0.2 }}
          className="absolute top-4 right-4"
        >
          <Quote className="w-16 h-16 text-white" />
        </motion.div>
        
        {/* Avatar and info */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center font-bold text-xl text-white shadow-lg`}
          >
            {testimonial.avatar}
          </motion.div>
          <div>
            <motion.p 
              className="font-semibold text-lg text-white"
              whileHover={{ x: 3 }}
            >
              {testimonial.name}
            </motion.p>
            <p className="text-white/50 text-sm">{testimonial.role}</p>
          </div>
        </div>
        
        {/* Content */}
        <motion.p 
          className="text-white/80 leading-relaxed relative z-10 text-base"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6 + index * 0.2 }}
        >
          "{testimonial.content}"
        </motion.p>
        
        {/* Bottom gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.color}`}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
