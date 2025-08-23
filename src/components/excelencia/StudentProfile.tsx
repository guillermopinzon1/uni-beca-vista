import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  GraduationCap, 
  Award, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const StudentProfile = () => {
  const studentData = {
    nombre: "María José González",
    cedula: "V-12345678",
    email: "mgonzalez@unimet.edu.ve",
    telefono: "+58 412 1234567",
    carrera: "Ingeniería de Sistemas",
    nivel: "Pregrado",
    semestre: "7mo Semestre",
    iaa: 18.75,
    creditos: 156,
    creditosTotales: 180
  };

  const activeBecas = [
    {
      categoria: "Académica",
      porcentaje: "25%",
      fechaInicio: "2024-01-15",
      fechaVencimiento: "2024-12-15",
      estado: "Activa"
    },
    {
      categoria: "Deportiva",
      porcentaje: "15%",
      fechaInicio: "2024-02-01",
      fechaVencimiento: "2024-12-01",
      estado: "Activa"
    }
  ];

  const historialBecas = [
    {
      periodo: "2023-II",
      categoria: "Académica",
      porcentaje: "25%",
      estado: "Completada"
    },
    {
      periodo: "2023-I",
      categoria: "Académica",
      porcentaje: "15%",
      estado: "Completada"
    },
    {
      periodo: "2022-II",
      categoria: "Académica",
      porcentaje: "15%",
      estado: "Completada"
    }
  ];

  const documentos = [
    {
      nombre: "Histórico de Notas",
      fecha: "2024-03-01",
      tipo: "PDF"
    },
    {
      nombre: "Carta Compromiso - Académica",
      fecha: "2024-01-15",
      tipo: "PDF"
    },
    {
      nombre: "Carta Compromiso - Deportiva",
      fecha: "2024-02-01",
      tipo: "PDF"
    },
    {
      nombre: "Certificado Deportivo",
      fecha: "2024-01-20",
      tipo: "PDF"
    }
  ];

  const progressPercentage = (studentData.creditos / studentData.creditosTotales) * 100;

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil del Estudiante
          </CardTitle>
          <CardDescription>
            Información personal y académica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Datos Personales</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.cedula}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.telefono}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Datos Académicos</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.carrera}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{studentData.nivel} - {studentData.semestre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">IAA: {studentData.iaa}</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Excelente
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso de Carrera</span>
                      <span>{studentData.creditos}/{studentData.creditosTotales} créditos</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progressPercentage)}% completado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Becas Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Becas Activas
          </CardTitle>
          <CardDescription>
            Becas de excelencia actualmente vigentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeBecas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tienes becas activas en este momento
            </p>
          ) : (
            <div className="space-y-4">
              {activeBecas.map((beca, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Beca {beca.categoria}</h4>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {beca.estado}
                          </Badge>
                          <Badge variant="outline">
                            Cobertura: {beca.porcentaje}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Vigente desde {new Date(beca.fechaInicio).toLocaleDateString('es-ES')} 
                          hasta {new Date(beca.fechaVencimiento).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Carta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Becas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Becas
          </CardTitle>
          <CardDescription>
            Registro de becas obtenidas en períodos anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historialBecas.map((beca, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{beca.periodo}</div>
                  <div className="text-sm text-muted-foreground">Beca {beca.categoria}</div>
                  <Badge variant="outline">{beca.porcentaje}</Badge>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {beca.estado}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mis Documentos
          </CardTitle>
          <CardDescription>
            Documentos cargados y generados del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentos.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Subido el {new Date(doc.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{doc.tipo}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;