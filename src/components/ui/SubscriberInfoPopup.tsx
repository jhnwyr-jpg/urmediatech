import { useState } from "react";
import { X, Gift, Loader2, Copy, Check } from "lucide-react";
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

// Generate coupon code from email and phone
const generateCouponCode = (email: string, phone: string): string => {
  // Get last 3 characters before @ from email
  const emailPart = email.split("@")[0];
  const emailChars = emailPart.slice(-3).toUpperCase();
  
  // Get last 2 digits from phone
  const phoneDigits = phone.replace(/\D/g, "").slice(-2);
  
  // Combine: EMAIL3 + PHONE2 + random 2 chars for uniqueness
  const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
  
  return `${emailChars}${phoneDigits}${randomChars}`;
};

const SubscriberInfoPopup = ({ isOpen, onClose, playerId }: SubscriberInfoPopupProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Need both email and phone for coupon
    if (!email.trim() || !phone.trim()) {
      toast.error("Coupon পেতে email এবং phone দুটোই দিতে হবে");
      return;
    }

    // Basic email validation
    if (!email.includes("@")) {
      toast.error("সঠিক email address দিন");
      return;
    }

    // Phone validation (at least 6 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 6) {
      toast.error("সঠিক phone number দিন");
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

      // Generate unique coupon code
      const couponCode = generateCouponCode(email, phone);

      const { error } = await supabase.from("notification_subscribers").insert({
        email: email.trim(),
        phone: phone.trim(),
        name: name.trim() || null,
        onesignal_player_id: playerId || null,
        device_info: deviceInfo,
        coupon_code: couponCode,
      });

      if (error) throw error;

      // Show the coupon code
      setGeneratedCoupon(couponCode);
      
      // Mark as submitted in localStorage
      localStorage.setItem("subscriber_info_submitted", "true");
      localStorage.setItem("subscriber_coupon", couponCode);
      
      toast.success("🎉 আপনার Coupon Code তৈরি হয়েছে!");
    } catch (error: any) {
      console.error("Error saving subscriber info:", error);
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCoupon = async () => {
    if (generatedCoupon) {
      await navigator.clipboard.writeText(generatedCoupon);
      setCopied(true);
      toast.success("Coupon code কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("subscriber_popup_skipped", "true");
    localStorage.setItem("subscriber_popup_skip_time", Date.now().toString());
    onClose();
  };

  const handleClose = () => {
    setGeneratedCoupon(null);
    setEmail("");
    setPhone("");
    setName("");
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
          onClick={(e) => e.target === e.currentTarget && (generatedCoupon ? handleClose() : handleSkip())}
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
              onClick={generatedCoupon ? handleClose : handleSkip}
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
                {generatedCoupon ? "🎊 আপনার Coupon Code!" : "🎉 ধন্যবাদ Subscriber হওয়ার জন্য!"}
              </h2>
              <p className="text-white/90 text-sm">
                {generatedCoupon 
                  ? "এই code ব্যবহার করে 3% ছাড় পান!" 
                  : <>আপনার জন্য বিশেষ <span className="font-bold text-yellow-300">3% ছাড়!</span></>
                }
              </p>
            </div>

            {generatedCoupon ? (
              // Show coupon code
              <div className="p-6 space-y-4">
                <div className="bg-muted rounded-xl p-6 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">আপনার Coupon Code:</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold tracking-wider text-primary font-mono">
                      {generatedCoupon}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyCoupon}
                      className="h-10 w-10"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Order করার সময় এই code দিয়ে 3% ছাড় পাবেন
                  </p>
                </div>

                <Button onClick={handleClose} className="w-full" size="lg">
                  ধন্যবাদ! 🙏
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Code টি সংরক্ষণ করুন। প্রতি subscriber এর জন্য একটি unique code!
                </p>
              </div>
            ) : (
              // Form
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-center text-muted-foreground text-sm mb-4">
                  আপনার contact info দিন এবং <span className="font-semibold text-primary">unique coupon code</span> পান!
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
                  <Label htmlFor="sub-email">Email Address *</Label>
                  <Input
                    id="sub-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-phone">Phone Number *</Label>
                  <Input
                    id="sub-phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                    required
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
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        তৈরি হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Coupon নিন
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  আমরা আপনার তথ্য গোপন রাখি এবং spam করি না 🔒
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriberInfoPopup;
