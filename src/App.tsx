import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ChangePasswordRequired from "./pages/ChangePasswordRequired";
import Requisitos from "./pages/Requisitos";
import ModuleSelection from "./pages/ModuleSelection";
import AyudantiasDashboard from "./pages/AyudantiasDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PasanteAyudantiasModules from "./pages/PasanteAyudantiasModules";
import EstudianteDetail from "./pages/EstudianteDetail";
import ScholarshipPrograms from "./pages/ScholarshipPrograms";
import Profile from "./pages/Profile";
import PostulacionesList from "./pages/PostulacionesList";
import PostulacionDetail from "./pages/PostulacionDetail";
import Reportes from "./pages/Reportes";
import NotFound from "./pages/NotFound";
import ImpactoProgram from "./pages/ImpactoProgram";
import ExoneracionProgram from "./pages/ExoneracionProgram";
import ExcelenciaProgram from "./pages/ExcelenciaProgram";

import FormacionDocenteAdmin from "./pages/FormacionDocenteAdmin";
import FormacionDocenteProgram from "./pages/FormacionDocenteProgram";
import ExoneracionStudent from "./pages/ExoneracionStudent";
import ExoneracionCapitalHumano from "./pages/ExoneracionCapitalHumano";
import AspiranteScholarshipPrograms from "./pages/AspiranteScholarshipPrograms";
import PostulacionesBecas from "./pages/PostulacionesBecas";
import PostRegisterApplication from "./pages/PostRegisterApplication";
import MentorDashboard from "./pages/MentorDashboard";
import DirectorAreaDashboard from "./pages/DirectorAreaDashboard";
import CapitalHumanoDashboard from "./pages/CapitalHumanoDashboard";
import SupervisorLaboralDashboard from "./pages/SupervisorLaboralDashboard";
import AyudantiasProgram from "./pages/AyudantiasProgram";
import Home from "./pages/home";

import VocationalTest from "./pages/Vocacion/VocationalTest";
import VocationalExplorer from "./pages/Vocacion/VocationalExplorer";
import VocationalCrm from "./pages/Vocacion/VocationalCrm";
import VocationalAnalytics from "./pages/Vocacion/VocationalAnalytics";
import CareerDetailPage from "./pages/Vocacion/CareerDetail";


