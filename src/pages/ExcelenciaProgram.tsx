import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, LayoutDashboard, FileText, Info } from "lucide-react";
import { useState } from "react";
import Dashboard from "@/components/excelencia/Dashboard";
import ApplicationsList from "@/components/excelencia/ApplicationsList";
import InformacionAyuda from "@/components/excelencia/InformacionAyuda";

const ExcelenciaProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("dashboard");

  const sidebarItems = [
    {
      title: "Mi Dashboard",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("dashboard")
    },
    {
      title: "Mis Solicitudes",
      icon: FileText,
      onClick: () => setActiveModule("solicitudes")
    },
    {
      title: "Información y Ayuda",
      icon: Info,
      onClick: () => setActiveModule("informacion")
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
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Programa de Excelencia</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Excelencia
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">María González</p>
              <p className="text-xs text-muted-foreground">Estudiante</p>
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
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border border-orange/20 transition-all duration-200 ${
                    activeModule === (
                      item.title === "Mi Dashboard" ? "dashboard" :
                      item.title === "Mis Solicitudes" ? "solicitudes" :
                      "informacion"
                    ) 
                      ? "bg-orange/10 border-orange/40" 
                      : "bg-background hover:bg-orange/10 hover:border-orange/40"
                  }`}
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
            {activeModule === "dashboard" ? (
              <Dashboard />
            ) : activeModule === "solicitudes" ? (
              <ApplicationsList />
            ) : activeModule === "informacion" ? (
              <InformacionAyuda />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Programa de Excelencia
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

export default ExcelenciaProgram;