import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Save, TrendingUp, DollarSign, PiggyBank } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Finances() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [monthlyFloor, setMonthlyFloor] = useState(0);
  const [monthlyExpansion, setMonthlyExpansion] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [actualRevenue, setActualRevenue] = useState(0);

  const { data: financialGoal, isLoading } = trpc.financialGoals.get.useQuery({ currentMonth });
  const upsertMutation = trpc.financialGoals.upsert.useMutation({
    onSuccess: () => {
      utils.financialGoals.get.invalidate();
      toast.success("Objectifs financiers enregistrés");
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement");
    },
  });

  useEffect(() => {
    if (financialGoal) {
      setMonthlyFloor(financialGoal.monthlyFloor);
      setMonthlyExpansion(financialGoal.monthlyExpansion);
      setMonthlySavings(financialGoal.monthlySavings);
      setActualRevenue(financialGoal.actualRevenue);
    }
  }, [financialGoal]);

  const handleSave = () => {
    upsertMutation.mutate({
      currentMonth,
      monthlyFloor,
      monthlyExpansion,
      monthlySavings,
      actualRevenue,
    });
  };

  const floorProgress = monthlyFloor > 0 ? (actualRevenue / monthlyFloor) * 100 : 0;
  const expansionProgress = monthlyExpansion > 0 ? (actualRevenue / monthlyExpansion) * 100 : 0;

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
            <h1 className="text-xl font-medium">Plancher & Plafond</h1>
            <p className="text-sm text-muted-foreground">Sécurité financière</p>
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
                <strong>Rituel du lundi matin :</strong> Prends 10 minutes pour vérifier où tu en es. Définis ton plancher (le minimum vital), ton objectif d'expansion, et ton épargne. Suis ton revenu réel chaque semaine.
              </p>
            </CardContent>
          </Card>

          {/* Financial Goals Form */}
          <Card>
            <CardHeader>
              <CardTitle>Objectifs pour {new Date(currentMonth + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</CardTitle>
              <CardDescription>Définis tes objectifs financiers du mois</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="floor" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Plancher mensuel (€)
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={monthlyFloor}
                    onChange={(e) => setMonthlyFloor(Number(e.target.value))}
                    placeholder="1500"
                  />
                  <p className="text-xs text-muted-foreground">Le minimum vital</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expansion" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Objectif d'expansion (€)
                  </Label>
                  <Input
                    id="expansion"
                    type="number"
                    value={monthlyExpansion}
                    onChange={(e) => setMonthlyExpansion(Number(e.target.value))}
                    placeholder="3000"
                  />
                  <p className="text-xs text-muted-foreground">Ton objectif de croissance</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings" className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-primary" />
                    Épargne mensuelle (€)
                  </Label>
                  <Input
                    id="savings"
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                    placeholder="500"
                  />
                  <p className="text-xs text-muted-foreground">Ce que tu mets de côté</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual" className="text-lg font-medium">
                  Revenu réel du mois (€)
                </Label>
                <Input
                  id="actual"
                  type="number"
                  value={actualRevenue}
                  onChange={(e) => setActualRevenue(Number(e.target.value))}
                  placeholder="0"
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">Mets à jour chaque semaine</p>
              </div>

              <Button onClick={handleSave} disabled={upsertMutation.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          {/* Progress Visualization */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression du plancher</CardTitle>
                <CardDescription>
                  {actualRevenue} € / {monthlyFloor} €
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.min(floorProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {floorProgress.toFixed(0)}% atteint
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression de l'expansion</CardTitle>
                <CardDescription>
                  {actualRevenue} € / {monthlyExpansion} €
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${Math.min(expansionProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {expansionProgress.toFixed(0)}% atteint
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

