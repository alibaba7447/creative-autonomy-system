import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Save, TrendingUp, DollarSign, PiggyBank, Plus, Trash2, Edit2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Finances() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [monthlyFloor, setMonthlyFloor] = useState(0);
  const [monthlyExpansion, setMonthlyExpansion] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [actualRevenue, setActualRevenue] = useState(0);

  // Revenue form states
  const [showRevenueForm, setShowRevenueForm] = useState(false);
  const [revenueName, setRevenueName] = useState("");
  const [revenueAmount, setRevenueAmount] = useState(0);
  const [revenueFrequency, setRevenueFrequency] = useState("monthly");
  const [revenueDescription, setRevenueDescription] = useState("");
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  // Expense form states
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState("autres");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Queries
  const { data: financialGoal, isLoading } = trpc.financialGoals.get.useQuery({ currentMonth });
  const { data: revenueSources = [] } = trpc.revenueSources.list.useQuery();
  const { data: expenses = [] } = trpc.expenses.list.useQuery();

  // Mutations
  const upsertMutation = trpc.financialGoals.upsert.useMutation({
    onSuccess: () => {
      utils.financialGoals.get.invalidate();
      toast.success("Objectifs financiers enregistrés");
    },
  });

  const createRevenueMutation = trpc.revenueSources.create.useMutation({
    onSuccess: () => {
      utils.revenueSources.list.invalidate();
      resetRevenueForm();
      toast.success("Source de revenu ajoutée");
    },
  });

  const updateRevenueMutation = trpc.revenueSources.update.useMutation({
    onSuccess: () => {
      utils.revenueSources.list.invalidate();
      resetRevenueForm();
      toast.success("Source de revenu modifiée");
    },
  });

  const deleteRevenueMutation = trpc.revenueSources.delete.useMutation({
    onSuccess: () => {
      utils.revenueSources.list.invalidate();
      toast.success("Source de revenu supprimée");
    },
  });

  const createExpenseMutation = trpc.expenses.create.useMutation({
    onSuccess: () => {
      utils.expenses.list.invalidate();
      resetExpenseForm();
      toast.success("Dépense ajoutée");
    },
  });

  const updateExpenseMutation = trpc.expenses.update.useMutation({
    onSuccess: () => {
      utils.expenses.list.invalidate();
      resetExpenseForm();
      toast.success("Dépense modifiée");
    },
  });

  const deleteExpenseMutation = trpc.expenses.delete.useMutation({
    onSuccess: () => {
      utils.expenses.list.invalidate();
      toast.success("Dépense supprimée");
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

  const resetRevenueForm = () => {
    setShowRevenueForm(false);
    setRevenueName("");
    setRevenueAmount(0);
    setRevenueFrequency("monthly");
    setRevenueDescription("");
    setEditingRevenueId(null);
  };

  const resetExpenseForm = () => {
    setShowExpenseForm(false);
    setExpenseName("");
    setExpenseAmount(0);
    setExpenseCategory("autres");
    setExpenseDescription("");
    setEditingExpenseId(null);
  };

  const handleAddRevenue = () => {
    if (!revenueName || revenueAmount <= 0) {
      toast.error("Remplis tous les champs");
      return;
    }

    if (editingRevenueId) {
      updateRevenueMutation.mutate({
        id: editingRevenueId,
        name: revenueName,
        amount: revenueAmount,
        frequency: revenueFrequency as any,
        description: revenueDescription,
        date: new Date(),
      });
    } else {
      createRevenueMutation.mutate({
        name: revenueName,
        amount: revenueAmount,
        frequency: revenueFrequency as any,
        description: revenueDescription,
        date: new Date(),
      });
    }
  };

  const handleAddExpense = () => {
    if (!expenseName || expenseAmount <= 0) {
      toast.error("Remplis tous les champs");
      return;
    }

    if (editingExpenseId) {
      updateExpenseMutation.mutate({
        id: editingExpenseId,
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        description: expenseDescription,
        date: new Date(),
      });
    } else {
      createExpenseMutation.mutate({
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory,
        description: expenseDescription,
        date: new Date(),
      });
    }
  };

  const handleEditRevenue = (revenue: any) => {
    setRevenueName(revenue.name);
    setRevenueAmount(revenue.amount);
    setRevenueFrequency(revenue.frequency);
    setRevenueDescription(revenue.description || "");
    setEditingRevenueId(revenue.id);
    setShowRevenueForm(true);
  };

  const handleEditExpense = (expense: any) => {
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount);
    setExpenseCategory(expense.category);
    setExpenseDescription(expense.description || "");
    setEditingExpenseId(expense.id);
    setShowExpenseForm(true);
  };

  const floorProgress = monthlyFloor > 0 ? (actualRevenue / monthlyFloor) * 100 : 0;
  const expansionProgress = monthlyExpansion > 0 ? (actualRevenue / monthlyExpansion) * 100 : 0;
  const totalRevenue = revenueSources.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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
        <div className="max-w-6xl mx-auto space-y-8">
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

          {/* Revenue Sources */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sources de revenus</CardTitle>
                <CardDescription>Total: {totalRevenue}€</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setShowRevenueForm(!showRevenueForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showRevenueForm && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de la source</Label>
                      <Input
                        value={revenueName}
                        onChange={(e) => setRevenueName(e.target.value)}
                        placeholder="Ex: Freelance, Salaire..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Montant (€)</Label>
                      <Input
                        type="number"
                        value={revenueAmount}
                        onChange={(e) => setRevenueAmount(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fréquence</Label>
                      <select
                        value={revenueFrequency}
                        onChange={(e) => setRevenueFrequency(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="once">Une fois</option>
                        <option value="daily">Quotidien</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuel</option>
                        <option value="yearly">Annuel</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optionnel)</Label>
                      <Input
                        value={revenueDescription}
                        onChange={(e) => setRevenueDescription(e.target.value)}
                        placeholder="Notes..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddRevenue} className="flex-1">
                      {editingRevenueId ? "Modifier" : "Ajouter"}
                    </Button>
                    <Button variant="outline" onClick={resetRevenueForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {revenueSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune source de revenu</p>
                ) : (
                  revenueSources.map((revenue) => (
                    <div key={revenue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                      <div className="flex-1">
                        <p className="font-medium">{revenue.name}</p>
                        <p className="text-xs text-muted-foreground">{revenue.frequency}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-green-600">{revenue.amount}€</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRevenue(revenue)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRevenueMutation.mutate({ id: revenue.id })}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dépenses</CardTitle>
                <CardDescription>Total: {totalExpenses}€</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showExpenseForm && (
                <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de la dépense</Label>
                      <Input
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        placeholder="Ex: Loyer, Nourriture..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Montant (€)</Label>
                      <Input
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Catégorie</Label>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="logement">Logement</option>
                        <option value="nourriture">Nourriture</option>
                        <option value="transport">Transport</option>
                        <option value="sante">Santé</option>
                        <option value="loisirs">Loisirs</option>
                        <option value="autres">Autres</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (optionnel)</Label>
                      <Input
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                        placeholder="Notes..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddExpense} className="flex-1">
                      {editingExpenseId ? "Modifier" : "Ajouter"}
                    </Button>
                    <Button variant="outline" onClick={resetExpenseForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {expenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune dépense</p>
                ) : (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                      <div className="flex-1">
                        <p className="font-medium">{expense.name}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-red-600">-{expense.amount}€</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteExpenseMutation.mutate({ id: expense.id })}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-card">
                <p className="text-sm text-muted-foreground">Total revenus</p>
                <p className="text-2xl font-bold text-green-600">+{totalRevenue}€</p>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-card">
                <p className="text-sm text-muted-foreground">Total dépenses</p>
                <p className="text-2xl font-bold text-red-600">-{totalExpenses}€</p>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-card">
                <p className="text-sm text-muted-foreground">Bilan</p>
                <p className={`text-2xl font-bold ${totalRevenue - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalRevenue - totalExpenses}€
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

