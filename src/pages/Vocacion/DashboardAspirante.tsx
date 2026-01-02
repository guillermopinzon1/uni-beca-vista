import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";

const DashboardAspirante = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string>("informacion");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarItems = [
    {
      title: "Información del Programa",
      icon: Info,
      module: "informacion"
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      module: "reglamento"
    }
  ];

  const renderContent = () => {
    if (activeModule === "reglamento") {
      return (
        <div className="flex justify-center">
          <ReglamentoAccess becaType="impacto" />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Democratización e Inclusión Educativa
                </h2>
                <p className="text-lg text-muted-foreground mb-4">
                  El Programa Beca Impacto está orientado a fomentar la democratización e inclusión de bachilleres,
                  promoviendo la conformación de una población estudiantil diversa socialmente a través de alianzas
                  estratégicas con instituciones educativas, empresas u organizaciones.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Award className="h-5 w-5" />
                  <span>Cobertura: 100% de matrícula + cuota de inscripción</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Naturaleza del Beneficio */}
        <Card className="border-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Award className="h-6 w-6" />
              Naturaleza y Cobertura del Beneficio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                La Beca Impacto es la <strong>exoneración total del pago de la matrícula de pregrado</strong> para
                estudiantes que cumplan los requisitos establecidos.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  El beneficio INCLUYE:
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>100% del costo de asignaturas inscritas (plan de estudios)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Cuota de inscripción trimestral</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Arancel de Defensa de Trabajo de Grado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Acompañamiento integral obligatorio</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  El beneficiario PAGA:
                </h4>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Asignaturas retiradas o reprobadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Asignaturas adicionales fuera del plan de estudios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Aranceles de la Universidad (excepto Defensa de TG)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Asignaturas de carreras simultáneas (no comunes)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos de Postulación */}
        <Card className="border-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="h-6 w-6" />
              ¿Quién Puede Postular?
            </CardTitle>
            <CardDescription>
              Requisitos específicos para aspirar al Programa Beca Impacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Importante:</strong> La postulación se realiza a través de instituciones educativas,
                empresas u organizaciones con convenios o alianzas con la UNIMET.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Perfil del Aspirante:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ser bachiller o estar cursando último año de bachillerato</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Tener hasta <strong>21 años cumplidos</strong> o por cumplir al cierre de convocatoria</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Promedio de notas (1ro a 4to año): mínimo <strong>15,00 puntos</strong></span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Proceso de Admisión:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Presentar Prueba Diagnóstica de Ubicación (PDU) presencial</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Quedar admitido directamente a la carrera seleccionada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm"><strong>Exoneración del arancel de PDU</strong> para candidatos</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condiciones de Mantenimiento */}
        <Card className="border-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-6 w-6" />
              Condiciones de Mantenimiento
            </CardTitle>
            <CardDescription>
              Requisitos para conservar la Beca Impacto durante tus estudios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-3">📊 Requisitos Académicos:</h4>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span>Índice Académico Acumulado (IAA) mínimo:</span>
                  <span className="font-bold text-primary">≥ 12,00 puntos</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span>Créditos mínimos por trimestre regular:</span>
                  <span className="font-bold text-primary">15 créditos</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span>Plazo máximo para culminar estudios:</span>
                  <span className="font-bold text-primary">12 períodos regulares</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Inscripción de Asignaturas:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Mínimo 15 créditos en período regular (o remanente para finalizar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Se excluyen: selecciones deportivas/artísticas y asignaturas adicionales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Retiro de asignaturas: requiere consulta previa con DDBE</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Período intensivo: notificar a DDBE para tramitar permiso</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Compromisos del Becario:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Cumplir Carta Compromiso firmada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Participar en acompañamiento integral (obligatorio)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Respetar Reglamentos y Código de Ética UNIMET</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>No incurrir en sanciones disciplinarias</span>
                  </li>
                </ul>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <strong>Cambio de carrera:</strong> Se permite un cambio si no tienes más de 45 créditos aprobados,
                con aval del cuerpo técnico y recomendación de DDBE.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Permisos Especiales */}
        <Card className="border-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertCircle className="h-6 w-6" />
              Permisos para Interrumpir Estudios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              El beneficiario podrá solicitar permiso para interrumpir estudios (previa presentación de soportes) en casos de:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Condición de salud</div>
                  <div className="text-xs text-muted-foreground">Propia o del responsable económico</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Orden legal</div>
                  <div className="text-xs text-muted-foreground">Situaciones de índole legal</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Programas académicos</div>
                  <div className="text-xs text-muted-foreground">No vinculados con convenios UNIMET</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Movilidad estudiantil</div>
                  <div className="text-xs text-muted-foreground">Mantienes cobertura hasta tu regreso</div>
                </div>
              </div>
            </div>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Todas las solicitudes serán evaluadas por el cuerpo técnico designado.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Causales de Pérdida */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-6 w-6" />
              Causales de Pérdida del Beneficio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert className="bg-red-100 border-red-300">
                <AlertDescription className="text-red-900">
                  El abandono voluntario o incumplimiento de términos y condiciones resultará en la <strong>pérdida
                  inmediata del beneficio</strong>.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>IAA menor a 12,00 puntos al término del año lectivo</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Inscribir menos de 15 créditos sin autorización</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Exceder 12 períodos regulares consecutivos</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Incumplir con el acompañamiento integral</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Incumplir con compromisos de pago</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Incurrir en sanciones disciplinarias</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <Card className="border-primary/20 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              ¿Listo para Ser Parte del Programa Impacto?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Las postulaciones se realizan anualmente a través de instituciones educativas, empresas u
              organizaciones aliadas. Contacta a tu institución para conocer las convocatorias disponibles.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate("/scholarship-programs")}
                className="bg-gradient-primary hover:opacity-90"
              >
                Ver Otros Programas
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4 sticky top-0 z-10">
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
              <h1 className="text-2xl font-bold text-primary">Programa Beca Impacto</h1>
              <p className="text-sm text-muted-foreground">Democratización e Inclusión</p>
            </div>
          </div>

          {/* Logo en el centro */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/lovable-uploads/UNIMETLogo.png"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
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
                  onClick={() => setActiveModule(item.module)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border border-orange/20 transition-all duration-200 ${
                    activeModule === item.module
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
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAspirante;