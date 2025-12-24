import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  page_views: number;
  unique_visitors: number;
  revenue: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  loading?: boolean;
}

const AnalyticsChart = ({ data, loading }: AnalyticsChartProps) => {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Traffic Overview</h3>
        <div className="h-[300px] animate-pulse bg-muted rounded-xl" />
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border/50 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Traffic Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="page_views"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorViews)"
              strokeWidth={2}
              name="Page Views"
            />
            <Area
              type="monotone"
              dataKey="unique_visitors"
              stroke="hsl(262, 83%, 58%)"
              fillOpacity={1}
              fill="url(#colorVisitors)"
              strokeWidth={2}
              name="Unique Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;
