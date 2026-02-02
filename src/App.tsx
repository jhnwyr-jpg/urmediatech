import { Toaster } from "@/components/ui/toaster";
import AdminProjects from "./pages/admin/Projects";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import OneSignalProvider from "@/components/OneSignalProvider";

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
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="/admin/chats" element={<AdminChats />} />
              <Route path="/admin/meetings" element={<AdminMeetings />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/client-services" element={<AdminClientServices />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/subscribers" element={<AdminSubscribers />} />
              
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
