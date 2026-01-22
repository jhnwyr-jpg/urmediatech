import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Headset, User, Loader2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type Role = "user" | "assistant";
type Message = { id?: string; role: Role; content: string; created_at?: string };

const SUPPORT_SESSION_KEY = "urmedia_support_session_id";
const SUPPORT_CONV_KEY = "urmedia_support_conversation_id";
const SUPPORT_VISITOR_KEY = "urmedia_support_visitor";

function getOrCreateSessionId() {
  const existing = localStorage.getItem(SUPPORT_SESSION_KEY);
  if (existing && existing.length >= 8) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(SUPPORT_SESSION_KEY, next);
  return next;
}

const SupportChatWidget = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => localStorage.getItem(SUPPORT_CONV_KEY));

  const savedVisitor = useMemo(() => {
    try {
      const raw = localStorage.getItem(SUPPORT_VISITOR_KEY);
      return raw ? (JSON.parse(raw) as { name: string; phone: string }) : null;
    } catch {
      return null;
    }
  }, []);
  const [visitorName, setVisitorName] = useState(savedVisitor?.name ?? "");
  const [visitorPhone, setVisitorPhone] = useState(savedVisitor?.phone ?? "");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canChat = Boolean(conversationId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Focus input
  useEffect(() => {
    if (isOpen && canChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, canChat]);

  // Global opener (used by navbar “Contact”)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-support-chat", handler);
    return () => window.removeEventListener("open-support-chat", handler);
  }, []);

  // Load existing messages + subscribe
  useEffect(() => {
    if (!conversationId || !isOpen) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!cancelled) {
        if (error) {
          console.error("Support chat fetch messages error:", error);
          return;
        }
        setMessages((data as Message[]) ?? []);
      }
    })();

    const channel = supabase
      .channel(`support-chat:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const row = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m) => m.id && m.id === row.id)) return prev;
            return [...prev, { id: row.id, role: row.role, content: row.content, created_at: row.created_at }];
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [conversationId, isOpen]);

  const startSupportChat = useCallback(async () => {
    const name = visitorName.trim();
    const phone = visitorPhone.trim();
    if (!name || phone.length < 6) {
      toast({
        variant: "destructive",
        title: "Missing info",
        description: "Please enter your name and a valid phone number.",
      });
      return;
    }

    setIsStarting(true);
    try {
      const sessionId = getOrCreateSessionId();
      const { data, error } = await supabase.functions.invoke("support-chat-init", {
        body: { sessionId, visitorName: name, visitorPhone: phone },
      });

      if (error) throw error;
      if (!data?.conversationId) throw new Error("No conversation id");

      localStorage.setItem(SUPPORT_VISITOR_KEY, JSON.stringify({ name, phone }));
      localStorage.setItem(SUPPORT_CONV_KEY, data.conversationId);
      setConversationId(data.conversationId);

      // Seed welcome message
      setMessages([
        {
          role: "assistant",
          content: "Hi! Thanks for contacting UR Media support. How can we help you today?",
        },
      ]);
    } catch (e) {
      console.error("Support chat init error:", e);
      toast({
        variant: "destructive",
        title: "Couldn’t start chat",
        description: "Please try again in a moment.",
      });
    } finally {
      setIsStarting(false);
    }
  }, [toast, visitorName, visitorPhone]);

  const handleSend = useCallback(async () => {
    if (!conversationId || !input.trim() || isLoading) return;
    const content = input.trim();
    setInput("");
    setIsLoading(true);

    // optimistic append
    setMessages((prev) => [...prev, { role: "user", content }]);

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content,
      });
      if (error) throw error;
    } catch (e) {
      console.error("Support chat send error:", e);
      toast({
        variant: "destructive",
        title: "Message not sent",
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, input, isLoading, toast]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* No extra floating button: this opens from Navbar “Contact” */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            aria-label="Support chat window"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Headset className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-xs opacity-80">Online • Replying in admin panel</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!canChat ? (
              <div className="p-4 space-y-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm text-foreground font-medium">Before we start</p>
                  <p className="text-sm text-muted-foreground mt-1">Please share your name and phone number.</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Your name"
                      className="pl-9"
                      disabled={isStarting}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="Phone number"
                      className="pl-9"
                      disabled={isStarting}
                      inputMode="tel"
                    />
                  </div>
                </div>

                <Button
                  onClick={startSupportChat}
                  disabled={isStarting}
                  className="w-full rounded-full"
                >
                  {isStarting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Start chat
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id ?? index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.role === "user" ? <User className="w-4 h-4" /> : <Headset className="w-4 h-4" />}
                        </div>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Headset className="w-4 h-4" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border bg-background">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Type your message…"
                      disabled={isLoading}
                      className="flex-1 rounded-full"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="rounded-full"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChatWidget;
