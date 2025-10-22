import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Target, Zap, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  
  const { data: financialGoals } = trpc.financialGoals.list.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();
  const { data: cycles } = trpc.cycles.list.useQuery();
  const { data: reflections } = trpc.quarterlyReflections.list.useQuery();
  const { data: routines } = trpc.dailyRoutines.list.useQuery({ limit: 30 });

  // Préparer les données financières
  const financialData = financialGoals?.slice(0, 6).reverse().map((goal) => ({
    month: goal.currentMonth,
    plancher: goal.monthlyFloor,
    expansion: goal.monthlyExpansion,
    réel: goal.actualRevenue,
  })) || [];

  // Calculer les statistiques financières
  const currentFinancial = financialGoals?.[0];
  const floorPercentage = currentFinancial && currentFinancial.monthlyFloor > 0 ? (currentFinancial.actualRevenue / currentFinancial.monthlyFloor) * 100 : 0;
  const expansionPercentage = currentFinancial && currentFinancial.monthlyExpansion > 0 ? (currentFinancial.actualRevenue / currentFinancial.monthlyExpansion) * 100 : 0;

  // Statuts des projets
  const projectsByStatus = {
    exploration: projects?.filter((p) => p.status === "exploration").length || 0,
    production: projects?.filter((p) => p.status === "production").length || 0,
    consolidation: projects?.filter((p) => p.status === "consolidation").length || 0,
    completed: projects?.filter((p) => p.status === "completed").length || 0,
  };

  const projectStatusData = [
    { name: "Exploration", value: projectsByStatus.exploration, color: "#3b82f6" },
    { name: "Production", value: projectsByStatus.production, color: "#10b981" },
    { name: "Consolidation", value: projectsByStatus.consolidation, color: "#f59e0b" },
    { name: "Terminé", value: projectsByStatus.completed, color: "#6b7280" },
  ];

  // Satisfaction moyenne par projet
  const avgSatisfaction = projects?.length ? (projects.reduce((sum, p) => sum + (p.satisfactionLevel || 0), 0) / projects.length).toFixed(1) : "0";

  // Données pour le radar (Créer/Transmettre/Gagner)
  const latestReflection = reflections?.[0];
  const radarData = [
    { category: "Créer", value: latestReflection?.createScore || 5 },
    { category: "Transmettre", value: latestReflection?.teachScore || 5 },
    { category: "Gagner", value: latestReflection?.earnScore || 5 },
  ];

  // Taux de complétude des routines
  const routineCompletionRate = routines?.length
    ? ((routines.filter((r) => r.morningCompleted && r.beforeWorkCompleted && r.endOfDayCompleted).length / routines.length) * 100).toFixed(0)
    : "0";

  // Cycles actifs et terminés
  const activeCycles = cycles?.filter((c) => {
    const now = new Date();
    return now >= new Date(c.startDate) && now <= new Date(c.endDate);
  }).length || 0;

  const completedCycles = cycles?.filter((c) => new Date() > new Date(c.endDate)).length || 0;

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
            <h1 className="text-xl font-medium">Analytique & Insights</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble de ta progression</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Plancher atteint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{floorPercentage.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentFinancial?.actualRevenue || 0} € / {currentFinancial?.monthlyFloor || 0} €
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{expansionPercentage.toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentFinancial?.actualRevenue || 0} € / {currentFinancial?.monthlyExpansion || 0} €
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{avgSatisfaction}/10</div>
                <p className="text-xs text-muted-foreground mt-1">{projects?.length || 0} projets</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Routines complètes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{routineCompletionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Derniers 30 jours</p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Progression financière</CardTitle>
              <CardDescription>Plancher vs Expansion vs Réel (6 derniers mois)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="plancher" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expansion" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="réel" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Projects by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Projets par statut</CardTitle>
                <CardDescription>Distribution de tes projets</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Alignment Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Équilibre des 3 axes</CardTitle>
                <CardDescription>Créer / Transmettre / Gagner</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cycles Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Cycles de travail</CardTitle>
              <CardDescription>Progression de tes cycles de 6 semaines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cycles actifs</span>
                    <span className="text-2xl font-bold text-primary">{activeCycles}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cycles complétés</span>
                    <span className="text-2xl font-bold text-accent">{completedCycles}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Recommendations */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Insights & Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {floorPercentage < 100 && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    ⚠️ Tu es à {floorPercentage.toFixed(0)}% de ton plancher. Accélère tes actions pour atteindre ta sécurité financière.
                  </p>
                </div>
              )}
              {floorPercentage >= 100 && expansionPercentage < 100 && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    ✅ Plancher atteint ! Tu es à {expansionPercentage.toFixed(0)}% de ton objectif d'expansion.
                  </p>
                </div>
              )}
              {expansionPercentage >= 100 && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    🎉 Bravo ! Tu as atteint ton objectif d'expansion. Pense à augmenter tes objectifs.
                  </p>
                </div>
              )}
              {projectsByStatus.production === 0 && (
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    💡 Aucun projet en production. Passe au moins un projet en phase de production.
                  </p>
                </div>
              )}
              {Number(routineCompletionRate) < 50 && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-900 dark:text-red-100">
                    🔴 Tes routines quotidiennes ne sont complétées qu'à {routineCompletionRate}%. Recommence à les suivre régulièrement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

