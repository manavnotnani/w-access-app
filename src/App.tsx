import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateWallet from "./pages/CreateWallet";
import NameService from "./pages/NameService";
import Recovery from "./pages/Recovery";
import Settings from "./pages/Settings";
import SecuritySetup from "./pages/SecuritySetup";
import WalletTutorial from "./pages/WalletTutorial";
import ComingSoon from "./pages/ComingSoon";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-wallet" element={<CreateWallet />} />
          <Route path="/names" element={<NameService />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/security-setup" element={<SecuritySetup />} />
          <Route path="/wallet-tutorial" element={<WalletTutorial />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
