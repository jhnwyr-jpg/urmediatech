import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

const AGENT_ID = "agent_4101kkxx1rygfy5v5f7mfkfxzm0m";

const ElevenLabsAgent = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log("ElevenLabs Agent connected"),
    onDisconnect: () => console.log("ElevenLabs Agent disconnected"),
    onError: (error) => console.error("ElevenLabs error:", error),
  });

  const isConnected = conversation.status === "connected";

  const startConversation = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, isConnecting]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-[72px] left-0 bg-card border border-border rounded-xl p-3 shadow-xl min-w-[180px]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-foreground">AI Tutor Active</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {conversation.isSpeaking ? "🔊 Speaking..." : "🎙️ Listening..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={isConnected ? stopConversation : startConversation}
        disabled={isConnecting}
        className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors ${
          isConnected
            ? "bg-destructive text-destructive-foreground"
            : "bg-accent text-accent-foreground hover:bg-accent/90"
        } ${isConnecting ? "opacity-70 cursor-wait" : ""}`}
      >
        {/* Pulse ring when connected */}
        {isConnected && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-destructive" style={{ animationDuration: "2s" }} />
        )}

        {isConnecting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : isConnected ? (
          <PhoneOff className="w-5 h-5" />
        ) : (
          <Phone className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};

export default ElevenLabsAgent;
