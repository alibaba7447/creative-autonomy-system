import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Heart, Lightbulb } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Overview() {
  const { user } = useAuth();
  
  const { data: financialGoals } = trpc.financialGoals.list.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: cycles } = trpc.cycles.list.useQuery();
  const { data: reflections } = trpc.quarterlyReflections.list.useQuery();
  const { data: routines } = trpc.dailyRoutines.list.useQuery({ limit: 7 });

  const currentFinancial = financialGoals?.[0];
  const floorPercentage = currentFinancial && currentFinancial.monthlyFloor > 0 ? (currentFinancial.actualRevenue / currentFinancial.monthlyFloor) * 100 : 0;
  const expansionPercentage = currentFinancial && currentFinancial.monthlyExpansion > 0 ? (currentFinancial.actualRevenue / currentFinancial.monthlyExpansion) * 100 : 0;

  const activeProjects = projects?.filter((p) => p.status !== "completed" && p.status !== "paused") || [];
  const avgSatisfaction = projects?.length ? (projects.reduce((sum, p) => sum + (p.satisfactionLevel || 0), 0) / projects.length).toFixed(1) : "0";

  const latestReflection = reflections?.[0];
  const alignmentScore = latestReflection ? (((latestReflection.createScore ?? 0) + (latestReflection.teachScore ?? 0) + (latestReflection.earnScore ?? 0)) / 3).toFixed(1) : "0";

  const completedRoutinesThisWeek = routines?.filter((r) => r.morningCompleted && r.beforeWorkCompleted && r.endOfDayCompleted).length || 0;

  const activeCycle = cycles?.find((c) => {
    const now = new Date();
    return now >= new Date(c.startDate) && now <= new Date(c.endDate);
  });

  // Déterminer la santé globale
  const getHealthStatus = () => {
    const scores = [];
    if (floorPercentage >= 100) scores.push(1);
    else if (floorPercentage >= 80) scores.push(0.8);
    else scores.push(0.5);

    if (activeProjects.length > 0) scores.push(1);
    else scores.push(0.5);

    if (Number(avgSatisfaction) >= 7) scores.push(1);
    else if (Number(avgSatisfaction) >= 5) scores.push(0.7);
    else scores.push(0.5);

    if (Number(alignmentScore) >= 7) scores.push(1);
    else if (Number(alignmentScore) >= 5) scores.push(0.7);
    else scores.push(0.5);

    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return {
      percentage: (average * 100).toFixed(0),
      status: average >= 0.8 ? "Excellent" : average >= 0.6 ? "Bon" : "À améliorer",
      color: average >= 0.8 ? "text-green-600" : average >= 0.6 ? "text-amber-600" : "text-red-600",
    };
  };

  const health = getHealthStatus();

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
            <h1 className="text-xl font-medium">Mon Bilan</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble complète</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Global Health Score */}
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Santé globale de ton système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <div className="text-6xl font-bold text-primary">{health.percentage}%</div>
                  <p className={`text-lg font-medium mt-2 ${health.color}`}>{health.status}</p>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ton système d'autonomie créative fonctionne à {health.percentage}% de son potentiel. Continue à nourrir chaque domaine pour maintenir l'équilibre.
                  </p>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${health.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Four Pillars */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Clarté financière
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plancher</span>
                    <span className="font-medium">{floorPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${Math.min(floorPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentFinancial?.actualRevenue || 0} € / {currentFinancial?.monthlyFloor || 0} €
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Expansion</span>
                    <span className="font-medium">{expansionPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${Math.min(expansionPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentFinancial?.actualRevenue || 0} € / {currentFinancial?.monthlyExpansion || 0} €
                  </p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {floorPercentage >= 100 ? "✅ Plancher atteint !" : "⚠️ Augmente tes revenus"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Creative Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  Progression créative
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projets actifs</span>
                    <span className="font-medium">{activeProjects.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeProjects.length > 0 ? "Tu as des projets en cours" : "Crée un nouveau projet"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction moyenne</span>
                    <span className="font-medium">{avgSatisfaction}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(Number(avgSatisfaction) / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {Number(avgSatisfaction) >= 7 ? "✅ Tes projets te satisfont" : "💡 Réajuste tes projets"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Alignment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  Alignement (Créer/Transmettre/Gagner)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Score moyen</span>
                    <span className="font-medium">{alignmentScore}/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${(Number(alignmentScore) / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-muted">
                    <div className="font-medium">{latestReflection?.createScore || 0}/10</div>
                    <div className="text-muted-foreground">Créer</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-medium">{latestReflection?.teachScore || 0}/10</div>
                    <div className="text-muted-foreground">Transmettre</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-medium">{latestReflection?.earnScore || 0}/10</div>
                    <div className="text-muted-foreground">Gagner</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {Number(alignmentScore) >= 7 ? "✅ Tu es bien aligné" : "💡 Réfléchis à tes priorités"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Routine Consistency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Stabilité quotidienne
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Routines complètes (7j)</span>
                    <span className="font-medium">{completedRoutinesThisWeek}/7</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${(completedRoutinesThisWeek / 7) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {completedRoutinesThisWeek >= 5 ? "✅ Excellent suivi" : "⚠️ Reprends tes routines"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Cycle */}
          {activeCycle && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>Cycle actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{activeCycle.title}</h3>
                  <p className="text-sm text-muted-foreground">Phase : {activeCycle.phase}</p>
                  {activeCycle.notes && (
                    <p className="text-sm mt-3 p-3 rounded bg-muted">{activeCycle.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Prochaines actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {floorPercentage < 100 && (
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Augmente tes revenus</p>
                    <p className="text-xs text-muted-foreground">Tu es à {floorPercentage.toFixed(0)}% de ton plancher</p>
                  </div>
                </div>
              )}
              {activeProjects.length === 0 && (
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Crée un nouveau projet</p>
                    <p className="text-xs text-muted-foreground">Applique la règle du 3×3</p>
                  </div>
                </div>
              )}
              {completedRoutinesThisWeek < 5 && (
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Reprends tes routines quotidiennes</p>
                    <p className="text-xs text-muted-foreground">Stabilité mentale = liberté créative</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links to Detailed Pages */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/finances">
              <Button variant="outline" className="w-full">
                Voir les finances détaillées
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full">
                Voir les analytics complètes
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

