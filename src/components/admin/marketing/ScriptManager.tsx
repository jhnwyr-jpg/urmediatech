import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Trash2, ToggleLeft, ToggleRight, Code2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface MarketingScript {
  id: string;
  script_name: string;
  script_type: "header" | "footer";
  script_content: string;
  is_enabled: boolean;
  created_at: string;
}

const ScriptManager = () => {
  const { toast } = useToast();
  const [scripts, setScripts] = useState<MarketingScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newScript, setNewScript] = useState({
    script_name: "",
    script_type: "header" as "header" | "footer",
    script_content: "",
  });

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from("marketing_scripts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScripts((data as MarketingScript[]) || []);
    } catch (error) {
      console.error("Error fetching scripts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleAddScript = async () => {
    if (!newScript.script_name.trim() || !newScript.script_content.trim()) {
      toast({
        title: "Validation Error",
        description: "Script name and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving("new");
    try {
      const { error } = await supabase.from("marketing_scripts").insert({
        script_name: newScript.script_name.trim(),
        script_type: newScript.script_type,
        script_content: newScript.script_content.trim(),
      });

      if (error) throw error;

      toast({
        title: "Script added",
        description: "Your tracking script has been added successfully.",
      });
      setNewScript({ script_name: "", script_type: "header", script_content: "" });
      setShowAddForm(false);
      fetchScripts();
    } catch (error) {
      console.error("Error adding script:", error);
      toast({
        title: "Error",
        description: "Failed to add script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleToggleEnabled = async (script: MarketingScript) => {
    setIsSaving(script.id);
    try {
      const { error } = await supabase
        .from("marketing_scripts")
        .update({ is_enabled: !script.is_enabled })
        .eq("id", script.id);

      if (error) throw error;

      setScripts(scripts.map((s) => 
        s.id === script.id ? { ...s, is_enabled: !s.is_enabled } : s
      ));
      toast({
        title: script.is_enabled ? "Script disabled" : "Script enabled",
        description: `${script.script_name} has been ${script.is_enabled ? "disabled" : "enabled"}.`,
      });
    } catch (error) {
      console.error("Error toggling script:", error);
      toast({
        title: "Error",
        description: "Failed to update script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleDeleteScript = async (script: MarketingScript) => {
    if (!confirm(`Are you sure you want to delete "${script.script_name}"?`)) return;

    setIsSaving(script.id);
    try {
      const { error } = await supabase
        .from("marketing_scripts")
        .delete()
        .eq("id", script.id);

      if (error) throw error;

      setScripts(scripts.filter((s) => s.id !== script.id));
      toast({
        title: "Script deleted",
        description: `${script.script_name} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting script:", error);
      toast({
        title: "Error",
        description: "Failed to delete script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const headerScripts = scripts.filter((s) => s.script_type === "header");
  const footerScripts = scripts.filter((s) => s.script_type === "footer");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-foreground">Script Manager</h3>
          <p className="text-sm text-muted-foreground">
            Add custom tracking scripts to your website's header or footer
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Script
        </Button>
      </div>

      {/* Add New Script Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-5 space-y-4">
              <h4 className="font-medium text-foreground">Add New Script</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Script Name
                  </label>
                  <Input
                    value={newScript.script_name}
                    onChange={(e) => setNewScript({ ...newScript, script_name: e.target.value })}
                    placeholder="e.g., Google Tag Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Injection Location
                  </label>
                  <select
                    value={newScript.script_type}
                    onChange={(e) => setNewScript({ ...newScript, script_type: e.target.value as "header" | "footer" })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                  >
                    <option value="header">Header (before &lt;/head&gt;)</option>
                    <option value="footer">Footer (before &lt;/body&gt;)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Script Code
                </label>
                <Textarea
                  value={newScript.script_content}
                  onChange={(e) => setNewScript({ ...newScript, script_content: e.target.value })}
                  placeholder="Paste your tracking script here (including <script> tags)"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="gradient"
                  onClick={handleAddScript}
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
                  Save Script
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-secondary/30 rounded-xl border border-border/50 p-5">
              <div className="h-5 bg-secondary rounded w-1/3 mb-3" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : scripts.length === 0 ? (
        <div className="bg-secondary/30 rounded-xl border border-border/50 p-8 text-center">
          <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No Scripts Added</h3>
          <p className="text-muted-foreground text-sm">
            Add your tracking scripts (GTM, Meta Pixel, etc.) to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Scripts */}
          {headerScripts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Header Scripts ({headerScripts.length})
              </h4>
              <div className="space-y-3">
                {headerScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    isSaving={isSaving}
                    onToggle={handleToggleEnabled}
                    onDelete={handleDeleteScript}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Footer Scripts */}
          {footerScripts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Footer Scripts ({footerScripts.length})
              </h4>
              <div className="space-y-3">
                {footerScripts.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    isSaving={isSaving}
                    onToggle={handleToggleEnabled}
                    onDelete={handleDeleteScript}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Important Notes</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Scripts are injected automatically when enabled</li>
              <li>• Header scripts load before page content</li>
              <li>• Footer scripts load after page content</li>
              <li>• Invalid scripts may affect page performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScriptCard = ({
  script,
  isSaving,
  onToggle,
  onDelete,
}: {
  script: MarketingScript;
  isSaving: string | null;
  onToggle: (script: MarketingScript) => void;
  onDelete: (script: MarketingScript) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl border border-border/50 p-4"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground">{script.script_name}</h4>
        <p className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-md">
          {script.script_content.substring(0, 80)}...
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onToggle(script)}
          disabled={isSaving === script.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            script.is_enabled
              ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          {script.is_enabled ? (
            <>
              <ToggleRight className="w-4 h-4" />
              On
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4" />
              Off
            </>
          )}
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(script)}
          disabled={isSaving === script.id}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </motion.div>
);

export default ScriptManager;
