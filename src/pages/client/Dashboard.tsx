import { useEffect, useState, useRef } from "react";
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
  Ticket,
  Plus,
  Send,
  Loader2,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";
import NotificationBell from "@/components/ui/NotificationBell";

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

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
}

const ClientDashboard = () => {
  const [services, setServices] = useState<ClientService[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Profile edit states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = {
    bn: {
      dashboard: "ড্যাশবোর্ড",
      myServices: "আমার সার্ভিস",
      invoices: "ইনভয়েস",
      tickets: "টিকেট",
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
      updateProfile: "প্রোফাইল আপডেট করুন",
      invoiceHistory: "ইনভয়েস হিস্ট্রি",
      date: "তারিখ",
      amount: "পরিমাণ",
      createTicket: "নতুন টিকেট",
      subject: "বিষয়",
      message: "বার্তা",
      priority: "প্রায়োরিটি",
      low: "কম",
      medium: "মাঝারি",
      high: "জরুরি",
      submit: "জমা দিন",
      noTickets: "কোনো টিকেট নেই",
      noTicketsDesc: "আপনি এখনো কোনো সাপোর্ট টিকেট তৈরি করেননি।",
      open: "ওপেন",
      closed: "ক্লোজড",
      inProgress: "প্রসেসিং",
      adminReply: "অ্যাডমিন রিপ্লাই",
      supportTickets: "সাপোর্ট টিকেট",
      changePassword: "পাসওয়ার্ড পরিবর্তন",
      newPassword: "নতুন পাসওয়ার্ড",
      confirmNewPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      changePasswordBtn: "পাসওয়ার্ড পরিবর্তন করুন",
      passwordMismatch: "পাসওয়ার্ড মিলছে না",
      passwordTooShort: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে",
      passwordChanged: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
      profileUpdated: "প্রোফাইল আপডেট হয়েছে",
      avatarUpdated: "প্রোফাইল ছবি আপডেট হয়েছে",
      uploadPhoto: "ছবি আপলোড করুন",
      saving: "সেভ হচ্ছে...",
      emailReadonly: "ইমেইল পরিবর্তন করা যায় না",
      securitySection: "নিরাপত্তা",
    },
    en: {
      dashboard: "Dashboard",
      myServices: "My Services",
      invoices: "Invoices",
      tickets: "Tickets",
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
      createTicket: "New Ticket",
      subject: "Subject",
      message: "Message",
      priority: "Priority",
      low: "Low",
      medium: "Medium",
      high: "High",
      submit: "Submit",
      noTickets: "No tickets yet",
      noTicketsDesc: "You haven't created any support tickets yet.",
      open: "Open",
      closed: "Closed",
      inProgress: "In Progress",
      adminReply: "Admin Reply",
      supportTickets: "Support Tickets",
      changePassword: "Change Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm Password",
      changePasswordBtn: "Change Password",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      passwordChanged: "Password changed successfully",
      profileUpdated: "Profile updated successfully",
      avatarUpdated: "Profile photo updated",
      uploadPhoto: "Upload Photo",
      saving: "Saving...",
      emailReadonly: "Email cannot be changed",
      securitySection: "Security",
    },
  };

  const texts = t[language];

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || "");
      setEditPhone(profile.phone || "");
      setEditAddress(profile.address || "");
    }
  }, [profile]);

  const checkAuthAndFetchData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/client/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address, avatar_url")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);

      const { data: servicesData, error } = await supabase
        .from("client_services")
        .select("*")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(servicesData || []);

      const { data: ticketsData } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("client_id", session.user.id)
        .order("created_at", { ascending: false });

      setTickets(ticketsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editName.trim() || null,
          phone: editPhone.trim() || null,
          address: editAddress.trim() || null,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, full_name: editName.trim(), phone: editPhone.trim(), address: editAddress.trim() } : prev);
      toast({ title: texts.profileUpdated });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error updating profile", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be less than 2MB", variant: "destructive" });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${session.user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrlWithCache = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrlWithCache })
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrlWithCache } : prev);
      toast({ title: texts.avatarUpdated });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({ title: "Error uploading photo", variant: "destructive" });
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: texts.passwordTooShort, variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: texts.passwordMismatch, variant: "destructive" });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({ title: texts.passwordChanged });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({ title: error.message || "Error changing password", variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast({ title: "বিষয় এবং বার্তা লিখুন", variant: "destructive" });
      return;
    }

    setIsSubmittingTicket(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from("support_tickets").insert({
        client_id: session.user.id,
        subject: ticketSubject,
        message: ticketMessage,
        priority: ticketPriority,
      });

      if (error) throw error;

      toast({ title: "টিকেট তৈরি হয়েছে!" });
      setTicketSubject("");
      setTicketMessage("");
      setTicketPriority("medium");
      setIsTicketDialogOpen(false);
      checkAuthAndFetchData();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({ title: "টিকেট তৈরি করতে সমস্যা হয়েছে", variant: "destructive" });
    } finally {
      setIsSubmittingTicket(false);
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

  const getTicketStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      open: { label: texts.open, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      in_progress: { label: texts.inProgress, className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      closed: { label: texts.closed, className: "bg-green-500/20 text-green-400 border-green-500/30" },
    };
    const { label, className } = map[status] || map.open;
    return <Badge className={`${className} border`}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { label: string; className: string }> = {
      low: { label: texts.low, className: "bg-gray-500/20 text-gray-400" },
      medium: { label: texts.medium, className: "bg-yellow-500/20 text-yellow-400" },
      high: { label: texts.high, className: "bg-red-500/20 text-red-400" },
    };
    const { label, className } = map[priority] || map.medium;
    return <Badge className={className}>{label}</Badge>;
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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

  const sidebarItems = [
    { key: "services", icon: Package, label: texts.myServices, badge: 0 },
    { key: "invoices", icon: Receipt, label: texts.invoices, badge: 0 },
    { key: "tickets", icon: Ticket, label: texts.tickets, badge: tickets.filter(t => t.status === "open").length },
    { key: "settings", icon: Settings, label: texts.settings, badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden lg:flex lg:flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={logo} alt="UR Media" className="w-8 h-8" />
            <span className="font-bold text-lg text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </Link>

          {/* Sidebar Avatar */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-muted/50">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {profile?.full_name || "Client"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge > 0 && (
                <span className={`ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                  activeTab === item.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-border">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <Home size={16} />
              {texts.backToHome}
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut size={16} />
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
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-50 px-2 py-2">
        <div className="flex justify-around">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center gap-1 px-3 py-2 relative transition-colors ${
                activeTab === item.key ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px]">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
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
          <div className="mb-8 flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/30 shadow-lg hidden sm:flex">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {texts.welcome}, {profile?.full_name || profile?.email?.split("@")[0] || "Client"} 👋
              </h1>
              <p className="text-muted-foreground mt-0.5">{texts.dashboard}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: texts.totalServices, value: services.length, color: "text-primary", bg: "bg-primary/10" },
              { icon: DollarSign, label: texts.totalSpent, value: `৳${totalSpent.toLocaleString()}`, color: "text-green-500", bg: "bg-green-500/10" },
              { icon: CheckCircle, label: texts.activeServices, value: activeCount, color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: AlertCircle, label: texts.pendingPayments, value: `৳${pendingPayments.toLocaleString()}`, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow duration-300 overflow-hidden relative group">
                  <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                  <CardContent className="p-4 lg:p-6 relative">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 lg:p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={stat.color} size={20} />
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Services Tab */}
          {activeTab === "services" && (
            <Card className="shadow-sm">
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
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{texts.serviceName}</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{texts.status}</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{texts.price}</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{texts.paid}</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{texts.due}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-4">
                                <p className="font-medium">{service.service_name}</p>
                                {service.service_description && (
                                  <p className="text-sm text-muted-foreground">{service.service_description}</p>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  {getStatusBadge(service.status)}
                                  {getPaymentBadge(service.payment_status)}
                                </div>
                              </td>
                              <td className="py-4 px-4 font-medium">৳{service.price.toLocaleString()}</td>
                              <td className="py-4 px-4 text-green-500">৳{service.paid_amount.toLocaleString()}</td>
                              <td className="py-4 px-4 text-yellow-500">৳{(service.price - service.paid_amount).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                      {services.map((service) => (
                        <div key={service.id} className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{service.service_name}</p>
                              {service.service_description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{service.service_description}</p>
                              )}
                            </div>
                            <div className="flex gap-1.5">
                              {getStatusBadge(service.status)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{texts.price}: <span className="font-medium text-foreground">৳{service.price.toLocaleString()}</span></span>
                            {getPaymentBadge(service.payment_status)}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-500">{texts.paid}: ৳{service.paid_amount.toLocaleString()}</span>
                            <span className="text-yellow-500">{texts.due}: ৳{(service.price - service.paid_amount).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <Card className="shadow-sm">
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
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-primary/10">
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

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{texts.supportTickets}</CardTitle>
                <Button className="gap-2" onClick={() => setIsTicketDialogOpen(true)}>
                  <Plus size={16} />
                  {texts.createTicket}
                </Button>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-semibold mb-2">{texts.noTickets}</h3>
                    <p className="text-muted-foreground mb-4">{texts.noTicketsDesc}</p>
                    <Button variant="gradient" onClick={() => setIsTicketDialogOpen(true)}>
                      {texts.createTicket}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 bg-muted/30 rounded-xl space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.message}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            {getPriorityBadge(ticket.priority)}
                            {getTicketStatusBadge(ticket.status)}
                          </div>
                        </div>
                        {ticket.admin_reply && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <p className="text-xs font-medium text-primary mb-1">{texts.adminReply}</p>
                            <p className="text-sm text-foreground">{ticket.admin_reply}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(ticket.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              {/* Profile Edit Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={20} />
                    {texts.profileSettings}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-sm text-primary hover:underline"
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? texts.saving : texts.uploadPhoto}
                    </button>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{texts.name}</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder={language === "bn" ? "আপনার নাম" : "Your name"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{texts.email}</Label>
                      <Input
                        value={profile?.email || ""}
                        disabled
                        className="opacity-60"
                      />
                      <p className="text-xs text-muted-foreground">{texts.emailReadonly}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{texts.phone}</Label>
                      <Input
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder={language === "bn" ? "ফোন নম্বর" : "Phone number"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{texts.address}</Label>
                      <Textarea
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder={language === "bn" ? "আপনার ঠিকানা" : "Your address"}
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="w-full gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {texts.saving}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {texts.updateProfile}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Password Change Card */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock size={20} />
                    {texts.changePassword}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{texts.newPassword}</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{texts.confirmNewPassword}</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive">{texts.passwordMismatch}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !newPassword || !confirmPassword}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {texts.saving}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        {texts.changePasswordBtn}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>

      {/* Create Ticket Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{texts.createTicket}</DialogTitle>
            <DialogDescription>
              {language === "bn" ? "আপনার সমস্যা বর্ণনা করুন" : "Describe your issue"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{texts.subject}</Label>
              <Input
                placeholder={language === "bn" ? "টিকেটের বিষয়..." : "Ticket subject..."}
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{texts.message}</Label>
              <Textarea
                placeholder={language === "bn" ? "আপনার সমস্যা বিস্তারিত লিখুন..." : "Describe your issue in detail..."}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{texts.priority}</Label>
              <Select value={ticketPriority} onValueChange={setTicketPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{texts.low}</SelectItem>
                  <SelectItem value="medium">{texts.medium}</SelectItem>
                  <SelectItem value="high">{texts.high}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTicketDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={isSubmittingTicket} className="gap-2">
              {isSubmittingTicket ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "bn" ? "জমা হচ্ছে..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {texts.submit}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
