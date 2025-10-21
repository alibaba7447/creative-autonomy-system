import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Link } from "wouter";
import { ArrowLeft, Save, Palette, Users, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Reflections() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const currentQuarter = `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
  
  const [createScore, setCreateScore] = useState(5);
  const [teachScore, setTeachScore] = useState(5);
  const [earnScore, setEarnScore] = useState(5);
  const [alignmentPhrase, setAlignmentPhrase] = useState("");
  const [notes, setNotes] = useState("");

  const { data: reflection, isLoading } = trpc.quarterlyReflections.get.useQuery({ quarter: currentQuarter });
  const upsertMutation = trpc.quarterlyReflections.upsert.useMutation({
    onSuccess: () => {
      utils.quarterlyReflections.get.invalidate();
      toast.success("Réflexion enregistrée");
    },
  });

  useEffect(() => {
    if (reflection) {
      setCreateScore(reflection.createScore ?? 5);
      setTeachScore(reflection.teachScore ?? 5);
      setEarnScore(reflection.earnScore ?? 5);
      setAlignmentPhrase(reflection.alignmentPhrase ?? "");
      setNotes(reflection.notes ?? "");
    }
  }, [reflection]);

  const handleSave = () => {
    upsertMutation.mutate({
      quarter: currentQuarter,
      createScore,
      teachScore,
      earnScore,
      alignmentPhrase,
      notes,
    });
  };

  const averageScore = ((createScore + teachScore + earnScore) / 3).toFixed(1);

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
        <div className="container py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-medium">Tableau de sens</h1>
            <p className="text-sm text-muted-foreground">Bilan trimestriel</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Intro */}
          <Card className="border-l-4 border-l-primary bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Bilan trimestriel :</strong> Prends du recul sur tes trois axes de vie : Créer, Transmettre, Gagner ta vie. Note chaque axe de 1 à 10 et écris une phrase d'alignement pour la semaine.
              </p>
            </CardContent>
          </Card>

          {/* Current Quarter */}
          <Card>
            <CardHeader>
              <CardTitle>Trimestre actuel : {currentQuarter}</CardTitle>
              <CardDescription>Évalue ton alignement sur les trois axes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Créer */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg font-medium">Créer</Label>
                    <p className="text-sm text-muted-foreground">
                      Production créative, projets artistiques
                    </p>
                  </div>
                  <span className="text-2xl font-medium">{createScore}/10</span>
                </div>
                <Slider
                  value={[createScore]}
                  onValueChange={(v) => setCreateScore(v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Transmettre */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg font-medium">Transmettre</Label>
                    <p className="text-sm text-muted-foreground">
                      Enseignement, partage de connaissances
                    </p>
                  </div>
                  <span className="text-2xl font-medium">{teachScore}/10</span>
                </div>
                <Slider
                  value={[teachScore]}
                  onValueChange={(v) => setTeachScore(v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Gagner ma vie */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg font-medium">Gagner ma vie</Label>
                    <p className="text-sm text-muted-foreground">
                      Revenus, stabilité financière
                    </p>
                  </div>
                  <span className="text-2xl font-medium">{earnScore}/10</span>
                </div>
                <Slider
                  value={[earnScore]}
                  onValueChange={(v) => setEarnScore(v[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Average Score */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Score moyen d'alignement</span>
                    <span className="text-3xl font-bold text-primary">{averageScore}/10</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alignment Phrase */}
              <div className="space-y-2">
                <Label htmlFor="phrase" className="text-lg font-medium">
                  Phrase d'alignement hebdomadaire
                </Label>
                <Input
                  id="phrase"
                  value={alignmentPhrase}
                  onChange={(e) => setAlignmentPhrase(e.target.value)}
                  placeholder="Cette semaine, je..."
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Une phrase courte qui guide ta semaine
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-medium">
                  Notes et réflexions
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Écris tes réflexions sur ce trimestre..."
                  rows={5}
                />
              </div>

              <Button onClick={handleSave} disabled={upsertMutation.isPending} className="gap-2 w-full">
                <Save className="h-4 w-4" />
                Enregistrer ma réflexion
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

