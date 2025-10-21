import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { 
  DollarSign, 
  FolderKanban, 
  Calendar, 
  Compass, 
  Sun,
  TrendingUp,
  LogOut,
  Home
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sections = [
    {
      title: "Plancher & Plafond",
      description: "Suis ta sécurité financière mensuelle",
      icon: DollarSign,
      href: "/finances",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Portefeuille de projets",
      description: "Règle du 3×3 : 3 projets, 3 mois, 3 actions",
      icon: FolderKanban,
      href: "/projects",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Cycles de 6 semaines",
      description: "Planifie tes phases de travail",
      icon: Calendar,
      href: "/cycles",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Tableau de sens",
      description: "Bilan trimestriel : Créer, Transmettre, Gagner",
      icon: Compass,
      href: "/reflections",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Routine quotidienne",
      description: "Rituel minimal pour rester aligné",
      icon: Sun,
      href: "/routines",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Suivi du coach",
      description: "Progression semaine par semaine",
      icon: TrendingUp,
      href: "/coaching",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-medium">Mon espace</h1>
              <p className="text-sm text-muted-foreground">Bienvenue, {user?.name}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-medium">Système d'autonomie créative</h2>
            <p className="text-muted-foreground">
              Choisis une section pour commencer à structurer ta vie créative.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href}>
                  <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${section.color}`} />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Quote */}
          <Card className="border-l-4 border-l-primary bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-lg italic text-muted-foreground">
                "La liberté commence par la clarté. Structure ton quotidien pour libérer ta créativité."
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