import DashboardAspirante from "./pages/Vocacion/DashboardAspirante";
import VocationalIndex from "./pages/Vocacion/vocationalIndex";
import DashboardEspecialist from "./pages/Vocacion/DashboardEspecialist";
import SeleccionarTest from "./pages/Vocacion/SeleccionarTest";
import Ronda1 from "./pages/Vocacion/Ronda1";
import Ronda2 from "./pages/Vocacion/Ronda2";
import Resultados from "./pages/Vocacion/Resultados";
import TestICO from "./pages/Vocacion/TestICO";
import ResultadosICO from "./pages/Vocacion/ResultadosICO";
import PerfilVocacional from "./pages/Vocacion/PerfilVocacional";
import Historial from "./pages/Vocacion/Historial";



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
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/index" element={<Index />} />
              <Route path="/home" element={<Home/>} />
              <Route path="/vocational" element={<VocationalIndex/>}/>
              <Route path="/career/:id" element={<CareerDetailPage />} />

              {/* Rutas de autenticación (solo para usuarios NO autenticados) */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Rutas protegidas - Orientación Vocacional */}
              <Route path="/vocational-test" element={<ProtectedRoute><VocationalTest/></ProtectedRoute>}/>
              <Route path="/vocational-explorer" element={<ProtectedRoute><VocationalExplorer/></ProtectedRoute>}/>
              <Route path="/vocational-crm" element={<ProtectedRoute allowedRoles={['admin', 'especialista']}><VocationalCrm/></ProtectedRoute>}/>
              <Route path="/vocational-analytics" element={<ProtectedRoute allowedRoles={['admin', 'especialista']}><VocationalAnalytics/></ProtectedRoute>}/>

              {/* Dashboard Aspirante - Protegido (estudiantes y aspirantes) */}
              <Route path="/dashboard-aspirante" element={<ProtectedRoute allowedRoles={['aspirante', 'estudiante']}><DashboardAspirante/></ProtectedRoute>}/>

              {/* Rutas de Orientación Vocacional con DashboardAspirante como layout */}
              <Route path="/orientacion" element={<ProtectedRoute allowedRoles={['aspirante', 'estudiante']}><DashboardAspirante/></ProtectedRoute>}>
                <Route path="seleccionar-test" element={<SeleccionarTest/>}/>
                <Route path="ronda-1" element={<Ronda1/>}/>
                <Route path="ronda-2" element={<Ronda2/>}/>
                <Route path="test-ico" element={<TestICO/>}/>
                <Route path="resultados/:sesionId?" element={<Resultados/>}/>
                <Route path="resultados-ico" element={<ResultadosICO/>}/>
                <Route path="perfil" element={<PerfilVocacional/>}/>
                <Route path="historial" element={<Historial/>}/>
              </Route>

              {/* Dashboard Especialista - Protegido */}
              <Route path="/dashboard-especialista" element={<ProtectedRoute allowedRoles={['especialista']}><DashboardEspecialist/></ProtectedRoute>}/>

              {/* Cambio de contraseña obligatorio - Protegido pero sin restricción de rol */}
              <Route path="/cambiar-password-obligatorio" element={<ProtectedRoute><ChangePasswordRequired /></ProtectedRoute>} />
              {/* Módulos y Dashboards - Protegidos por rol */}
              <Route path="/modules" element={<ProtectedRoute allowedRoles={['estudiante', 'aspirante']}><ModuleSelection /></ProtectedRoute>} />
              <Route path="/ayudantias-dashboard" element={<ProtectedRoute allowedRoles={['supervisor']}><AyudantiasDashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/pasante-ayudantias-modules" element={<ProtectedRoute allowedRoles={['estudiante']}><PasanteAyudantiasModules /></ProtectedRoute>} />
              <Route path="/estudiante/:id" element={<ProtectedRoute allowedRoles={['supervisor', 'admin', 'mentor', 'director-area', 'capital-humano', 'supervisor-laboral']}><EstudianteDetail /></ProtectedRoute>} />

              {/* Programas de Becas - Protegidos */}
              <Route path="/scholarship-programs" element={<ProtectedRoute allowedRoles={['estudiante']}><ScholarshipPrograms /></ProtectedRoute>} />
              <Route path="/aspirante-scholarship-programs" element={<ProtectedRoute allowedRoles={['aspirante']}><AspiranteScholarshipPrograms /></ProtectedRoute>} />
              <Route path="/postulaciones-becas" element={<ProtectedRoute><PostulacionesBecas /></ProtectedRoute>} />
              <Route path="/post-register-application" element={<ProtectedRoute allowedRoles={['aspirante']}><PostRegisterApplication /></ProtectedRoute>} />

              {/* Perfil y Postulaciones - Protegidos */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/requisitos" element={<ProtectedRoute><Requisitos /></ProtectedRoute>} />
              <Route path="/postulaciones" element={<ProtectedRoute><PostulacionesList /></ProtectedRoute>} />
              <Route path="/postulaciones/:id" element={<ProtectedRoute><PostulacionDetail /></ProtectedRoute>} />
              <Route path="/reportes" element={<ProtectedRoute allowedRoles={['admin', 'director-area', 'capital-humano', 'supervisor-laboral']}><Reportes /></ProtectedRoute>} />

              {/* Programas específicos - Protegidos para estudiantes */}
              <Route path="/impacto" element={<ProtectedRoute allowedRoles={['estudiante']}><ImpactoProgram /></ProtectedRoute>} />
              <Route path="/exoneracion" element={<ProtectedRoute allowedRoles={['estudiante']}><ExoneracionProgram /></ProtectedRoute>} />
              <Route path="/excelencia" element={<ProtectedRoute allowedRoles={['estudiante']}><ExcelenciaProgram /></ProtectedRoute>} />
              <Route path="/formacion-docente" element={<ProtectedRoute allowedRoles={['estudiante']}><FormacionDocenteProgram /></ProtectedRoute>} />
              <Route path="/ayudantias" element={<ProtectedRoute allowedRoles={['estudiante']}><AyudantiasProgram /></ProtectedRoute>} />

              {/* Rutas administrativas - Protegidas por rol */}
              <Route path="/formacion-docente-admin" element={<ProtectedRoute allowedRoles={['admin', 'director-area']}><FormacionDocenteAdmin /></ProtectedRoute>} />
              <Route path="/exoneracion-student" element={<ProtectedRoute allowedRoles={['estudiante']}><ExoneracionStudent /></ProtectedRoute>} />
              <Route path="/exoneracion-capital-humano" element={<ProtectedRoute allowedRoles={['capital-humano', 'admin']}><ExoneracionCapitalHumano /></ProtectedRoute>} />

              {/* Dashboards específicos por rol */}
              <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
              <Route path="/director-area-dashboard" element={<ProtectedRoute allowedRoles={['director-area']}><DirectorAreaDashboard /></ProtectedRoute>} />
              <Route path="/capital-humano-dashboard" element={<ProtectedRoute allowedRoles={['capital-humano']}><CapitalHumanoDashboard /></ProtectedRoute>} />
              <Route path="/supervisor-laboral-dashboard" element={<ProtectedRoute allowedRoles={['supervisor-laboral']}><SupervisorLaboralDashboard /></ProtectedRoute>} />
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
