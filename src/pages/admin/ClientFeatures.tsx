import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Globe,
  Shield,
  Loader2,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";

// All available features that can be controlled
const ALL_FEATURES = [
  { key: "notifications", name: "Push Notifications" },
  { key: "client_notifications", name: "Client Notifications" },
  { key: "broadcast", name: "Broadcast Notifications" },
  { key: "chat_support", name: "Chat Support" },
  { key: "ai_chatbot", name: "AI Chatbot" },
  { key: "analytics", name: "Analytics & Reports" },
  { key: "tracking_pixels", name: "Tracking Pixels" },
  { key: "marketing_scripts", name: "Marketing Scripts" },
  { key: "conversion_tracking", name: "Conversion Tracking" },
  { key: "meetings", name: "Meeting Booking" },
  { key: "services", name: "Services Management" },
  { key: "orders", name: "Orders Management" },
  { key: "coupons", name: "Coupons System" },
  { key: "pricing", name: "Pricing Plans" },
];

interface ClientWithSite {
  id: string;
  client_id: string;
  site_name: string;
  site_url: string | null;
  is_active: boolean;
}

interface FeatureControl {
  id: string;
  client_id: string;
  feature_key: string;
  feature_name: string;
  is_enabled: boolean;
}

const ClientFeatures = () => {
  const [clients, setClients] = useState<ClientWithSite[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientWithSite | null>(null);
  const [features, setFeatures] = useState<FeatureControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_api_keys")
      .select("id, client_id, site_name, site_url, is_active")
      .order("site_name");
    if (error) {
      toast.error("Failed to load clients");
    } else {
      setClients((data as ClientWithSite[]) || []);
    }
    setLoading(false);
  };

  const selectClient = async (client: ClientWithSite) => {
    setSelectedClient(client);
    setFeaturesLoading(true);

    // Fetch existing feature controls for this client
    const { data: existing } = await supabase
      .from("client_feature_controls")
      .select("*")
      .eq("client_id", client.client_id);

    const existingFeatures = (existing as FeatureControl[]) || [];
    const existingKeys = existingFeatures.map((f) => f.feature_key);

    // Auto-create missing features for this client
    const missing = ALL_FEATURES.filter((f) => !existingKeys.includes(f.key));
    if (missing.length > 0) {
      const toInsert = missing.map((f) => ({
        client_id: client.client_id,
        feature_key: f.key,
        feature_name: f.name,
        is_enabled: true,
      }));
      const { data: inserted } = await supabase
        .from("client_feature_controls")
        .insert(toInsert)
        .select();
      if (inserted) {
        existingFeatures.push(...(inserted as FeatureControl[]));
      }
    }

    // Sort by ALL_FEATURES order
    const sorted = ALL_FEATURES.map((af) => {
      const found = existingFeatures.find((ef) => ef.feature_key === af.key);
      return found || { id: "", client_id: client.client_id, feature_key: af.key, feature_name: af.name, is_enabled: true };
    });

    setFeatures(sorted);
    setFeaturesLoading(false);
  };

  const toggleFeature = async (feature: FeatureControl) => {
    setToggling(feature.feature_key);
    const newVal = !feature.is_enabled;
    const { error } = await supabase
      .from("client_feature_controls")
      .update({ is_enabled: newVal })
      .eq("id", feature.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setFeatures((prev) =>
        prev.map((f) =>
          f.feature_key === feature.feature_key ? { ...f, is_enabled: newVal } : f
        )
      );
      toast.success(`${feature.feature_name} ${newVal ? "enabled" : "disabled"}`);
    }
    setToggling(null);
  };

  const toggleAll = async (enable: boolean) => {
    if (!selectedClient) return;
    setFeaturesLoading(true);
    const { error } = await supabase
      .from("client_feature_controls")
      .update({ is_enabled: enable })
      .eq("client_id", selectedClient.client_id);

    if (error) {
      toast.error("Failed to update");
    } else {
      setFeatures((prev) => prev.map((f) => ({ ...f, is_enabled: enable })));
      toast.success(enable ? "All features enabled" : "All features disabled");
    }
    setFeaturesLoading(false);
  };

  const filteredClients = clients.filter((c) =>
    c.site_name.toLowerCase().includes(search.toLowerCase())
  );

  const enabledCount = features.filter((f) => f.is_enabled).length;
  const disabledCount = features.length - enabledCount;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Feature Controls</h1>
          <p className="text-muted-foreground">Manage which features each client website can access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client List - Left Panel */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredClients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No clients found
                </p>
              ) : (
                <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => selectClient(client)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                        selectedClient?.id === client.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{client.site_name}</p>
                        {client.site_url && (
                          <p className={`text-xs truncate ${
                            selectedClient?.id === client.id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}>
                            {client.site_url}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 opacity-50" />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Features Panel - Right */}
          <div className="lg:col-span-2">
            {!selectedClient ? (
              <Card className="p-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">Select a Client</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a client from the left panel to manage their features
                </p>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      {selectedClient.site_name}
                    </h2>
                    {selectedClient.site_url && (
                      <p className="text-sm text-muted-foreground">{selectedClient.site_url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">
                      <Unlock className="h-3 w-3 mr-1" /> {enabledCount}
                    </Badge>
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-200">
                      <Lock className="h-3 w-3 mr-1" /> {disabledCount}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => toggleAll(true)}>
                    <Unlock className="h-3.5 w-3.5 mr-1" /> Enable All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleAll(false)}>
                    <Lock className="h-3.5 w-3.5 mr-1" /> Disable All
                  </Button>
                </div>

                {featuresLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {features.map((feature) => (
                      <div
                        key={feature.feature_key}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          {feature.is_enabled ? (
                            <Unlock className="h-4 w-4 text-green-500" />
                          ) : (
                            <Lock className="h-4 w-4 text-red-400" />
                          )}
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {feature.feature_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {feature.feature_key}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={feature.is_enabled}
                          onCheckedChange={() => toggleFeature(feature)}
                          disabled={toggling === feature.feature_key}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClientFeatures;
