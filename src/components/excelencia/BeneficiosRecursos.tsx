import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Gift,
  Award,
  Info,
  CheckCircle,
  XCircle,
  DollarSign,
  BookOpen,
  Users,
  AlertTriangle
} from "lucide-react";

const BeneficiosRecursos = ({ scholarshipType }: { scholarshipType?: string }) => {

  const getCoberturaInfo = () => {
    // Todas las becas de excelencia tienen la misma cobertura base
    const coberturaBase = {
      porcentaje: scholarshipType === 'academica' ? '100%' : '25%',
      descripcion: scholarshipType === 'academica'
        ? 'Cobertura total del costo de matrícula'
        : 'Cobertura parcial del costo de matrícula'
    };

    return coberturaBase;
  };

  const cobertura = getCoberturaInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Gift className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold text-foreground">Beneficios y Cobertura</h2>
            <p className="text-sm text-muted-foreground">
              Naturaleza del beneficio y recursos disponibles (Art. 9, Art. 3)
            </p>
          </div>
        </div>
      </div>

      {/* Cobertura Principal */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-green-900">
            <Award className="h-6 w-6" />
            Cobertura de la Beca
          </CardTitle>
          <CardDescription>
            Porcentaje de exoneración otorgado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg border border-green-200">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-green-600 mb-2">{cobertura.porcentaje}</div>
              <p className="text-sm text-green-800">{cobertura.descripcion}</p>
            </div>
            <Alert className="bg-green-50 border-green-300">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 text-sm">
                La beca de excelencia cubre el <strong>{cobertura.porcentaje}</strong> del costo de las asignaturas inscritas
                según tu plan de estudios vigente de pregrado.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Qué incluye el beneficio */}
      <Card className="border-orange/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            El beneficio INCLUYE
          </CardTitle>
          <CardDescription>
            Conceptos cubiertos por la beca de excelencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Asignaturas del plan de estudios</p>
                <p className="text-xs text-green-800">
                  {cobertura.porcentaje} del costo de las asignaturas inscritas según tu plan de estudios vigente
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Cuota de inscripción trimestral</p>
                <p className="text-xs text-green-800">
                  Incluida en el beneficio de exoneración
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Arancel de Defensa de Trabajo de Grado</p>
                <p className="text-xs text-green-800">
                  Cubierto al momento de la defensa
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Qué NO incluye el beneficio */}
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-red-900">
            <XCircle className="h-5 w-5 text-red-600" />
            El beneficio NO INCLUYE
          </CardTitle>
          <CardDescription>
            Conceptos que debes pagar adicionalmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Asignaturas retiradas o reprobadas</p>
                <p className="text-xs text-red-800">
                  Debes pagar el costo completo de asignaturas inscritas y no aprobadas o retiradas (Art. 3-e, Art. 16-b)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Asignaturas fuera del plan de estudios</p>
                <p className="text-xs text-red-800">
                  Solo se cubren asignaturas que forman parte de tu plan de estudios vigente
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Asignaturas en período intensivo sin permiso</p>
                <p className="text-xs text-red-800">
                  Debes notificar a DDBE si deseas cursar período intensivo (Art. 14-e)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Cursos de nivelación o preparatorios</p>
                <p className="text-xs text-red-800">
                  No están cubiertos por el beneficio
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Materiales, libros y recursos académicos</p>
                <p className="text-xs text-red-800">
                  Son responsabilidad del estudiante
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Transporte, alimentación y alojamiento</p>
                <p className="text-xs text-red-800">
                  Gastos personales no cubiertos por la beca
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recursos Disponibles */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900">
            <Users className="h-5 w-5" />
            Recursos y Apoyo Disponibles
          </CardTitle>
          <CardDescription>
            Servicios de acompañamiento para becarios de excelencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Acompañamiento Integral DDBE</h4>
                  <p className="text-xs text-blue-800">
                    Seguimiento trimestral obligatorio con revisión anual. Orientación académica, personal y profesional
                    para asegurar tu éxito universitario (Art. 14-h, Art. 3-b).
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Asesoría Académica</h4>
                  <p className="text-xs text-blue-800">
                    Apoyo en la planificación de tu carga académica, consultas sobre retiro de asignaturas (Art. 14-d)
                    y orientación para cambio de carrera si aplica (Art. 14-g).
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start gap-3 mb-2">
                <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Programas de Reconocimiento</h4>
                  <p className="text-xs text-blue-800">
                    Acceso a programas de distinciones académicas como la Lista del Rector (para Excelencia Académica)
                    y reconocimientos institucionales por logros destacados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advertencias Importantes */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-900 text-sm">
          <strong>Importante:</strong> El incumplimiento de las condiciones de mantenimiento puede resultar en la
          <strong> suspensión o revocación del beneficio</strong> sin perjuicio de otras acciones que la Universidad
          considere pertinentes (Art. 50). Los costos de asignaturas retiradas o reprobadas <strong>no están cubiertos</strong> por
          el beneficio y deberán ser pagados por el estudiante (Art. 3-e, Art. 16).
        </AlertDescription>
      </Alert>

      {/* Información de Contacto */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
            <Info className="h-5 w-5" />
            ¿Tienes dudas sobre tu beneficio?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-900 mb-3">
            Para consultas sobre tu cobertura, condiciones de mantenimiento, retiro de asignaturas, período intensivo
            o cualquier aspecto de tu beca, contacta a:
          </p>
          <div className="p-3 bg-white rounded-lg border border-purple-200">
            <p className="font-semibold text-purple-900 text-sm">
              Dirección de Desarrollo y Bienestar Estudiantil (DDBE)
            </p>
            <p className="text-xs text-purple-800 mt-1">
              Área responsable del seguimiento y administración de becas de excelencia
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeneficiosRecursos;
