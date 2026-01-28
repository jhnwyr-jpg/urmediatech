import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  User,
  X,
  Save,
  Mail,
  Users,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string | null;
}

interface ClientService {
  id: string;
  client_id: string;
  service_name: string;
  service_description: string | null;
  price: number;
  paid_amount: number;
  status: string;
  payment_status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

const emptyService: Omit<ClientService, "id" | "created_at"> = {
  client_id: "",
  service_name: "",
  service_description: "",
  price: 0,
  paid_amount: 0,
  status: "pending",
  payment_status: "unpaid",
  start_date: null,
  end_date: null,
  notes: "",
};

const ClientServicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allClients, setAllClients] = useState<Profile[]>([]);
  const [filteredClients, setFilteredClients] = useState<Profile[]>([]);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [services, setServices] = useState<ClientService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ClientService | null>(null);
  const [formData, setFormData] = useState(emptyService);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Fetch all clients on mount
  useEffect(() => {
    fetchAllClients();
  }, []);

  // Filter clients based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(allClients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        allClients.filter(
          (client) =>
            client.email?.toLowerCase().includes(query) ||
            client.full_name?.toLowerCase().includes(query) ||
            client.phone?.includes(query)
        )
      );
    }
  }, [searchQuery, allClients]);

  // Fetch all clients
  const fetchAllClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, phone, created_at")
        .eq("is_client", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch clients",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch services for selected client
  const fetchClientServices = async (clientId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_services")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch client services",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle client selection
  const handleSelectClient = (client: Profile) => {
    setSelectedClient(client);
    fetchClientServices(client.user_id);
  };

  // Toggle client selection for bulk email
  const toggleClientSelection = (userId: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all clients
  const selectAllClients = () => {
    if (selectedClientIds.length === filteredClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredClients.map((c) => c.user_id));
    }
  };

  // Send bulk email
  const handleSendBulkEmail = async () => {
    if (selectedClientIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one client",
      });
      return;
    }

    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Subject and content are required",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const recipients = allClients
        .filter((c) => selectedClientIds.includes(c.user_id) && c.email)
        .map((c) => ({
          email: c.email!,
          name: c.full_name || undefined,
        }));

      const { data, error } = await supabase.functions.invoke("send-bulk-email", {
        body: {
          recipients,
          subject: emailSubject,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">UR Media</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <p>Hi {{name}},</p>
                ${emailContent.replace(/\n/g, "<br>")}
                <br><br>
                <p>Best regards,<br>UR Media Team</p>
              </div>
              <div style="background: #1f2937; padding: 15px; text-align: center; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} UR Media. All rights reserved.
              </div>
            </div>
          `,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Email Sent!",
        description: `Successfully sent to ${data.totalSent} clients${data.totalFailed > 0 ? `, ${data.totalFailed} failed` : ""}`,
      });

      setIsEmailDialogOpen(false);
      setEmailSubject("");
      setEmailContent("");
      setSelectedClientIds([]);
    } catch (error: any) {
      console.error("Error sending bulk email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send emails",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Open add service dialog
  const handleAddService = () => {
    if (!selectedClient) return;
    setEditingService(null);
    setFormData({ ...emptyService, client_id: selectedClient.user_id });
    setIsDialogOpen(true);
  };

  // Open edit service dialog
  const handleEditService = (service: ClientService) => {
    setEditingService(service);
    setFormData({
      client_id: service.client_id,
      service_name: service.service_name,
      service_description: service.service_description || "",
      price: service.price,
      paid_amount: service.paid_amount,
      status: service.status,
      payment_status: service.payment_status,
      start_date: service.start_date,
      end_date: service.end_date,
      notes: service.notes || "",
    });
    setIsDialogOpen(true);
  };

  // Save service
  const handleSaveService = async () => {
    if (!formData.service_name || !formData.client_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name is required",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingService) {
        const { error } = await supabase
          .from("client_services")
          .update({
            service_name: formData.service_name,
            service_description: formData.service_description || null,
            price: formData.price,
            paid_amount: formData.paid_amount,
            status: formData.status,
            payment_status: formData.payment_status,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            notes: formData.notes || null,
          })
          .eq("id", editingService.id);

        if (error) throw error;
        toast({ title: "Success", description: "Service updated successfully" });
      } else {
        const { error } = await supabase.from("client_services").insert({
          client_id: formData.client_id,
          service_name: formData.service_name,
          service_description: formData.service_description || null,
          price: formData.price,
          paid_amount: formData.paid_amount,
          status: formData.status,
          payment_status: formData.payment_status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          notes: formData.notes || null,
        });

        if (error) throw error;
        toast({ title: "Success", description: "Service added successfully" });
      }

      setIsDialogOpen(false);
      if (selectedClient) {
        fetchClientServices(selectedClient.user_id);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("client_services")
        .delete()
        .eq("id", serviceToDelete.id);

      if (error) throw error;
      toast({ title: "Success", description: "Service deleted successfully" });
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
      if (selectedClient) {
        fetchClientServices(selectedClient.user_id);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const classes: Record<string, string> = {
      paid: "bg-green-500/20 text-green-400",
      unpaid: "bg-red-500/20 text-red-400",
      partial: "bg-yellow-500/20 text-yellow-400",
    };
    return <Badge className={classes[status] || classes.unpaid}>{status}</Badge>;
  };

  // Stats
  const totalServices = services.length;
  const totalRevenue = services.reduce((acc, s) => acc + s.price, 0);
  const totalPaid = services.reduce((acc, s) => acc + s.paid_amount, 0);
  const totalDue = totalRevenue - totalPaid;

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Client Services
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage client services, pricing, and send bulk emails
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAllClients} disabled={isLoading}>
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
            <Button
              onClick={() => setIsEmailDialogOpen(true)}
              disabled={selectedClientIds.length === 0}
              className="gap-2"
            >
              <Mail size={18} />
              Send Email ({selectedClientIds.length})
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Clients</p>
                  <p className="text-xl font-bold">{allClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Check className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Selected</p>
                  <p className="text-xl font-bold">{selectedClientIds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <Mail className="text-green-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">With Email</p>
                  <p className="text-xl font-bold">{allClients.filter(c => c.email).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Package className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Filtered</p>
                  <p className="text-xl font-bold">{filteredClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Client List */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Clients
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllClients}
                >
                  {selectedClientIds.length === filteredClients.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <Input
                  placeholder="Search by email, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {isLoading && allClients.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">No clients found</p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        selectedClient?.id === client.id
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={selectedClientIds.includes(client.user_id)}
                        onCheckedChange={() => toggleClientSelection(client.user_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div
                        className="flex-1 flex items-center gap-3 min-w-0"
                        onClick={() => handleSelectClient(client)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {client.full_name || "Unnamed Client"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {client.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Client Services */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} />
                  {selectedClient ? `${selectedClient.full_name || "Client"}'s Services` : "Select a Client"}
                </CardTitle>
                {selectedClient && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddService}>
                      <Plus size={16} className="mr-1" />
                      Add Service
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedClient(null);
                      setServices([]);
                    }}>
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedClient ? (
                <div className="text-center py-12">
                  <User className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">Click on a client to view their services</p>
                </div>
              ) : (
                <>
                  {/* Client Info */}
                  <div className="p-4 bg-muted/50 rounded-xl mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedClient.full_name || "Unnamed"}</h3>
                        <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                        {selectedClient.phone && (
                          <p className="text-xs text-muted-foreground">{selectedClient.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-primary">৳{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Due</p>
                      <p className="font-bold text-yellow-500">৳{totalDue.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {services.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto text-muted-foreground mb-2" size={32} />
                        <p className="text-sm text-muted-foreground">No services yet</p>
                      </div>
                    ) : (
                      services.map((service) => (
                        <div key={service.id} className="p-3 bg-muted/30 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{service.service_name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {service.service_description}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditService(service)}>
                                <Edit size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-destructive"
                                onClick={() => {
                                  setServiceToDelete(service);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(service.status)}
                            {getPaymentBadge(service.payment_status)}
                            <span className="text-sm font-medium ml-auto">
                              ৳{service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bulk Email Dialog */}
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail size={20} />
                Send Bulk Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Sending to <strong>{selectedClientIds.length}</strong> selected clients
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_subject">Subject *</Label>
                <Input
                  id="email_subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_content">Message *</Label>
                <Textarea
                  id="email_content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your message here... Use {{name}} for personalization."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Use {"{{name}}"} to personalize with client's name
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendBulkEmail} disabled={isSendingEmail}>
                  {isSendingEmail ? (
                    <>
                      <RefreshCw size={18} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={18} className="mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Service Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) =>
                    setFormData({ ...formData, service_name: e.target.value })
                  }
                  placeholder="e.g., Website Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_description">Description</Label>
                <Textarea
                  id="service_description"
                  value={formData.service_description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, service_description: e.target.value })
                  }
                  placeholder="Service details..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paid_amount">Paid Amount (৳)</Label>
                  <Input
                    id="paid_amount"
                    type="number"
                    value={formData.paid_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, paid_amount: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value || null })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value || null })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveService} disabled={isLoading}>
                  <Save size={18} className="mr-2" />
                  {isLoading ? "Saving..." : "Save Service"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Service</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{serviceToDelete?.service_name}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteService}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
};

export default ClientServicesPage;
