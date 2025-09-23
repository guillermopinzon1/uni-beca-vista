import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Video, MapPin, FileText, Star } from "lucide-react";

const Mentoria = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mentoría</h2>
        <p className="text-muted-foreground">Gestión y seguimiento de tu programa de mentoría</p>
      </div>

      {/* Mi Mentor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mi Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Dra. María López</h3>
              <p className="text-muted-foreground">Profesora Titular - Departamento de Ingeniería de Sistemas</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Oficina: Edificio A, Piso 3, Oficina 308</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Horario: Lun-Vie 2:00-4:00 PM</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm"><strong>Email:</strong> maria.lopez@unimet.edu.ve</p>
                  <p className="text-sm"><strong>Teléfono:</strong> +58 212-274-0123</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Especialidad:</strong> Desarrollo de Software, Inteligencia Artificial, Mentoring Académico
                </p>
                <p className="text-sm mt-2">
                  La Dra. López tiene más de 15 años de experiencia en el área y ha mentorado a más de 50 estudiantes 
                  del programa de becas Impacto, con una tasa de éxito del 95% en graduación a tiempo.
                </p>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button size="sm">
                  Enviar Email
                </Button>
                <Button variant="outline" size="sm">
                  Agendar Sesión
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario de Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calendario de Sesiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Próxima Sesión */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-blue-600">Próxima Sesión</Badge>
                <span className="text-sm text-muted-foreground">15 Nov 2025</span>
              </div>
              <h4 className="font-semibold">Planificación Académica Período 2025-1</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>2:00 - 3:00 PM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video className="h-4 w-4" />
                  <span>Presencial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>Traer expediente académico</span>
                </div>
              </div>
              <Button size="sm" className="mt-3">Confirmar Asistencia</Button>
            </div>

            {/* Sesiones Programadas */}
            <div className="space-y-3">
              <h4 className="font-medium">Sesiones Programadas</h4>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Seguimiento Rendimiento Académico</h5>
                    <p className="text-sm text-muted-foreground">29 Nov 2025 • 2:00 PM • Virtual</p>
                  </div>
                  <Button variant="outline" size="sm">Reagendar</Button>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Preparación para Renovación</h5>
                    <p className="text-sm text-muted-foreground">13 Dic 2025 • 3:00 PM • Presencial</p>
                  </div>
                  <Button variant="outline" size="sm">Reagendar</Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Solicitar Sesión Extraordinaria
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registro de Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registro de Sesiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Inducción al Programa</h4>
                  <p className="text-sm text-muted-foreground">1 Oct 2025 • 1 hora • Presencial</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Completada
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Temas tratados:</strong> Presentación, expectativas del programa, cronograma</p>
                <p><strong>Compromisos:</strong> Enviar plan de estudio actualizado</p>
                <p><strong>Estado:</strong> ✅ Cumplido</p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Autoevaluación: 5/5 - Muy útil</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Estrategias de Estudio</h4>
                  <p className="text-sm text-muted-foreground">18 Oct 2025 • 45 min • Virtual</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Completada
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Temas tratados:</strong> Técnicas de memoria, planificación de tiempo</p>
                <p><strong>Compromisos:</strong> Implementar calendario de estudio</p>
                <p><strong>Estado:</strong> ✅ Cumplido</p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Autoevaluación: 4/5 - Útil</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Revisión Notas Parciales</h4>
                  <p className="text-sm text-muted-foreground">5 Nov 2025 • 1 hora • Presencial</p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Completada
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Temas tratados:</strong> Análisis de rendimiento, áreas de mejora</p>
                <p><strong>Compromisos:</strong> Buscar tutoría en Cálculo II</p>
                <p><strong>Estado:</strong> ⏳ En progreso</p>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Autoevaluación: 5/5 - Muy útil</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Herramientas de Apoyo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Herramientas de Apoyo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Plan de Estudio Personalizado</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Cronograma optimizado para tu ritmo de aprendizaje
              </p>
              <Button size="sm" variant="outline">Ver Plan</Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Técnicas de Estudio</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Métodos recomendados por tu mentor
              </p>
              <Button size="sm" variant="outline">Descargar Guía</Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">Tutores por Materia</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contactos de tutores especializados
              </p>
              <Button size="sm" variant="outline">Ver Contactos</Button>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2">Grupos de Estudio</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Únete a grupos de tu carrera
              </p>
              <Button size="sm" variant="outline">Explorar Grupos</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mentoria;