import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

type Project = {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  category_en: string;
  category_bn: string;
  demo_url: string;
  gradient: string;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProject(data as Project);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project ? (language === "bn" ? project.title_bn : project.title_en) : "Project",
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {language === "bn" ? "প্রজেক্ট পাওয়া যায়নি" : "Project not found"}
          </h1>
          <Link to="/#projects">
            <Button variant="gradient">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "bn" ? "ফিরে যান" : "Go Back"}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = language === "bn" ? project.title_bn : project.title_en;
  const description = language === "bn" ? project.description_bn : project.description_en;
  const category = language === "bn" ? project.category_bn : project.category_en;

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title={`${title} | UR Media Portfolio`}
        description={description || `Check out ${title} - a project by UR Media`}
        canonical={`https://urmedia.tech/projects/${project.id}`}
      />
      <Navbar />
      
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <Link to="/#projects">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <span className="text-sm text-primary font-medium">{category}</span>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? (language === "bn" ? "কপি হয়েছে!" : "Copied!") : (language === "bn" ? "লিংক কপি" : "Copy Link")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {language === "bn" ? "শেয়ার" : "Share"}
              </Button>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <Button variant="gradient" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {language === "bn" ? "নতুন ট্যাবে খুলুন" : "Open in New Tab"}
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-6 max-w-3xl"
            >
              {description}
            </motion.p>
          )}
        </div>
      </section>

      {/* Iframe Section */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card"
          >
            {/* Browser-like header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-background rounded-lg px-3 py-1.5 text-xs text-muted-foreground truncate max-w-md">
                  {project.demo_url}
                </div>
              </div>
            </div>
            
            {/* Iframe */}
            <iframe
              src={project.demo_url}
              className="w-full h-[70vh] md:h-[80vh]"
              title={title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProjectDetail;
