import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Users, DollarSign, BarChart3, ArrowUpRight, Zap, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingElements from "@/components/ui/FloatingElements";
import { MagneticButton, AnimatedText } from "@/components/ui/AnimatedComponents";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useLanguage();

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <FloatingElements />
      
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 80% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 40% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Animated noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        animate={{ opacity: [0.015, 0.025, 0.015] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Multiple animated background orbs with parallax */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        style={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-bg opacity-10 blur-[150px] rounded-full"
      />
      
      {/* Secondary orb */}
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, 100, 0],
        }}
        style={{
          x: mousePosition.x * -1.5,
          y: mousePosition.y * -1.5,
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-[100px] rounded-full"
      />
      
      {/* Tertiary orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          y: [0, -50, 0],
        }}
        style={{
          x: mousePosition.x * 1,
          y: mousePosition.y * 1,
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-[80px] rounded-full"
      />

      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 8 + i * 2, 
            repeat: Infinity, 
            delay: i * 0.5,
            ease: "easeInOut" 
          }}
        >
          <div 
            className={`w-${4 + i * 2} h-${4 + i * 2} ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'} border border-primary/20`}
            style={{ width: 16 + i * 8, height: 16 + i * 8 }}
          />
        </motion.div>
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with 3D hover and glow */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ 
              scale: 1.08, 
              rotateX: 5,
              boxShadow: "0 20px 40px -15px rgba(139, 92, 246, 0.3)",
            }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft mb-8 cursor-default relative overflow-hidden group"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Badge shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-secondary-foreground tracking-wide relative z-10">
              {t("hero.badge")}
            </span>
            {/* Floating particles inside badge */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/40"
                animate={{
                  x: [0, 10, 0],
                  y: [0, -5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{ left: `${30 + i * 20}%`, top: "50%" }}
              />
            ))}
          </motion.div>

          {/* Headline with enhanced zoom and 3D effects */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900 relative"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotateX: -45 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="inline-block relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Text glow effect */}
              <motion.span
                className="absolute inset-0 blur-2xl opacity-30 gradient-text"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {t("hero.title1")}
              </motion.span>
              {t("hero.title1")}
            </motion.span>
            <br />
            <span className="relative inline-flex items-center">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-block"
                whileHover={{ scale: 1.05 }}
              >
                {t("hero.title2")}
              </motion.span>
              {" "}
              <span className="relative mx-2">
                {/* Enhanced decorative swirl */}
                <motion.svg
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 w-20 h-20 text-primary/30"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <motion.path 
                    d="M50 0C60 20 80 30 100 50C80 70 60 80 50 100C40 80 20 70 0 50C20 30 40 20 50 0Z"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    style={{ transformOrigin: "center" }}
                  />
                </motion.svg>
                
                {/* Gradient text with enhanced effects */}
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 150 }}
                  whileHover={{ 
                    scale: 1.15,
                    textShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
                  }}
                  className="relative z-10 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600 bg-clip-text text-transparent cursor-pointer inline-block"
                >
                  {t("hero.title3")}
                  {/* Underline animation on hover */}
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </span>
              
              {/* Enhanced sparkle decorations */}
              {[
                { delay: 1.0, className: "absolute -right-12 -top-4 text-primary", size: "w-4 h-4" },
                { delay: 1.1, className: "absolute -right-8 top-0 text-slate-400", size: "w-3 h-3" },
                { delay: 1.2, className: "absolute -right-6 -top-6 text-primary/60", size: "w-5 h-5" },
                { delay: 1.3, className: "absolute -right-16 top-2 text-cyan-400", size: "w-2 h-2" },
              ].map((star, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: star.delay, type: "spring", stiffness: 200 }}
                  className={star.className}
                >
                  <motion.div
                    animate={{ 
                      rotate: 360, 
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className={`${star.size} fill-current drop-shadow-lg`} />
                  </motion.div>
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subheadline with enhanced animation */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 relative"
          >
            <AnimatedText delay={0.6}>
              {t("hero.subtitle")}
            </AnimatedText>
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton>
              <a href="#projects">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Button glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg blur-lg opacity-0 group-hover:opacity-50"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Button variant="gradient" size="lg" className="group px-8 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      initial={{ x: "-100%", skewX: -15 }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Play className="w-4 h-4" />
                    </motion.span>
                    {t("hero.demo")}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.span>
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="relative overflow-hidden group border-2">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-cyan-500/0"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                    />
                    {t("hero.contact")}
                    <motion.span
                      className="ml-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MousePointer2 className="w-4 h-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats with enhanced counter animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { number: "১৫০+", numberEn: "150+", labelKey: "hero.projects", icon: BarChart3 },
              { number: "৯৮%", numberEn: "98%", labelKey: "hero.satisfaction", icon: TrendingUp },
              { number: "৫★", numberEn: "5★", labelKey: "hero.rating", icon: Star },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center relative group cursor-pointer"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Stat glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl"
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.15, type: "spring" }}
                >
                  {/* Floating icon */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="mx-auto mb-2"
                  >
                    <stat.icon className="w-5 h-5 text-primary/60 mx-auto" />
                  </motion.div>
                  <motion.p 
                    className="text-2xl md:text-3xl font-bold gradient-text"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.numberEn}
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(stat.labelKey)}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Premium Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 1, type: "spring", stiffness: 50 }}
        className="w-full max-w-5xl mx-auto mt-20 px-6 relative z-10"
      >
        {/* Dashboard container with enhanced effects */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
          }}
        >
          {/* Glow effect behind dashboard */}
          <motion.div
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-cyan-600/30 rounded-3xl blur-2xl"
          />
          
          {/* Main dashboard card */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
            {/* Browser-like header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-b border-slate-200/50">
              <div className="flex gap-1.5">
                <motion.div 
                  whileHover={{ scale: 1.3 }}
                  className="w-3 h-3 rounded-full bg-red-400"
                />
                <motion.div 
                  whileHover={{ scale: 1.3 }}
                  className="w-3 h-3 rounded-full bg-yellow-400"
                />
                <motion.div 
                  whileHover={{ scale: 1.3 }}
                  className="w-3 h-3 rounded-full bg-green-400"
                />
              </div>
              <div className="flex-1 flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-1 bg-white rounded-md text-xs text-slate-400 border border-slate-200/50"
                >
                  dashboard.urmedia.com
                </motion.div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                    className="text-xl font-semibold text-slate-800"
                  >
                    {t("hero.dashboard")}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                    className="text-sm text-slate-500"
                  >
                    {t("hero.welcome")}
                  </motion.p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    {t("hero.last7days")}
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 bg-violet-600 rounded-lg text-xs text-white cursor-pointer hover:bg-violet-700 transition-colors"
                  >
                    {t("hero.export")}
                  </motion.div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { labelKey: "hero.revenue", value: "৳২৫,৪৫০", valueEn: "$25,450", change: "+12%", icon: DollarSign, color: "from-violet-500 to-purple-600" },
                  { labelKey: "hero.visitors", value: "১২,৮৪৫", valueEn: "12,845", change: "+8%", icon: Users, color: "from-cyan-500 to-blue-600" },
                  { labelKey: "hero.conversion", value: "৩.২%", valueEn: "3.2%", change: "+5%", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
                  { labelKey: "hero.analytics", value: "৯৮.৫%", valueEn: "98.5%", change: "+2%", icon: BarChart3, color: "from-amber-500 to-orange-600" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative p-4 bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer group overflow-hidden"
                  >
                    {/* Hover gradient */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
                    />
                    
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}
                      >
                        <stat.icon className="w-4 h-4 text-white" />
                      </motion.div>
                      <motion.span 
                        className="text-xs text-green-600 font-medium flex items-center gap-0.5"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.change}
                      </motion.span>
                    </div>
                    <motion.p 
                      className="text-2xl font-bold text-slate-800 relative z-10"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {stat.valueEn}
                    </motion.p>
                    <p className="text-sm text-slate-500 relative z-10">{t(stat.labelKey)}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 }}
                className="relative h-48 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 p-4 overflow-hidden"
              >
                {/* Animated chart bars */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 h-32">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 2 + i * 0.1, duration: 0.8, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="flex-1 bg-gradient-to-t from-violet-600 to-purple-400 rounded-t-md cursor-pointer relative group"
                    >
                      {/* Tooltip on hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap"
                      >
                        {height}%
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Animated gradient line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <motion.path
                    d="M0,120 Q50,100 100,80 T200,60 T300,40 T400,30"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 2.5, duration: 1.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Activity feed */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="p-4 bg-slate-50/80 rounded-xl">
                  <h4 className="text-sm font-medium text-slate-600 mb-3">{t("hero.recentActivity")}</h4>
                  <div className="space-y-2">
                    {[
                      { textKey: "hero.activity1", time: "2m ago", color: "bg-green-500" },
                      { textKey: "hero.activity2", time: "5m ago", color: "bg-violet-500" },
                      { textKey: "hero.activity3", time: "12m ago", color: "bg-cyan-500" },
                      { textKey: "hero.activity4", time: "25m ago", color: "bg-amber-500" },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.4 + i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 text-sm cursor-pointer"
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          className={`w-2 h-2 rounded-full ${activity.color}`} 
                        />
                        <span className="text-slate-600">{t(activity.textKey)}</span>
                        <span className="text-slate-400 text-xs ml-auto">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-slate-600">Quick Actions</h4>
                    <motion.div
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Zap className="w-4 h-4 text-violet-500" />
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Create", "Import", "Export", "Share"].map((action, i) => (
                      <motion.div
                        key={action}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.6 + i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-white rounded-lg text-sm text-slate-600 text-center cursor-pointer hover:bg-violet-100 hover:text-violet-700 transition-colors border border-slate-100"
                      >
                        {action}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Floating elements around dashboard */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center"
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg flex items-center justify-center"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;