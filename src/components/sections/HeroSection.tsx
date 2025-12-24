import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star } from "lucide-react";
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
          
          {/* Dashboard content with shimmer effect */}
          <div className="p-6 space-y-4 relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-4 w-32 bg-muted rounded" 
                />
                <div className="h-3 w-24 bg-muted/50 rounded" />
              </div>
              <div className="flex gap-2">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-8 w-20 bg-primary/20 rounded-md cursor-pointer" 
                />
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-8 w-20 gradient-bg rounded-md cursor-pointer" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-muted/30 rounded-xl p-4 space-y-3 cursor-pointer"
                >
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-6 w-20 bg-primary/20 rounded" />
                  <div className="h-2 w-full bg-muted/50 rounded" />
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex-1 bg-muted/30 rounded-xl p-4 h-32 cursor-pointer" 
              />
              <div className="w-48 bg-muted/30 rounded-xl p-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
                    className="h-3 bg-muted/50 rounded" 
                  />
                ))}
              </div>
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