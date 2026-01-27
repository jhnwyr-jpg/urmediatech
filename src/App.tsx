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

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminContacts from "./pages/admin/Contacts";
import AdminMeetings from "./pages/admin/Meetings";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminChats from "./pages/admin/Chats";
import AdminUsers from "./pages/admin/Users";

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
