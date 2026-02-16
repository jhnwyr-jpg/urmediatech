import { useState, useEffect } from "react";
import { Bell, Send, Loader2, Trash2, Copy, Key, Plus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface ClientProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

interface ClientNotification {
  id: string;
  client_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ApiKey {
  id: string;
  client_id: string;
  api_key: string;
  site_name: string;
  site_url: string | null;
  is_active: boolean;
  created_at: string;
}

const ClientNotifications = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New API key form
  const [newKeyClientId, setNewKeyClientId] = useState("");
  const [newKeySiteName, setNewKeySiteName] = useState("");
  const [newKeySiteUrl, setNewKeySiteUrl] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchNotifications();
    fetchApiKeys();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .eq("is_client", true)
      .order("full_name");
    setClients(data || []);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("client_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifications((data as ClientNotification[]) || []);
    setIsLoading(false);
  };

  const fetchApiKeys = async () => {
    const { data } = await supabase
      .from("client_api_keys")
      .select("*")
      .order("created_at", { ascending: false });
    setApiKeys((data as ApiKey[]) || []);
  };

  const handleSend = async () => {
    if (!selectedClientId || !title.trim() || !message.trim()) {
      toast.error("Client, Title এবং Message দিতে হবে");
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.from("client_notifications").insert({
        client_id: selectedClientId,
        title: title.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      toast.success("Notification পাঠানো হয়েছে!");
      setTitle("");
      setMessage("");
      setSelectedClientId("");
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message || "সমস্যা হয়েছে");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("client_notifications").delete().eq("id", id);
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification মুছে ফেলা হয়েছে");
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyClientId || !newKeySiteName.trim()) {
      toast.error("Client এবং Site Name দিতে হবে");
      return;
    }
    setIsCreatingKey(true);
    try {
      const { error } = await supabase.from("client_api_keys").insert({
        client_id: newKeyClientId,
        site_name: newKeySiteName.trim(),
        site_url: newKeySiteUrl.trim() || null,
      });
      if (error) throw error;
      toast.success("API Key তৈরি হয়েছে!");
      setNewKeyClientId("");
      setNewKeySiteName("");
      setNewKeySiteUrl("");
      setShowKeyDialog(false);
      fetchApiKeys();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleToggleKey = async (id: string, isActive: boolean) => {
    await supabase.from("client_api_keys").update({ is_active: !isActive }).eq("id", id);
    fetchApiKeys();
  };

  const handleDeleteKey = async (id: string) => {
    await supabase.from("client_api_keys").delete().eq("id", id);
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("API Key মুছে ফেলা হয়েছে");
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.user_id === clientId);
    return client?.full_name || client?.email || clientId.slice(0, 8);
  };

  const getEmbedCode = (apiKey: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `<!-- UR Media Notification Widget -->
<script>
(function(){
  var s=document.createElement('script');
  s.src='${window.location.origin}/notification-widget.js';
  s.setAttribute('data-api-key','${apiKey}');
  s.setAttribute('data-endpoint','${supabaseUrl}/functions/v1/client-notifications-api');
  document.body.appendChild(s);
})();
</script>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Client Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Client দের notification পাঠান ও API key manage করুন
          </p>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList>
            <TabsTrigger value="send">Send Notification</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys & Embed</TabsTrigger>
          </TabsList>

          {/* Send Tab */}
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  নতুন Notification পাঠান
                </CardTitle>
                <CardDescription>Client select করে notification পাঠান</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Client নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.user_id} value={client.user_id}>
                          {client.full_name || client.email || client.user_id.slice(0, 8)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="Notification title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea
                    placeholder="Notification message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                </div>

                <Button
                  onClick={handleSend}
                  disabled={isSending || !selectedClientId || !title.trim() || !message.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Notification পাঠান
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>সাম্প্রতিক Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">কোনো notification নেই</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{notif.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notif.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{getClientName(notif.client_id)}</Badge>
                          <Badge variant={notif.is_read ? "secondary" : "default"} className="text-xs">
                            {notif.is_read ? "Read" : "Unread"}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(notif.created_at).toLocaleDateString("bn-BD")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>Client website এ embed করার জন্য API key তৈরি করুন</CardDescription>
                  </div>
                  <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1.5 h-4 w-4" />
                        New API Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>নতুন API Key তৈরি করুন</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Client *</Label>
                          <Select value={newKeyClientId} onValueChange={setNewKeyClientId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Client নির্বাচন করুন" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.user_id} value={client.user_id}>
                                  {client.full_name || client.email || client.user_id.slice(0, 8)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Site Name *</Label>
                          <Input
                            placeholder="e.g. Client Portfolio Site"
                            value={newKeySiteName}
                            onChange={(e) => setNewKeySiteName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Site URL (optional)</Label>
                          <Input
                            placeholder="https://example.com"
                            value={newKeySiteUrl}
                            onChange={(e) => setNewKeySiteUrl(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreateApiKey} disabled={isCreatingKey} className="w-full">
                          {isCreatingKey ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          API Key তৈরি করুন
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">কোনো API key নেই</p>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{key.site_name}</span>
                              <Badge variant={key.is_active ? "default" : "secondary"}>
                                {key.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Client: {getClientName(key.client_id)}
                              {key.site_url && ` • ${key.site_url}`}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleKey(key.id, key.is_active)}
                            >
                              {key.is_active ? "Disable" : "Enable"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteKey(key.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* API Key display */}
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted px-3 py-2 rounded text-xs font-mono truncate">
                            {key.api_key}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(key.api_key)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Embed Code */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">Embed Code (Client এর website এ paste করুন)</Label>
                          <div className="relative">
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                              {getEmbedCode(key.api_key)}
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(getEmbedCode(key.api_key))}
                            >
                              <Copy className="mr-1.5 h-3 w-3" />
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ClientNotifications;
