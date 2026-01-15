import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { createArticleSchema, createBreadcrumbSchema } from "@/lib/jsonLd";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "./Blog";

// Blog content - in production this would come from CMS or MDX files
const blogContent: Record<string, { content: string }> = {
  "video-editing-tips-2025": {
    content: `
      <p>Video editing continues to evolve rapidly, and staying ahead of the curve is essential for content creators. Here are our top 10 tips for creating stunning videos in 2025.</p>
      
      <h2>1. Embrace AI-Assisted Editing</h2>
      <p>AI tools have become indispensable for modern video editors. From automated color correction to smart scene detection, leveraging AI can dramatically speed up your workflow while maintaining quality.</p>
      
      <h2>2. Master Short-Form Content</h2>
      <p>With platforms like TikTok and Instagram Reels dominating, the ability to tell compelling stories in under 60 seconds is crucial. Focus on strong hooks and quick pacing.</p>
      
      <h2>3. Prioritize Audio Quality</h2>
      <p>Great audio can make or break a video. Invest in proper sound design, background music selection, and ensure your voice-overs are crisp and clear.</p>
      
      <h2>4. Use Dynamic Transitions</h2>
      <p>Move beyond basic cuts and fades. Custom transitions that match your brand personality can significantly elevate your content.</p>
      
      <h2>5. Color Grade Consistently</h2>
      <p>Develop a signature color palette that viewers associate with your brand. Consistency in color grading builds recognition and professionalism.</p>
      
      <h2>6. Optimize for Mobile Viewing</h2>
      <p>Most content is consumed on mobile devices. Ensure your text is readable, important elements are centered, and your videos work in both vertical and horizontal formats.</p>
      
      <h2>7. Add Value with Captions</h2>
      <p>Captions aren't just for accessibility—they boost engagement significantly. Use styled captions that complement your video's aesthetic.</p>
      
      <h2>8. Keep Learning New Tools</h2>
      <p>The editing landscape changes constantly. Dedicate time to learning new software features, plugins, and techniques.</p>
      
      <h2>9. Build a Template Library</h2>
      <p>Create reusable templates for intros, outros, lower thirds, and transitions. This saves time and maintains brand consistency.</p>
      
      <h2>10. Seek Feedback</h2>
      <p>Share your work with peers and audiences regularly. Constructive criticism is invaluable for growth as an editor.</p>
    `,
  },
  "social-media-video-strategy": {
    content: `
      <p>Creating a successful social media video strategy requires understanding each platform's unique characteristics and audience expectations.</p>
      
      <h2>Understanding Platform Differences</h2>
      <p>Each social platform has its own culture and content preferences. What works on TikTok might not perform well on LinkedIn. Tailor your approach accordingly.</p>
      
      <h2>Content Pillars</h2>
      <p>Establish 3-5 content pillars that align with your brand values and audience interests. This provides structure while allowing creative flexibility.</p>
      
      <h2>Posting Frequency</h2>
      <p>Consistency matters more than frequency. It's better to post quality content 3 times a week than mediocre content daily.</p>
      
      <h2>Engagement Strategies</h2>
      <p>Video is just the beginning. Respond to comments, create duets, and encourage user-generated content to build community.</p>
    `,
  },
  "color-grading-basics": {
    content: `
      <p>Color grading is one of the most powerful tools in a video editor's arsenal. Here's everything you need to know to get started.</p>
      
      <h2>What is Color Grading?</h2>
      <p>Color grading is the process of altering and enhancing the color of a motion picture, video, or still image. It's different from color correction, which fixes technical issues.</p>
      
      <h2>Essential Tools</h2>
      <p>Most editing software includes color grading tools like color wheels, curves, and LUTs (Look-Up Tables). Understanding these basics is crucial.</p>
      
      <h2>Creating Mood</h2>
      <p>Different color schemes evoke different emotions. Warm tones feel inviting, while cool tones can create tension or melancholy.</p>
      
      <h2>Practice Projects</h2>
      <p>Start by recreating color grades from your favorite films. This hands-on practice is the fastest way to develop your skills.</p>
    `,
  },
  "motion-graphics-trends": {
    content: `
      <p>Motion graphics continue to push creative boundaries. Here are the trends shaping the industry right now.</p>
      
      <h2>3D Integration</h2>
      <p>The line between 2D and 3D is blurring. Expect to see more hybrid designs that combine flat graphics with three-dimensional elements.</p>
      
      <h2>Kinetic Typography</h2>
      <p>Text that moves with purpose and personality remains hugely popular, especially for social media content and explainer videos.</p>
      
      <h2>Retro Aesthetics</h2>
      <p>Vintage-inspired graphics with modern twists are having a moment. Think 80s neon, 90s glitch, and Y2K aesthetics.</p>
      
      <h2>Sustainable Design</h2>
      <p>As brands focus on sustainability, expect motion graphics that reflect eco-friendly values through organic shapes and natural color palettes.</p>
    `,
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const post = blogPosts.find((p) => p.slug === slug);
  const content = slug ? blogContent[slug] : null;

  if (!post || !content) {
    return <Navigate to="/blog" replace />;
  }

  const articleSchema = createArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://urmedia.tech/blog/${post.slug}`,
    datePublished: post.date,
  });

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://urmedia.tech" },
    { name: "Blog", url: "https://urmedia.tech/blog" },
    { name: post.title, url: `https://urmedia.tech/blog/${post.slug}` },
  ]);

  // Find next/prev posts
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category.toLowerCase()}, video editing, content creation`}
        canonical={`https://urmedia.tech/blog/${post.slug}`}
        ogType="article"
        jsonLd={[articleSchema, breadcrumbs]}
      />
      <Navbar />
      
      <article className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
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

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div
              className="prose prose-lg max-w-none 
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex justify-between gap-4">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="flex-1">
                  <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                    <div className="text-sm text-muted-foreground mb-1">Previous</div>
                    <div className="font-medium text-foreground">{prevPost.title}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="flex-1 text-right">
                  <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                    <div className="text-sm text-muted-foreground mb-1">Next</div>
                    <div className="font-medium text-foreground">{nextPost.title}</div>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 p-8 rounded-2xl bg-card border border-border text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Need Professional Video Editing?
            </h2>
            <p className="text-muted-foreground mb-6">
              Let our team handle your video content while you focus on growing your business.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="rounded-full">
                Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPost;
