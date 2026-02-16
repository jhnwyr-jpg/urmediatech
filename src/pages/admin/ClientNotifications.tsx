import { useState, useEffect } from "react";
import { Bell, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

const ClientNotifications = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
    fetchNotifications();
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

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.user_id === clientId);
    return client?.full_name || client?.email || clientId.slice(0, 8);
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
            নির্দিষ্ট client কে notification পাঠান
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Send Form */}
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

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক Notifications</CardTitle>
              <CardDescription>সর্বশেষ পাঠানো notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  কোনো notification পাঠানো হয়নি
                </p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-lg border border-border bg-muted/30 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notif.message}
                          </p>
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
                        <Badge variant="outline" className="text-xs">
                          {getClientName(notif.client_id)}
                        </Badge>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClientNotifications;
