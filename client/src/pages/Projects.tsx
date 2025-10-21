import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, Plus, MoreVertical, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Projects() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<"exploration" | "production" | "consolidation" | "completed" | "paused">("exploration");
  const [newSatisfaction, setNewSatisfaction] = useState(5);

  const { data: projects, isLoading } = trpc.projects.list.useQuery();
  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      setIsCreateOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewStatus("exploration");
      setNewSatisfaction(5);
      toast.success("Projet créé");
    },
  });

  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      toast.success("Projet mis à jour");
    },
  });

  const deleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      toast.success("Projet supprimé");
    },
  });

  const handleCreate = () => {
    if (!newTitle.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    createMutation.mutate({
      title: newTitle,
      description: newDescription,
      status: newStatus,
      satisfactionLevel: newSatisfaction,
    });
  };

  const handleStatusChange = (projectId: string, status: string) => {
    updateMutation.mutate({
      id: projectId,
      status: status as any,
    });
  };

  const handleDelete = (projectId: string) => {
    if (confirm("Supprimer ce projet ?")) {
      deleteMutation.mutate({ id: projectId });
    }
  };

  const statusColumns = [
    { status: "exploration", label: "Exploration", color: "border-blue-500" },
    { status: "production", label: "Production", color: "border-green-500" },
    { status: "consolidation", label: "Consolidation", color: "border-amber-500" },
    { status: "completed", label: "Terminé", color: "border-gray-500" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-medium">Portefeuille de projets</h1>
              <p className="text-sm text-muted-foreground">Règle du 3×3</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouveau projet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un projet</DialogTitle>
                <DialogDescription>
                  Rappel : 3 projets maximum, 3 mois, 3 actions par projet
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du projet</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Mon nouveau projet créatif"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Décris ton projet..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Phase</Label>
                  <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exploration">Exploration</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="consolidation">Consolidation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="satisfaction">Niveau de satisfaction (1-10)</Label>
                  <Input
                    id="satisfaction"
                    type="number"
                    min="1"
                    max="10"
                    value={newSatisfaction}
                    onChange={(e) => setNewSatisfaction(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                  Créer le projet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Intro */}
          <Card className="border-l-4 border-l-primary bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Règle du 3×3 :</strong> Maximum 3 projets actifs, chacun sur 3 mois, avec 3 actions concrètes. Cela t'évite de te disperser et te permet d'avancer sereinement.
              </p>
            </CardContent>
          </Card>

          {/* Kanban Board */}
          <div className="grid md:grid-cols-4 gap-6">
            {statusColumns.map((column) => (
              <div key={column.status} className="space-y-4">
                <div className={`border-l-4 ${column.color} pl-3`}>
                  <h3 className="font-medium text-lg">{column.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {projects?.filter((p) => p.status === column.status).length || 0} projet(s)
                  </p>
                </div>
                <div className="space-y-3">
                  {projects
                    ?.filter((p) => p.status === column.status)
                    .map((project) => (
                      <Card key={project.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{project.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {statusColumns.map((col) => (
                                  <DropdownMenuItem
                                    key={col.status}
                                    onClick={() => handleStatusChange(project.id, col.status)}
                                  >
                                    Déplacer vers {col.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem
                                  onClick={() => handleDelete(project.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {project.description && (
                            <CardDescription className="text-sm line-clamp-2">
                              {project.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Satisfaction</span>
                            <span className="font-medium">{project.satisfactionLevel}/10</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

