import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    content: "UR Media transformed our online presence. The designs are stunning and conversions have increased significantly.",
    avatar: "S",
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content: "Working with UR Media was a game-changer. Professional, fast, and the results speak for themselves.",
    avatar: "M",
  },
  {
    name: "Emily Roberts",
    role: "E-commerce Owner",
    content: "Best investment we made for our brand. The attention to detail and creativity exceeded our expectations.",
    avatar: "E",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="gradient-section-navy py-24 relative text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Trust badge */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary-foreground/60 text-sm uppercase tracking-wider mb-4">
            Trusted by businesses who sleep better at night
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-primary-foreground/80">4.9 out of 5 stars from 200+ reviews</p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-primary-foreground/60 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's + of happy users.
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            plus <span className="text-primary-foreground font-semibold">you.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;