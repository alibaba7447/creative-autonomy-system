import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-xl font-medium">{APP_TITLE}</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="default">Accéder à mon bilan</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default">Se connecter</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Pour les créatifs qui veulent avancer librement</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
              Système d'autonomie créative
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stabilise ton mental, structure tes projets, et avance librement. Un système simple pour équilibrer créativité, clarté financière et plaisir d'apprendre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Voir mon bilan
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="gap-2">
                    Commencer
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20 border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Clarté financière</h3>
              <p className="text-muted-foreground leading-relaxed">
                Définis ton plancher et ton plafond. Suis tes revenus sans stress avec le tableau "Plancher & Plafond".
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Projets structurés</h3>
              <p className="text-muted-foreground leading-relaxed">
                Applique la règle du 3×3 : 3 projets, 3 mois, 3 actions. Avance sans te disperser.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Progression sereine</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cycles de 6 semaines, routines douces et bilans trimestriels pour garder le cap.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container py-20 border-t border-border/50">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-medium">
              Équilibre et liberté
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ce système repose sur une philosophie simple : la stabilité mentale et financière ne s'oppose pas à la créativité. Au contraire, elle la nourrit. En structurant tes projets et tes revenus, tu libères ton esprit pour créer, transmettre et grandir.
            </p>
            <div className="pt-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2">
                    Voir mon bilan
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" variant="outline" className="gap-2">
                    Découvrir le système
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Système d'autonomie créative · Pour avancer librement</p>
        </div>
      </footer>
    </div>
  );
}

