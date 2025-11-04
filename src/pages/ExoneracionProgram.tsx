import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, FileText, GraduationCap } from "lucide-react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useState } from "react";
import RequisitosBeneficios from "@/components/exoneracion/RequisitosBeneficios";
import AlineacionCarrera from "@/components/exoneracion/AlineacionCarrera";

const ExoneracionProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("mi-beneficio");
  
  // Simulated user type - could come from auth context
  const userType = "hijo"; // "hijo" or "empleado"

  const sidebarItemsHijo = [
    {
      title: "Mi Beneficio de Exoneración",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("mi-beneficio")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  const sidebarItemsEmpleado = [
    {
      title: "Mi Beneficio de Exoneración",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("mi-beneficio")
    },
    {
      title: "Alineación Carrera-Puesto",
      icon: GraduationCap,
      onClick: () => setActiveModule("alineacion")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  const sidebarItems = userType === "hijo" ? sidebarItemsHijo : sidebarItemsEmpleado;

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
              <h1 className="text-2xl font-bold text-primary">
                {userType === "hijo" ? "Programa de Exoneración - Hijo de Empleado" : "Programa de Exoneración - Empleado"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Exoneración
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {userType === "hijo" 
                    ? "Beneficiario Exoneración - Hijo de Personal UNIMET" 
                    : "Beneficiario Exoneración - Empleado UNIMET"
                  }
                </Badge>
              </div>
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
                      item.title === "Mi Beneficio de Exoneración" ? "mi-beneficio" :
                      item.title === "Alineación Carrera-Puesto" ? "alineacion" :
                      "reglamento"
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
            {activeModule === "mi-beneficio" ? (
              <RequisitosBeneficios userType={userType} />
            ) : activeModule === "alineacion" ? (
              <AlineacionCarrera />
            ) : activeModule === "reglamento" ? (
              <div className="flex justify-center">
                <ReglamentoAccess becaType="exoneracion" />
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Programa de Exoneración
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

export default ExoneracionProgram;