import { useState } from "react";
import { Users, Mail, Phone, Download, Search, Calendar, Ticket, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  coupon_expires_at: string | null;
  subscribed_at: string;
  is_active: boolean;
}

const Subscribers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all subscribers
  const { data: subscribers, isLoading, refetch } = useQuery({
    queryKey: ["all-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      return data as Subscriber[];
    },
  });

  // Filter subscribers based on search
  const filteredSubscribers = subscribers?.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      sub.email?.toLowerCase().includes(query) ||
      sub.phone?.includes(query) ||
      sub.name?.toLowerCase().includes(query) ||
      sub.coupon_code?.toLowerCase().includes(query)
    );
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.error("Export করার জন্য কোনো data নেই");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Coupon Code", "Coupon Used", "Subscribed At"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map((sub) =>
        [
          sub.name || "",
          sub.email || "",
          sub.phone || "",
          sub.coupon_code || "",
          sub.coupon_used ? "Yes" : "No",
          sub.subscribed_at ? format(new Date(sub.subscribed_at), "yyyy-MM-dd HH:mm") : "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${subscribers.length} টি record export হয়েছে!`);
  };

  // Copy all emails
  const handleCopyEmails = async () => {
    const emails = subscribers?.filter((s) => s.email).map((s) => s.email).join(", ");
    if (!emails) {
      toast.error("কোনো email নেই");
      return;
    }
    await navigator.clipboard.writeText(emails);
    toast.success("সব emails copy হয়েছে!");
  };

  // Copy all phones
  const handleCopyPhones = async () => {
    const phones = subscribers?.filter((s) => s.phone).map((s) => s.phone).join(", ");
    if (!phones) {
      toast.error("কোনো phone নেই");
      return;
    }
    await navigator.clipboard.writeText(phones);
    toast.success("সব phone numbers copy হয়েছে!");
  };

  const stats = {
    total: subscribers?.length || 0,
    withEmail: subscribers?.filter((s) => s.email).length || 0,
    withPhone: subscribers?.filter((s) => s.phone).length || 0,
    withCoupon: subscribers?.filter((s) => s.coupon_code).length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8" />
              Subscribers
            </h1>
            <p className="text-muted-foreground mt-1">
              Notification subscribers দের email এবং phone number সংগ্রহ করুন
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExportCSV} disabled={!subscribers?.length}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">মোট Subscribers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withEmail}</p>
                  <p className="text-sm text-muted-foreground">With Email</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withPhone}</p>
                  <p className="text-sm text-muted-foreground">With Phone</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.withCoupon}</p>
                  <p className="text-sm text-muted-foreground">With Coupon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>দ্রুত email বা phone copy করুন</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleCopyEmails} disabled={!stats.withEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Copy All Emails ({stats.withEmail})
            </Button>
            <Button variant="outline" onClick={handleCopyPhones} disabled={!stats.withPhone}>
              <Phone className="h-4 w-4 mr-2" />
              Copy All Phones ({stats.withPhone})
            </Button>
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  সব Subscribers
                </CardTitle>
                <CardDescription>
                  সব notification subscribers এর list
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSubscribers && filteredSubscribers.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Coupon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          {sub.name || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {sub.email ? (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {sub.email}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {sub.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {sub.phone}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {sub.coupon_code ? (
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {sub.coupon_code}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {sub.coupon_used ? (
                            <Badge variant="secondary">Used</Badge>
                          ) : sub.coupon_code ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="outline">No Coupon</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(sub.subscribed_at), "dd MMM yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">কোনো subscriber নেই</p>
                <p className="text-sm mt-1">
                  Visitors notification subscribe করলে এখানে দেখাবে
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Subscribers;
