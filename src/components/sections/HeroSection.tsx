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
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            background: [
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 80% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 40% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 will-change-[background]"
        />
      </div>

      {/* Animated noise texture overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        animate={{ opacity: [0.015, 0.025, 0.015] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Multiple animated background orbs with parallax */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 0.1,
          scale: [1, 1.15, 1],
          rotate: [0, 180, 360],
        }}
        style={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-bg blur-[150px] rounded-full will-change-transform"
      />
      
      {/* Secondary orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          scale: [1.2, 1, 1.2],
          x: [0, 100, 0],
        }}
        style={{
          x: mousePosition.x * -1.5,
          y: mousePosition.y * -1.5,
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-[100px] rounded-full will-change-transform"
      />
      
      {/* Tertiary orb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          scale: [1, 1.2, 1],
          y: [0, -50, 0],
        }}
        style={{
          x: mousePosition.x * 1,
          y: mousePosition.y * 1,
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 0.5 }}
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-[80px] rounded-full will-change-transform"
      />

      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.25, 0.1],
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 10 + i * 2, 
            repeat: Infinity, 
            delay: i * 0.3,
            ease: "linear" 
          }}
        >
          <div 
            className={`${i % 2 === 0 ? 'rounded-full' : 'rotate-45'} border border-primary/20`}
            style={{ width: 16 + i * 8, height: 16 + i * 8 }}
          />
        </motion.div>
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with 3D hover and glow */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 15px 30px -10px rgba(139, 92, 246, 0.25)",
            }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-soft mb-8 cursor-default relative overflow-hidden group will-change-transform"
          >
            {/* Badge shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent will-change-transform"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
            />
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity, ease: "linear" }
              }}
              className="will-change-transform"
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
                className="absolute w-1 h-1 rounded-full bg-primary/40 will-change-transform"
                animate={{
                  x: [0, 8, 0],
                  y: [0, -4, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "linear",
                }}
                style={{ left: `${30 + i * 20}%`, top: "50%" }}
              />
            ))}
          </motion.div>

          {/* Headline with enhanced zoom and 3D effects */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900 relative will-change-transform"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="inline-block relative will-change-transform"
            >
              {/* Text glow effect */}
              <motion.span
                className="absolute inset-0 blur-2xl opacity-30 gradient-text"
                animate={{ opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                {t("hero.title1")}
              </motion.span>
              {t("hero.title1")}
            </motion.span>
            <br />
            <span className="relative inline-flex items-center">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                className="inline-block will-change-transform"
                whileHover={{ scale: 1.03 }}
              >
                {t("hero.title2")}
              </motion.span>
              {" "}
              <span className="relative mx-2">
                {/* Enhanced decorative swirl */}
                <motion.svg
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 w-20 h-20 text-primary/30 will-change-transform"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <motion.path 
                    d="M50 0C60 20 80 30 100 50C80 70 60 80 50 100C40 80 20 70 0 50C20 30 40 20 50 0Z"
                    animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                    transition={{ 
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "linear" }
                    }}
                    style={{ transformOrigin: "center" }}
                  />
                </motion.svg>
                
                {/* Gradient text with enhanced effects */}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: "0 0 25px rgba(139, 92, 246, 0.4)",
                  }}
                  className="relative z-10 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600 bg-clip-text text-transparent cursor-pointer inline-block will-change-transform"
                >
                  {t("hero.title3")}
                  {/* Underline animation on hover */}
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.span>
              </span>
              
              {/* Enhanced sparkle decorations */}
              {[
                { delay: 0.6, className: "absolute -right-12 -top-4 text-primary", size: "w-4 h-4" },
                { delay: 0.65, className: "absolute -right-8 top-0 text-slate-400", size: "w-3 h-3" },
                { delay: 0.7, className: "absolute -right-6 -top-6 text-primary/60", size: "w-5 h-5" },
                { delay: 0.75, className: "absolute -right-16 top-2 text-cyan-400", size: "w-2 h-2" },
              ].map((star, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: star.delay, duration: 0.3, ease: "easeOut" }}
                  className={`${star.className} will-change-transform`}
                >
                  <motion.div
                    animate={{ 
                      rotate: 360, 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className={`${star.size} fill-current drop-shadow-lg`} />
                  </motion.div>
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subheadline with enhanced animation */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 relative"
          >
            <AnimatedText delay={0.3}>
              {t("hero.subtitle")}
            </AnimatedText>
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton>
              <a href="#projects">
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  className="relative will-change-transform"
                >
                  {/* Button glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-lg blur-lg opacity-0 group-hover:opacity-40 will-change-[opacity]"
                    animate={{ opacity: [0.25, 0.4, 0.25] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <Button variant="gradient" size="lg" className="group px-8 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 will-change-transform"
                      initial={{ x: "-100%", skewX: -15 }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="mr-2 will-change-transform"
                    >
                      <Play className="w-4 h-4" />
                    </motion.span>
                    {t("hero.demo")}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="will-change-transform"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.span>
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="will-change-transform">
                  <Button variant="outline" size="lg" className="relative overflow-hidden group border-2">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-cyan-500/0 will-change-transform"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
                    />
                    {t("hero.contact")}
                    <motion.span
                      className="ml-2 will-change-transform"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { number: "150+", label: t("hero.projects"), icon: BarChart3 },
              { number: "98%", label: t("hero.satisfaction"), icon: TrendingUp },
              { number: "5★", label: t("hero.rating"), icon: Star },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center relative group cursor-pointer will-change-transform"
                whileHover={{ scale: 1.1, y: -6 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
              >
                {/* Stat glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl"
                  transition={{ duration: 0.2 }}
                />
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.08, duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2 will-change-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.4 }}
                  >
                    <stat.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <motion.p 
                    className="text-2xl md:text-3xl font-bold text-foreground"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.4, ease: "linear" }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Premium Dashboard Preview - Floating Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="container mx-auto px-6 mt-16 relative z-10"
      >
        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="max-w-5xl mx-auto relative will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        >
          {/* Card glow effect */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl will-change-[opacity]"
            animate={{ opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Dashboard Card */}
          <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent will-change-transform"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
            />
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center will-change-transform"
                >
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{t("hero.dashboard")}</h3>
                  <p className="text-xs text-muted-foreground">{t("hero.welcome")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("hero.last7days")}</span>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium"
                >
                  {t("hero.export")}
                </motion.button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 p-6">
              {[
                { label: t("hero.revenue"), value: "$24,500", change: "+12.5%", icon: DollarSign, color: "from-green-500 to-emerald-600" },
                { label: t("hero.visitors"), value: "12,450", change: "+8.2%", icon: Users, color: "from-blue-500 to-cyan-600" },
                { label: t("hero.conversion"), value: "3.2%", change: "+2.1%", icon: TrendingUp, color: "from-violet-500 to-purple-600" },
                { label: t("hero.analytics"), value: "89%", change: "+5.4%", icon: BarChart3, color: "from-orange-500 to-amber-600" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-muted/50 rounded-xl p-4 relative overflow-hidden group cursor-pointer will-change-transform"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color}`}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <motion.div 
                      whileHover={{ rotate: 12 }}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-xs text-green-500 font-medium flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <motion.p 
                    className="text-xl font-bold text-foreground"
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Activity Section */}
            <div className="px-6 pb-6">
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-foreground">{t("hero.recentActivity")}</h4>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                </div>
                <div className="space-y-3">
                  {[
                    { action: t("hero.activity1"), time: "2m ago", color: "bg-blue-500" },
                    { action: t("hero.activity2"), time: "5m ago", color: "bg-green-500" },
                    { action: t("hero.activity3"), time: "12m ago", color: "bg-violet-500" },
                    { action: t("hero.activity4"), time: "25m ago", color: "bg-amber-500" },
                  ].map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.08, duration: 0.3, ease: "easeOut" }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 cursor-pointer will-change-transform"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "linear" }}
                        className={`w-2 h-2 rounded-full ${activity.color}`} 
                      />
                      <span className="text-sm text-foreground flex-1">{activity.action}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <span className="text-xs text-muted-foreground">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-1.5 h-3 rounded-full bg-primary will-change-transform"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
