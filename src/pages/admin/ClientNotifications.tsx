import { useState, useEffect } from "react";
import { Bell, Send, Loader2, Trash2, Copy, Megaphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  url: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

const ClientNotifications = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [broadcastNotifications, setBroadcastNotifications] = useState<BroadcastNotification[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast form
  const [bTitle, setBTitle] = useState("");
  const [bMessage, setBMessage] = useState("");
  const [bUrl, setBUrl] = useState("");
  const [bImageUrl, setBImageUrl] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchNotifications();
    fetchBroadcastNotifications();
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

  const fetchBroadcastNotifications = async () => {
    const { data } = await supabase
      .from("broadcast_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setBroadcastNotifications((data as BroadcastNotification[]) || []);
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

  const handleBroadcast = async () => {
    if (!bTitle.trim() || !bMessage.trim()) {
      toast.error("Title এবং Message দিতে হবে");
      return;
    }
    setIsBroadcasting(true);
    try {
      const { error } = await supabase.from("broadcast_notifications").insert({
        title: bTitle.trim(),
        message: bMessage.trim(),
        url: bUrl.trim() || null,
        image_url: bImageUrl.trim() || null,
      });
      if (error) throw error;
      toast.success("Broadcast notification পাঠানো হয়েছে! সব সাইটে দেখাবে।");
      setBTitle("");
      setBMessage("");
      setBUrl("");
      setBImageUrl("");
      fetchBroadcastNotifications();
    } catch (error: any) {
      toast.error(error.message || "সমস্যা হয়েছে");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("client_notifications").delete().eq("id", id);
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification মুছে ফেলা হয়েছে");
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    const { error } = await supabase.from("broadcast_notifications").delete().eq("id", id);
    if (!error) {
      setBroadcastNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Broadcast notification মুছে ফেলা হয়েছে");
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.user_id === clientId);
    return client?.full_name || client?.email || clientId.slice(0, 8);
  };

  const embedCode = (() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `<!-- UR Media Notification Widget -->
<script>
(function(){
  var s=document.createElement('script');
  s.src='${window.location.origin}/broadcast-widget.js';
  s.setAttribute('data-endpoint','${supabaseUrl}/functions/v1/broadcast-notifications');
  document.body.appendChild(s);
})();
</script>`;
  })();

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
            Broadcast notification পাঠান সব সাইটে অথবা নির্দিষ্ট client কে
          </p>
        </div>

        <Tabs defaultValue="broadcast" className="space-y-6">
          <TabsList>
            <TabsTrigger value="broadcast">📢 Broadcast (সব সাইট)</TabsTrigger>
            <TabsTrigger value="send">👤 Individual Client</TabsTrigger>
            <TabsTrigger value="embed">🔗 Embed Code</TabsTrigger>
            <TabsTrigger value="history">📋 History</TabsTrigger>
          </TabsList>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Broadcast Notification
                  </CardTitle>
                  <CardDescription>
                    একবার পাঠালে সব client website এ দেখাবে - কোনো API key লাগবে না
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      placeholder="Notification title..."
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">{bTitle.length}/100</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea
                      placeholder="Notification message..."
                      value={bMessage}
                      onChange={(e) => setBMessage(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{bMessage.length}/500</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Launch URL (optional)</Label>
                    <Input
                      placeholder="https://..."
                      value={bUrl}
                      onChange={(e) => setBUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Click করলে এই URL এ যাবে</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL (optional)</Label>
                    <Input
                      placeholder="https://example.com/image.png"
                      value={bImageUrl}
                      onChange={(e) => setBImageUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleBroadcast}
                    disabled={isBroadcasting || !bTitle.trim() || !bMessage.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isBroadcasting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Megaphone className="mr-2 h-4 w-4" />
                        সব সাইটে Broadcast করুন
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Broadcast History */}
              <Card>
                <CardHeader>
                  <CardTitle>সাম্প্রতিক Broadcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  {broadcastNotifications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">কোনো broadcast নেই</p>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {broadcastNotifications.map((notif) => (
                        <div key={notif.id} className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{notif.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                              {notif.url && (
                                <p className="text-xs text-primary truncate mt-1">{notif.url}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteBroadcast(notif.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notif.created_at).toLocaleDateString("bn-BD")} • {new Date(notif.created_at).toLocaleTimeString("bn-BD")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Individual Send Tab */}
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  নির্দিষ্ট Client কে Notification
                </CardTitle>
                <CardDescription>একটি নির্দিষ্ট client কে notification পাঠান</CardDescription>
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
                  <Input placeholder="Notification title..." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Message *</Label>
                  <Textarea placeholder="Notification message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500} />
                </div>
                <Button onClick={handleSend} disabled={isSending || !selectedClientId || !title.trim() || !message.trim()} className="w-full" size="lg">
                  {isSending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />পাঠানো হচ্ছে...</> : <><Send className="mr-2 h-4 w-4" />Notification পাঠান</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embed Code Tab */}
          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Universal Embed Code
                </CardTitle>
                <CardDescription>
                  এই একটাই code সব client website এ দিলেই হবে - কোনো API key লাগবে না!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-primary">✅ কিভাবে কাজ করে:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>এই code যেকোনো website এ <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> এর আগে paste করুন</li>
                    <li>Website এ একটি 🔔 notification bell দেখাবে</li>
                    <li>আপনি Admin panel থেকে "Broadcast" ট্যাব দিয়ে notification পাঠালে সব সাইটে একসাথে দেখাবে</li>
                    <li>Read/Unread status user এর browser এ localStorage এ save থাকবে</li>
                  </ul>
                </div>

                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                    {embedCode}
                  </pre>
                  <Button
                    variant="default"
                    size="sm"
                    className="absolute top-3 right-3"
                    onClick={() => copyToClipboard(embedCode)}
                  >
                    <Copy className="mr-1.5 h-3 w-3" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Individual Notification History</CardTitle>
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
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(notif.id)}>
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
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ClientNotifications;
