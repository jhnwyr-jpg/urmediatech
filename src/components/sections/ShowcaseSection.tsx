import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Eye, MousePointer } from "lucide-react";

const ShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      {/* Perspective Grid Section */}
      <section className="relative h-[500px] perspective-grid bg-background overflow-hidden">
        {/* Decorative lines going up */}
        <div className="absolute left-1/4 bottom-0 w-px h-80 bg-gradient-to-t from-primary/30 to-transparent" />
        <div className="absolute left-1/2 bottom-0 w-px h-96 bg-gradient-to-t from-primary/40 to-transparent" />
        <div className="absolute right-1/4 bottom-0 w-px h-72 bg-gradient-to-t from-primary/30 to-transparent" />
        
        {/* Corner decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 left-20 w-4 h-4 border-l-2 border-t-2 border-primary/40"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-20 right-20 w-4 h-4 border-r-2 border-t-2 border-primary/40"
        />
      </section>

      {/* Light Purple Section */}
      <section ref={ref} className="gradient-section-light py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
                  <Eye className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Real-Time Collaboration</h3>
                  <p className="text-muted-foreground text-sm">Work together seamlessly</p>
                </div>
              </div>
              
              {/* Mock interface */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full gradient-bg" />
                  <div className="flex-1">
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-muted/50 rounded" />
                  </div>
                  <div className="text-xs text-muted-foreground">2m ago</div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                See what's working and{" "}
                <span className="gradient-text">optimize it</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Get real-time insights into your website performance. Track user behavior, 
                monitor conversions, and make data-driven decisions to improve your results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purple Gradient Section */}
      <section className="gradient-section-purple py-24 relative text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Actually measure event success
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6">
                No more guessing if your website is performing well. Get detailed 
                analytics and actionable insights that help you make better decisions.
              </p>
              <ul className="space-y-3">
                {["Track visitor engagement", "Monitor conversion rates", "Analyze user journeys"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6" />
                <span className="font-semibold">Performance Overview</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">Conversion Rate</span>
                  <span className="font-bold">12.4%</span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary-foreground rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">Page Views</span>
                  <span className="font-bold">24,521</span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-primary-foreground rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dark Section */}
      <section className="gradient-section-dark py-24 relative text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <MousePointer className="w-12 h-12 mx-auto mb-6 text-primary-foreground/80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Drive attendance for your entire KPI team
            </h2>
            <p className="text-primary-foreground/70 text-lg">
              Streamline your workflow and boost productivity with our comprehensive 
              suite of design and development tools.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ShowcaseSection;