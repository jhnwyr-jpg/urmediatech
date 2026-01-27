import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import TrackingPixelsSettings from "@/components/admin/TrackingPixelsSettings";
import AIChatbotSettings from "@/components/admin/AIChatbotSettings";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your website settings</p>
        </div>

        {/* AI Chatbot Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <AIChatbotSettings />
        </motion.div>

        {/* Tracking & Pixel Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <TrackingPixelsSettings />
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-secondary/50 rounded-2xl p-6 max-w-2xl"
        >
          <h3 className="font-medium text-foreground mb-3">How to find your Pixel IDs:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Facebook:</strong> Events Manager → Data Sources → Settings</li>
            <li><strong>Google Analytics:</strong> Admin → Property Settings → Measurement ID</li>
            <li><strong>Google Ads:</strong> Tools & Settings → Conversions → Conversion ID</li>
            <li><strong>TikTok:</strong> Events Manager → Website Pixel → Setup</li>
            <li><strong>LinkedIn:</strong> Campaign Manager → Account Assets → Insight Tag</li>
            <li><strong>Twitter:</strong> Tools → Conversion Tracking → Create Pixel</li>
          </ul>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
