import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, Users, FileText, AlertTriangle, Building } from "lucide-react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useState } from "react";
import Dashboard from "@/components/impacto/Dashboard";
import ApplicationsList from "@/components/impacto/ApplicationsList";
import Mentoria from "@/components/impacto/Mentoria";
import RenovacionDocumentos from "@/components/impacto/RenovacionDocumentos";
import SituacionesEspeciales from "@/components/impacto/SituacionesEspeciales";
import InstitucionAliada from "@/components/impacto/InstitucionAliada";

const ImpactoProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("portal-institucional");

  const sidebarItems = [
    {
      title: "Portal Institucional",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("portal-institucional")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
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
              <h1 className="text-2xl font-bold text-primary">Portal Instituciones Aliadas - Programa Impacto</h1>
              <p className="text-sm text-muted-foreground">
                Acceso exclusivo para instituciones autorizadas
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Convocatoria Cerrada
            </Badge>
            <Badge variant="outline" className="border-red-200 text-red-600">
              Solo Instituciones Aliadas
            </Badge>
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
                      item.title === "Mi Beca Impacto" ? "mi-beca" :
                      item.title === "Portal Institucional" ? "portal-institucional" :
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
            {activeModule === "portal-institucional" ? (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-red-800 mb-4">
                    🔒 Portal Exclusivo para Instituciones Aliadas
                  </h2>
                  <div className="space-y-4 text-red-700">
                    <p className="font-medium">
                      El Programa Impacto es de CONVOCATORIA CERRADA
                    </p>
                    <div className="space-y-2">
                      <p>• NO es una beca pública donde estudiantes regulares pueden postularse</p>
                      <p>• Solo instituciones autorizadas pueden nominar estudiantes vulnerables</p>
                      <p>• Máximo 30 nominaciones por institución</p>
                      <p>• Acceso controlado con usuario y contraseña</p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Instituciones Aliadas Autorizadas:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Fe y Alegría</li>
                        <li>Mano Amiga</li>
                        <li>Colegios asociados (casos especiales)</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <h4 className="font-semibold text-yellow-800">Proceso del Programa:</h4>
                      <ol className="list-decimal list-inside mt-2 space-y-1 text-yellow-700">
                        <li>DDBE abre convocatoria (fechas específicas)</li>
                        <li>Instituciones acceden con credenciales</li>
                        <li>Cargan estudiantes nominados (máx. 30)</li>
                        <li>Sistema consolida nominaciones</li>
                        <li>Envío a Admisiones para PDU</li>
                        <li>Comité de Becas toma decisión final</li>
                        <li>Seguimiento se transfiere al módulo de acompañamiento</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeModule === "reglamento" ? (
              <div className="flex justify-center">
                <ReglamentoAccess becaType="impacto" />
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Portal de Instituciones Aliadas - Programa Impacto
                </h2>
                <p className="text-muted-foreground">
                  Utiliza el menú lateral para navegar entre los diferentes módulos administrativos
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImpactoProgram;