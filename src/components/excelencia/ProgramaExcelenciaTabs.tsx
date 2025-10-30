import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UnifiedApplicationForm from "@/components/shared/UnifiedApplicationForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  fetchConfiguracionesBecas,
  TipoBeca,
  SubtipoExcelencia,
  ConfiguracionBeca
} from "@/lib/api/configuracion";
import {
  Trophy,
  Dumbbell,
  Palette,
  Lightbulb,
  Heart,
  Loader2
} from "lucide-react";

interface ProgramaExcelenciaTabsProps {
  configuraciones?: ConfiguracionBeca[];
}

const ProgramaExcelenciaTabs = ({ configuraciones: configuracionesProp = [] }: ProgramaExcelenciaTabsProps) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [configuraciones, setConfiguraciones] = useState<ConfiguracionBeca[]>(configuracionesProp);
  const { tokens } = useAuth();
  const { toast } = useToast();

  // Actualizar configuraciones cuando cambie la prop
  useEffect(() => {
    setConfiguraciones(configuracionesProp);
  }, [configuracionesProp]);

  const handleBackToTabs = () => {
    setSelectedTab(null);
  };

  // Mapeo de iconos por subtipo
  const iconMap: Record<string, any> = {
    [SubtipoExcelencia.ACADEMICA]: Trophy,
    [SubtipoExcelencia.DEPORTIVA]: Dumbbell,
    [SubtipoExcelencia.ARTISTICA]: Palette,
    [SubtipoExcelencia.EMPRENDIMIENTO]: Lightbulb,
    [SubtipoExcelencia.CIVICO]: Heart,
  };

  // Mapeo de IDs de tabs (lowercase sin acentos) a SubtipoExcelencia
  const tabIdToSubtipo: Record<string, SubtipoExcelencia> = {
    'academica': SubtipoExcelencia.ACADEMICA,
    'deportiva': SubtipoExcelencia.DEPORTIVA,
    'artistica': SubtipoExcelencia.ARTISTICA,
    'emprendimiento': SubtipoExcelencia.EMPRENDIMIENTO,
    'compromiso-civico': SubtipoExcelencia.CIVICO,
  };

  // Convertir configuraciones del backend a formato de programas
  const excellencePrograms = Object.entries(tabIdToSubtipo).map(([id, subtipo]) => {
    // Buscar configuración que coincida con el subtipo (puede venir como string del API)
    const config = configuraciones.find(c => {
      const configSubtipo = c.subtipoExcelencia;
      return configSubtipo === subtipo || String(configSubtipo) === String(subtipo);
    });

    // Descripción por defecto si no hay configuración
    const defaultDescriptions: Record<SubtipoExcelencia, string> = {
      [SubtipoExcelencia.ACADEMICA]: "Para estudiantes con alto rendimiento académico y promedio sobresaliente.",
      [SubtipoExcelencia.DEPORTIVA]: "Para estudiantes destacados en disciplinas deportivas y competencias.",
      [SubtipoExcelencia.ARTISTICA]: "Para estudiantes con talento excepcional en artes y expresión cultural.",
      [SubtipoExcelencia.EMPRENDIMIENTO]: "Para estudiantes con iniciativas empresariales y proyectos innovadores.",
      [SubtipoExcelencia.CIVICO]: "Para estudiantes comprometidos con el servicio comunitario y voluntariado.",
    };

    return {
      id,
      title: `Excelencia ${subtipo === SubtipoExcelencia.CIVICO ? 'Cívico' : subtipo}`,
      description: defaultDescriptions[subtipo],
      icon: iconMap[subtipo],
      details: config?.requisitosEspeciales || `Programa de ${subtipo}`,
      requirements: config?.documentosRequeridos || [],
      config: config, // Incluir toda la configuración para acceso a otros datos
    };
  });

  if (selectedTab) {
    const program = excellencePrograms.find(p => p.id === selectedTab);
    const config = program?.config;
    
    return (
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">{program?.title}</h2>
            <p className="text-muted-foreground">Programa de {program?.title.replace('Excelencia ', '')}</p>
          </div>
          <Button variant="outline" onClick={handleBackToTabs}>
            Volver a Programas
          </Button>
        </div>
        
        {/* Mostrar requisitos arriba del formulario */}
        {config && (
          <Card className="mb-6 border-0 shadow-lg w-full">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Promedio Mínimo</p>
                    <p className="text-2xl font-bold text-primary">{config.promedioMinimo ?? '-'}</p>
                  </div>
                </div>
                
                {config.requisitosEspeciales && (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Requisitos Especiales</h3>
                    <p className="text-sm text-muted-foreground">{config.requisitosEspeciales}</p>
                  </div>
                )}
                
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Documentos Requeridos</h3>
                  {Array.isArray(config.documentosRequeridos) && config.documentosRequeridos.length > 0 ? (
                    <ul className="space-y-2">
                      {config.documentosRequeridos.map((doc: string, i: number) => (
                        <li key={i} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tiene ningún requisito</p>
                  )}
                </div>
                
                {(config.semestreMinimo || config.semestreMaximo || config.edadMaxima) && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Requisitos Académicos</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {config.semestreMinimo && config.semestreMaximo && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Semestre: {config.semestreMinimo} - {config.semestreMaximo}</span>
                        </div>
                      )}
                      {config.edadMaxima && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Edad máxima: {config.edadMaxima} años</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {!config && (
          <Card className="mb-6 border-0 shadow-lg w-full">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">Este programa no tiene requisitos configurados</p>
            </CardContent>
          </Card>
        )}
        
        <UnifiedApplicationForm 
          programTitle={`Programa de Excelencia - ${program?.title}`}
          requiredDocuments={(config?.documentosRequeridos as string[]) || []}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Programa de Excelencia</h2>
        <p className="text-muted-foreground">
          Selecciona el tipo de programa de excelencia al que deseas postularte
        </p>
      </div>

      <Tabs defaultValue="academica" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="academica">Académica</TabsTrigger>
          <TabsTrigger value="deportiva">Deportiva</TabsTrigger>
          <TabsTrigger value="artistica">Artística</TabsTrigger>
          <TabsTrigger value="emprendimiento">Emprendimiento</TabsTrigger>
          <TabsTrigger value="compromiso-civico">Cívico</TabsTrigger>
        </TabsList>

        {excellencePrograms.map((program) => (
          <TabsContent key={program.id} value={program.id} className="w-full">
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 rounded-full bg-primary/10 w-fit mb-4">
                  <program.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">{program.title}</CardTitle>
                <CardDescription className="text-lg">{program.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-6">{program.details}</p>
                </div>

                {/* Información de la beca (sin monto) */}
                {program.config ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Cupos</p>
                      <p className="text-xl font-semibold text-primary">{program.config.cuposDisponibles}</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Promedio mínimo</p>
                      <p className="text-xl font-semibold text-primary">{program.config.promedioMinimo}</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Duración</p>
                      <p className="text-xl font-semibold text-primary">{program.config.duracionMeses} meses</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Card className="border-dashed">
                      <CardContent className="p-4 text-sm text-muted-foreground text-center">
                        No tiene requisitos configurados
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Requisitos especiales */}
                {program.config && program.config.requisitosEspeciales && (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mb-4">
                    <h4 className="font-semibold mb-2">Requisitos Especiales</h4>
                    <p className="text-sm text-muted-foreground">{program.config.requisitosEspeciales}</p>
                  </div>
                )}

                {/* Requisitos académicos */}
                {program.config && (
                  <div className="bg-muted/50 border border-gray-200 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-3">Requisitos Académicos</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>Semestre: {program.config.semestreMinimo} - {program.config.semestreMaximo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>Edad máxima: {program.config.edadMaxima} años</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>Promedio mínimo: {program.config.promedioMinimo}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requisitos requeridos - Solo mostrar si hay configuración */}
                {program.config && (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Documentos Requeridos</h4>
                    </div>
                    {program.requirements.length > 0 ? (
                      <ul className="space-y-2">
                        {program.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tiene ningún requisito</p>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <Button 
                    onClick={() => setSelectedTab(program.id)}
                    className="w-full max-w-md"
                  >
                    Postular a {program.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProgramaExcelenciaTabs;