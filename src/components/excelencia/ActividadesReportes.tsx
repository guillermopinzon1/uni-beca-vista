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
  
  const getActivitiesData = () => {
    switch (scholarshipType) {
      case 'academica':
        return {
          title: "Logros Académicos",
          description: "Registro de tus logros académicos y participaciones en investigación",
          activities: [
            {
              tipo: "logro",
              titulo: "Lista del Rector - IAA 17.2",
              fecha: "2025-10-15",
              resultado: "🏆 Reconocimiento académico",
              descripcion: "IAA sobresaliente período 2525-3"
            },
            {
              tipo: "investigacion", 
              titulo: "Proyecto de Investigación - Sostenibilidad",
              fecha: "2025-09-20",
              resultado: "📊 En desarrollo",
              descripcion: "Investigación sobre energías renovables"
            },
            {
              tipo: "competencia",
              titulo: "Olimpiada de Matemáticas UNIMET",
              fecha: "2025-08-01",
              resultado: "🥈 Segundo lugar",
              descripcion: "Competencia académica interuniversitaria"
            }
          ],
          buttons: ["Registrar logro académico", "Agregar proyecto de investigación"],
          reports: ["Reporte Académico", "Certificado de Honor", "Carta de Rendimiento Académico"]
        };
      
      case 'artistica':
        return {
          title: "Actividades Artísticas",
          description: "Registro de tus presentaciones y logros culturales",
          activities: [
            {
              tipo: "presentacion",
              titulo: "Concierto Sinfónico UNIMET",
              fecha: "2025-10-15",
              resultado: "🎼 Presentación principal",
              descripcion: "Violín principal en concierto de gala"
            },
            {
              tipo: "competencia", 
              titulo: "Festival de Música Universitaria",
              fecha: "2025-09-20",
              resultado: "🥇 Primer lugar",
              descripcion: "Categoría música clásica"
            },
            {
              tipo: "taller",
              titulo: "Taller Comunitario de Música",
              fecha: "2025-08-01",
              resultado: "👥 25 beneficiarios",
              descripcion: "Enseñanza musical a niños de la comunidad"
            }
          ],
          buttons: ["Registrar presentación", "Agregar actividad cultural"],
          reports: ["Reporte Cultural", "Certificado Artístico", "Carta de Participación Cultural"]
        };
      
      case 'civico':
        return {
          title: "Proyectos de Impacto Social",
          description: "Registro de tus actividades comunitarias y proyectos sociales",
          activities: [
            {
              tipo: "proyecto",
              titulo: "Programa de Alfabetización Digital",
              fecha: "2025-10-15",
              resultado: "📚 150 beneficiarios",
              descripcion: "Enseñanza de tecnología a adultos mayores"
            },
            {
              tipo: "voluntariado", 
              titulo: "Jornada de Salud Comunitaria",
              fecha: "2025-09-20",
              resultado: "⚕️ 200 consultas",
              descripcion: "Apoyo en jornada médica gratuita"
            },
            {
              tipo: "liderazgo",
              titulo: "Coordinador de Grupo Juvenil",
              fecha: "2025-08-01",
              resultado: "👥 Liderazgo activo",
              descripcion: "Coordinación de 30 jóvenes voluntarios"
            }
          ],
          buttons: ["Registrar proyecto social", "Agregar actividad comunitaria"],
          reports: ["Reporte de Impacto", "Certificado de Servicio", "Carta de Compromiso Social"]
        };
      
      case 'emprendimiento':
        return {
          title: "Actividades de Emprendimiento",
          description: "Registro de tu startup y actividades emprendedoras",
          activities: [
            {
              tipo: "startup",
              titulo: "EcoTech Solutions - App Sostenibilidad",
              fecha: "2025-10-15",
              resultado: "🚀 En incubadora",
              descripcion: "Aplicación para reducción de huella de carbono"
            },
            {
              tipo: "competencia", 
              titulo: "Pitch Competition UNIMET",
              fecha: "2025-09-20",
              resultado: "🥇 Primer lugar",
              descripcion: "Mejor propuesta de negocio sustentable"
            },
            {
              tipo: "desarrollo",
              titulo: "Prototipo MVP completado",
              fecha: "2025-08-01",
              resultado: "💡 Beta testing",
              descripcion: "Primera versión funcional del producto"
            }
          ],
          buttons: ["Registrar hito del startup", "Agregar actividad emprendedora"],
          reports: ["Reporte de Emprendimiento", "Certificado de Innovación", "Carta de Incubadora"]
        };
      
      default: // deportiva
        return {
          title: "Competencias y Logros",
          description: "Registro de tus participaciones y reconocimientos deportivos",
          activities: [
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
          ],
          buttons: ["Registrar competencia", "Agregar logro"],
          reports: ["Reporte Deportivo", "Carta de Buena Conducta", "Certificado Atlético"]
        };
    }
  };

  const activityData = getActivitiesData();

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'logro': return '🏆';
      case 'investigacion': return '🔬';
      case 'competencia': return scholarshipType === 'academica' ? '🧠' : scholarshipType === 'artistica' ? '🎭' : scholarshipType === 'emprendimiento' ? '💡' : '🏊‍♂️';
      case 'presentacion': return '🎼';
      case 'taller': return '🎨';
      case 'proyecto': return '🌍';
      case 'voluntariado': return '❤️';
      case 'liderazgo': return '👥';
      case 'startup': return '🚀';
      case 'desarrollo': return '💻';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Actividades y Reportes</h2>
        <p className="text-muted-foreground">
          {activityData.description}
        </p>
      </div>

      {/* Competencias y Logros */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>{activityData.title}</span>
              </CardTitle>
              <CardDescription>
                {activityData.description}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {activityData.buttons[0]}
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                {activityData.buttons[1]}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.activities.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getActivityIcon(item.tipo)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.fecha).toLocaleDateString('es-ES')}
                    </p>
                    {item.tiempo && (
                      <p className="text-sm text-primary font-medium">Tiempo: {item.tiempo}</p>
                    )}
                    {item.descripcion && (
                      <p className="text-sm text-muted-foreground">{item.descripcion}</p>
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
            Descarga certificados y reportes de tu actividad académica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activityData.reports.map((report, index) => (
              <Button key={index} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Download className="h-5 w-5" />
                <span className="text-sm">{report}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActividadesReportes;