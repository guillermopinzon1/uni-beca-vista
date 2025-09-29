import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, RefreshCw, FileText, Gift, Target, GraduationCap, Trophy, Palette, Heart, Lightbulb, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import Dashboard from "@/components/excelencia/Dashboard";
import RenovacionAnual from "@/components/excelencia/RenovacionAnual";
import ActividadesReportes from "@/components/excelencia/ActividadesReportes";
import BeneficiosRecursos from "@/components/excelencia/BeneficiosRecursos";
import CompromisosEspeciales from "@/components/excelencia/CompromisosEspeciales";

const ExcelenciaProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("mi-beca");
  const [applicationStep, setApplicationStep] = useState<'type-selection' | 'categories' | 'form'>('type-selection');
  const [applicationType, setApplicationType] = useState<'regular' | 'colegio-asociado' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [colegioData, setColegioData] = useState({
    colegio: '',
    fueBecado: '',
    razonBeca: '',
    hijoTrabajador: ''
  });

   const sidebarItems = [
    {
      title: "Postular a Excelencia",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("mi-beca")
    },
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

  const categorias = [
    {
      id: 'academica',
      title: 'EXCELENCIA ACADÉMICA',
      icon: GraduationCap,
      description: 'Para estudiantes con rendimiento académico excepcional',
      iaaMinimo: '17.5',
      color: 'blue',
      extraInfo: null
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

  const colegiosAsociados = [
    'Colegio Emil Friedman',
    'Colegio Jefferson',
    'Fe y Alegría San José',
    'Colegio San Agustín',
    'Instituto Educacional Juan XXIII'
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
                      item.title === "Mi Beca Activa" ? "mi-beca" :
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

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {activeModule === "mi-beca" ? (
              <div className="space-y-6">
                {applicationStep === 'type-selection' && (
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-primary">¿Cómo estás aplicando al Programa de Excelencia?</h2>
                      <p className="text-muted-foreground">Selecciona tu tipo de aplicación para continuar</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                        onClick={() => {
                          setApplicationType('regular');
                          setApplicationStep('categories');
                        }}
                      >
                        <CardHeader className="text-center py-8">
                          <GraduationCap className="h-16 w-16 mx-auto text-primary mb-4" />
                          <CardTitle className="text-xl">Soy estudiante regular UNIMET</CardTitle>
                          <CardDescription>
                            Estudiante activo de la Universidad Metropolitana aplicando por primera vez o renovando
                          </CardDescription>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                        onClick={() => {
                          setApplicationType('colegio-asociado');
                          setApplicationStep('form');
                        }}
                      >
                        <CardHeader className="text-center py-8">
                          <FileText className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                          <CardTitle className="text-xl">Vengo de un Colegio Asociado</CardTitle>
                          <CardDescription>
                            Estudiante proveniente de uno de nuestros colegios asociados con convenio especial
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>
                )}

                {applicationStep === 'categories' && applicationType === 'regular' && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setApplicationStep('type-selection')}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                      </Button>
                      <h2 className="text-2xl font-bold text-primary">Categorías de Excelencia</h2>
                      <p className="text-muted-foreground">Selecciona la categoría que mejor se adapte a tu perfil</p>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                        <p className="text-orange-800 text-sm">
                          <strong>Nota:</strong> El porcentaje final de cobertura (15%, 25% o 50%) depende del estudio socioeconómico
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorias.map((categoria) => (
                        <Card 
                          key={categoria.id}
                          className={`cursor-pointer hover:shadow-lg transition-all border-2 hover:border-${categoria.color}-500/50 ${
                            selectedCategory === categoria.id ? `border-${categoria.color}-500 bg-${categoria.color}-50/30` : ''
                          }`}
                          onClick={() => {
                            setSelectedCategory(categoria.id);
                            setApplicationStep('form');
                          }}
                        >
                          <CardHeader className="text-center">
                            <categoria.icon className={`h-12 w-12 mx-auto text-${categoria.color}-600 mb-3`} />
                            <CardTitle className="text-lg">{categoria.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {categoria.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className={`bg-${categoria.color}-100 p-3 rounded-lg`}>
                              <p className={`text-${categoria.color}-800 font-medium text-sm`}>
                                IAA mínimo: {categoria.iaaMinimo}
                              </p>
                              {categoria.extraInfo && (
                                <p className={`text-${categoria.color}-700 text-xs mt-1`}>
                                  {categoria.extraInfo}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {applicationStep === 'form' && applicationType === 'colegio-asociado' && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="text-center space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setApplicationStep('type-selection')}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                      </Button>
                      <h2 className="text-2xl font-bold text-primary">Información de Colegio Asociado</h2>
                      <p className="text-muted-foreground">Complete la información adicional requerida</p>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Datos del Colegio Asociado</CardTitle>
                        <CardDescription>
                          Los casos de colegios asociados requieren evaluación especial
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="colegio">Colegio de Procedencia</Label>
                          <Select value={colegioData.colegio} onValueChange={(value) => setColegioData({...colegioData, colegio: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu colegio" />
                            </SelectTrigger>
                            <SelectContent>
                              {colegiosAsociados.map((colegio) => (
                                <SelectItem key={colegio} value={colegio}>{colegio}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <Label>¿Fuiste becado en tu colegio?</Label>
                          <RadioGroup 
                            value={colegioData.fueBecado} 
                            onValueChange={(value) => setColegioData({...colegioData, fueBecado: value})}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="si" id="becado-si" />
                              <Label htmlFor="becado-si">Sí</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="becado-no" />
                              <Label htmlFor="becado-no">No</Label>
                            </div>
                          </RadioGroup>
                          
                          {colegioData.fueBecado === 'si' && (
                            <div className="space-y-2">
                              <Label htmlFor="razon-beca">Explica la razón de tu beca en el colegio</Label>
                              <Textarea
                                id="razon-beca"
                                placeholder="Describe el motivo por el cual recibiste la beca..."
                                value={colegioData.razonBeca}
                                onChange={(e) => setColegioData({...colegioData, razonBeca: e.target.value})}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <Label>¿Eres hijo de trabajador del colegio?</Label>
                          <RadioGroup 
                            value={colegioData.hijoTrabajador} 
                            onValueChange={(value) => setColegioData({...colegioData, hijoTrabajador: value})}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="si" id="trabajador-si" />
                              <Label htmlFor="trabajador-si">Sí</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="trabajador-no" />
                              <Label htmlFor="trabajador-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => setApplicationStep('categories')}
                          disabled={!colegioData.colegio || !colegioData.fueBecado || !colegioData.hijoTrabajador}
                        >
                          Continuar a Categorías
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {applicationStep === 'form' && selectedCategory && (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="text-center space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setApplicationStep('categories')}
                        className="mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a Categorías
                      </Button>
                      <h2 className="text-2xl font-bold text-primary">
                        Formulario de {categorias.find(c => c.id === selectedCategory)?.title}
                      </h2>
                      <p className="text-muted-foreground">Complete todos los campos requeridos</p>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Formulario en Desarrollo</CardTitle>
                        <CardDescription>
                          Formulario específico para la categoría seleccionada: {categorias.find(c => c.id === selectedCategory)?.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            El formulario específico para esta categoría está en desarrollo
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Incluirá validaciones de IAA, uploads de documentos y campos específicos
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
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