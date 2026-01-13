import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subDays, subMonths, format, startOfDay, eachDayOfInterval, parseISO } from "date-fns";

export type TimeRange = "1w" | "1m" | "5m";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  amount: number;
  created_at: string;
}

interface DailyData {
  date: string;
  contacts: number;
  pending: number;
  running: number;
  success: number;
  revenue: number;
}

interface StatusSummary {
  pending: number;
  running: number;
  success: number;
  cancelled: number;
}

interface AnalyticsData {
  contacts: ContactSubmission[];
  dailyData: DailyData[];
  statusSummary: StatusSummary;
  totals: {
    totalContacts: number;
    totalRevenue: number;
    avgDealValue: number;
    successRate: number;
  };
  isLoading: boolean;
  refetch: () => void;
}

export const useAnalytics = (timeRange: TimeRange): AnalyticsData => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
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

  const fetchData = async () => {
    setIsLoading(true);
    const startDate = getStartDate(timeRange);
    const startIso = startDate.toISOString();

    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .gte("created_at", startIso)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

      const pending = dayContacts.filter((c) => c.status === "pending").length;
      const running = dayContacts.filter((c) => c.status === "running").length;
      const success = dayContacts.filter((c) => c.status === "success").length;
      const revenue = dayContacts
        .filter((c) => c.status === "success")
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      return {
        date: format(day, "MMM dd"),
        contacts: dayContacts.length,
        pending,
        running,
        success,
        revenue,
      };
    });
  }, [contacts, timeRange]);

  const statusSummary = useMemo(() => {
    return {
      pending: contacts.filter((c) => c.status === "pending").length,
      running: contacts.filter((c) => c.status === "running").length,
      success: contacts.filter((c) => c.status === "success").length,
      cancelled: contacts.filter((c) => c.status === "cancelled").length,
    };
  }, [contacts]);

  const totals = useMemo(() => {
    const successContacts = contacts.filter((c) => c.status === "success");
    const totalRevenue = successContacts.reduce((sum, c) => sum + (c.amount || 0), 0);
    const successRate = contacts.length > 0 ? (successContacts.length / contacts.length) * 100 : 0;

    return {
      totalContacts: contacts.length,
      totalRevenue,
      avgDealValue: successContacts.length > 0 ? totalRevenue / successContacts.length : 0,
      successRate,
    };
  }, [contacts]);

  return { contacts, dailyData, statusSummary, totals, isLoading, refetch: fetchData };
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
