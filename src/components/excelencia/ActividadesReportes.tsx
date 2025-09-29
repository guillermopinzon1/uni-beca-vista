import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Clock,
  Download,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

const ActividadesReportes = ({ scholarshipType }: { scholarshipType?: string }) => {
  const competenciasLogros = [
    {
      tipo: "competencia",
      titulo: "Oro en 100m libres - Interclubes",
      fecha: "2025-10-15",
      resultado: "🥇 Primer lugar",
      tiempo: "52.34s"
    },
    {
      tipo: "competencia", 
      titulo: "Plata en relevos 4x100",
      fecha: "2025-09-20",
      resultado: "🥈 Segundo lugar",
      tiempo: "3:24.12"
    },
    {
      tipo: "logro",
      titulo: "Capitán del equipo",
      fecha: "2025-08-01",
      resultado: "📋 Liderazgo",
      descripcion: "Designado capitán por rendimiento y liderazgo"
    }
  ];

  const datosEntrenamiento = {
    asistenciaEsteMes: 18,
    totalSesiones: 20,
    horasAcumuladas: 45,
    porcentajeAsistencia: 90
  };

  const representacionInstitucional = [
    { evento: "Juegos Interclubes UNIMET", fecha: "Oct 2025", participantes: "15 atletas" },
    { evento: "Copa Nacional Universitaria", fecha: "Sep 2025", participantes: "8 atletas" },
    { evento: "Torneo Metropolitano", fecha: "Ago 2025", participantes: "12 atletas" },
    { evento: "Clínica Deportiva Comunitaria", fecha: "Jul 2025", participantes: "25 niños" }
  ];

  const estadisticasImpacto = {
    eventosRepresentados: 4,
    clinicasDictadas: 2,
    ninosBeneficiados: 50
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Actividades y Reportes</h2>
        <p className="text-muted-foreground">
          Registro de tus competencias, entrenamientos y actividades deportivas
        </p>
      </div>

      {/* Competencias y Logros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Competencias y Logros</span>
              </CardTitle>
              <CardDescription>
                Registro de tus participaciones y reconocimientos deportivos
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Registrar competencia
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar logro
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competenciasLogros.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {item.tipo === "competencia" ? "🏊‍♂️" : "📋"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.fecha).toLocaleDateString('es-ES')}
                    </p>
                    {item.tiempo && (
                      <p className="text-sm text-primary font-medium">Tiempo: {item.tiempo}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-primary">
                  {item.resultado}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Generación de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Generación de Reportes</CardTitle>
          <CardDescription>
            Descarga certificados y reportes de tu actividad deportiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-5 w-5" />
              <span className="text-sm">Reporte Semestral</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">Carta de Buena Conducta</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">Certificado Becario Activo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActividadesReportes;