import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, MessageCircle, RefreshCw, Send, User } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Conversation = {
  id: string;
  created_at: string;
  status: string | null;
  visitor_name: string | null;
  visitor_phone: string | null;
};

type Message = {
  id: string;
  conversation_id: string | null;
  created_at: string;
  role: "user" | "assistant";
  content: string;
};

const AdminChats = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [meetingOpen, setMeetingOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId]
  );

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("id, created_at, status, visitor_name, visitor_phone")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setConversations((data as Conversation[]) ?? []);
      setSelectedId((prev) => prev ?? (data?.[0]?.id ?? null));
    } catch (e) {
      console.error("Fetch conversations error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to load chats." });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, conversation_id, created_at, role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    setMessages((data as Message[]) ?? []);
  };

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel("admin-chats:conversations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_conversations" },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedId).catch((e) => {
      console.error("Fetch messages error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to load messages." });
    });

    const channel = supabase
      .channel(`admin-chats:messages:${selectedId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          const row = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId, toast]);

  const sendReply = async () => {
    if (!selectedId || !reply.trim() || isSending) return;
    setIsSending(true);
    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: selectedId,
        role: "assistant",
        content: reply.trim(),
      });
      if (error) throw error;
      setReply("");
    } catch (e) {
      console.error("Send reply error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to send reply." });
    } finally {
      setIsSending(false);
    }
  };

  const createMeeting = async () => {
    if (!selectedConversation) return;
    if (!meetingDate || !meetingTime) {
      toast({ variant: "destructive", title: "Missing info", description: "Please choose date and time." });
      return;
    }
    try {
      const { error } = await supabase.from("meetings").insert({
        visitor_name: selectedConversation.visitor_name ?? "Visitor",
        visitor_phone: selectedConversation.visitor_phone,
        visitor_email: null,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        status: "pending",
        notes: `Scheduled from support chat (${selectedConversation.id})`,
      });
      if (error) throw error;
      setMeetingOpen(false);
      setMeetingDate("");
      setMeetingTime("");
      toast({ title: "Meeting created", description: "Saved in Meetings." });
    } catch (e) {
      console.error("Create meeting error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to create meeting." });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Chats</h1>
            <p className="text-muted-foreground mt-1">View and reply to support conversations</p>
          </div>
          <Button variant="outline" onClick={fetchConversations} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation list */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <p className="font-medium text-foreground">Conversations</p>
            </div>
            <ScrollArea className="h-[560px]">
              <div className="p-2">
                {conversations.length === 0 && !isLoading ? (
                  <p className="text-sm text-muted-foreground p-4">No chats yet.</p>
                ) : (
                  conversations.map((c, idx) => {
                    const active = c.id === selectedId;
                    return (
                      <motion.button
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors border ${
                          active
                            ? "bg-primary/10 border-primary/20"
                            : "bg-background border-transparent hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {c.visitor_name || "Unknown visitor"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {c.visitor_phone || "No phone"}
                            </p>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {selectedConversation?.visitor_name || "Select a conversation"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedConversation?.visitor_phone || ""}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setMeetingOpen(true)}
                disabled={!selectedConversation}
              >
                <CalendarPlus className="w-4 h-4 mr-2" />
                Schedule meeting
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                        m.role === "assistant"
                          ? "bg-secondary text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-background">
              <div className="flex gap-2">
                <Input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply as support…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  disabled={!selectedId || isSending}
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={sendReply}
                  disabled={!selectedId || !reply.trim() || isSending}
                  size="icon"
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={meetingOpen} onOpenChange={setMeetingOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a meeting</DialogTitle>
              <DialogDescription>
                This will create a meeting record linked to this chat.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
              <Input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setMeetingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createMeeting}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminChats;
