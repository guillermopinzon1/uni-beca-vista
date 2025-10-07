import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Requisitos from "./pages/Requisitos";
import ModuleSelection from "./pages/ModuleSelection";
import AyudantiasDashboard from "./pages/AyudantiasDashboard";
import Ayudantias from "./pages/Ayudantias";
import AdminDashboard from "./pages/AdminDashboard";
import EstudianteDetail from "./pages/EstudianteDetail";
import ScholarshipPrograms from "./pages/ScholarshipPrograms";
import Profile from "./pages/Profile";
import PostulacionesList from "./pages/PostulacionesList";
import PostulacionDetail from "./pages/PostulacionDetail";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import ImpactoProgram from "./pages/ImpactoProgram";
import ExcelenciaProgram from "./pages/ExcelenciaProgram";
import AspiranteScholarshipPrograms from "./pages/AspiranteScholarshipPrograms";
import PostulacionesBecas from "./pages/PostulacionesBecas";
import CapitalHumanoDashboard from "./pages/CapitalHumanoDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/modules" element={<ModuleSelection />} />
          <Route path="/ayudantias" element={<Ayudantias />} />
          <Route path="/ayudantias-dashboard" element={<AyudantiasDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/estudiante/:id" element={<EstudianteDetail />} />
              <Route path="/scholarship-programs" element={<ScholarshipPrograms />} />
              <Route path="/aspirante-scholarship-programs" element={<AspiranteScholarshipPrograms />} />
              <Route path="/postulaciones-becas" element={<PostulacionesBecas />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/requisitos" element={<Requisitos />} />
              <Route path="/postulaciones" element={<PostulacionesList />} />
              <Route path="/postulaciones/:id" element={<PostulacionDetail />} />
              <Route path="/reportes" element={<Reportes />} />
        <Route path="/impacto" element={<ImpactoProgram />} />
              <Route path="/excelencia" element={<ExcelenciaProgram />} />
              <Route path="/capital-humano-dashboard" element={<CapitalHumanoDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
