import { useState, useEffect } from "react";
import { Search, Ticket, CheckCircle, XCircle, User, Mail, Phone, Calendar, Loader2, Gift, Users, Clock, AlertTriangle, Percent, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays, isPast } from "date-fns";

interface Subscriber {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  coupon_code: string | null;
  coupon_used: boolean | null;
  coupon_used_at: string | null;
  coupon_expires_at: string | null;
  subscribed_at: string;
  is_active: boolean;
}

// Helper to check if coupon is expired
const isCouponExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false;
  return isPast(new Date(expiresAt));
};

// Get remaining days
const getRemainingDays = (expiresAt: string | null): number | null => {
  if (!expiresAt) return null;
  const days = differenceInDays(new Date(expiresAt), new Date());
  return days < 0 ? 0 : days;
};

const Coupons = () => {
  const [searchCode, setSearchCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSubscriber, setVerifiedSubscriber] = useState<Subscriber | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState("3");
  const [isSavingDiscount, setIsSavingDiscount] = useState(false);
  const queryClient = useQueryClient();

  // Fetch discount percentage from site_settings
  const { data: discountSetting } = useQuery({
    queryKey: ["site-settings", "coupon_discount_percent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "coupon_discount_percent")
        .maybeSingle();

      if (error) throw error;
      return data?.value || "3";
    },
  });

  useEffect(() => {
    if (discountSetting) {
      setDiscountPercent(discountSetting);
    }
  }, [discountSetting]);

  // Fetch all subscribers with coupons
  const { data: subscribers, isLoading, refetch } = useQuery({
    queryKey: ["notification-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_subscribers")
        .select("*")
        .not("coupon_code", "is", null)
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });

  const handleSaveDiscount = async () => {
    const percent = parseFloat(discountPercent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
      toast.error("সঠিক percentage দিন (0-100)");
      return;
    }

    setIsSavingDiscount(true);
    try {
      // Upsert the setting
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { key: "coupon_discount_percent", value: discountPercent },
          { onConflict: "key" }
        );

      if (error) throw error;

      toast.success(`Discount ${discountPercent}% সেট করা হয়েছে!`);
      queryClient.invalidateQueries({ queryKey: ["site-settings", "coupon_discount_percent"] });
    } catch (error: any) {
      console.error("Error saving discount:", error);
      toast.error("সমস্যা হয়েছে");
    } finally {
      setIsSavingDiscount(false);
    }
  };

  const handleVerifyCoupon = async () => {
    if (!searchCode.trim()) {
      toast.error("Coupon code দিন");
      return;
    }

    setIsVerifying(true);
    setVerifiedSubscriber(null);
    setVerificationError(null);

    try {
      const { data, error } = await supabase
        .from("notification_subscribers")
        .select("*")
        .eq("coupon_code", searchCode.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setVerificationError("এই coupon code টি valid নয়!");
        toast.error("Invalid coupon code!");
      } else if (data.coupon_used) {
        setVerifiedSubscriber(data as Subscriber);
        setVerificationError("এই coupon code আগেই ব্যবহার হয়ে গেছে!");
        toast.warning("Coupon already used!");
      } else if (isCouponExpired(data.coupon_expires_at)) {
        setVerifiedSubscriber(data as Subscriber);
        setVerificationError("এই coupon code expire হয়ে গেছে!");
        toast.error("Coupon expired!");
      } else {
        setVerifiedSubscriber(data as Subscriber);
        const remaining = getRemainingDays(data.coupon_expires_at);
        toast.success(`✅ Valid coupon! ${discountPercent}% ছাড় প্রযোজ্য${remaining !== null ? ` (${remaining} দিন বাকি)` : ""}`);
      }
    } catch (error: any) {
      console.error("Error verifying coupon:", error);
      toast.error("Verification এ সমস্যা হয়েছে");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMarkAsUsed = async (subscriberId: string) => {
    try {
      const { error } = await supabase
        .from("notification_subscribers")
        .update({
          coupon_used: true,
          coupon_used_at: new Date().toISOString(),
        })
        .eq("id", subscriberId);

      if (error) throw error;

      toast.success("Coupon ব্যবহৃত হিসেবে mark করা হয়েছে!");
      setVerifiedSubscriber(null);
      setSearchCode("");
      refetch();
    } catch (error: any) {
      console.error("Error marking coupon as used:", error);
      toast.error("সমস্যা হয়েছে");
    }
  };

  const stats = {
    total: subscribers?.length || 0,
    unused: subscribers?.filter((s) => !s.coupon_used && !isCouponExpired(s.coupon_expires_at)).length || 0,
    used: subscribers?.filter((s) => s.coupon_used).length || 0,
    expired: subscribers?.filter((s) => !s.coupon_used && isCouponExpired(s.coupon_expires_at)).length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Ticket className="h-8 w-8" />
            Coupon Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Subscriber দের coupon code verify করুন এবং {discountPercent}% ছাড় দিন
          </p>
        </div>

        {/* Discount Setting */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Percent className="h-5 w-5" />
              Coupon Discount সেট করুন
            </CardTitle>
            <CardDescription>
              এই percentage টি subscriber popup এ দেখাবে
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-24 text-lg font-bold text-center"
                />
                <span className="text-2xl font-bold text-muted-foreground">%</span>
              </div>
              <Button onClick={handleSaveDiscount} disabled={isSavingDiscount}>
                {isSavingDiscount ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save করুন
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">মোট Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.unused}</p>
                  <p className="text-sm text-muted-foreground">Active Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary">
                  <CheckCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.used}</p>
                  <p className="text-sm text-muted-foreground">Used Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.expired}</p>
                  <p className="text-sm text-muted-foreground">Expired</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Verify Coupon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Coupon Verify করুন
              </CardTitle>
              <CardDescription>
                Customer এর coupon code দিয়ে check করুন valid কিনা
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code লিখুন (যেমন: HIM78XY)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  className="font-mono text-lg tracking-wider"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyCoupon()}
                />
                <Button onClick={handleVerifyCoupon} disabled={isVerifying}>
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Verification Result */}
              {verificationError && !verifiedSubscriber && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">{verificationError}</span>
                  </div>
                </div>
              )}

              {verifiedSubscriber && (
                <div className={`p-4 rounded-lg border ${
                  verifiedSubscriber.coupon_used || isCouponExpired(verifiedSubscriber.coupon_expires_at)
                    ? "bg-muted border-border" 
                    : "bg-primary/5 border-primary/20"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {verifiedSubscriber.coupon_used ? (
                      <>
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground">Coupon আগে ব্যবহার হয়েছে</span>
                      </>
                    ) : isCouponExpired(verifiedSubscriber.coupon_expires_at) ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="font-medium text-destructive">Coupon Expire হয়ে গেছে!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="font-medium text-primary">Valid Coupon! ✅ {discountPercent}% ছাড় দিন</span>
                        {getRemainingDays(verifiedSubscriber.coupon_expires_at) !== null && (
                          <Badge variant="outline" className="ml-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {getRemainingDays(verifiedSubscriber.coupon_expires_at)} দিন বাকি
                          </Badge>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {verifiedSubscriber.name && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{verifiedSubscriber.name}</span>
                      </div>
                    )}
                    {verifiedSubscriber.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{verifiedSubscriber.email}</span>
                      </div>
                    )}
                    {verifiedSubscriber.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{verifiedSubscriber.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Subscribed: {format(new Date(verifiedSubscriber.subscribed_at), "dd MMM yyyy, hh:mm a")}</span>
                    </div>
                    {verifiedSubscriber.coupon_expires_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {format(new Date(verifiedSubscriber.coupon_expires_at), "dd MMM yyyy")}</span>
                      </div>
                    )}
                    {verifiedSubscriber.coupon_used && verifiedSubscriber.coupon_used_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>Used: {format(new Date(verifiedSubscriber.coupon_used_at), "dd MMM yyyy, hh:mm a")}</span>
                      </div>
                    )}
                  </div>

                  {!verifiedSubscriber.coupon_used && !isCouponExpired(verifiedSubscriber.coupon_expires_at) && (
                    <Button
                      onClick={() => handleMarkAsUsed(verifiedSubscriber.id)}
                      className="w-full mt-4"
                      variant="default"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      ব্যবহৃত হিসেবে Mark করুন
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Coupons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Recent Coupons
              </CardTitle>
              <CardDescription>
                সর্বশেষ generate হওয়া coupon codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : subscribers && subscribers.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {subscribers.slice(0, 10).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-mono font-bold text-primary">
                          {sub.coupon_code}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {sub.name || sub.email || sub.phone || "Unknown"}
                        </div>
                      </div>
                      {(() => {
                        const expired = isCouponExpired(sub.coupon_expires_at);
                        const remaining = getRemainingDays(sub.coupon_expires_at);
                        
                        if (sub.coupon_used) {
                          return <Badge variant="secondary">Used</Badge>;
                        }
                        if (expired) {
                          return <Badge variant="destructive">Expired</Badge>;
                        }
                        return (
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Active</Badge>
                            {remaining !== null && remaining <= 7 && (
                              <Badge variant="outline" className="text-xs">
                                {remaining}d
                              </Badge>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>কোনো coupon নেই</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Coupons;
