import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Target, BarChart3, Zap } from "lucide-react";
import ScriptManager from "./marketing/ScriptManager";
import ConversionSettings from "./marketing/ConversionSettings";
import EventTrackingGuide from "./marketing/EventTrackingGuide";
import MarketingAnalytics from "./marketing/MarketingAnalytics";

const MarketingSettings = () => {
  const [activeTab, setActiveTab] = useState("scripts");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Marketing & Tracking</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage tracking scripts, conversion APIs, and analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full bg-secondary/50">
          <TabsTrigger value="scripts" className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="conversions" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Conversions</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ScriptManager />
          </motion.div>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ConversionSettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EventTrackingGuide />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MarketingAnalytics />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingSettings;
