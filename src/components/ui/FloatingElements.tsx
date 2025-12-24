import { motion } from "framer-motion";

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large gradient blob - top right */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full gradient-bg opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Medium violet dot - left */}
      <motion.div
        className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-primary"
        animate={{
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Small dot - right side */}
      <motion.div
        className="absolute top-1/3 right-20 w-3 h-3 rounded-full bg-primary opacity-50"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Tiny dot - bottom left */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-primary opacity-40"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Cross/Plus shape - right */}
      <motion.div
        className="absolute top-1/2 right-1/4 opacity-30"
        animate={{
          rotate: [0, 90, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      
      {/* Ring - bottom right */}
      <motion.div
        className="absolute bottom-1/3 right-10 w-8 h-8 rounded-full border-2 border-primary opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      {/* Gradient blob - bottom left */}
      <motion.div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full gradient-bg opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default FloatingElements;
