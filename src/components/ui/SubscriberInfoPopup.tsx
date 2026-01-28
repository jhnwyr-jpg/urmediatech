import { useState, useEffect } from "react";
import { X, Gift, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriberInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  playerId?: string;
}

const SubscriberInfoPopup = ({ isOpen, onClose, playerId }: SubscriberInfoPopupProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() && !phone.trim()) {
      toast.error("অন্তত email অথবা phone নম্বর দিন");
      return;
    }

    // Basic email validation
    if (email.trim() && !email.includes("@")) {
      toast.error("সঠিক email address দিন");
      return;
    }

    setIsSubmitting(true);

    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      };

      const { error } = await supabase.from("notification_subscribers").insert({
        email: email.trim() || null,
        phone: phone.trim() || null,
        name: name.trim() || null,
        onesignal_player_id: playerId || null,
        device_info: deviceInfo,
      });

      if (error) throw error;

      toast.success("ধন্যবাদ! 🎉 আপনি 3% ছাড় পাবেন!");
      
      // Mark as submitted in localStorage
      localStorage.setItem("subscriber_info_submitted", "true");
      
      onClose();
    } catch (error: any) {
      console.error("Error saving subscriber info:", error);
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Still save that they subscribed, just without contact info
    localStorage.setItem("subscriber_popup_skipped", "true");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleSkip()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🎉 ধন্যবাদ Subscriber হওয়ার জন্য!
              </h2>
              <p className="text-white/90 text-sm">
                আপনার জন্য বিশেষ <span className="font-bold text-yellow-300">3% ছাড়!</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-center text-muted-foreground text-sm mb-4">
                আপনার contact info দিন এবং exclusive offers পান!
              </p>

              <div className="space-y-2">
                <Label htmlFor="sub-name">আপনার নাম</Label>
                <Input
                  id="sub-name"
                  placeholder="যেমন: রহিম উদ্দিন"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-email">Email Address</Label>
                <Input
                  id="sub-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-phone">Phone Number</Label>
                <Input
                  id="sub-phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  পরে দেব
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      সংরক্ষণ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      3% ছাড় নিন
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                আমরা আপনার তথ্য গোপন রাখি এবং spam করি না 🔒
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriberInfoPopup;
