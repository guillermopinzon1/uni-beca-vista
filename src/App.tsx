import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Requisitos from "./pages/Requisitos";

import ModuleSelection from "./pages/ModuleSelection";
import AyudantiasDashboard from "./pages/AyudantiasDashboard";
import ScholarshipPrograms from "./pages/ScholarshipPrograms";
import Profile from "./pages/Profile";
import PostulacionesList from "./pages/PostulacionesList";
import PostulacionDetail from "./pages/PostulacionDetail";
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/modules" element={<ModuleSelection />} />
          <Route path="/ayudantias" element={<AyudantiasDashboard />} />
          <Route path="/scholarship-programs" element={<ScholarshipPrograms />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/requisitos" element={<Requisitos />} />
          <Route path="/postulaciones" element={<PostulacionesList />} />
          <Route path="/postulaciones/:id" element={<PostulacionDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
