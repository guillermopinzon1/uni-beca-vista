import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Shield, 
  Dumbbell,
  Shirt,
  Bus,
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  Download,
  HelpCircle,
  Globe,
  Users,
  Star
} from "lucide-react";

const BeneficiosRecursos = ({ scholarshipType }: { scholarshipType?: string }) => {
  
  const getBenefitsData = () => {
    const commonBenefits = [
      {
        titulo: "Cobertura Económica",
        descripcion: scholarshipType === 'academica' ? "15%, 25% o 50% según estudio socioeconómico" : "15%, 25% o 50% según estudio socioeconómico",
        icono: <DollarSign className="h-6 w-6" />,
        valor: "Variable",
        activo: true
      },
      {
        titulo: "Acompañamiento Integral",
        descripcion: "Seguimiento trimestral obligatorio",
        icono: <Users className="h-6 w-6" />,
        valor: "Incluido",
        activo: true
      },
      {
        titulo: "Prioridad Académica",
        descripcion: "Prioridad en inscripción de materias",
        icono: <BookOpen className="h-6 w-6" />,
        valor: "Prioridad",
        activo: true
      }
    ];

    const specificBenefits = {
      academica: [
        {
          titulo: "Reconocimiento Lista del Rector",
          descripcion: "Posibilidad de obtener reconocimientos académicos",
          icono: <Star className="h-6 w-6" />,
          valor: "Elegible",
          activo: true
        },
        {
          titulo: "Acceso a Investigación",
          descripcion: "Participación en proyectos de investigación",
          icono: <GraduationCap className="h-6 w-6" />,
          valor: "Disponible",
          activo: true
        }
      ],
      deportiva: [
        {
          titulo: "Seguro Deportivo",
          descripcion: "Seguro deportivo incluido",
          icono: <Shield className="h-6 w-6" />,
          valor: "Incluido",
          activo: true
        },
        {
          titulo: "Instalaciones Deportivas",
          descripcion: "Acceso completo a instalaciones deportivas",
          icono: <Dumbbell className="h-6 w-6" />,
          valor: "Acceso total",
          activo: true
        },
        {
          titulo: "Uniforme de Competencia",
          descripcion: "Uniforme oficial de competencia",
          icono: <Shirt className="h-6 w-6" />,
          valor: "Incluido",
          activo: true
        },
        {
          titulo: "Transporte",
          descripcion: "Transporte a competencias nacionales",
          icono: <Bus className="h-6 w-6" />,
          valor: "Nacional",
          activo: true
        }
      ],
      artistica: [
        {
          titulo: "Acceso a Espacios Culturales",
          descripcion: "Uso de auditorios y salas de ensayo",
          icono: <Globe className="h-6 w-6" />,
          valor: "Completo",
          activo: true
        },
        {
          titulo: "Participación en Eventos",
          descripcion: "Presentaciones en eventos institucionales",
          icono: <Calendar className="h-6 w-6" />,
          valor: "Garantizada",
          activo: true
        }
      ],
      civico: [
        {
          titulo: "Red de Contactos Sociales",
          descripcion: "Conexión con organizaciones comunitarias",
          icono: <Users className="h-6 w-6" />,
          valor: "Activa",
          activo: true
        },
        {
          titulo: "Certificaciones de Impacto",
          descripcion: "Documentación oficial de trabajo comunitario",
          icono: <GraduationCap className="h-6 w-6" />,
          valor: "Incluidas",
          activo: true
        }
      ],
      emprendimiento: [
        {
          titulo: "Incubadora de Emprendimientos",
          descripcion: "Acceso a la incubadora de startups UNIMET",
          icono: <Star className="h-6 w-6" />,
          valor: "Garantizado",
          activo: true
        },
        {
          titulo: "Mentoría Empresarial",
          descripcion: "Acompañamiento de emprendedores exitosos",
          icono: <Users className="h-6 w-6" />,
          valor: "Personalizada",
          activo: true
        }
      ]
    };

    return [...commonBenefits, ...(specificBenefits[scholarshipType as keyof typeof specificBenefits] || specificBenefits.deportiva)];
  };

  const beneficiosActivos = getBenefitsData();

  const contactosApoyo = [
    {
      cargo: "Directora DDBE",
      nombre: "Dra. María Rodríguez",
      telefono: "+58 212-555-0101",
      email: "mrodriguez@unimet.edu.ve",
      horario: "Lun-Vie 8:00-16:00"
    },
    {
      cargo: "Coordinador Deportivo",
      nombre: "Prof. Carlos López",
      telefono: "+58 212-555-0102", 
      email: "clopez@unimet.edu.ve",
      horario: "Lun-Vie 14:00-20:00"
    }
  ];

  const oportunidadesAdicionales = [
    {
      titulo: "Intercambio Deportivo Internacional",
      descripcion: "Programa de intercambio con universidades internacionales",
      fechaLimite: "2025-03-15",
      tipo: "Intercambio"
    },
    {
      titulo: "Programa de Mentores",
      descripcion: "Programa de mentores para nuevos atletas",
      fechaLimite: "Abierto",
      tipo: "Mentoría"
    },
    {
      titulo: "Becas Complementarias",
      descripcion: "Becas adicionales por excelencia deportiva",
      fechaLimite: "2025-02-28",
      tipo: "Beca"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Beneficios y Recursos</h2>
        <p className="text-muted-foreground">
          Todos los beneficios activos y recursos de apoyo disponibles para tu beca de excelencia {scholarshipType === 'academica' ? 'académica' : scholarshipType === 'artistica' ? 'artística' : scholarshipType === 'civico' ? 'cívica' : scholarshipType === 'emprendimiento' ? 'de emprendimiento' : 'deportiva'}
        </p>
      </div>

      {/* Beneficios Activos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Mis Beneficios Activos</span>
          </CardTitle>
          <CardDescription>
            Beneficios que tienes disponibles como becario de excelencia {scholarshipType === 'academica' ? 'académica' : scholarshipType === 'artistica' ? 'artística' : scholarshipType === 'civico' ? 'cívica' : scholarshipType === 'emprendimiento' ? 'de emprendimiento' : 'deportiva'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beneficiosActivos.map((beneficio, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-card">
                <div className="text-primary">
                  {beneficio.icono}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{beneficio.titulo}</h3>
                  <p className="text-xs text-muted-foreground">{beneficio.descripcion}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {beneficio.valor}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recursos de Apoyo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Recursos de Apoyo</span>
          </CardTitle>
          <CardDescription>
            Contactos y recursos para resolver dudas y obtener apoyo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactosApoyo.map((contacto, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{contacto.cargo}</h3>
                  <p className="text-sm text-muted-foreground">{contacto.nombre}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{contacto.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{contacto.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{contacto.horario}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Agendar cita de asesoría
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <Download className="h-5 w-5" />
              <span className="text-sm">Descargar reglamento actualizado</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm">FAQs Excelencia {scholarshipType === 'academica' ? 'Académica' : scholarshipType === 'artistica' ? 'Artística' : scholarshipType === 'civico' ? 'Cívica' : scholarshipType === 'emprendimiento' ? 'Emprendimiento' : 'Deportiva'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default BeneficiosRecursos;