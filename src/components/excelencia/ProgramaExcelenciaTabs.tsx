import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UnifiedApplicationForm from "@/components/shared/UnifiedApplicationForm";
import { 
  Trophy, 
  Dumbbell, 
  Palette, 
  Lightbulb, 
  Heart 
} from "lucide-react";

const ProgramaExcelenciaTabs = () => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleBackToTabs = () => {
    setSelectedTab(null);
  };

  const excellencePrograms = [
    {
      id: "academica",
      title: "Excelencia Académica",
      description: "Para estudiantes con alto rendimiento académico y promedio sobresaliente.",
      icon: Trophy,
      details: "Dirigido a estudiantes que mantengan un promedio mínimo de 85 puntos y demuestren consistencia académica.",
      requirements: ["Promedio mínimo 85 puntos", "Record académico sin reprobaciones", "Carta de recomendación académica"]
    },
    {
      id: "deportiva",
      title: "Excelencia Deportiva",
      description: "Para estudiantes destacados en disciplinas deportivas y competencias.",
      icon: Dumbbell,
      details: "Reconoce a estudiantes que representen a la universidad en competencias deportivas.",
      requirements: ["Participación en equipos universitarios", "Logros deportivos comprobables", "Certificado médico de aptitud"]
    },
    {
      id: "artistica",
      title: "Excelencia Artística",
      description: "Para estudiantes con talento excepcional en artes y expresión cultural.",
      icon: Palette,
      details: "Apoya a estudiantes con habilidades destacadas en música, teatro, danza, artes visuales.",
      requirements: ["Portafolio artístico", "Participación en eventos culturales", "Carta de recomendación de instructor"]
    },
    {
      id: "emprendimiento",
      title: "Excelencia en Emprendimiento",
      description: "Para estudiantes con iniciativas empresariales y proyectos innovadores.",
      icon: Lightbulb,
      details: "Fomenta el espíritu emprendedor y apoya proyectos de negocio estudiantiles.",
      requirements: ["Plan de negocio", "Proyecto emprendedor viable", "Carta de intención comercial"]
    },
    {
      id: "compromiso-civico",
      title: "Compromiso Cívico",
      description: "Para estudiantes comprometidos con el servicio comunitario y voluntariado.",
      icon: Heart,
      details: "Reconoce el compromiso social y las actividades de servicio a la comunidad.",
      requirements: ["Horas de servicio comunitario", "Proyectos sociales ejecutados", "Carta de organizaciones beneficiadas"]
    }
  ];

  if (selectedTab) {
    const program = excellencePrograms.find(p => p.id === selectedTab);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">{program?.title}</h2>
            <p className="text-muted-foreground">{program?.details}</p>
          </div>
          <Button variant="outline" onClick={handleBackToTabs}>
            Volver a Programas
          </Button>
        </div>
        
        <UnifiedApplicationForm 
          programTitle={`Programa de Excelencia - ${program?.title}`} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <TabsContent key={program.id} value={program.id}>
            <Card>
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

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Requisitos principales:</h4>
                  <ul className="space-y-2">
                    {program.requirements.map((req, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

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