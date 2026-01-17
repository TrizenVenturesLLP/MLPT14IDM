import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Cases from "./pages/Cases";
import Alerts from "./pages/Alerts";
import Blockchain from "./pages/Blockchain";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Standalone pages without sidebar */}
          <Route path="/" element={<Landing />} />
          <Route path="/analysis" element={<Analysis />} />
          
          {/* Dashboard pages with sidebar */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/cases" element={<MainLayout><Cases /></MainLayout>} />
          <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
          <Route path="/blockchain" element={<MainLayout><Blockchain /></MainLayout>} />
          <Route path="/agents" element={<MainLayout><Agents /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
