import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { ArrowLeft, Save, Sunrise, Coffee, Moon, Play, Pause, RotateCcw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const inspiringQuotes = [
  "La liberté commence par la clarté.",
  "Chaque petit pas compte. Avance à ton rythme.",
  "La créativité naît de la régularité, pas de l'urgence.",
  "Prends soin de ton mental comme de tes projets.",
  "L'équilibre est une pratique, pas une destination.",
  "Ta valeur ne dépend pas de ta productivité.",
  "Respire. Tu as le temps.",
  "La progression est plus importante que la perfection.",
];

export default function Routines() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [morningCompleted, setMorningCompleted] = useState(false);
  const [beforeWorkCompleted, setBeforeWorkCompleted] = useState(false);
  const [endOfDayCompleted, setEndOfDayCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const [currentQuote, setCurrentQuote] = useState("");
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { data: routine, isLoading } = trpc.dailyRoutines.get.useQuery({ date: today });
  const upsertMutation = trpc.dailyRoutines.upsert.useMutation({
    onSuccess: () => {
      utils.dailyRoutines.get.invalidate();
      toast.success("Routine enregistrée");
    },
  });

  useEffect(() => {
    if (routine) {
      setMorningCompleted(routine.morningCompleted);
      setBeforeWorkCompleted(routine.beforeWorkCompleted);
      setEndOfDayCompleted(routine.endOfDayCompleted);
      setNotes(routine.notes ?? "");
    }
  }, [routine]);

  useEffect(() => {
    setCurrentQuote(inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)]);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setIsTimerRunning(false);
          toast.success("Timer terminé !");
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const handleSave = () => {
    upsertMutation.mutate({
      date: today,
      morningCompleted,
      beforeWorkCompleted,
      endOfDayCompleted,
      notes,
    });
  };

  const resetTimer = () => {
    setTimerMinutes(10);
    setTimerSeconds(0);
    setIsTimerRunning(false);
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
        <div className="container py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-medium">Routine quotidienne</h1>
            <p className="text-sm text-muted-foreground">Rituel minimal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quote */}
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-accent/10 to-transparent">
            <CardContent className="pt-6">
              <p className="text-xl italic text-foreground font-light text-center">
                "{currentQuote}"
              </p>
            </CardContent>
          </Card>

          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle>Timer de concentration</CardTitle>
              <CardDescription>Utilise ce timer pour tes sessions de travail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="text-6xl font-light tabular-nums">
                  {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  size="lg"
                  variant={isTimerRunning ? "secondary" : "default"}
                  className="gap-2"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Démarrer
                    </>
                  )}
                </Button>
                <Button onClick={resetTimer} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Daily Routine Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Ma routine du {today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</CardTitle>
              <CardDescription>Coche les étapes au fur et à mesure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Morning */}
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                <Checkbox
                  id="morning"
                  checked={morningCompleted}
                  onCheckedChange={(checked) => setMorningCompleted(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <label htmlFor="morning" className="flex items-center gap-2 text-lg font-medium cursor-pointer">
                    <Sunrise className="h-5 w-5 text-amber-500" />
                    Rituel du matin
                  </label>
                  <p className="text-sm text-muted-foreground">
                    5 minutes : respiration, intention de la journée, gratitude
                  </p>
                </div>
              </div>

              {/* Before Work */}
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                <Checkbox
                  id="beforeWork"
                  checked={beforeWorkCompleted}
                  onCheckedChange={(checked) => setBeforeWorkCompleted(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <label htmlFor="beforeWork" className="flex items-center gap-2 text-lg font-medium cursor-pointer">
                    <Coffee className="h-5 w-5 text-primary" />
                    Avant le travail
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Définis tes 3 priorités du jour, prépare ton espace
                  </p>
                </div>
              </div>

              {/* End of Day */}
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                <Checkbox
                  id="endOfDay"
                  checked={endOfDayCompleted}
                  onCheckedChange={(checked) => setEndOfDayCompleted(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <label htmlFor="endOfDay" className="flex items-center gap-2 text-lg font-medium cursor-pointer">
                    <Moon className="h-5 w-5 text-blue-500" />
                    Fin de journée
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Bilan rapide, note ce qui a bien fonctionné, prépare demain
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes de la journée
                </label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Comment s'est passée ta journée ? Qu'as-tu appris ?"
                  rows={4}
                />
              </div>

              <Button onClick={handleSave} disabled={upsertMutation.isPending} className="gap-2 w-full">
                <Save className="h-4 w-4" />
                Enregistrer ma routine
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

