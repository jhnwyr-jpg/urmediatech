import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Users, DollarSign, BarChart3, ArrowUpRight, Zap, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingElements from "@/components/ui/FloatingElements";
import { MagneticButton, AnimatedText } from "@/components/ui/AnimatedComponents";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

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
              প্রিমিয়াম ডিজাইন এজেন্সি
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
                প্রিমিয়াম ওয়েবসাইট ডিজাইন
              </motion.span>
              প্রিমিয়াম ওয়েবসাইট ডিজাইন
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
                হয়ে গেল
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
                  সহজ
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
              অসাধারণ কনভার্শন-কেন্দ্রিক ল্যান্ডিং পেজের মাধ্যমে আপনার ডিজিটাল উপস্থিতি রূপান্তর করুন যা আপনার দর্শকদের মুগ্ধ করে এবং ফলাফল নিয়ে আসে।
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
                    ডেমো দেখুন
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
                    যোগাযোগ করুন
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
              { number: "১৫০+", label: "প্রজেক্ট", icon: BarChart3 },
              { number: "৯৮%", label: "সন্তুষ্টি", icon: TrendingUp },
              { number: "৫★", label: "রেটিং", icon: Star },
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
                  className="text-2xl md:text-3xl font-bold gradient-text relative"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                >
                  <motion.span
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(139, 92, 246, 0)",
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                        "0 0 0px rgba(139, 92, 246, 0)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {stat.number}
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1"
                  whileHover={{ color: "hsl(var(--primary))" }}
                >
                  <stat.icon className="w-3 h-3 opacity-50" />
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dashboard preview mockup with 3D effect */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.7, type: "spring", stiffness: 50 }}
        whileHover={{ y: -10, rotateX: 5 }}
        className="relative z-10 w-full max-w-4xl mx-auto mt-12 px-6"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* Floating particles around browser */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b'][i % 4]}, ${['#6366f1', '#0ea5e9', '#f43f5e', '#eab308'][i % 4]})`,
              left: `${10 + (i * 12)}%`,
              top: i % 2 === 0 ? '-20px' : 'auto',
              bottom: i % 2 === 1 ? '-20px' : 'auto',
            }}
            animate={{
              y: i % 2 === 0 ? [0, -15, 0] : [0, 15, 0],
              x: [0, (i % 3 - 1) * 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating icons around browser */}
        <motion.div
          className="absolute -left-8 top-1/4 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg"
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <DollarSign className="w-5 h-5 text-white" />
        </motion.div>

        <motion.div
          className="absolute -right-8 top-1/3 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
          animate={{ 
            y: [0, 15, 0], 
            rotate: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <TrendingUp className="w-5 h-5 text-white" />
        </motion.div>

        <motion.div
          className="absolute -left-6 bottom-1/4 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg"
          animate={{ 
            y: [0, 12, 0], 
            x: [0, -5, 0],
            rotate: [0, -8, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Users className="w-4 h-4 text-white" />
        </motion.div>

        <motion.div
          className="absolute -right-6 bottom-1/3 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
          animate={{ 
            y: [0, -12, 0], 
            x: [0, 5, 0],
            rotate: [0, 8, 0],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <Zap className="w-4 h-4 text-white" />
        </motion.div>

        {/* Orbiting ring effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-primary/20 pointer-events-none"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
            <div className="flex gap-1.5">
              <motion.div 
                whileHover={{ scale: 1.3 }}
                className="w-3 h-3 rounded-full bg-destructive/60 cursor-pointer" 
              />
              <motion.div 
                whileHover={{ scale: 1.3 }}
                className="w-3 h-3 rounded-full bg-yellow-500/60 cursor-pointer" 
              />
              <motion.div 
                whileHover={{ scale: 1.3 }}
                className="w-3 h-3 rounded-full bg-green-500/60 cursor-pointer" 
              />
            </div>
            <div className="flex-1 flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground"
              >
                urmedia.tech
              </motion.div>
            </div>
          </div>
          
          {/* Dashboard content with real-looking UI */}
          <div className="p-6 space-y-4 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-sm font-semibold text-foreground"
                >
                  ড্যাশবোর্ড ওভারভিউ
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-xs text-muted-foreground"
                >
                  স্বাগতম, অ্যাডমিন
                </motion.div>
              </div>
              <div className="flex gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-8 px-3 bg-muted/50 rounded-lg flex items-center gap-2 cursor-pointer text-xs text-muted-foreground"
                >
                  <span>গত ৭ দিন</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-8 px-4 gradient-bg rounded-lg flex items-center cursor-pointer text-xs text-white font-medium"
                >
                  এক্সপোর্ট
                </motion.div>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { icon: DollarSign, label: "আয়", value: "৳২৪,৫০০", change: "+১২.৫%", color: "text-green-500" },
                { icon: Users, label: "ভিজিটর", value: "১২,৮৪০", change: "+৮.২%", color: "text-blue-500" },
                { icon: TrendingUp, label: "কনভার্শন", value: "৩.২৪%", change: "+২.১%", color: "text-purple-500" },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border/30 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <motion.div 
                      className="flex items-center gap-0.5 text-xs text-green-500"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </motion.div>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-lg font-bold text-foreground group-hover:gradient-text transition-all">
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom row - Chart and Activity */}
            <div className="flex gap-4 mt-4">
              {/* Mini chart area */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-border/30 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">অ্যানালিটিক্স</span>
                  </div>
                  <Zap className="w-3 h-3 text-yellow-500" />
                </div>
                {/* Animated bar chart */}
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 1.8 + i * 0.1, duration: 0.5, type: "spring" }}
                      className="flex-1 gradient-bg rounded-t-sm opacity-80"
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Activity list */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="w-48 bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-border/30"
              >
                <div className="text-xs font-medium text-foreground mb-3">সাম্প্রতিক কার্যক্রম</div>
                {["নতুন সাইনআপ", "পেমেন্ট প্রাপ্ত", "অর্ডার সম্পন্ন", "রিভিউ পোস্ট"].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 + i * 0.1 }}
                    className="flex items-center gap-2 py-1.5"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                    <span className="text-xs text-muted-foreground truncate">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Animated glow effect */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 -z-10 gradient-bg blur-3xl" 
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div 
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;