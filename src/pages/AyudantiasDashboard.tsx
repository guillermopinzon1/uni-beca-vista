
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import ListaAyudantes from "@/components/ayudantias/ListaAyudantes";
import BuscarAyudantes from "@/components/ayudantias/BuscarAyudantes";

const AyudantiasDashboard = () => {
  const navigate = useNavigate();
  const { logoutAndNavigateHome } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("lista-ayudantes");

  const sidebarItems = [
    {
      title: "Lista de Ayudantes",
      icon: Users,
      onClick: () => setActiveModule("lista-ayudantes")
    },
    {
      title: "Buscar Ayudantes", 
      icon: Search,
      onClick: () => setActiveModule("buscar-ayudantes")
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
              onClick={logoutAndNavigateHome}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Ayudantías</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Ayudantías
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Juan Carlos Pérez</p>
              <p className="text-xs text-muted-foreground">Supervisor</p>
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
            {activeModule === "lista-ayudantes" ? (
              <ListaAyudantes />
            ) : activeModule === "buscar-ayudantes" ? (
              <BuscarAyudantes />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Sistema de Ayudantías
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

export default AyudantiasDashboard;
