import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Seminar from "@/pages/seminar";
import SeminarSchedulePage from "@/pages/seminar-schedule";
import SeminarApplyPage from "@/pages/seminar-apply";
import Products from "@/pages/products";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/seminar" component={Seminar} />
      <Route path="/seminar/schedule" component={SeminarSchedulePage} />
      <Route path="/seminar/apply" component={SeminarApplyPage} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
