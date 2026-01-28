import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Key, Save, Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AIChatbotSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [settings, setSettings] = useState({
    aiChatEnabled: true,
    customApiKey: "",
    useCustomKey: false,
  });

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["ai_chat_enabled", "ai_custom_api_key", "ai_use_custom_key"]);

        if (error) throw error;

        const settingsMap = data?.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string | null>);

        setSettings({
          aiChatEnabled: settingsMap?.ai_chat_enabled !== "false",
          customApiKey: settingsMap?.ai_custom_api_key || "",
          useCustomKey: settingsMap?.ai_use_custom_key === "true",
        });
      } catch (error) {
        console.error("Error fetching AI settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { key: "ai_chat_enabled", value: String(settings.aiChatEnabled) },
        { key: "ai_use_custom_key", value: String(settings.useCustomKey) },
      ];

      // Only save API key if useCustomKey is true
      if (settings.useCustomKey && settings.customApiKey) {
        updates.push({ key: "ai_custom_api_key", value: settings.customApiKey });
      }

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(
            { key: update.key, value: update.value, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "AI Chatbot settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving AI settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI Chatbot Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your AI assistant</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Enable/Disable AI Chat */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50"
        >
          <div className="flex items-center gap-3">
            {settings.aiChatEnabled ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <Label className="text-base font-medium">Enable AI Chatbot</Label>
              <p className="text-sm text-muted-foreground">Show AI chat widget on website</p>
            </div>
          </div>
          <Switch
            checked={settings.aiChatEnabled}
            onCheckedChange={(checked) => setSettings({ ...settings, aiChatEnabled: checked })}
          />
        </motion.div>

        {/* Use Custom API Key Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50"
        >
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-primary" />
            <div>
              <Label className="text-base font-medium">Use Custom API Key</Label>
              <p className="text-sm text-muted-foreground">Use your own OpenAI/Gemini API key</p>
            </div>
          </div>
          <Switch
            checked={settings.useCustomKey}
            onCheckedChange={(checked) => setSettings({ ...settings, useCustomKey: checked })}
          />
        </motion.div>

        {/* Custom API Key Input */}
        {settings.useCustomKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5"
          >
            <Label htmlFor="apiKey" className="text-sm font-medium">
              API Key (OpenAI / Google Gemini)
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={settings.customApiKey}
                onChange={(e) => setSettings({ ...settings, customApiKey: e.target.value })}
                placeholder="sk-... (OpenAI) অথবা AIza... (Gemini)"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Key type indicator */}
            {settings.customApiKey && (
              <div className="flex items-center gap-2 text-xs">
                {settings.customApiKey.startsWith("sk-") ? (
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-600">✓ OpenAI Key Detected</span>
                ) : settings.customApiKey.startsWith("AIza") ? (
                  <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-600">✓ Google Gemini Key Detected</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-600">⚠ Unknown Key Format</span>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              আপনার নিজের API key দিন। OpenAI key "sk-" দিয়ে শুরু হয়, Gemini key "AIza" দিয়ে শুরু হয়।
            </p>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <h4 className="font-medium text-sm text-foreground mb-2">ℹ️ Supported API Keys:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>OpenAI:</strong> sk-... (GPT-4o-mini model ব্যবহার হবে)</li>
            <li>• <strong>Google Gemini:</strong> AIza... (Gemini 2.0 Flash model ব্যবহার হবে)</li>
            <li>• <strong>Custom key OFF থাকলে:</strong> Default Lovable AI ব্যবহার হবে</li>
          </ul>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-xl"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIChatbotSettings;
