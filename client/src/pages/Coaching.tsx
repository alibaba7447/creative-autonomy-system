import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { ArrowLeft, Save, CheckCircle2, Circle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Coaching() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: cycles } = trpc.cycles.list.useQuery();
  const activeCycle = cycles?.find((c) => {
    const now = new Date();
    return now >= new Date(c.startDate) && now <= new Date(c.endDate);
  });

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [weekNotes, setWeekNotes] = useState("");
  const [weekDeliverables, setWeekDeliverables] = useState("");

  const { data: weeklyProgress } = trpc.weeklyProgress.list.useQuery(
    { cycleId: activeCycle?.id ?? "" },
    { enabled: !!activeCycle }
  );

  const upsertMutation = trpc.weeklyProgress.upsert.useMutation({
    onSuccess: () => {
      utils.weeklyProgress.list.invalidate();
      toast.success("Progression enregistrée");
      setWeekNotes("");
      setWeekDeliverables("");
    },
  });

  const handleSaveWeek = () => {
    if (!activeCycle) {
      toast.error("Aucun cycle actif");
      return;
    }

    const weekStartDate = new Date(activeCycle.startDate);
    weekStartDate.setDate(weekStartDate.getDate() + (selectedWeek - 1) * 7);

    upsertMutation.mutate({
      cycleId: activeCycle.id,
      weekNumber: selectedWeek,
      weekStartDate,
      notes: weekNotes,
      deliverables: weekDeliverables,
    });
  };

  const getWeekProgress = (weekNum: number) => {
    return weeklyProgress?.find((w) => w.weekNumber === weekNum);
  };

  if (!activeCycle) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container py-4 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-medium">Suivi du coach</h1>
              <p className="text-sm text-muted-foreground">Progression hebdomadaire</p>
            </div>
          </div>
        </header>
        <main className="container py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Aucun cycle actif. Commence par créer un cycle de 6 semaines dans la section "Cycles".
              </p>
              <Link href="/cycles">
                <Button className="mt-4">Créer un cycle</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
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
            <h1 className="text-xl font-medium">Suivi du coach</h1>
            <p className="text-sm text-muted-foreground">Cycle : {activeCycle.title}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Intro */}
          <Card className="border-l-4 border-l-primary bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Suivi hebdomadaire :</strong> Documente ta progression semaine par semaine. Note tes apprentissages, tes livrables et tes réflexions. C'est ton journal de bord créatif.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Week Selection */}
            <Card>
              <CardHeader>
                <CardTitle>6 semaines</CardTitle>
                <CardDescription>Sélectionne une semaine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((weekNum) => {
                  const progress = getWeekProgress(weekNum);
                  const isCompleted = !!progress;
                  const isSelected = selectedWeek === weekNum;

                  return (
                    <button
                      key={weekNum}
                      onClick={() => {
                        setSelectedWeek(weekNum);
                        if (progress) {
                          setWeekNotes(progress.notes ?? "");
                          setWeekDeliverables(progress.deliverables ?? "");
                        } else {
                          setWeekNotes("");
                          setWeekDeliverables("");
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-medium">Semaine {weekNum}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Week Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Semaine {selectedWeek}</CardTitle>
                <CardDescription>
                  {getWeekProgress(selectedWeek)
                    ? "Modifie ta progression"
                    : "Ajoute ta progression"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes et apprentissages
                  </label>
                  <Textarea
                    id="notes"
                    value={weekNotes}
                    onChange={(e) => setWeekNotes(e.target.value)}
                    placeholder="Qu'as-tu appris cette semaine ? Quels défis as-tu rencontrés ?"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="deliverables" className="text-sm font-medium">
                    Livrables et réalisations
                  </label>
                  <Textarea
                    id="deliverables"
                    value={weekDeliverables}
                    onChange={(e) => setWeekDeliverables(e.target.value)}
                    placeholder="Qu'as-tu produit ou livré cette semaine ?"
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleSaveWeek}
                  disabled={upsertMutation.isPending}
                  className="gap-2 w-full"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer la semaine {selectedWeek}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé de progression</CardTitle>
              <CardDescription>Vue d'ensemble de ton cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((weekNum) => {
                  const progress = getWeekProgress(weekNum);
                  const isCompleted = !!progress;

                  return (
                    <div
                      key={weekNum}
                      className={`p-4 rounded-lg border text-center ${
                        isCompleted
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="text-sm text-muted-foreground mb-2">S{weekNum}</div>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-primary mx-auto" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground mx-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {weeklyProgress?.length || 0} / 6 semaines complétées
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

