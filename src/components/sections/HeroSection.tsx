import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Users, DollarSign, BarChart3, ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingElements from "@/components/ui/FloatingElements";
import { MagneticButton, AnimatedText } from "@/components/ui/AnimatedComponents";
const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-20"
    >
      <FloatingElements />
      
      {/* Animated background orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-bg opacity-10 blur-[150px] rounded-full"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with 3D hover */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotateX: 5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-soft mb-8 cursor-default"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-secondary-foreground">
              Premium Design Agency
            </span>
          </motion.div>

          {/* Headline with zoom and 3D effects */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotateX: -45 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="inline-block"
              style={{ transformStyle: "preserve-3d" }}
            >
              Premium Website Design
            </motion.span>
            <br />
            <span className="relative inline-flex items-center">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="inline-block"
              >
                made
              </motion.span>
              {" "}
              <span className="relative mx-2">
                {/* Decorative swirl behind */}
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
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "center" }}
                  />
                </motion.svg>
                
                {/* Gradient text with zoom effect */}
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 150 }}
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-600 bg-clip-text text-transparent cursor-default inline-block"
                >
                  simple
                </motion.span>
              </span>
              
              {/* Sparkle decorations with staggered animation */}
              {[
                { delay: 1.0, className: "absolute -right-12 -top-4 text-primary", size: "w-4 h-4" },
                { delay: 1.1, className: "absolute -right-8 top-0 text-slate-400", size: "w-3 h-3" },
                { delay: 1.2, className: "absolute -right-6 -top-6 text-primary/60", size: "w-5 h-5" },
              ].map((star, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: star.delay, type: "spring", stiffness: 200 }}
                  className={star.className}
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className={`${star.size} fill-current`} />
                  </motion.div>
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subheadline with word animation */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            <AnimatedText delay={0.6}>
              Transform your digital presence with stunning conversion-focused landing pages that captivate your audience and drive results.
            </AnimatedText>
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton>
              <a href="#projects">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="gradient" size="lg" className="group px-8 relative overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%", skewX: -15 }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <Play className="w-4 h-4 mr-2" />
                    View Demo
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="relative overflow-hidden group">
                    <motion.span
                      className="absolute inset-0 gradient-bg opacity-0 group-hover:opacity-10"
                      transition={{ duration: 0.3 }}
                    />
                    Contact Us
                  </Button>
                </motion.div>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats with counter animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { number: "150+", label: "Projects" },
              { number: "98%", label: "Satisfaction" },
              { number: "5★", label: "Rating" },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="text-2xl md:text-3xl font-bold gradient-text"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
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
                  Dashboard Overview
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-xs text-muted-foreground"
                >
                  Welcome back, Admin
                </motion.div>
              </div>
              <div className="flex gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-8 px-3 bg-muted/50 rounded-lg flex items-center gap-2 cursor-pointer text-xs text-muted-foreground"
                >
                  <span>Last 7 days</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-8 px-4 gradient-bg rounded-lg flex items-center cursor-pointer text-xs text-white font-medium"
                >
                  Export
                </motion.div>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { icon: DollarSign, label: "Revenue", value: "$24,500", change: "+12.5%", color: "text-green-500" },
                { icon: Users, label: "Visitors", value: "12,840", change: "+8.2%", color: "text-blue-500" },
                { icon: TrendingUp, label: "Conversion", value: "3.24%", change: "+2.1%", color: "text-purple-500" },
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
                    <span className="text-xs font-medium text-foreground">Analytics</span>
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
                <div className="text-xs font-medium text-foreground mb-3">Recent Activity</div>
                {["New signup", "Payment received", "Order completed", "Review posted"].map((item, i) => (
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