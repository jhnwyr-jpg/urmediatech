import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, MousePointerClick, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface UtmStats {
  source: string;
  visits: number;
  conversions: number;
}

interface AnalyticsData {
  totalVisits: number;
  totalConversions: number;
  conversionRate: number;
  utmStats: UtmStats[];
  recentEvents: {
    event_type: string;
    event_value: number | null;
    created_at: string;
  }[];
}

const MarketingAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalVisits: 0,
    totalConversions: 0,
    conversionRate: 0,
    utmStats: [],
    recentEvents: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const startDate = startOfDay(subDays(new Date(), days)).toISOString();
      const endDate = endOfDay(new Date()).toISOString();

      // Fetch UTM visits
      const { data: visits, error: visitsError } = await supabase
        .from("utm_visits")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (visitsError) throw visitsError;

      // Fetch conversion events
      const { data: events, error: eventsError } = await supabase
        .from("conversion_events")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at", { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;

      // Calculate stats
      const totalVisits = visits?.length || 0;
      const conversions = visits?.filter((v) => v.converted).length || 0;
      const conversionRate = totalVisits > 0 ? (conversions / totalVisits) * 100 : 0;

      // Group by UTM source
      const sourceMap = new Map<string, { visits: number; conversions: number }>();
      visits?.forEach((visit) => {
        const source = visit.utm_source || "Direct / Organic";
        const current = sourceMap.get(source) || { visits: 0, conversions: 0 };
        sourceMap.set(source, {
          visits: current.visits + 1,
          conversions: current.conversions + (visit.converted ? 1 : 0),
        });
      });

      const utmStats: UtmStats[] = Array.from(sourceMap.entries())
        .map(([source, stats]) => ({
          source,
          visits: stats.visits,
          conversions: stats.conversions,
        }))
        .sort((a, b) => b.visits - a.visits);

      setData({
        totalVisits,
        totalConversions: conversions,
        conversionRate,
        utmStats,
        recentEvents: events || [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const statCards = [
    {
      label: "Total Visitors",
      value: data.totalVisits.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Conversions",
      value: data.totalConversions.toLocaleString(),
      icon: MousePointerClick,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Conversion Rate",
      value: `${data.conversionRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes("facebook") || source.toLowerCase().includes("fb")) return "📘";
    if (source.toLowerCase().includes("google")) return "🔍";
    if (source.toLowerCase().includes("tiktok")) return "🎵";
    if (source.toLowerCase().includes("instagram")) return "📸";
    if (source.toLowerCase().includes("twitter") || source.toLowerCase().includes("x")) return "🐦";
    return "🌐";
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "Purchase": return "🛒";
      case "Lead": return "📝";
      case "PageView": return "👁️";
      case "Contact": return "📞";
      case "ButtonClick": return "👆";
      default: return "📊";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-foreground">Marketing Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track traffic sources and conversion performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as "7d" | "30d" | "90d")}
            className="h-9 px-3 rounded-md border border-input bg-background text-foreground text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border/50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Traffic Sources */}
      <div className="bg-card rounded-xl border border-border/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h4 className="font-medium text-foreground">Traffic Sources</h4>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-8 h-8 bg-secondary rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
                  <div className="h-2 bg-secondary rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : data.utmStats.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No traffic data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Traffic will be tracked once visitors arrive with UTM parameters
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.utmStats.map((stat, index) => {
              const percentage = data.totalVisits > 0 
                ? (stat.visits / data.totalVisits) * 100 
                : 0;
              return (
                <motion.div
                  key={stat.source}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-xl">{getSourceIcon(stat.source)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{stat.source}</span>
                      <span className="text-xs text-muted-foreground">
                        {stat.visits} visits • {stat.conversions} conversions
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div className="bg-card rounded-xl border border-border/50 p-5">
        <h4 className="font-medium text-foreground mb-4">Recent Conversion Events</h4>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-12 bg-secondary rounded" />
            ))}
          </div>
        ) : data.recentEvents.length === 0 ? (
          <div className="text-center py-8">
            <MousePointerClick className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events recorded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.recentEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getEventIcon(event.event_type)}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.created_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                {event.event_value && (
                  <span className="text-sm font-medium text-green-600">
                    ৳{event.event_value.toLocaleString()}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <h4 className="font-medium text-foreground mb-2">How it works</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Visitors are tracked automatically when they arrive with UTM parameters</li>
          <li>• Example URL: <code className="bg-background px-1 rounded">urmedia.tech?utm_source=facebook&utm_medium=cpc</code></li>
          <li>• Conversions are recorded when forms are submitted or orders are placed</li>
        </ul>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
