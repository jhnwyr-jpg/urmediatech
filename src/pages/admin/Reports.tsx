import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  MessageSquare,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  useAnalytics,
  exportToCSV,
  exportToExcel,
  TimeRange,
} from "@/hooks/useAnalytics";
import { format } from "date-fns";

const timeRangeLabels: Record<TimeRange, string> = {
  "1w": "Last 7 Days",
  "1m": "Past Month",
  "5m": "Last 5 Months",
};

const chartConfig = {
  contacts: {
    label: "Contacts",
    color: "hsl(255 80% 68%)",
  },
  orders: {
    label: "Orders",
    color: "hsl(142 76% 36%)",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(45 93% 47%)",
  },
};

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");
  const { contacts, orders, dailyData, totals, isLoading } = useAnalytics(timeRange);

  const handleExportContacts = (type: "csv" | "excel") => {
    const exportData = contacts.map((c) => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone || "",
      Message: c.message,
      Date: format(new Date(c.created_at), "yyyy-MM-dd HH:mm"),
    }));
    if (type === "csv") {
      exportToCSV(exportData, "contacts_report");
    } else {
      exportToExcel(exportData, "contacts_report");
    }
  };

  const handleExportOrders = (type: "csv" | "excel") => {
    const exportData = orders.map((o) => ({
      "Customer Name": o.customer_name,
      "Customer Email": o.customer_email,
      Status: o.status,
      "Total Amount": o.total_amount,
      Notes: o.notes || "",
      Date: format(new Date(o.created_at!), "yyyy-MM-dd HH:mm"),
    }));
    if (type === "csv") {
      exportToCSV(exportData, "orders_report");
    } else {
      exportToExcel(exportData, "orders_report");
    }
  };

  const handleExportSummary = (type: "csv" | "excel") => {
    const exportData = dailyData.map((d) => ({
      Date: d.date,
      Contacts: d.contacts,
      Orders: d.orders,
      Revenue: d.revenue,
    }));
    if (type === "csv") {
      exportToCSV(exportData, "summary_report");
    } else {
      exportToExcel(exportData, "summary_report");
    }
  };

  const statCards = [
    {
      title: "Total Contacts",
      value: totals.totalContacts,
      icon: MessageSquare,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Total Orders",
      value: totals.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Total Revenue",
      value: `৳${totals.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      title: "Avg Order Value",
      value: `৳${Math.round(totals.avgOrderValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-blue-500/10 text-blue-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track contacts, sales data, and export reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Tabs
              value={timeRange}
              onValueChange={(v) => setTimeRange(v as TimeRange)}
            >
              <TabsList>
                <TabsTrigger value="1w">1 Week</TabsTrigger>
                <TabsTrigger value="1m">1 Month</TabsTrigger>
                <TabsTrigger value="5m">5 Months</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {isLoading ? "..." : stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contacts Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Contact Submissions
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportContacts("csv")}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportContacts("excel")}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(255 80% 68%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(255 80% 68%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis tickLine={false} axisLine={false} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="contacts"
                      stroke="hsl(255 80% 68%)"
                      fillOpacity={1}
                      fill="url(#colorContacts)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Orders & Sales
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportOrders("csv")}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportOrders("excel")}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis tickLine={false} axisLine={false} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="orders"
                      fill="hsl(142 76% 36%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                Revenue Trend ({timeRangeLabels[timeRange]})
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportSummary("csv")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportSummary("excel")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" />
                  Export Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(45 93% 47%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(45 93% 47%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `৳${value}`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`৳${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(45 93% 47%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(45 93% 47%)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Combined Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Combined Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="contacts"
                    fill="hsl(255 80% 68%)"
                    radius={[4, 4, 0, 0]}
                    name="Contacts"
                  />
                  <Bar
                    dataKey="orders"
                    fill="hsl(142 76% 36%)"
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
