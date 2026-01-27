import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Receipt,
  Settings,
  LogOut,
  Home,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";

interface ClientService {
  id: string;
  service_name: string;
  service_description: string | null;
  price: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

const ClientDashboard = () => {
  const [services, setServices] = useState<ClientService[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = {
    bn: {
      dashboard: "ড্যাশবোর্ড",
      myServices: "আমার সার্ভিসসমূহ",
      invoices: "ইনভয়েস",
      settings: "সেটিংস",
      logout: "লগআউট",
      backToHome: "হোমে যান",
      welcome: "স্বাগতম",
      totalServices: "মোট সার্ভিস",
      totalSpent: "মোট খরচ",
      activeServices: "সক্রিয় সার্ভিস",
      pendingPayments: "বাকি পেমেন্ট",
      serviceName: "সার্ভিসের নাম",
      status: "স্ট্যাটাস",
      price: "মূল্য",
      paid: "পরিশোধিত",
      due: "বাকি",
      noServices: "কোনো সার্ভিস পাওয়া যায়নি",
      noServicesDesc: "আপনি এখনো কোনো সার্ভিস ক্রয় করেননি।",
      contactUs: "যোগাযোগ করুন",
      active: "সক্রিয়",
      pending: "পেন্ডিং",
      completed: "সম্পন্ন",
      cancelled: "বাতিল",
      paidStatus: "পেইড",
      unpaid: "আনপেইড",
      partial: "আংশিক",
      profileSettings: "প্রোফাইল সেটিংস",
      name: "নাম",
      email: "ইমেইল",
      phone: "ফোন",
      address: "ঠিকানা",
      updateProfile: "আপডেট করুন",
      invoiceHistory: "ইনভয়েস হিস্ট্রি",
      date: "তারিখ",
      amount: "পরিমাণ",
    },
    en: {
      dashboard: "Dashboard",
      myServices: "My Services",
      invoices: "Invoices",
      settings: "Settings",
      logout: "Logout",
      backToHome: "Back to Home",
      welcome: "Welcome",
      totalServices: "Total Services",
      totalSpent: "Total Spent",
      activeServices: "Active Services",
      pendingPayments: "Pending Payments",
      serviceName: "Service Name",
      status: "Status",
      price: "Price",
      paid: "Paid",
      due: "Due",
      noServices: "No services found",
      noServicesDesc: "You haven't purchased any services yet.",
      contactUs: "Contact Us",
      active: "Active",
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
      paidStatus: "Paid",
      unpaid: "Unpaid",
      partial: "Partial",
      profileSettings: "Profile Settings",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      updateProfile: "Update Profile",
      invoiceHistory: "Invoice History",
      date: "Date",
      amount: "Amount",
    },
  };

  const texts = t[language];

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/client/login");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);

      // Fetch services
      const { data: servicesData, error } = await supabase
        .from("client_services")
        .select("*")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(servicesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/client/login");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: texts.active, variant: "default" },
      pending: { label: texts.pending, variant: "secondary" },
      completed: { label: texts.completed, variant: "outline" },
      cancelled: { label: texts.cancelled, variant: "destructive" },
    };
    const { label, variant } = statusMap[status] || statusMap.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      paid: { label: texts.paidStatus, className: "bg-green-500/20 text-green-400" },
      unpaid: { label: texts.unpaid, className: "bg-red-500/20 text-red-400" },
      partial: { label: texts.partial, className: "bg-yellow-500/20 text-yellow-400" },
    };
    const { label, className } = statusMap[status] || statusMap.unpaid;
    return <Badge className={className}>{label}</Badge>;
  };

  const totalSpent = services.reduce((acc, s) => acc + s.paid_amount, 0);
  const activeCount = services.filter((s) => s.status === "active").length;
  const pendingPayments = services.reduce((acc, s) => acc + (s.price - s.paid_amount), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 hidden lg:block">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10">
          <img src={logo} alt="UR Media" className="w-8 h-8" />
          <span className="font-bold text-lg text-foreground">
            UR <span className="text-primary">Media</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("services")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "services"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Package size={20} />
            {texts.myServices}
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "invoices"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Receipt size={20} />
            {texts.invoices}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "settings"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Settings size={20} />
            {texts.settings}
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Home size={18} />
              {texts.backToHome}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {texts.logout}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-b border-border z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="UR Media" className="w-8 h-8" />
            <span className="font-bold text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("services")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "services" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Package size={20} />
            <span className="text-xs">{texts.myServices}</span>
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "invoices" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Receipt size={20} />
            <span className="text-xs">{texts.invoices}</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Settings size={20} />
            <span className="text-xs">{texts.settings}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 pb-24 lg:pb-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {texts.welcome}, {profile?.full_name || profile?.email?.split("@")[0] || "Client"}
            </h1>
            <p className="text-muted-foreground mt-1">{texts.dashboard}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-primary/10">
                    <Package className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{texts.totalServices}</p>
                    <p className="text-xl lg:text-2xl font-bold">{services.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-green-500/10">
                    <DollarSign className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{texts.totalSpent}</p>
                    <p className="text-xl lg:text-2xl font-bold">৳{totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-blue-500/10">
                    <CheckCircle className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{texts.activeServices}</p>
                    <p className="text-xl lg:text-2xl font-bold">{activeCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 rounded-xl bg-yellow-500/10">
                    <AlertCircle className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{texts.pendingPayments}</p>
                    <p className="text-xl lg:text-2xl font-bold">৳{pendingPayments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>{texts.myServices}</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-semibold mb-2">{texts.noServices}</h3>
                    <p className="text-muted-foreground mb-4">{texts.noServicesDesc}</p>
                    <Link to="/#contact">
                      <Button variant="gradient">{texts.contactUs}</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            {texts.serviceName}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            {texts.status}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            {texts.price}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            {texts.paid}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            {texts.due}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service) => (
                          <tr key={service.id} className="border-b border-border/50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{service.service_name}</p>
                                {service.service_description && (
                                  <p className="text-sm text-muted-foreground">
                                    {service.service_description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                {getStatusBadge(service.status)}
                                {getPaymentBadge(service.payment_status)}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium">
                              ৳{service.price.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-green-500">
                              ৳{service.paid_amount.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-yellow-500">
                              ৳{(service.price - service.paid_amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "invoices" && (
            <Card>
              <CardHeader>
                <CardTitle>{texts.invoiceHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">{texts.noServicesDesc}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Receipt className="text-primary" size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{service.service_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(service.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">৳{service.price.toLocaleString()}</p>
                          {getPaymentBadge(service.payment_status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>{texts.profileSettings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-muted-foreground">{texts.name}</label>
                    <p className="font-medium">{profile?.full_name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{texts.email}</label>
                    <p className="font-medium">{profile?.email || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{texts.phone}</label>
                    <p className="font-medium">{profile?.phone || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">{texts.address}</label>
                    <p className="font-medium">{profile?.address || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ClientDashboard;
