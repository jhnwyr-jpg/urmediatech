import { Toaster } from "@/components/ui/toaster";
import AdminProjects from "./pages/admin/Projects";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import OneSignalProvider from "@/components/OneSignalProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/Chat";
import ProjectDetail from "./pages/ProjectDetail";

// Client Pages
import ClientLogin from "./pages/client/Login";
import ClientDashboard from "./pages/client/Dashboard";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminContacts from "./pages/admin/Contacts";
import AdminMeetings from "./pages/admin/Meetings";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminChats from "./pages/admin/Chats";
import AdminUsers from "./pages/admin/Users";
import AdminNotifications from "./pages/admin/Notifications";
import AdminClientServices from "./pages/admin/ClientServices";
import AdminCoupons from "./pages/admin/Coupons";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminPricing from "./pages/admin/Pricing";
import AdminClientNotifications from "./pages/admin/ClientNotifications";
import AdminClientFeatures from "./pages/admin/ClientFeatures";
import AdminTickets from "./pages/admin/Tickets";
import AdminContent from "./pages/admin/Content";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <OneSignalProvider />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Single Page Landing */}
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              
              {/* Client Routes */}
              <Route path="/client/login" element={<ClientLogin />} />
              <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              
              {/* Admin Routes - All protected with requireAdmin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/contacts" element={<ProtectedRoute requireAdmin><AdminContacts /></ProtectedRoute>} />
              <Route path="/admin/chats" element={<ProtectedRoute requireAdmin><AdminChats /></ProtectedRoute>} />
              <Route path="/admin/meetings" element={<ProtectedRoute requireAdmin><AdminMeetings /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute requireAdmin><AdminProjects /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute requireAdmin><AdminNotifications /></ProtectedRoute>} />
              <Route path="/admin/client-services" element={<ProtectedRoute requireAdmin><AdminClientServices /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute requireAdmin><AdminCoupons /></ProtectedRoute>} />
              <Route path="/admin/subscribers" element={<ProtectedRoute requireAdmin><AdminSubscribers /></ProtectedRoute>} />
              <Route path="/admin/pricing" element={<ProtectedRoute requireAdmin><AdminPricing /></ProtectedRoute>} />
              <Route path="/admin/client-notifications" element={<ProtectedRoute requireAdmin><AdminClientNotifications /></ProtectedRoute>} />
              <Route path="/admin/client-features" element={<ProtectedRoute requireAdmin><AdminClientFeatures /></ProtectedRoute>} />
              <Route path="/admin/tickets" element={<ProtectedRoute requireAdmin><AdminTickets /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute requireAdmin><AdminContent /></ProtectedRoute>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
