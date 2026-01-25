import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Headset, User, Loader2, Phone, ArrowLeft, MessageCircle, Check, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Role = "user" | "assistant";
type Message = { id?: string; role: Role; content: string; created_at?: string; is_seen?: boolean };

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

const ChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(() => 
    localStorage.getItem(SUPPORT_CONV_KEY)
  );
  const [adminTyping, setAdminTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canChat = Boolean(conversationId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (canChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [canChat]);

  // Load existing messages + subscribe to messages and typing
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at, is_seen")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!cancelled) {
        if (error) {
          console.error("Support chat fetch messages error:", error);
          return;
        }
        setMessages((data as Message[]) ?? []);
        
        // Mark unseen assistant messages as seen
        const unseenIds = (data || [])
          .filter((m: any) => m.role === "assistant" && !m.is_seen)
          .map((m: any) => m.id);
        
        if (unseenIds.length > 0) {
          await supabase
            .from("chat_messages")
            .update({ is_seen: true })
            .in("id", unseenIds);
        }
      }
    })();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`support-chat-page:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const row = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m) => m.id && m.id === row.id)) return prev;
            return [...prev, { id: row.id, role: row.role, content: row.content, created_at: row.created_at, is_seen: row.is_seen }];
          });
          
          // Mark as seen if it's from admin
          if (row.role === "assistant") {
            supabase
              .from("chat_messages")
              .update({ is_seen: true })
              .eq("id", row.id);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const row = payload.new as any;
          setMessages((prev) =>
            prev.map((m) => (m.id === row.id ? { ...m, is_seen: row.is_seen } : m))
          );
        }
      )
      .subscribe();

    // Subscribe to typing indicator
    const typingChannel = supabase
      .channel(`support-typing:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_conversations", filter: `id=eq.${conversationId}` },
        (payload) => {
          const row = payload.new as any;
          setAdminTyping(row.admin_typing === true);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [conversationId]);

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
        title: "Couldn't start chat",
        description: "Please try again in a moment.",
      });
    } finally {
      setIsStarting(false);
    }
  }, [toast, visitorName, visitorPhone]);

  // Update visitor typing status
  const updateTypingStatus = useCallback(async (isTyping: boolean) => {
    if (!conversationId) return;
    await supabase
      .from("chat_conversations")
      .update({ visitor_typing: isTyping })
      .eq("id", conversationId);
  }, [conversationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Set typing to true
    updateTypingStatus(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to clear typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);
  };

  const handleSend = useCallback(async () => {
    if (!conversationId || !input.trim() || isLoading) return;
    const content = input.trim();
    setInput("");
    setIsLoading(true);
    
    // Clear typing status
    updateTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
  }, [conversationId, input, isLoading, toast, updateTypingStatus]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Customer Support</h1>
              <p className="text-xs opacity-80">Online • Replying in admin panel</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {!canChat ? (
          /* Pre-chat form */
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Start a Conversation</h2>
                <p className="text-muted-foreground">
                  We're here to help! Share your details to connect with our support team.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Your name"
                      className="pl-11 h-12 text-base rounded-xl"
                      disabled={isStarting}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      placeholder="Phone number"
                      className="pl-11 h-12 text-base rounded-xl"
                      disabled={isStarting}
                      inputMode="tel"
                    />
                  </div>
                </div>

                <Button
                  onClick={startSupportChat}
                  disabled={isStarting}
                  size="lg"
                  className="w-full rounded-xl h-12 text-base"
                >
                  {isStarting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Start Chat
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Chat Messages */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id ?? index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted border border-border"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Headset className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}>
                        {message.created_at && (
                          <span className={`text-[10px] ${
                            message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                        {/* Seen status for user messages */}
                        {message.role === "user" && message.id && (
                          <span className="text-primary-foreground/60">
                            {message.is_seen ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Admin typing indicator */}
              {adminTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Headset className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-muted-foreground">typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Headset className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4">
              <div className="max-w-4xl mx-auto flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-full px-5 text-base bg-muted/50 border-border/50 focus:bg-background"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
