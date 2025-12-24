import { motion } from "framer-motion";
import logo from "@/assets/logo.ico";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center"
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full gradient-bg blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="relative"
        >
          <motion.img 
            src={logo} 
            alt="UR Media" 
            className="w-24 h-24 invert"
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 0.8
            }}
          />
          
          {/* Glow ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full gradient-bg blur-xl"
          />
        </motion.div>

        {/* Text animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex items-center gap-2"
        >
          <span className="text-2xl font-bold text-white">UR</span>
          <motion.span 
            className="text-2xl font-bold gradient-text"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Media
          </motion.span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full mt-6"
        />

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/50 text-sm mt-4 tracking-widest uppercase"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Experience
          </motion.span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;