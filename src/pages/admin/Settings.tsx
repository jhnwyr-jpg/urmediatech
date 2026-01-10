import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pixelId, setPixelId] = useState("");
  const [originalPixelId, setOriginalPixelId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "facebook_pixel_id")
          .maybeSingle();

        if (error) throw error;
        const value = data?.value || "";
        setPixelId(value);
        setOriginalPixelId(value);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: pixelId.trim(), updated_by: user.id })
        .eq("key", "facebook_pixel_id");

      if (error) throw error;

      setOriginalPixelId(pixelId.trim());
      toast({
        title: "Settings saved",
        description: "Facebook Pixel ID has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: null, updated_by: user.id })
        .eq("key", "facebook_pixel_id");

      if (error) throw error;

      setPixelId("");
      setOriginalPixelId("");
      toast({
        title: "Pixel removed",
        description: "Facebook Pixel has been removed from your website.",
      });
    } catch (error) {
      console.error("Error removing pixel:", error);
      toast({
        title: "Error",
        description: "Failed to remove pixel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = pixelId !== originalPixelId;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your website settings</p>
        </div>

        {/* Facebook Pixel Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 p-6 max-w-2xl"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Facebook Pixel</h2>
              <p className="text-muted-foreground mt-1">
                Add your Facebook Pixel ID to track conversions and build audiences for your ads.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-secondary rounded-lg" />
              <div className="h-10 bg-secondary rounded-lg w-32" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="pixelId" className="block text-sm font-medium text-foreground mb-2">
                  Pixel ID
                </label>
                <Input
                  id="pixelId"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  placeholder="e.g., 123456789012345"
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  You can find your Pixel ID in Facebook Events Manager
                </p>
              </div>

              {/* Status indicator */}
              {originalPixelId && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600">
                    Facebook Pixel is active on all pages
                  </p>
                </div>
              )}

              {!originalPixelId && !pixelId && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-600">
                    No Facebook Pixel configured
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="gradient"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving || !pixelId.trim()}
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                {originalPixelId && (
                  <Button
                    variant="outline"
                    onClick={handleRemove}
                    disabled={isSaving}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Pixel
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-secondary/50 rounded-2xl p-6 max-w-2xl"
        >
          <h3 className="font-medium text-foreground mb-3">How to find your Pixel ID:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Go to Facebook Events Manager</li>
            <li>Select your Pixel from the Data Sources section</li>
            <li>Click on Settings</li>
            <li>Copy the Pixel ID (a 15-16 digit number)</li>
          </ol>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
