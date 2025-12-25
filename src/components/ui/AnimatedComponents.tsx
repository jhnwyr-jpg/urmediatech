import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

// Hook to check if we're on mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  type?: "words" | "chars" | "zoom";
}

export const AnimatedText = ({ children, className = "", delay = 0, type = "words" }: AnimatedTextProps) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  // On mobile, trigger animation immediately; on desktop, use scroll-based
  const isInView = useInView(ref, { once: true, margin: isMobile ? "100px" : "-50px" });

  if (type === "zoom") {
    return (
      <motion.span
        ref={ref}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.span>
    );
  }

  if (type === "chars") {
    return (
      <span ref={ref} className={className}>
        {children.split("").map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -90 }}
            transition={{ duration: 0.4, delay: delay + i * 0.03 }}
            className="inline-block"
            style={{ transformOrigin: "bottom" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.4, delay: delay + i * 0.1 }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  // On mobile, use larger margin to trigger animations earlier/immediately
  const isInView = useInView(ref, { once: true, margin: isMobile ? "50px" : "-100px" });

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface Card3DProps {
  children: ReactNode;
  className?: string;
}

export const Card3D = ({ children, className = "" }: Card3DProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

export const MagneticButton = ({ children, className = "" }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
};