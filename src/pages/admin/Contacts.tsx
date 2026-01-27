import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Calendar, User, Search, RefreshCw, DollarSign, CalendarPlus, Clock, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  amount: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  running: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  success: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  running: "Running",
  success: "Success",
  cancelled: "Cancelled",
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingAmount, setEditingAmount] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<string>("");
  
  // Meeting scheduling state
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [meetingDate, setMeetingDate] = useState<Date | undefined>();
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleAmountSave = async (id: string) => {
    const amount = parseFloat(tempAmount) || 0;
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ amount })
        .eq("id", id);

      if (error) throw error;

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, amount } : c))
      );
      setEditingAmount(null);
      toast.success("Amount updated successfully");
    } catch (error) {
      console.error("Error updating amount:", error);
      toast.error("Failed to update amount");
    }
  };

  const openMeetingDialog = (contact: ContactSubmission) => {
    setSelectedContact(contact);
    setMeetingDate(undefined);
    setMeetingTime("");
    setMeetingNotes("");
    setMeetingDialogOpen(true);
  };

  const handleScheduleMeeting = async () => {
    if (!selectedContact || !meetingDate || !meetingTime) {
      toast.error("Please select date and time");
      return;
    }

    setIsSendingInvite(true);
    try {
      // First save to meetings table
      const { error: dbError } = await supabase
        .from("meetings")
        .insert({
          visitor_name: selectedContact.name,
          visitor_email: selectedContact.email,
          visitor_phone: selectedContact.phone,
          meeting_date: format(meetingDate, "yyyy-MM-dd"),
          meeting_time: meetingTime,
          notes: meetingNotes || null,
          status: "pending",
        });

      if (dbError) {
        console.error("DB Error:", dbError);
        throw new Error("Failed to save meeting");
      }

      // Send email invitation
      const { data, error } = await supabase.functions.invoke("send-meeting-invite", {
        body: {
          recipientEmail: selectedContact.email,
          recipientName: selectedContact.name,
          meetingDate: format(meetingDate, "yyyy-MM-dd"),
          meetingTime: meetingTime,
          notes: meetingNotes,
        },
      });

      if (error) {
        console.error("Email Error:", error);
        toast.warning("Meeting saved but email failed to send");
      } else if (data?.success) {
        toast.success("Meeting scheduled & invitation sent!");
      } else {
        toast.warning("Meeting saved but email may not have sent");
      }

      setMeetingDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Failed to schedule meeting");
    } finally {
      setIsSendingInvite(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredContacts
    .filter((c) => c.status === "success")
    .reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
            <p className="text-muted-foreground mt-1">View and manage customer messages</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-500/10 text-green-600 px-4 py-2 rounded-lg font-medium">
              Total Revenue: ৳{totalRevenue.toLocaleString()}
            </div>
            <Button variant="outline" onClick={fetchContacts} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contacts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
            />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No contacts found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery || statusFilter !== "all"
                ? "Try a different search or filter"
                : "Contact submissions will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border/50 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{contact.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(contact.created_at), "PPp")}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </a>
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          📞 {contact.phone}
                        </a>
                      )}
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                      <p className="text-foreground whitespace-pre-wrap">{contact.message}</p>
                    </div>

                    {/* Status, Amount, and Meeting Row */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Select
                          value={contact.status}
                          onValueChange={(value) => handleStatusChange(contact.id, value)}
                        >
                          <SelectTrigger
                            className={`w-[130px] ${statusColors[contact.status]} border`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Amount Field */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {editingAmount === contact.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempAmount}
                              onChange={(e) => setTempAmount(e.target.value)}
                              className="w-[120px]"
                              placeholder="Amount"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAmountSave(contact.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAmount(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingAmount(contact.id);
                              setTempAmount(String(contact.amount || 0));
                            }}
                            className="text-foreground font-medium hover:text-primary transition-colors"
                          >
                            ৳{(contact.amount || 0).toLocaleString()}
                          </button>
                        )}
                      </div>

                      {/* Schedule Meeting Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openMeetingDialog(contact)}
                        className="ml-auto"
                      >
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Count */}
        {!isLoading && filteredContacts.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </p>
        )}

        {/* Meeting Scheduling Dialog */}
        <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-primary" />
                Schedule Meeting
              </DialogTitle>
              <DialogDescription>
                {selectedContact && (
                  <>Set a meeting date for <strong>{selectedContact.name}</strong>. An invitation email will be sent to {selectedContact.email}.</>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !meetingDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {meetingDate ? format(meetingDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={meetingDate}
                      onSelect={setMeetingDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Time</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Select value={meetingTime} onValueChange={setMeetingTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                        <>
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 ${hour === 12 ? 'PM' : 'AM'}`}
                          </SelectItem>
                          <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                            {hour > 12 ? `${hour - 12}:30 PM` : `${hour}:30 ${hour === 12 ? 'PM' : 'AM'}`}
                          </SelectItem>
                        </>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Add any notes for this meeting..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleMeeting} 
                disabled={!meetingDate || !meetingTime || isSendingInvite}
              >
                {isSendingInvite ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Schedule & Send Invite
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
