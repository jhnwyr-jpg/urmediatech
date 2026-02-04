import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, ToggleLeft, ToggleRight, Server, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ConversionSetting {
  id: string;
  platform: string;
  pixel_id: string | null;
  access_token: string | null;
  conversion_id: string | null;
  conversion_label: string | null;
  is_enabled: boolean;
  server_side_enabled: boolean;
}

const PLATFORM_CONFIG: Record<string, {
  label: string;
  icon: string;
  fields: Array<{ key: string; label: string; placeholder: string; secret?: boolean }>;
  helpText: string;
}> = {
  meta: {
    label: "Meta (Facebook) Pixel",
    icon: "📘",
    fields: [
      { key: "pixel_id", label: "Pixel ID", placeholder: "e.g., 123456789012345" },
      { key: "access_token", label: "Access Token (for Conversion API)", placeholder: "Your Meta access token", secret: true },
    ],
    helpText: "Get your Pixel ID from Events Manager → Data Sources → Settings",
  },
  google_ads: {
    label: "Google Ads",
    icon: "📢",
    fields: [
      { key: "conversion_id", label: "Conversion ID", placeholder: "e.g., AW-123456789" },
      { key: "conversion_label", label: "Conversion Label", placeholder: "e.g., AbCdEfGh123" },
    ],
    helpText: "Get these from Google Ads → Tools & Settings → Conversions",
  },
  tiktok: {
    label: "TikTok Pixel",
    icon: "🎵",
    fields: [
      { key: "pixel_id", label: "Pixel ID", placeholder: "e.g., C123ABCDEFGH" },
      { key: "access_token", label: "Access Token (for Events API)", placeholder: "Your TikTok access token", secret: true },
    ],
    helpText: "Get your Pixel ID from TikTok Events Manager → Website Pixel",
  },
};

const ConversionSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ConversionSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, Record<string, string>>>({});

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("conversion_settings")
        .select("*")
        .order("platform");

      if (error) throw error;
      setSettings((data as ConversionSetting[]) || []);
      
      // Initialize edited values
      const initialValues: Record<string, Record<string, string>> = {};
      data?.forEach((s: ConversionSetting) => {
        initialValues[s.platform] = {
          pixel_id: s.pixel_id || "",
          access_token: s.access_token || "",
          conversion_id: s.conversion_id || "",
          conversion_label: s.conversion_label || "",
        };
      });
      setEditedValues(initialValues);
    } catch (error) {
      console.error("Error fetching conversion settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (setting: ConversionSetting) => {
    setIsSaving(setting.id);
    try {
      const values = editedValues[setting.platform];
      const { error } = await supabase
        .from("conversion_settings")
        .update({
          pixel_id: values.pixel_id || null,
          access_token: values.access_token || null,
          conversion_id: values.conversion_id || null,
          conversion_label: values.conversion_label || null,
        })
        .eq("id", setting.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: `${PLATFORM_CONFIG[setting.platform].label} settings have been updated.`,
      });
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleToggleEnabled = async (setting: ConversionSetting) => {
    setIsSaving(setting.id);
    try {
      const { error } = await supabase
        .from("conversion_settings")
        .update({ is_enabled: !setting.is_enabled })
        .eq("id", setting.id);

      if (error) throw error;

      setSettings(settings.map((s) => 
        s.id === setting.id ? { ...s, is_enabled: !s.is_enabled } : s
      ));
      toast({
        title: setting.is_enabled ? "Pixel disabled" : "Pixel enabled",
        description: `${PLATFORM_CONFIG[setting.platform].label} has been ${setting.is_enabled ? "disabled" : "enabled"}.`,
      });
    } catch (error) {
      console.error("Error toggling setting:", error);
    } finally {
      setIsSaving(null);
    }
  };

  const handleToggleServerSide = async (setting: ConversionSetting) => {
    setIsSaving(setting.id);
    try {
      const { error } = await supabase
        .from("conversion_settings")
        .update({ server_side_enabled: !setting.server_side_enabled })
        .eq("id", setting.id);

      if (error) throw error;

      setSettings(settings.map((s) => 
        s.id === setting.id ? { ...s, server_side_enabled: !s.server_side_enabled } : s
      ));
      toast({
        title: setting.server_side_enabled ? "Server-side disabled" : "Server-side enabled",
        description: `Server-side tracking for ${PLATFORM_CONFIG[setting.platform].label} has been ${setting.server_side_enabled ? "disabled" : "enabled"}.`,
      });
    } catch (error) {
      console.error("Error toggling server-side:", error);
    } finally {
      setIsSaving(null);
    }
  };

  const updateFieldValue = (platform: string, field: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-secondary/30 rounded-xl border border-border/50 p-5">
            <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
            <div className="h-10 bg-secondary rounded w-full mb-3" />
            <div className="h-10 bg-secondary rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  const getPlatformConfig = (platform: string) => {
    return PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG] || PLATFORM_CONFIG.meta;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-foreground">Conversion API & Pixel Integration</h3>
        <p className="text-sm text-muted-foreground">
          Configure your advertising pixels and server-side tracking
        </p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => {
          const config = getPlatformConfig(setting.platform);
          return (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border/50 p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{config.label}</h4>
                    <p className="text-xs text-muted-foreground">{config.helpText}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEnabled(setting)}
                    disabled={isSaving === setting.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      setting.is_enabled
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {setting.is_enabled ? (
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
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {config.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Input
                        type={field.secret && !showSecrets[`${setting.platform}-${field.key}`] ? "password" : "text"}
                        value={editedValues[setting.platform]?.[field.key] || ""}
                        onChange={(e) => updateFieldValue(setting.platform, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="pr-10"
                      />
                      {field.secret && (
                        <button
                          type="button"
                          onClick={() => setShowSecrets((prev) => ({
                            ...prev,
                            [`${setting.platform}-${field.key}`]: !prev[`${setting.platform}-${field.key}`],
                          }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showSecrets[`${setting.platform}-${field.key}`] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Server-side toggle & Save */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <button
                  onClick={() => handleToggleServerSide(setting)}
                  disabled={isSaving === setting.id || !setting.is_enabled}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    setting.server_side_enabled && setting.is_enabled
                      ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  } ${!setting.is_enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Server className="w-4 h-4" />
                  Server-side Tracking {setting.server_side_enabled && setting.is_enabled ? "On" : "Off"}
                </button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => handleSave(setting)}
                  disabled={isSaving === setting.id}
                >
                  {isSaving === setting.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <h4 className="font-medium text-foreground mb-2">Server-side Tracking</h4>
        <p className="text-sm text-muted-foreground">
          Server-side tracking sends conversion events directly from the server, improving accuracy
          and bypassing ad blockers. Requires valid access tokens for Meta and TikTok.
        </p>
      </div>
    </div>
  );
};

export default ConversionSettings;
