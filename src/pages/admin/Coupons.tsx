import { useState } from "react";
import { Search, Ticket, CheckCircle, XCircle, User, Mail, Phone, Calendar, Loader2, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  coupon_code: string | null;
  coupon_used: boolean | null;
  coupon_used_at: string | null;
  subscribed_at: string;
  is_active: boolean;
}

const Coupons = () => {
  const [searchCode, setSearchCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSubscriber, setVerifiedSubscriber] = useState<Subscriber | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

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
      } else {
        setVerifiedSubscriber(data as Subscriber);
        toast.success("✅ Valid coupon! 3% ছাড় প্রযোজ্য");
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
    unused: subscribers?.filter((s) => !s.coupon_used).length || 0,
    used: subscribers?.filter((s) => s.coupon_used).length || 0,
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
            Subscriber দের coupon code verify করুন এবং 3% ছাড় দিন
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
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
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Gift className="h-6 w-6 text-green-500" />
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
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <CheckCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.used}</p>
                  <p className="text-sm text-muted-foreground">Used Coupons</p>
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
                  verifiedSubscriber.coupon_used 
                    ? "bg-orange-500/10 border-orange-500/20" 
                    : "bg-green-500/10 border-green-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {verifiedSubscriber.coupon_used ? (
                      <>
                        <XCircle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium text-orange-600">Coupon আগে ব্যবহার হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-600">Valid Coupon! ✅ 3% ছাড় দিন</span>
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
                    {verifiedSubscriber.coupon_used && verifiedSubscriber.coupon_used_at && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Used: {format(new Date(verifiedSubscriber.coupon_used_at), "dd MMM yyyy, hh:mm a")}</span>
                      </div>
                    )}
                  </div>

                  {!verifiedSubscriber.coupon_used && (
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
                      <Badge variant={sub.coupon_used ? "secondary" : "default"}>
                        {sub.coupon_used ? "Used" : "Active"}
                      </Badge>
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
