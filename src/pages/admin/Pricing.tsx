import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, GripVertical, Edit2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Feature {
  id: string;
  plan_id: string;
  text_bn: string;
  text_en: string;
  icon: string;
  sort_order: number;
}

interface Plan {
  id: string;
  plan_key: string;
  name_bn: string;
  name_en: string;
  price: string;
  period_bn: string;
  period_en: string;
  icon: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  features: Feature[];
}

const iconOptions = ["Zap", "Crown", "Globe", "Server", "Code", "Headphones", "Palette", "Shield", "Sparkles", "Check"];

const AdminPricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState<{ planId: string; text_bn: string; text_en: string }>({ planId: "", text_bn: "", text_en: "" });

  const fetchPlans = async () => {
    setLoading(true);
    const { data: plansData } = await supabase.from("pricing_plans").select("*").order("sort_order");
    const { data: featuresData } = await supabase.from("pricing_features").select("*").order("sort_order");

    if (plansData) {
      setPlans(
        plansData.map((p) => ({
          ...p,
          features: (featuresData || []).filter((f) => f.plan_id === p.id),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const updatePlan = async (plan: Plan) => {
    setSaving(true);
    const { error } = await supabase
      .from("pricing_plans")
      .update({
        name_bn: plan.name_bn,
        name_en: plan.name_en,
        price: plan.price,
        period_bn: plan.period_bn,
        period_en: plan.period_en,
        icon: plan.icon,
        is_featured: plan.is_featured,
        is_active: plan.is_active,
      })
      .eq("id", plan.id);

    if (error) toast.error("Failed to update plan");
    else toast.success("Plan updated!");
    setSaving(false);
    setEditingPlan(null);
  };

  const updateFeature = async (feature: Feature) => {
    const { error } = await supabase
      .from("pricing_features")
      .update({ text_bn: feature.text_bn, text_en: feature.text_en, icon: feature.icon })
      .eq("id", feature.id);

    if (error) toast.error("Failed to update feature");
    else toast.success("Feature updated!");
  };

  const addFeature = async (planId: string) => {
    if (!newFeature.text_bn || !newFeature.text_en) return toast.error("Fill both fields");

    const plan = plans.find((p) => p.id === planId);
    const { error } = await supabase.from("pricing_features").insert({
      plan_id: planId,
      text_bn: newFeature.text_bn,
      text_en: newFeature.text_en,
      icon: "Check",
      sort_order: (plan?.features.length || 0),
    });

    if (error) toast.error("Failed to add feature");
    else {
      toast.success("Feature added!");
      setNewFeature({ planId: "", text_bn: "", text_en: "" });
      fetchPlans();
    }
  };

  const deleteFeature = async (featureId: string) => {
    const { error } = await supabase.from("pricing_features").delete().eq("id", featureId);
    if (error) toast.error("Failed to delete");
    else {
      toast.success("Feature deleted!");
      fetchPlans();
    }
  };

  const setPlanField = (planId: string, field: keyof Plan, value: any) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, [field]: value } : p)));
  };

  const setFeatureField = (planId: string, featureId: string, field: keyof Feature, value: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, features: p.features.map((f) => (f.id === featureId ? { ...f, [field]: value } : f)) }
          : p
      )
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-muted-foreground mt-1">Manage pricing plans and features</p>
        </div>

        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card rounded-2xl border border-border/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.is_featured ? "gradient-bg" : "bg-primary/10"}`}>
                  <span className={`text-lg ${plan.is_featured ? "text-primary-foreground" : "text-primary"}`}>
                    {plan.icon === "Zap" ? "⚡" : plan.icon === "Crown" ? "👑" : "✨"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name_bn}</h3>
                  <p className="text-sm text-muted-foreground">{plan.plan_key}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch checked={plan.is_active} onCheckedChange={(v) => { setPlanField(plan.id, "is_active", v); }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Featured</span>
                  <Switch checked={plan.is_featured} onCheckedChange={(v) => { setPlanField(plan.id, "is_featured", v); }} />
                </div>
                <Button size="sm" onClick={() => updatePlan(plan)} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>

            {/* Plan details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name (বাংলা)</label>
                <Input value={plan.name_bn} onChange={(e) => setPlanField(plan.id, "name_bn", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Name (English)</label>
                <Input value={plan.name_en} onChange={(e) => setPlanField(plan.id, "name_en", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                <Input value={plan.price} onChange={(e) => setPlanField(plan.id, "price", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Period (বাংলা)</label>
                <Input value={plan.period_bn} onChange={(e) => setPlanField(plan.id, "period_bn", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Period (English)</label>
                <Input value={plan.period_en} onChange={(e) => setPlanField(plan.id, "period_en", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Icon</label>
                <select
                  value={plan.icon}
                  onChange={(e) => setPlanField(plan.id, "icon", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
                >
                  {iconOptions.map((ic) => (<option key={ic} value={ic}>{ic}</option>))}
                </select>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Features</h4>
              {plan.features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-2 bg-secondary/30 rounded-xl p-3">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={feature.text_bn}
                      onChange={(e) => setFeatureField(plan.id, feature.id, "text_bn", e.target.value)}
                      placeholder="বাংলা"
                      className="text-sm"
                    />
                    <Input
                      value={feature.text_en}
                      onChange={(e) => setFeatureField(plan.id, feature.id, "text_en", e.target.value)}
                      placeholder="English"
                      className="text-sm"
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => updateFeature(feature)}>
                    <Save className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFeature(feature.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              {/* Add new feature */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={newFeature.planId === plan.id ? newFeature.text_bn : ""}
                    onChange={(e) => setNewFeature({ planId: plan.id, text_bn: e.target.value, text_en: newFeature.planId === plan.id ? newFeature.text_en : "" })}
                    placeholder="নতুন ফিচার (বাংলা)"
                    className="text-sm"
                  />
                  <Input
                    value={newFeature.planId === plan.id ? newFeature.text_en : ""}
                    onChange={(e) => setNewFeature({ planId: plan.id, text_en: e.target.value, text_bn: newFeature.planId === plan.id ? newFeature.text_bn : "" })}
                    placeholder="New feature (English)"
                    className="text-sm"
                  />
                </div>
                <Button size="sm" onClick={() => addFeature(plan.id)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
