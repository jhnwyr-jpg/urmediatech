import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Trash2, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

interface TrackingPixel {
  id: string;
  pixel_type: string;
  pixel_id: string;
  is_enabled: boolean;
  enabled_on_home: boolean;
  enabled_on_product: boolean;
  enabled_on_contact: boolean;
  enabled_on_checkout: boolean;
  created_at: string;
  updated_at: string;
}

const pixelSchema = z.object({
  pixel_id: z.string().trim().min(1, "Pixel ID is required").max(50, "Pixel ID is too long"),
  pixel_type: z.string().min(1, "Pixel type is required"),
});

const PIXEL_TYPES = [
  { value: "facebook", label: "Facebook Pixel", icon: "📘" },
  { value: "google_analytics", label: "Google Analytics", icon: "📊" },
  { value: "google_ads", label: "Google Ads", icon: "📢" },
  { value: "tiktok", label: "TikTok Pixel", icon: "🎵" },
  { value: "linkedin", label: "LinkedIn Insight", icon: "💼" },
  { value: "twitter", label: "Twitter Pixel", icon: "🐦" },
];

const PAGE_OPTIONS = [
  { key: "enabled_on_home", label: "Home Page" },
  { key: "enabled_on_product", label: "Product Page" },
  { key: "enabled_on_contact", label: "Contact Page" },
  { key: "enabled_on_checkout", label: "Checkout / RTC Page" },
] as const;

const TrackingPixelsSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPixel, setNewPixel] = useState({ pixel_type: "facebook", pixel_id: "" });
  const [errors, setErrors] = useState<{ pixel_id?: string }>({});

  const fetchPixels = async () => {
    try {
      const { data, error } = await supabase
        .from("tracking_pixels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPixels(data || []);
    } catch (error) {
      console.error("Error fetching pixels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPixels();
  }, []);

  const handleAddPixel = async () => {
    setErrors({});
    const result = pixelSchema.safeParse(newPixel);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "pixel_id") {
          fieldErrors.pixel_id = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving("new");
    try {
      const { error } = await supabase.from("tracking_pixels").insert({
        pixel_type: newPixel.pixel_type,
        pixel_id: newPixel.pixel_id.trim(),
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Pixel added",
        description: "Tracking pixel has been added successfully.",
      });
      setNewPixel({ pixel_type: "facebook", pixel_id: "" });
      setShowAddForm(false);
      fetchPixels();
    } catch (error) {
      console.error("Error adding pixel:", error);
      toast({
        title: "Error",
        description: "Failed to add pixel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleToggleEnabled = async (pixel: TrackingPixel) => {
    setIsSaving(pixel.id);
    try {
      const { error } = await supabase
        .from("tracking_pixels")
        .update({ is_enabled: !pixel.is_enabled })
        .eq("id", pixel.id);

      if (error) throw error;

      setPixels(pixels.map((p) => 
        p.id === pixel.id ? { ...p, is_enabled: !p.is_enabled } : p
      ));
      toast({
        title: pixel.is_enabled ? "Pixel disabled" : "Pixel enabled",
        description: `Tracking pixel has been ${pixel.is_enabled ? "disabled" : "enabled"}.`,
      });
    } catch (error) {
      console.error("Error toggling pixel:", error);
      toast({
        title: "Error",
        description: "Failed to update pixel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleTogglePage = async (pixel: TrackingPixel, pageKey: keyof TrackingPixel) => {
    setIsSaving(pixel.id);
    try {
      const { error } = await supabase
        .from("tracking_pixels")
        .update({ [pageKey]: !pixel[pageKey] })
        .eq("id", pixel.id);

      if (error) throw error;

      setPixels(pixels.map((p) => 
        p.id === pixel.id ? { ...p, [pageKey]: !p[pageKey] } : p
      ));
    } catch (error) {
      console.error("Error toggling page:", error);
      toast({
        title: "Error",
        description: "Failed to update page setting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleDeletePixel = async (pixel: TrackingPixel) => {
    if (!confirm("Are you sure you want to delete this pixel?")) return;

    setIsSaving(pixel.id);
    try {
      const { error } = await supabase
        .from("tracking_pixels")
        .delete()
        .eq("id", pixel.id);

      if (error) throw error;

      setPixels(pixels.filter((p) => p.id !== pixel.id));
      toast({
        title: "Pixel deleted",
        description: "Tracking pixel has been removed.",
      });
    } catch (error) {
      console.error("Error deleting pixel:", error);
      toast({
        title: "Error",
        description: "Failed to delete pixel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const getPixelTypeInfo = (type: string) => {
    return PIXEL_TYPES.find((t) => t.value === type) || { label: type, icon: "📍" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Tracking & Pixel Settings</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your tracking pixels and control where they run
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Pixel
        </Button>
      </div>

      {/* Add New Pixel Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-xl border border-border/50 p-5 space-y-4">
              <h3 className="font-medium text-foreground">Add New Tracking Pixel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pixel Type
                  </label>
                  <select
                    value={newPixel.pixel_type}
                    onChange={(e) => setNewPixel({ ...newPixel, pixel_type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    {PIXEL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pixel ID
                  </label>
                  <Input
                    value={newPixel.pixel_id}
                    onChange={(e) => setNewPixel({ ...newPixel, pixel_id: e.target.value })}
                    placeholder="Enter your pixel ID"
                    className={errors.pixel_id ? "border-destructive" : ""}
                  />
                  {errors.pixel_id && (
                    <p className="text-destructive text-xs mt-1">{errors.pixel_id}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="gradient"
                  onClick={handleAddPixel}
                  disabled={isSaving === "new"}
                >
                  {isSaving === "new" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Pixel
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixels List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-card rounded-xl border border-border/50 p-5">
              <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : pixels.length === 0 ? (
        <div className="bg-card rounded-xl border border-border/50 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No Tracking Pixels</h3>
          <p className="text-muted-foreground text-sm">
            Add your first tracking pixel to start collecting data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pixels.map((pixel) => {
            const typeInfo = getPixelTypeInfo(pixel.pixel_type);
            return (
              <motion.div
                key={pixel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border/50 p-5"
              >
                {/* Pixel Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div>
                      <h3 className="font-medium text-foreground">{typeInfo.label}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{pixel.pixel_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Global Enable/Disable Toggle */}
                    <button
                      onClick={() => handleToggleEnabled(pixel)}
                      disabled={isSaving === pixel.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pixel.is_enabled
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {pixel.is_enabled ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Disabled
                        </>
                      )}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePixel(pixel)}
                      disabled={isSaving === pixel.id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Page Controls */}
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-medium text-foreground mb-3">Active on Pages:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PAGE_OPTIONS.map((page) => (
                      <button
                        key={page.key}
                        onClick={() => handleTogglePage(pixel, page.key)}
                        disabled={isSaving === pixel.id || !pixel.is_enabled}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          pixel[page.key] && pixel.is_enabled
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-secondary text-muted-foreground border border-transparent"
                        } ${!pixel.is_enabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/30"}`}
                      >
                        <span>{page.label}</span>
                        {pixel[page.key] && pixel.is_enabled ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-secondary/50 rounded-xl p-5">
        <h3 className="font-medium text-foreground mb-2">How it works</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Enable/Disable:</strong> Turn the entire pixel on or off globally</li>
          <li>• <strong>Page Controls:</strong> Choose which pages should load each pixel</li>
          <li>• <strong>Instant Apply:</strong> Changes take effect immediately on your website</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingPixelsSettings;
