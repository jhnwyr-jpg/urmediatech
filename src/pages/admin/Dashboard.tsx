import { useEffect, useState } from 'react';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/admin/StatCard';
import RecentOrders from '@/components/admin/RecentOrders';
import AnalyticsChart from '@/components/admin/AnalyticsChart';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalPageViews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalPageViews: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch profiles count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch orders
        const { data: ordersData, count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch site stats
        const { data: statsData } = await supabase
          .from('site_stats')
          .select('*')
          .order('date', { ascending: true })
          .limit(7);

        // Calculate totals from stats
        const totalRevenue = statsData?.reduce((sum, s) => sum + Number(s.revenue), 0) || 0;
        const totalPageViews = statsData?.reduce((sum, s) => sum + s.page_views, 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          totalPageViews,
        });
        setOrders(ordersData || []);
        setChartData(statsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+12% from last month"
          changeType="positive"
          icon={Users}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+8% from last month"
          changeType="positive"
          icon={ShoppingCart}
          color="green"
          delay={0.1}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+23% from last month"
          changeType="positive"
          icon={DollarSign}
          color="orange"
          delay={0.2}
        />
        <StatCard
          title="Page Views"
          value={stats.totalPageViews.toLocaleString()}
          change="+18% from last month"
          changeType="positive"
          icon={TrendingUp}
          color="violet"
          delay={0.3}
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart data={chartData} loading={loading} />
        </div>
        <div>
          <RecentOrders orders={orders} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
