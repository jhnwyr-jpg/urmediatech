import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import AIChatbotSettings from "@/components/admin/AIChatbotSettings";
import ContactInfoSettings from "@/components/admin/ContactInfoSettings";
import MarketingSettings from "@/components/admin/MarketingSettings";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your website settings</p>
        </div>

        {/* Contact Info Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <ContactInfoSettings />
        </motion.div>

        {/* AI Chatbot Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <AIChatbotSettings />
        </motion.div>

        {/* Marketing & Tracking Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <MarketingSettings />
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
