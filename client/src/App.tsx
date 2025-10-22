import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Finances from "./pages/Finances";
import Projects from "./pages/Projects";
import Cycles from "./pages/Cycles";
import Reflections from "./pages/Reflections";
import Routines from "./pages/Routines";
import Coaching from "./pages/Coaching";
import Analytics from "./pages/Analytics";
import Overview from "./pages/Overview";
import OverviewEnhanced from "./pages/OverviewEnhanced";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
       <Route path="/dashboard" component={OverviewEnhanced} />
      <Route path="/nav" component={Dashboard} />
      <Route path="/finances" component={Finances} />
      <Route path="/projects" component={Projects} />
      <Route path="/cycles" component={Cycles} />
      <Route path="/reflections" component={Reflections} />
      <Route path="/routines" component={Routines} />
      <Route path="/coaching" component={Coaching} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/overview" component={Overview} />
      <Route path="/dashboard" component={OverviewEnhanced} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
