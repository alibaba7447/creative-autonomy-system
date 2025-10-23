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
import { ArrowLeft, Plus, Calendar as CalendarIcon, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Cycles() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState<"exploration" | "production" | "consolidation" | "meta">("exploration");
  const [newNotes, setNewNotes] = useState("");

  const { data: cycles, isLoading } = trpc.cycles.list.useQuery();
  const createMutation = trpc.cycles.create.useMutation({
    onSuccess: () => {
      utils.cycles.list.invalidate();
      setIsCreateOpen(false);
      setNewTitle("");
      setNewPhase("exploration");
      setNewNotes("");
      toast.success("Cycle créé");
    },
  });
  
  const updateMutation = trpc.cycles.update.useMutation({
    onSuccess: () => {
      utils.cycles.list.invalidate();
      setIsEditOpen(false);
      setEditingId(null);
      setNewTitle("");
      setNewPhase("exploration");
      setNewNotes("");
      toast.success("Cycle modifié");
    },
  });
  
  const deleteMutation = trpc.cycles.delete.useMutation({
    onSuccess: () => {
      utils.cycles.list.invalidate();
      toast.success("Cycle supprimé");
    },
  });

  const handleCreate = () => {
    if (!newTitle.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 42); // 6 semaines = 42 jours

    createMutation.mutate({
      title: newTitle,
      phase: newPhase,
      startDate,
      endDate,
      notes: newNotes,
    });
  };
  
  const handleEdit = (cycle: any) => {
    setEditingId(cycle.id);
    setNewTitle(cycle.title);
    setNewPhase(cycle.phase);
    setNewNotes(cycle.notes || "");
    setIsEditOpen(true);
  };
  
  const handleUpdate = () => {
    if (!newTitle.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    
    if (!editingId) return;
    
    updateMutation.mutate({
      id: editingId,
      title: newTitle,
      phase: newPhase,
      notes: newNotes,
    });
  };
  
  const handleDelete = (id: string) => {
    if (confirm("Es-tu sûr de vouloir supprimer ce cycle ?")) {
      deleteMutation.mutate({ id });
    }
  };

  const phaseColors = {
    exploration: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
    production: "border-green-500 bg-green-50 dark:bg-green-950/30",
    consolidation: "border-amber-500 bg-amber-50 dark:bg-amber-950/30",
    meta: "border-purple-500 bg-purple-50 dark:bg-purple-950/30",
  };

  const phaseLabels = {
    exploration: "Exploration",
    production: "Production",
    consolidation: "Consolidation",
    meta: "Méta-réflexion",
  };

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
              <h1 className="text-xl font-medium">Cycles de 6 semaines</h1>
              <p className="text-sm text-muted-foreground">Planifie tes phases de travail</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouveau cycle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un cycle de 6 semaines</DialogTitle>
                <DialogDescription>
                  Définis un cycle de travail avec une phase spécifique
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du cycle</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Cycle printemps 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase du cycle</Label>
                  <Select value={newPhase} onValueChange={(v: any) => setNewPhase(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exploration">Exploration</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="consolidation">Consolidation</SelectItem>
                      <SelectItem value="meta">Méta-réflexion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Objectifs, intentions..."
                    rows={3}
                  />
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  Le cycle commencera aujourd'hui et durera 6 semaines (42 jours)
                </div>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                  Créer le cycle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le cycle</DialogTitle>
                <DialogDescription>
                  Mets à jour les informations de ton cycle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Titre du cycle</Label>
                  <Input
                    id="edit-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Cycle printemps 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phase">Phase du cycle</Label>
                  <Select value={newPhase} onValueChange={(v: any) => setNewPhase(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exploration">Exploration</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="consolidation">Consolidation</SelectItem>
                      <SelectItem value="meta">Méta-réflexion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Objectifs, intentions..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="w-full">
                  Mettre à jour
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Intro */}
          <Card className="border-l-4 border-l-primary bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Cycles de 6 semaines :</strong> Travaille par phases (exploration → production → consolidation → méta). Chaque cycle dure 6 semaines pour maintenir un rythme soutenable et progressif.
              </p>
            </CardContent>
          </Card>

          {/* Cycles List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-medium">Mes cycles</h2>
            {cycles && cycles.length > 0 ? (
              <div className="grid gap-4" key={`cycles-${cycles.length}`}>
                {cycles.map((cycle, idx) => {
                  const startDate = new Date(cycle.startDate);
                  const endDate = new Date(cycle.endDate);
                  const now = new Date();
                  const isActive = now >= startDate && now <= endDate;
                  const isPast = now > endDate;
                  
                  return (
                    <Card
                      key={`${cycle.id}-${idx}`}
                      className={`${phaseColors[cycle.phase]} border-l-4 transition-all ${
                        isActive ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl">{cycle.title}</CardTitle>
                            <CardDescription>
                              Phase : {phaseLabels[cycle.phase]}
                            </CardDescription>
                          </div>
                          {isActive && (
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                              En cours
                            </span>
                          )}
                          {isPast && (
                            <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                              Terminé
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {startDate.toLocaleDateString("fr-FR")} - {endDate.toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        {cycle.notes && (
                          <p className="text-sm text-muted-foreground">{cycle.notes}</p>
                        )}
                        <div className="flex gap-2 pt-4 border-t border-border/50">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleEdit(cycle)}
                          >
                            <Edit2 className="h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                            onClick={() => handleDelete(cycle.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>Aucun cycle créé pour le moment.</p>
                  <p className="text-sm mt-2">Commence par créer ton premier cycle de 6 semaines.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

