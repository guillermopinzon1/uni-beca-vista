import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, FileText, Gift, Target, GraduationCap, Trophy, Palette, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import RenovacionAnual from "@/components/excelencia/RenovacionAnual";
import ActividadesReportes from "@/components/excelencia/ActividadesReportes";
import BeneficiosRecursos from "@/components/excelencia/BeneficiosRecursos";
import CompromisosEspeciales from "@/components/excelencia/CompromisosEspeciales";

const ExcelenciaProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedScholarshipType, setSelectedScholarshipType] = useState<string | null>(null);

   const sidebarItems = [
    {
      title: "Renovación Anual",
      icon: RefreshCw,
      onClick: () => setActiveModule("renovacion")
    },
    {
      title: "Actividades y Reportes",
      icon: FileText,
      onClick: () => setActiveModule("actividades")
    },
    {
      title: "Beneficios y Recursos",
      icon: Gift,
      onClick: () => setActiveModule("beneficios")
    },
    {
      title: "Compromisos Especiales",
      icon: Target,
      onClick: () => setActiveModule("compromisos")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  const tiposBecas = [
    {
      id: 'academica',
      title: 'EXCELENCIA ACADÉMICA',
      icon: GraduationCap,
      description: 'Para estudiantes con rendimiento académico excepcional',
      iaaMinimo: '17.5',
      color: 'blue'
    },
    {
      id: 'deportiva',
      title: 'EXCELENCIA DEPORTIVA',
      icon: Trophy,
      description: 'Para atletas de selecciones deportivas UNIMET',
      iaaMinimo: '15.0',
      color: 'green',
      extraInfo: 'Debes estar en selección con nota ≥18'
    },
    {
      id: 'artistica',
      title: 'EXCELENCIA ARTÍSTICA',
      icon: Palette,
      description: 'Para talentos de selecciones culturales UNIMET',
      iaaMinimo: '15.0',
      color: 'purple',
      extraInfo: 'Debes estar en selección cultural con nota ≥18'
    },
    {
      id: 'civico',
      title: 'COMPROMISO CÍVICO',
      icon: Heart,
      description: 'Para líderes de proyectos de impacto social',
      iaaMinimo: '15.0',
      color: 'orange',
      extraInfo: 'Requiere evidencias de impacto comunitario'
    },
    {
      id: 'emprendimiento',
      title: 'EMPRENDIMIENTO',
      icon: Lightbulb,
      description: 'Para estudiantes con proyectos emprendedores',
      iaaMinimo: '15.0',
      color: 'yellow',
      extraInfo: 'Proyecto de máximo 2 páginas'
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
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Programa de Excelencia</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Excelencia
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  Becario Activo - Excelencia Deportiva
                </Badge>
                <Badge variant="outline" className="border-orange/40 text-primary">
                  25% Cobertura
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">Carlos Mendoza</p>
                <p className="text-xs text-muted-foreground">Estudiante - Natación</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Integrated Sidebar - Only show if scholarship type is selected */}
        {selectedScholarshipType && (
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
                        item.title === "Renovación Anual" ? "renovacion" :
                        item.title === "Actividades y Reportes" ? "actividades" :
                        item.title === "Beneficios y Recursos" ? "beneficios" :
                        item.title === "Compromisos Especiales" ? "compromisos" :
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
        )}

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {!selectedScholarshipType ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-primary">¿Qué tipo de Beca de Excelencia tienes?</h2>
                  <p className="text-muted-foreground">Selecciona tu categoría de beca para acceder a tus módulos</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tiposBecas.map((tipo) => (
                    <Card 
                      key={tipo.id}
                      className={`cursor-pointer hover:shadow-lg transition-all border-2 hover:border-${tipo.color}-500/50`}
                      onClick={() => setSelectedScholarshipType(tipo.id)}
                    >
                      <CardHeader className="text-center">
                        <tipo.icon className={`h-12 w-12 mx-auto text-${tipo.color}-600 mb-3`} />
                        <CardTitle className="text-lg">{tipo.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {tipo.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className={`bg-${tipo.color}-100 p-3 rounded-lg`}>
                          <p className={`text-${tipo.color}-800 font-medium text-sm`}>
                            IAA mínimo: {tipo.iaaMinimo}
                          </p>
                          {tipo.extraInfo && (
                            <p className={`text-${tipo.color}-700 text-xs mt-1`}>
                              {tipo.extraInfo}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : activeModule === "renovacion" ? (
              <RenovacionAnual />
            ) : activeModule === "actividades" ? (
              <ActividadesReportes />
            ) : activeModule === "beneficios" ? (
              <BeneficiosRecursos />
            ) : activeModule === "compromisos" ? (
              <CompromisosEspeciales />
            ) : activeModule === "reglamento" ? (
              <div className="flex justify-center">
                <ReglamentoAccess becaType="excelencia" />
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Beca de Excelencia - {tiposBecas.find(t => t.id === selectedScholarshipType)?.title}
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