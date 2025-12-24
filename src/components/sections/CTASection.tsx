import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to transform your digital presence?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join hundreds of businesses that trust UR Media for their web design needs. 
            Let's create something amazing together.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#contact">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;