import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Blog posts data - can be moved to a separate file or fetched from CMS
export const blogPosts = [
  {
    slug: "video-editing-tips-2025",
    title: "10 Video Editing Tips for 2025",
    excerpt: "Master the latest video editing techniques and trends to create content that stands out in 2025.",
    date: "2025-01-10",
    readTime: "5 min read",
    category: "Tips & Tricks",
  },
  {
    slug: "social-media-video-strategy",
    title: "Building a Social Media Video Strategy",
    excerpt: "Learn how to create a cohesive video content strategy for TikTok, Instagram, and YouTube.",
    date: "2025-01-05",
    readTime: "7 min read",
    category: "Strategy",
  },
  {
    slug: "color-grading-basics",
    title: "Color Grading Basics for Beginners",
    excerpt: "A comprehensive guide to understanding color grading and how to apply it to your videos.",
    date: "2024-12-28",
    readTime: "8 min read",
    category: "Tutorial",
  },
  {
    slug: "motion-graphics-trends",
    title: "Motion Graphics Trends to Watch",
    excerpt: "Explore the latest motion graphics styles and techniques dominating the industry.",
    date: "2024-12-20",
    readTime: "6 min read",
    category: "Trends",
  },
];

const Blog = () => {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Blog", url: "https://urmedia.tech/blog" },
  ]);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Blog - Video Editing Tips & Insights"
        description="Read the latest articles on video editing, motion graphics, social media content, and digital marketing from the UR Media team."
        keywords="video editing blog, motion graphics tutorials, content creation tips, video marketing"
        canonical="https://urmedia.tech/blog"
        jsonLd={[breadcrumbs]}
      />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, tutorials, and insights on video editing, motion graphics, 
              and content creation from our team of experts.
            </p>
          </motion.div>

          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
