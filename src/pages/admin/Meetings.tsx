import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Mail, 
  Phone,
  FileText,
  Check,
  X,
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Meeting {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  visitor_phone: string | null;
  project_name: string | null;
  service_type: string | null;
  requirements: unknown;
  meeting_date: string;
  meeting_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const { toast } = useToast();

  const fetchMeetings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: true })
      .order("meeting_time", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive",
      });
    } else {
      setMeetings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const updateMeetingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("meetings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update meeting status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Meeting status updated",
      });
      fetchMeetings();
      if (selectedMeeting?.id === id) {
        setSelectedMeeting({ ...selectedMeeting, status });
      }
    }
  };

  const deleteMeeting = async (id: string) => {
    const { error } = await supabase.from("meetings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Meeting deleted",
      });
      fetchMeetings();
      setSelectedMeeting(null);
    }
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad start of month to align with weekdays
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(daysInMonth);

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(m => isSameDay(parseISO(m.meeting_date), date));
  };

  const getDayMeetingsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getMeetingsForDate(selectedDate);
  };

  const upcomingMeetings = meetings.filter(m => {
    const meetingDate = parseISO(m.meeting_date);
    return meetingDate >= new Date() && m.status !== "cancelled";
  }).slice(0, 5);

  const stats = {
    total: meetings.length,
    pending: meetings.filter(m => m.status === "pending").length,
    confirmed: meetings.filter(m => m.status === "confirmed").length,
    completed: meetings.filter(m => m.status === "completed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meetings</h1>
            <p className="text-muted-foreground">Manage consultation appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <FileText className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button variant="outline" size="sm" onClick={fetchMeetings}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "Pending", value: stats.pending, color: "text-yellow-600" },
            { label: "Confirmed", value: stats.confirmed, color: "text-blue-600" },
            { label: "Completed", value: stats.completed, color: "text-green-600" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar / List View */}
          <div className="lg:col-span-2">
            {viewMode === "calendar" ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(currentMonth, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {paddedDays.map((day, index) => {
                      if (!day) {
                        return <div key={`empty-${index}`} className="h-20" />;
                      }
                      
                      const dayMeetings = getMeetingsForDate(day);
                      const isToday = isSameDay(day, new Date());
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      
                      return (
                        <motion.button
                          key={day.toISOString()}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDate(day)}
                          className={`h-20 p-1 rounded-lg border transition-colors text-left ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : isToday
                              ? "border-primary/50 bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? "text-primary" : "text-foreground"
                          }`}>
                            {format(day, "d")}
                          </div>
                          <div className="space-y-0.5">
                            {dayMeetings.slice(0, 2).map((meeting) => (
                              <div
                                key={meeting.id}
                                className={`text-[10px] px-1 py-0.5 rounded truncate ${statusColors[meeting.status]}`}
                              >
                                {meeting.meeting_time.slice(0, 5)} {meeting.visitor_name.split(" ")[0]}
                              </div>
                            ))}
                            {dayMeetings.length > 2 && (
                              <div className="text-[10px] text-muted-foreground px-1">
                                +{dayMeetings.length - 2} more
                              </div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meetings.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No meetings scheduled</p>
                    ) : (
                      meetings.map((meeting) => (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                              <span className="text-xs text-primary font-medium">
                                {format(parseISO(meeting.meeting_date), "MMM")}
                              </span>
                              <span className="text-lg font-bold text-primary leading-none">
                                {format(parseISO(meeting.meeting_date), "d")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{meeting.visitor_name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {meeting.meeting_time.slice(0, 5)}
                                {meeting.service_type && (
                                  <>
                                    <span>•</span>
                                    <span>{meeting.service_type}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusColors[meeting.status]}>
                              {meeting.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedMeeting(meeting)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Meetings */}
            {selectedDate && viewMode === "calendar" && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {format(selectedDate, "EEEE, MMMM d")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDayMeetingsForSelectedDate().length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No meetings scheduled
                      </p>
                    ) : (
                      getDayMeetingsForSelectedDate().map((meeting) => (
                        <div
                          key={meeting.id}
                          className="p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={statusColors[meeting.status]}>
                              {meeting.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {meeting.meeting_time.slice(0, 5)}
                            </span>
                          </div>
                          <p className="font-medium text-foreground">{meeting.visitor_name}</p>
                          {meeting.service_type && (
                            <p className="text-sm text-muted-foreground">{meeting.service_type}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Meetings */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingMeetings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming meetings
                    </p>
                  ) : (
                    upcomingMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-primary font-medium">
                            {format(parseISO(meeting.meeting_date), "MMM")}
                          </span>
                          <span className="text-sm font-bold text-primary leading-none">
                            {format(parseISO(meeting.meeting_date), "d")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {meeting.visitor_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {meeting.meeting_time.slice(0, 5)}
                          </p>
                        </div>
                        <Badge variant="outline" className={`${statusColors[meeting.status]} text-[10px]`}>
                          {meeting.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Meeting Detail Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
            <DialogDescription>
              {selectedMeeting && format(parseISO(selectedMeeting.meeting_date), "EEEE, MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={statusColors[selectedMeeting.status]}>
                  {selectedMeeting.status}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{selectedMeeting.meeting_time.slice(0, 5)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedMeeting.visitor_name}</span>
                </div>
                {selectedMeeting.visitor_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedMeeting.visitor_email}`} className="text-primary hover:underline">
                      {selectedMeeting.visitor_email}
                    </a>
                  </div>
                )}
                {selectedMeeting.visitor_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${selectedMeeting.visitor_phone}`} className="text-primary hover:underline">
                      {selectedMeeting.visitor_phone}
                    </a>
                  </div>
                )}
                {selectedMeeting.project_name && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedMeeting.project_name}</span>
                  </div>
                )}
                {selectedMeeting.service_type && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Service Interest</p>
                    <p className="font-medium">{selectedMeeting.service_type}</p>
                  </div>
                )}
                {selectedMeeting.notes && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedMeeting.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground">Update Status</p>
                <Select
                  value={selectedMeeting.status}
                  onValueChange={(value) => updateMeetingStatus(selectedMeeting.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => updateMeetingStatus(selectedMeeting.id, "confirmed")}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => updateMeetingStatus(selectedMeeting.id, "cancelled")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMeeting(selectedMeeting.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Meetings;
