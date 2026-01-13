import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, DollarSign, CheckCircle, Clock, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Stats {
  totalContacts: number;
  todayContacts: number;
  totalRevenue: number;
  successCount: number;
  runningCount: number;
  pendingCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    todayContacts: 0,
    totalRevenue: 0,
    successCount: 0,
    runningCount: 0,
    pendingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        // Fetch all contact submissions
        const { data: contacts, error } = await supabase
          .from("contact_submissions")
          .select("*");

        if (error) throw error;

        const allContacts = contacts || [];
        const todayContacts = allContacts.filter(
          (c) => new Date(c.created_at) >= today
        );

        const successContacts = allContacts.filter((c) => c.status === "success");
        const runningContacts = allContacts.filter((c) => c.status === "running");
        const pendingContacts = allContacts.filter((c) => c.status === "pending");

        const totalRevenue = successContacts.reduce(
          (sum, c) => sum + (c.amount || 0),
          0
        );

        setStats({
          totalContacts: allContacts.length,
          todayContacts: todayContacts.length,
          totalRevenue,
          successCount: successContacts.length,
          runningCount: runningContacts.length,
          pendingCount: pendingContacts.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: MessageSquare,
      color: "bg-blue-500/10 text-blue-600",
      trend: `+${stats.todayContacts} today`,
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600",
      trend: "From successful deals",
    },
    {
      title: "Success",
      value: stats.successCount,
      icon: CheckCircle,
      color: "bg-emerald-500/10 text-emerald-600",
      trend: "Completed deals",
    },
    {
      title: "Running",
      value: stats.runningCount,
      icon: PlayCircle,
      color: "bg-purple-500/10 text-purple-600",
      trend: "In progress",
    },
    {
      title: "Pending",
      value: stats.pendingCount,
      icon: Clock,
      color: "bg-orange-500/10 text-orange-600",
      trend: "Awaiting action",
    },
    {
      title: "Today's Contacts",
      value: stats.todayContacts,
      icon: TrendingUp,
      color: "bg-pink-500/10 text-pink-600",
      trend: "New today",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {isLoading ? "..." : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-card rounded-2xl border border-border/50 p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/admin/contacts"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">View Contact Submissions</p>
                  <p className="text-sm text-muted-foreground">Manage status and amounts</p>
                </div>
              </a>
              <a
                href="/admin/reports"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">View Reports</p>
                  <p className="text-sm text-muted-foreground">Analytics and export data</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-card rounded-2xl border border-border/50 p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
            <div className="space-y-3">
              <a
                href="/admin/settings"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1877F2]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tracking Pixels</p>
                  <p className="text-sm text-muted-foreground">Configure Facebook & other pixels</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
