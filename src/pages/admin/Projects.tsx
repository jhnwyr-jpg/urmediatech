import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, ExternalLink, FolderKanban, Plus, RefreshCw, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Project = {
  id: string;
  title_en: string;
  title_bn: string;
  description_en: string | null;
  description_bn: string | null;
  category_en: string;
  category_bn: string;
  demo_url: string;
  gradient: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const gradientOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Blue → Cyan" },
  { value: "from-orange-500 to-red-500", label: "Orange → Red" },
  { value: "from-amber-500 to-orange-500", label: "Amber → Orange" },
  { value: "from-green-500 to-teal-500", label: "Green → Teal" },
  { value: "from-purple-500 to-pink-500", label: "Purple → Pink" },
  { value: "from-indigo-500 to-purple-500", label: "Indigo → Purple" },
  { value: "from-rose-500 to-pink-500", label: "Rose → Pink" },
  { value: "from-emerald-500 to-green-500", label: "Emerald → Green" },
];

const emptyProject: Omit<Project, "id" | "created_at" | "updated_at"> = {
  title_en: "",
  title_bn: "",
  description_en: "",
  description_bn: "",
  category_en: "",
  category_bn: "",
  demo_url: "",
  gradient: "from-blue-500 to-cyan-500",
  is_active: true,
  sort_order: 0,
};

const AdminProjects = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setProjects((data as Project[]) ?? []);
    } catch (e) {
      console.error("Fetch projects error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to load projects." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddDialog = () => {
    setEditingProject(null);
    setForm({ ...emptyProject, sort_order: projects.length });
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setForm({
      title_en: project.title_en,
      title_bn: project.title_bn,
      description_en: project.description_en ?? "",
      description_bn: project.description_bn ?? "",
      category_en: project.category_en,
      category_bn: project.category_bn,
      demo_url: project.demo_url,
      gradient: project.gradient,
      is_active: project.is_active,
      sort_order: project.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_en || !form.title_bn || !form.demo_url || !form.category_en || !form.category_bn) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please fill in all required fields." });
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            title_en: form.title_en,
            title_bn: form.title_bn,
            description_en: form.description_en || null,
            description_bn: form.description_bn || null,
            category_en: form.category_en,
            category_bn: form.category_bn,
            demo_url: form.demo_url,
            gradient: form.gradient,
            is_active: form.is_active,
            sort_order: form.sort_order,
          })
          .eq("id", editingProject.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Project updated successfully." });
      } else {
        const { error } = await supabase.from("projects").insert({
          title_en: form.title_en,
          title_bn: form.title_bn,
          description_en: form.description_en || null,
          description_bn: form.description_bn || null,
          category_en: form.category_en,
          category_bn: form.category_bn,
          demo_url: form.demo_url,
          gradient: form.gradient,
          is_active: form.is_active,
          sort_order: form.sort_order,
        });
        if (error) throw error;
        toast({ title: "Created", description: "Project added successfully." });
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (e) {
      console.error("Save project error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to save project." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Project removed." });
      fetchProjects();
    } catch (e) {
      console.error("Delete project error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete project." });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchProjects} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.length === 0 && !isLoading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No projects yet. Add your first project!</p>
            </div>
          ) : (
            projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{project.title_en}</p>
                      <p className="text-sm text-muted-foreground truncate">{project.title_bn}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                        project.is_active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {project.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description_en || "No description"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 bg-secondary rounded-full">{project.category_en}</span>
                    <span className="px-2 py-0.5 bg-secondary rounded-full">{project.category_bn}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </a>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
              <DialogDescription>Fill in the project details below.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2 py-4">
              <div className="space-y-2">
                <Label>Title (EN) *</Label>
                <Input
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  placeholder="SaaS Dashboard"
                />
              </div>
              <div className="space-y-2">
                <Label>Title (BN) *</Label>
                <Input
                  value={form.title_bn}
                  onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                  placeholder="SaaS ড্যাশবোর্ড"
                />
              </div>

              <div className="space-y-2">
                <Label>Category (EN) *</Label>
                <Input
                  value={form.category_en}
                  onChange={(e) => setForm({ ...form, category_en: e.target.value })}
                  placeholder="Web Application"
                />
              </div>
              <div className="space-y-2">
                <Label>Category (BN) *</Label>
                <Input
                  value={form.category_bn}
                  onChange={(e) => setForm({ ...form, category_bn: e.target.value })}
                  placeholder="ওয়েব অ্যাপ্লিকেশন"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Demo URL *</Label>
                <Input
                  value={form.demo_url}
                  onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Description (EN)</Label>
                <Textarea
                  value={form.description_en ?? ""}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  placeholder="Describe the project in English..."
                  rows={2}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description (BN)</Label>
                <Textarea
                  value={form.description_bn ?? ""}
                  onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                  placeholder="বাংলায় প্রজেক্ট সম্পর্কে লিখুন..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Gradient</Label>
                <Select value={form.gradient} onValueChange={(v) => setForm({ ...form, gradient: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${opt.value}`} />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label>Active (visible on website)</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : editingProject ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
