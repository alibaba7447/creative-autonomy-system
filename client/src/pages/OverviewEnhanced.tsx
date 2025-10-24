import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Heart, 
  Lightbulb,
  DollarSign,
  FolderKanban,
  Calendar,
  Compass,
  Sun,
  LogOut,
  Home,
  BarChart3,
  Zap,
  PieChart,
  LineChart
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function OverviewEnhanced() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: financialGoals } = trpc.financialGoals.list.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: cycles } = trpc.cycles.list.useQuery();
  const { data: reflections } = trpc.quarterlyReflections.list.useQuery();
  const { data: routines } = trpc.dailyRoutines.list.useQuery({ limit: 7 });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Calculs
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

  // Santé globale
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
      bgColor: average >= 0.8 ? "bg-green-50 dark:bg-green-950/30" : average >= 0.6 ? "bg-amber-50 dark:bg-amber-950/30" : "bg-red-50 dark:bg-red-950/30",
    };
  };

  const health = getHealthStatus();

  // Navigation rapide
  const quickNav = [
    { title: "Finances", icon: DollarSign, href: "/finances", color: "text-green-600" },
    { title: "Projets", icon: FolderKanban, href: "/projects", color: "text-blue-600" },
    { title: "Cycles", icon: Calendar, href: "/cycles", color: "text-purple-600" },
    { title: "Réflexions", icon: Compass, href: "/reflections", color: "text-amber-600" },
    { title: "Routines", icon: Sun, href: "/routines", color: "text-orange-600" },
    { title: "Coach", icon: TrendingUp, href: "/coaching", color: "text-teal-600" },
    { title: "Analytics", icon: BarChart3, href: "/analytics", color: "text-cyan-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-medium">Mon Bilan</h1>
                <p className="text-xs text-muted-foreground">Bienvenue, {user?.name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          {/* Quick Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {quickNav.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link key={nav.href} href={nav.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 whitespace-nowrap flex-shrink-0"
                  >
                    <Icon className={`h-4 w-4 ${nav.color}`} />
                    <span className="text-xs">{nav.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Global Health Score - Hero Section */}
          <Card className={`border-l-4 border-l-primary ${health.bgColor}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">Santé de ton système</CardTitle>
                  <CardDescription>Vue d'ensemble complète de ta progression</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-primary">{health.percentage}%</div>
                  <p className={`text-lg font-medium mt-2 ${health.color}`}>{health.status}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${health.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Four Pillars - Récapitulatif avec icônes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Finances */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Finances</CardTitle>
                    <CardDescription className="text-xs">Clarté financière</CardDescription>
                  </div>
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Plancher</span>
                    <span className="font-bold text-green-600">{floorPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(floorPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Expansion</span>
                    <span className="font-bold text-amber-600">{expansionPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${Math.min(expansionPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                  {currentFinancial?.actualRevenue || 0} € / {currentFinancial?.monthlyFloor || 0} €
                </div>
              </CardContent>
            </Card>

            {/* Projets */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Projets</CardTitle>
                    <CardDescription className="text-xs">Progression créative</CardDescription>
                  </div>
                  <FolderKanban className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-muted">
                    <div className="text-lg font-bold text-blue-600">{activeProjects.length}</div>
                    <div className="text-xs text-muted-foreground">Actifs</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="text-lg font-bold text-blue-600">{avgSatisfaction}/10</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                  {projects?.length || 0} projets total
                </div>
              </CardContent>
            </Card>

            {/* Alignement */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Alignement</CardTitle>
                    <CardDescription className="text-xs">Créer/Transmettre/Gagner</CardDescription>
                  </div>
                  <Compass className="h-6 w-6 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="p-2 rounded bg-muted">
                    <div className="font-bold text-amber-600">{latestReflection?.createScore ?? 0}</div>
                    <div className="text-muted-foreground text-xs">Créer</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-bold text-amber-600">{latestReflection?.teachScore ?? 0}</div>
                    <div className="text-muted-foreground text-xs">Enseigner</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-bold text-amber-600">{latestReflection?.earnScore ?? 0}</div>
                    <div className="text-muted-foreground text-xs">Gagner</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                  Moyenne : {alignmentScore}/10
                </div>
              </CardContent>
            </Card>

            {/* Routines */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Routines</CardTitle>
                    <CardDescription className="text-xs">Stabilité quotidienne</CardDescription>
                  </div>
                  <Sun className="h-6 w-6 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Cette semaine</span>
                    <span className="font-bold text-orange-600">{completedRoutinesThisWeek}/7</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${(completedRoutinesThisWeek / 7) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                  {routines?.length || 0} jours suivis
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Projets par statut */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-600" />
                    Projets par phase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projects && projects.length > 0 ? (
                    <div className="space-y-2">
                      {[
                        { status: "exploration", label: "Exploration", color: "bg-blue-500" },
                        { status: "production", label: "Production", color: "bg-green-500" },
                        { status: "consolidation", label: "Consolidation", color: "bg-amber-500" },
                        { status: "completed", label: "Terminé", color: "bg-gray-500" },
                      ].map((phase) => {
                        const count = projects.filter((p) => p.status === phase.status).length;
                        const percentage = (count / projects.length) * 100;
                        return (
                          <div key={phase.status}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{phase.label}</span>
                              <span className="font-bold">{count}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${phase.color}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucun projet créé</p>
                  )}
                </CardContent>
              </Card>

              {/* Tendance financière */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-green-600" />
                    Tendance financière
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentFinancial ? (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Revenu actuel</span>
                          <span className="font-bold">{currentFinancial.actualRevenue}€</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Plancher</span>
                          <span className="font-bold">{currentFinancial.monthlyFloor}€</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Expansion</span>
                          <span className="font-bold">{currentFinancial.monthlyExpansion}€</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                          {currentFinancial.actualRevenue >= currentFinancial.monthlyFloor ? (
                            <span className="text-green-600 font-medium">✅ Plancher atteint</span>
                          ) : (
                            <span className="text-amber-600 font-medium">⚠️ {currentFinancial.monthlyFloor - currentFinancial.actualRevenue}€ à atteindre</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Aucune donnée financière</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cycles & Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cycle Actuel */}
            {activeCycle ? (
              <Card className="border-l-4 border-l-primary lg:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Cycle actuel</CardTitle>
                      <CardDescription>{activeCycle.title}</CardDescription>
                    </div>
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Phase : {activeCycle.phase}
                  </div>
                  {activeCycle.notes && (
                    <p className="text-sm text-muted-foreground">{activeCycle.notes}</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-l-4 border-l-amber-500 lg:col-span-2 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Aucun cycle actif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Crée un cycle de 6 semaines pour structurer ta progression.
                  </p>
                  <Link href="/cycles">
                    <Button size="sm" className="mt-3">
                      Créer un cycle
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Prochaines Actions */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {floorPercentage < 100 && (
                  <div className="text-xs p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      ⚠️ Augmente tes revenus
                    </p>
                  </div>
                )}
                {activeProjects.length === 0 && (
                  <div className="text-xs p-2 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      💡 Crée un projet
                    </p>
                  </div>
                )}
                {completedRoutinesThisWeek < 5 && (
                  <div className="text-xs p-2 rounded bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                    <p className="font-medium text-orange-900 dark:text-orange-100">
                      🔄 Reprends tes routines
                    </p>
                  </div>
                )}
                {floorPercentage >= 100 && activeProjects.length > 0 && completedRoutinesThisWeek >= 5 && (
                  <div className="text-xs p-2 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-900 dark:text-green-100">
                      ✅ Tout va bien !
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistiques globales */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total projets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeProjects.length} actifs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cycles créés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cycles?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeCycle ? "1 en cours" : "Aucun actif"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Satisfaction moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSatisfaction}/10</div>
                <p className="text-xs text-muted-foreground mt-1">Tous projets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Alignement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alignmentScore}/10</div>
                <p className="text-xs text-muted-foreground mt-1">Créer/Transmettre/Gagner</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

