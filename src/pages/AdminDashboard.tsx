import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Users, UserCheck, FileText, BarChart3, Building, Settings, FileUp, Activity } from "lucide-react";
import { useState } from "react";
import EstudiantesBecarios from "@/components/admin/EstudiantesBecarios";
import GestionSupervisores from "@/components/admin/GestionSupervisores";
import GestionPostulaciones from "@/components/admin/GestionPostulaciones";
import GestionPlazas from "@/components/admin/GestionPlazas";
import ConfiguracionBecas from "@/components/admin/ConfiguracionBecas";
import ConfiguracionSistema from "@/components/admin/ConfiguracionSistema";
import GestionEstudiantesReportes from "@/components/admin/GestionEstudiantesReportes";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("estudiantes-becarios");

  const sidebarItems = [
    {
      title: "Estudiantes y Reportes",
      icon: Users,
      onClick: () => setActiveModule("estudiantes-becarios")
    },
    {
      title: "Gestión de Estudiantes y Reportes",
      icon: Activity,
      onClick: () => setActiveModule("gestion-estudiantes-reportes")
    },
    {
      title: "Supervisores",
      icon: UserCheck,
      onClick: () => setActiveModule("supervisores")
    },
    {
      title: "Postulaciones",
      icon: FileText,
      onClick: () => setActiveModule("postulaciones")
    },
    {
      title: "Gestión de Plazas",
      icon: Building,
      onClick: () => setActiveModule("plazas")
    },
    {
      title: "Configuración de Becas",
      icon: Settings,
      onClick: () => setActiveModule("configuracion")
    },
    {
      title: "Configuración del Sistema",
      icon: FileUp,
      onClick: () => setActiveModule("configuracion-sistema")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout(() => navigate('/'))}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Panel de Administración
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">María González</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))]">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={item.onClick}
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-background border border-orange/20 hover:bg-orange/10 hover:border-orange/40 transition-all duration-200"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                </button>
                
                {/* Tooltip on hover */}
                {hoveredItem === item.title && (
                  <div className="absolute left-16 top-0 bg-card border border-orange/20 rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary">{item.title}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-orange/20 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {activeModule === "estudiantes-becarios" ? (
              <EstudiantesBecarios />
            ) : activeModule === "gestion-estudiantes-reportes" ? (
              <GestionEstudiantesReportes />
            ) : activeModule === "supervisores" ? (
              <GestionSupervisores />
            ) : activeModule === "postulaciones" ? (
              <GestionPostulaciones />
            ) : activeModule === "plazas" ? (
              <GestionPlazas />
            ) : activeModule === "configuracion" ? (
              <ConfiguracionBecas />
            ) : activeModule === "configuracion-sistema" ? (
              <ConfiguracionSistema />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Panel de Administración
                </h2>
                <p className="text-muted-foreground">
                  Utiliza el menú lateral para navegar entre los diferentes módulos
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;