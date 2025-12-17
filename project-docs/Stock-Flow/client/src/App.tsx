import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import VerifyIdentity from "@/pages/verify-identity";
import ResetPin from "@/pages/reset-pin";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import Requests from "@/pages/requests";
import StockInfo from "@/pages/stock-info";
import UpdateStockMode from "@/pages/update-stock-mode";
import UpdateStockManual from "@/pages/update-stock-manual";
import UpdateStockAutomatic from "@/pages/update-stock-automatic";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/verify-identity" component={VerifyIdentity} />
      <Route path="/reset-pin" component={ResetPin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/reports" component={Reports} />
      <Route path="/requests" component={Requests} />
      <Route path="/stock" component={StockInfo} />
      <Route path="/update-stock-mode" component={UpdateStockMode} />
      <Route path="/update-stock-manual" component={UpdateStockManual} />
      <Route path="/update-stock-automatic" component={UpdateStockAutomatic} />
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
