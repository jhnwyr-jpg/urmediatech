import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subDays, subMonths, format, startOfDay, eachDayOfInterval, parseISO } from "date-fns";

export type TimeRange = "1w" | "1m" | "5m";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
}

interface DailyData {
  date: string;
  contacts: number;
  orders: number;
  revenue: number;
}

interface AnalyticsData {
  contacts: ContactSubmission[];
  orders: Order[];
  dailyData: DailyData[];
  totals: {
    totalContacts: number;
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  isLoading: boolean;
}

export const useAnalytics = (timeRange: TimeRange): AnalyticsData => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStartDate = (range: TimeRange): Date => {
    const now = new Date();
    switch (range) {
      case "1w":
        return subDays(now, 7);
      case "1m":
        return subMonths(now, 1);
      case "5m":
        return subMonths(now, 5);
      default:
        return subDays(now, 7);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const startDate = getStartDate(timeRange);
      const startIso = startDate.toISOString();

      try {
        const [contactsRes, ordersRes] = await Promise.all([
          supabase
            .from("contact_submissions")
            .select("*")
            .gte("created_at", startIso)
            .order("created_at", { ascending: true }),
          supabase
            .from("orders")
            .select("*")
            .gte("created_at", startIso)
            .order("created_at", { ascending: true }),
        ]);

        if (contactsRes.error) throw contactsRes.error;
        if (ordersRes.error) throw ordersRes.error;

        setContacts(contactsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const dailyData = useMemo(() => {
    const startDate = getStartDate(timeRange);
    const endDate = new Date();
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayContacts = contacts.filter((c) => {
        const cDate = parseISO(c.created_at);
        return cDate >= dayStart && cDate < dayEnd;
      });

      const dayOrders = orders.filter((o) => {
        const oDate = parseISO(o.created_at!);
        return oDate >= dayStart && oDate < dayEnd;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      return {
        date: format(day, "MMM dd"),
        contacts: dayContacts.length,
        orders: dayOrders.length,
        revenue: dayRevenue,
      };
    });
  }, [contacts, orders, timeRange]);

  const totals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return {
      totalContacts: contacts.length,
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    };
  }, [contacts, orders]);

  return { contacts, orders, dailyData, totals, isLoading };
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma or newline
          if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToExcel = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Create Excel-compatible XML
  const headers = Object.keys(data[0]);
  
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      <Row>
        ${headers.map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("")}
      </Row>
      ${data
        .map(
          (row) => `<Row>
        ${headers
          .map((h) => {
            const value = row[h];
            const type = typeof value === "number" ? "Number" : "String";
            return `<Cell><Data ss:Type="${type}">${escapeXml(String(value ?? ""))}</Data></Cell>`;
          })
          .join("")}
      </Row>`
        )
        .join("")}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${format(new Date(), "yyyy-MM-dd")}.xls`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
