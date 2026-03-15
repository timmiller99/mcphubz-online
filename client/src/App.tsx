import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Sandbox from "./pages/Sandbox";
import Templates from "./pages/Templates";
import Docs from "./pages/Docs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sandbox" component={Sandbox} />
      <Route path="/sandbox/:mode" component={Sandbox} />
      <Route path="/templates" component={Templates} />
      <Route path="/docs" component={Docs} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#e2e8f0',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
