import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, FileText, Globe, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { logError } from "@/lib/logger";

interface ContentSettings {
  // Promo Section
  promo_badge_bn: string;
  promo_badge_en: string;
  promo_title_bn: string;
  promo_title_en: string;
  promo_price_bn: string;
  promo_price_en: string;
  promo_description_bn: string;
  promo_description_en: string;
  promo_highlights_bn: string;
  promo_highlights_en: string;
  promo_cta_bn: string;
  promo_cta_en: string;
  // Website Tab
  website_title_bn: string;
  website_title_en: string;
  website_price_bn: string;
  website_price_en: string;
  website_description_bn: string;
  website_description_en: string;
  website_features_bn: string;
  website_features_en: string;
  website_cta_bn: string;
  website_cta_en: string;
}

const defaultContent: ContentSettings = {
  promo_badge_bn: "🔥 লিমিটেড অফার",
  promo_badge_en: "🔥 Limited Offer",
  promo_title_bn: "ওয়েবসাইট শুরু মাত্র",
  promo_title_en: "Websites Starting From",
  promo_price_bn: "৳৪,০০০",
  promo_price_en: "৳4,000",
  promo_description_bn: "ফুল কোডেড, রেসপন্সিভ ওয়েবসাইট — React, Next.js দিয়ে তৈরি। টেমপ্লেট না, কাস্টম ডিজাইন!",
  promo_description_en: "Fully coded, responsive website — built with React & Next.js. No templates, custom design!",
  promo_highlights_bn: "ফুল কোডেড ওয়েবসাইট,ফ্রি ডোমেইন + হোস্টিং,৭ দিনে ডেলিভারি",
  promo_highlights_en: "Fully Coded Website,Free Domain + Hosting,7 Days Delivery",
  promo_cta_bn: "এখনই অর্ডার করুন",
  promo_cta_en: "Order Now",
  website_title_bn: "যেকোনো ওয়েবসাইট শুরু মাত্র",
  website_title_en: "Any Website Starting From",
  website_price_bn: "৳৪,০০০",
  website_price_en: "৳4,000",
  website_description_bn: "ফুল কোডেড, রেসপন্সিভ ওয়েবসাইট — React, Next.js দিয়ে তৈরি। দাম নির্ভর করবে আপনার চাহিদা ও ফিচারের উপর।",
  website_description_en: "Fully coded, responsive website — built with React & Next.js. Price depends on your requirements and features.",
  website_features_bn: "ফুল কোডেড,কাস্টম ডিজাইন,অ্যাডমিন প্যানেল,SEO অপ্টিমাইজড,মোবাইল রেসপন্সিভ",
  website_features_en: "Fully Coded,Custom Design,Admin Panel,SEO Optimized,Mobile Responsive",
  website_cta_bn: "কনসাল্টেশন নিন",
  website_cta_en: "Get Consultation",
};

const AdminContent = () => {
  const [content, setContent] = useState<ContentSettings>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const keys = Object.keys(defaultContent);
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);

      if (error) throw error;

      if (data && data.length > 0) {
        const fetched: Partial<ContentSettings> = {};
        data.forEach((item) => {
          if (item.value) {
            (fetched as any)[item.key] = item.value;
          }
        });
        setContent((prev) => ({ ...prev, ...fetched }));
      }
    } catch (error) {
      logError("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const entries = Object.entries(content);
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(
            { key, value, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );
        if (error) throw error;
      }

      toast({ title: "✅ সেভ হয়েছে!", description: "কন্টেন্ট সফলভাবে আপডেট হয়েছে" });
    } catch (error) {
      logError("Error saving content:", error);
      toast({ variant: "destructive", title: "Error", description: "কন্টেন্ট সেভ করতে সমস্যা হয়েছে" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: keyof ContentSettings, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Content Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              ল্যান্ডিং পেজের টেক্সট, প্রাইস ও ফিচার এডিট করুন
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchContent} disabled={isLoading}>
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save size={18} />
              {isSaving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Promo Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                প্রমো ব্যানার সেকশন
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>ব্যাজ টেক্সট (বাংলা)</Label>
                  <Input value={content.promo_badge_bn} onChange={(e) => updateField("promo_badge_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Badge Text (English)</Label>
                  <Input value={content.promo_badge_en} onChange={(e) => updateField("promo_badge_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>টাইটেল (বাংলা)</Label>
                  <Input value={content.promo_title_bn} onChange={(e) => updateField("promo_title_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Title (English)</Label>
                  <Input value={content.promo_title_en} onChange={(e) => updateField("promo_title_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>প্রাইস (বাংলা)</Label>
                  <Input value={content.promo_price_bn} onChange={(e) => updateField("promo_price_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Price (English)</Label>
                  <Input value={content.promo_price_en} onChange={(e) => updateField("promo_price_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>বিবরণ (বাংলা)</Label>
                  <Textarea value={content.promo_description_bn} onChange={(e) => updateField("promo_description_bn", e.target.value)} rows={2} />
                </div>
                <div>
                  <Label>Description (English)</Label>
                  <Textarea value={content.promo_description_en} onChange={(e) => updateField("promo_description_en", e.target.value)} rows={2} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>হাইলাইটস (বাংলা) — কমা দিয়ে আলাদা করুন</Label>
                  <Input value={content.promo_highlights_bn} onChange={(e) => updateField("promo_highlights_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Highlights (English) — comma separated</Label>
                  <Input value={content.promo_highlights_en} onChange={(e) => updateField("promo_highlights_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>CTA বাটন (বাংলা)</Label>
                  <Input value={content.promo_cta_bn} onChange={(e) => updateField("promo_cta_bn", e.target.value)} />
                </div>
                <div>
                  <Label>CTA Button (English)</Label>
                  <Input value={content.promo_cta_en} onChange={(e) => updateField("promo_cta_en", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Tab Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                ওয়েবসাইট ট্যাব (প্রাইসিং সেকশন)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>টাইটেল (বাংলা)</Label>
                  <Input value={content.website_title_bn} onChange={(e) => updateField("website_title_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Title (English)</Label>
                  <Input value={content.website_title_en} onChange={(e) => updateField("website_title_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>প্রাইস (বাংলা)</Label>
                  <Input value={content.website_price_bn} onChange={(e) => updateField("website_price_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Price (English)</Label>
                  <Input value={content.website_price_en} onChange={(e) => updateField("website_price_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>বিবরণ (বাংলা)</Label>
                  <Textarea value={content.website_description_bn} onChange={(e) => updateField("website_description_bn", e.target.value)} rows={2} />
                </div>
                <div>
                  <Label>Description (English)</Label>
                  <Textarea value={content.website_description_en} onChange={(e) => updateField("website_description_en", e.target.value)} rows={2} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>ফিচার ট্যাগ (বাংলা) — কমা দিয়ে আলাদা করুন</Label>
                  <Input value={content.website_features_bn} onChange={(e) => updateField("website_features_bn", e.target.value)} />
                </div>
                <div>
                  <Label>Feature Tags (English) — comma separated</Label>
                  <Input value={content.website_features_en} onChange={(e) => updateField("website_features_en", e.target.value)} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>CTA বাটন (বাংলা)</Label>
                  <Input value={content.website_cta_bn} onChange={(e) => updateField("website_cta_bn", e.target.value)} />
                </div>
                <div>
                  <Label>CTA Button (English)</Label>
                  <Input value={content.website_cta_en} onChange={(e) => updateField("website_cta_en", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminContent;
