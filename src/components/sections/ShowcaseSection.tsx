import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Eye, MousePointer, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ShowcaseSection = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isInView2 = useInView(ref2, { once: true, margin: "-100px" });
  const isInView3 = useInView(ref3, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <>
      {/* Perspective Grid Section - Reduced height */}
      <section className="relative h-[200px] perspective-grid bg-background overflow-hidden">
        {/* Decorative lines going up with animation */}
        {[
          { left: "25%", height: "160px", delay: 0 },
          { left: "50%", height: "192px", delay: 0.2 },
          { left: "75%", height: "144px", delay: 0.4 },
        ].map((line, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: line.height, opacity: 1 }}
            transition={{ duration: 1, delay: line.delay, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute bottom-0 w-px bg-gradient-to-t from-primary/40 to-transparent"
            style={{ left: line.left }}
          />
        ))}
        
        {/* Corner decorations */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          viewport={{ once: true }}
          className="absolute top-8 left-20 w-4 h-4 border-l-2 border-t-2 border-primary/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          viewport={{ once: true }}
          className="absolute top-8 right-20 w-4 h-4 border-r-2 border-t-2 border-primary/40"
        />
      </section>

      {/* Light Purple Section */}
      <section ref={ref} className="gradient-section-light py-24 relative overflow-hidden">
        {/* Floating background elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature Card */}
            <motion.div
              initial={{ opacity: 0, x: -80, rotateY: -15 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -80, rotateY: -15 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/30 relative overflow-hidden group"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "200%" } : { x: "-100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              {/* Glow on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10"
              />

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shadow-lg"
                >
                  <Eye className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.4 }}
                    className="font-bold text-xl"
                  >
                    {t("showcase.pixelPerfect")}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground text-sm"
                  >
                    {t("showcase.everyDetail")}
                  </motion.p>
                </div>
              </div>
              
              {/* Mock interface with loading animation */}
              <div className="space-y-3 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer group/item"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 rounded-full gradient-bg" 
                  />
                  <div className="flex-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "6rem" } : { width: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="h-3 bg-muted rounded" 
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    {t("showcase.justNow")}
                  </motion.div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="w-8 h-8 rounded-full bg-secondary" 
                  />
                  <div className="flex-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "8rem" } : { width: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="h-3 bg-muted/50 rounded" 
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-xs text-muted-foreground"
                  >
                    {t("showcase.2mAgo")}
                  </motion.div>
                </motion.div>
              </div>

              {/* Floating sparkle */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-4 right-4 text-primary/30"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.4 }}
              >
                {t("showcase.seeWorking")}{" "}
                <motion.span 
                  className="gradient-text inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  {t("showcase.optimize")}
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7 }}
              >
                {t("showcase.seeWorkingDesc")}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purple Gradient Section */}
      <section ref={ref2} className="gradient-section-purple py-24 relative text-primary-foreground overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={isInView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
            >
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 0.2 }}
              >
                {t("showcase.measureSuccess")}
              </motion.h2>
              <motion.p 
                className="text-primary-foreground/80 text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                {t("showcase.measureSuccessDesc")}
              </motion.p>
              <ul className="space-y-3">
                {[t("showcase.track1"), t("showcase.track2"), t("showcase.track3")].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={isInView2 ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                      className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                    </motion.div>
                    <span className="text-primary-foreground/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, rotateY: 15 }}
              animate={isInView2 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 80, rotateY: 15 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20 relative overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={isInView2 ? { x: "200%" } : { x: "-100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TrendingUp className="w-6 h-6" />
                </motion.div>
                <span className="font-semibold">{t("showcase.performanceOverview")}</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">{t("showcase.conversionRate")}</span>
                  <motion.span 
                    className="font-bold"
                    initial={{ opacity: 0 }}
                    animate={isInView2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    12.4%
                  </motion.span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView2 ? { width: "75%" } : { width: 0 }}
                    transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary-foreground rounded-full" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">{t("showcase.pageViews")}</span>
                  <motion.span 
                    className="font-bold"
                    initial={{ opacity: 0 }}
                    animate={isInView2 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1 }}
                  >
                    24,521
                  </motion.span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isInView2 ? { width: "83%" } : { width: 0 }}
                    transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary-foreground rounded-full" 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dark Section */}
      <section ref={ref3} className="gradient-section-dark py-24 relative text-primary-foreground overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-20 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView3 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="inline-block mb-6"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MousePointer className="w-10 h-10" />
              </motion.div>
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {t("showcase.intuitive")}{" "}
              <motion.span 
                className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                style={{ display: "inline-block" }}
              >
                {t("showcase.userExperience")}
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-primary-foreground/70 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              {t("showcase.intuitiveDesc")}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ShowcaseSection;
