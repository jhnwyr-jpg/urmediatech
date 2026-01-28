import { ReactNode, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CalendarDays,
  FolderKanban,
  Users,
  Bell,
  Package,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: MessageSquare, label: "Contacts", path: "/admin/contacts" },
  { icon: MessageCircle, label: "Chats", path: "/admin/chats" },
  { icon: CalendarDays, label: "Meetings", path: "/admin/meetings" },
  { icon: Package, label: "Client Services", path: "/admin/client-services" },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Ticket, label: "Coupons", path: "/admin/coupons" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">U</span>
                </div>
                <span className="font-bold text-xl text-foreground">UR Media</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-lg text-foreground">Admin Panel</span>
            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
