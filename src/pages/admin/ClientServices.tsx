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
  const [clients, setClients] = useState<Profile[]>([]);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [services, setServices] = useState<ClientService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClientService | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ClientService | null>(null);
  const [formData, setFormData] = useState(emptyService);
  const { toast } = useToast();

  // Search clients by email
  const searchClients = async () => {
    if (!searchQuery.trim()) {
      setClients([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, phone")
        .or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .eq("is_client", true)
        .limit(10);

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error searching clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search clients",
      });
    } finally {
      setIsSearching(false);
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
    setClients([]);
    setSearchQuery("");
    fetchClientServices(client.user_id);
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
        // Update existing service
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
        // Create new service
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
              Manage client services, pricing, and payments
            </p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search size={20} />
              Search Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchClients()}
                  className="pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <Button onClick={searchClients} disabled={isSearching}>
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </div>

            {/* Search Results */}
            {clients.length > 0 && (
              <div className="mt-4 space-y-2">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {client.full_name || "Unnamed Client"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Client */}
        {selectedClient && (
          <>
            {/* Client Info Card */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedClient.full_name || "Unnamed Client"}
                      </h3>
                      <p className="text-muted-foreground">{selectedClient.email}</p>
                      {selectedClient.phone && (
                        <p className="text-sm text-muted-foreground">
                          {selectedClient.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddService}>
                      <Plus size={18} className="mr-2" />
                      Add Service
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedClient(null);
                        setServices([]);
                      }}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Package className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Services</p>
                      <p className="text-xl font-bold">{totalServices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <DollarSign className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-xl font-bold">৳{totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <DollarSign className="text-green-500" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid Amount</p>
                      <p className="text-xl font-bold">৳{totalPaid.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-500/10">
                      <DollarSign className="text-yellow-500" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Amount</p>
                      <p className="text-xl font-bold">৳{totalDue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services Table */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                    <p className="text-muted-foreground">No services found for this client</p>
                    <Button className="mt-4" onClick={handleAddService}>
                      <Plus size={18} className="mr-2" />
                      Add First Service
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Service
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Paid
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Due
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service) => (
                          <tr key={service.id} className="border-b border-border/50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium">{service.service_name}</p>
                                {service.service_description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {service.service_description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2 flex-wrap">
                                {getStatusBadge(service.status)}
                                {getPaymentBadge(service.payment_status)}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium">
                              ৳{service.price.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-green-500">
                              ৳{service.paid_amount.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-yellow-500">
                              ৳{(service.price - service.paid_amount).toLocaleString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setServiceToDelete(service);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

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
