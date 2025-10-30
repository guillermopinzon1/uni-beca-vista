import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, FileText, Gift, Target, BookOpen, Users, Clock, CheckCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const FormacionDocenteProgram = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string>("informacion");

  const handleLogout = async () => {
    await logout(() => navigate('/'));
  };

  const sidebarItems = [
    {
      title: "Información del Programa",
      icon: FileText,
      onClick: () => setActiveModule("informacion")
    },
    {
      title: "Requisitos",
      icon: CheckCircle,
      onClick: () => setActiveModule("requisitos")
    },
    {
      title: "Beneficios",
      icon: Gift,
      onClick: () => setActiveModule("beneficios")
    },
    {
      title: "Compromisos",
      icon: Target,
      onClick: () => setActiveModule("compromisos")
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Diseño de fondo con líneas modernas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradientFormacion" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Líneas diagonales principales */}
          <line x1="0" y1="10%" x2="100%" y2="25%" stroke="url(#lineGradientFormacion)" strokeWidth="1.5" opacity="0.4"/>
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="url(#lineGradientFormacion)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="55%" x2="100%" y2="70%" stroke="url(#lineGradientFormacion)" strokeWidth="1.5" opacity="0.35"/>
          <line x1="0" y1="75%" x2="100%" y2="90%" stroke="url(#lineGradientFormacion)" strokeWidth="1.5" opacity="0.3"/>

          {/* Líneas diagonales secundarias */}
          <line x1="0" y1="85%" x2="100%" y2="70%" stroke="url(#lineGradientFormacion)" strokeWidth="1" opacity="0.25"/>
          <line x1="0" y1="50%" x2="100%" y2="35%" stroke="url(#lineGradientFormacion)" strokeWidth="1" opacity="0.2"/>

          {/* Líneas diagonales adicionales */}
          <line x1="0" y1="0" x2="40%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="25%" y1="0" x2="65%" y2="100%" stroke="#FF6B35" strokeWidth="1.5" opacity="0.1"/>
          <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="75%" y1="0" x2="100%" y2="50%" stroke="#FF6B35" strokeWidth="1" opacity="0.07"/>

          {/* Líneas diagonales inversas */}
          <line x1="100%" y1="15%" x2="60%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.06"/>
          <line x1="100%" y1="45%" x2="80%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.05"/>
        </svg>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary hover:text-primary/90"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Programa de Formación Docente</h1>
              <p className="text-sm text-muted-foreground">
                Profesionalización de docentes en ejercicio
              </p>
            </div>
          </div>

          {/* Logo en el centro */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/450.jpg"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-orange/30 text-orange-600">
              <BookOpen className="h-3 w-3 mr-1" />
              Formación Docente
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))] relative z-10">
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
                  className={`w-12 h-12 flex items-center justify-center rounded-lg bg-background border transition-all duration-200 ${
                    activeModule === item.title.toLowerCase().replace(/\s+/g, '-') ||
                    (item.title === "Información del Programa" && activeModule === "informacion")
                      ? "border-orange/40 bg-orange/10"
                      : "border-orange/20 hover:bg-orange/10 hover:border-orange/40"
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
            {activeModule === "informacion" && (
              <div className="space-y-6">
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Acerca del Programa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      El Programa de Beca Formación Docente tiene como objetivo principal proporcionar a los
                      docentes en ejercicio la oportunidad de desarrollar las competencias necesarias para
                      alcanzar altos niveles de eficacia y eficiencia en su rol como educadores.
                    </p>
                    <p className="text-muted-foreground">
                      Se busca que los beneficiarios adquieran las habilidades para asumir un papel
                      protagónico y multiplicador en los cambios socioculturales, económicos y políticos
                      de la actualidad nacional.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle>Objetivo del Programa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Facilitar la profesionalización de docentes en ejercicio, en apego a los principios
                      que rigen la profesión docente en el país. La Universidad, consciente de la
                      trascendencia de la labor educativa, espera de los beneficiarios un compromiso cabal
                      con los requisitos académicos y profesionales establecidos.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle>Cobertura del Beneficio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Apoyo Económico Significativo</p>
                          <p className="text-sm text-muted-foreground">
                            Descuento considerable sobre el costo de las asignaturas inscritas
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Exoneración de Defensa de Trabajo de Grado</p>
                          <p className="text-sm text-muted-foreground">
                            No pagas el arancel de Defensa de Trabajo de Grado
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Asignaturas por Suficiencia</p>
                          <p className="text-sm text-muted-foreground">
                            Exoneración del costo de una asignatura por suficiencia (una vez en la carrera)
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeModule === "requisitos" && (
              <div className="space-y-6">
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Requisitos para Postular
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Requisito Principal</h3>
                        <p className="text-blue-800">
                          <strong>Ser docente en ejercicio</strong> al momento de la postulación y mantener esta
                          condición durante el tiempo que dure su proceso formativo. Esto garantiza que la
                          formación teórica se complementa con la práctica pedagógica continua.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Documentación Requerida</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Documentos solicitados por la Escuela de Educación
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Documentos solicitados por la Dirección de Desarrollo y Bienestar Estudiantil
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Constancia de ejercicio docente actual
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle>Condiciones de Mantenimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            IAA Mínimo
                          </h4>
                          <p className="text-2xl font-bold text-green-700">≥ 14.00</p>
                          <p className="text-sm text-green-800">puntos al término del año lectivo</p>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Carga Académica
                          </h4>
                          <p className="text-2xl font-bold text-purple-700">5 asignaturas</p>
                          <p className="text-sm text-purple-800">mínimo por trimestre</p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Duración Máxima
                          </h4>
                          <p className="text-2xl font-bold text-blue-700">8 períodos</p>
                          <p className="text-sm text-blue-800">regulares consecutivos</p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Retiro de Asignaturas
                          </h4>
                          <p className="text-sm text-orange-800">
                            Requiere autorización previa de la DDBE
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeModule === "beneficios" && (
              <div className="space-y-6">
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-primary" />
                      Beneficios del Programa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Exoneraciones Específicas</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <h4 className="font-semibold text-green-900">Defensa de Trabajo de Grado</h4>
                            <p className="text-sm text-green-800 mt-1">
                              No pagas el arancel de Defensa de Trabajo de Grado (a menos que retires
                              la defensa por motivos distintos al diferimiento)
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <h4 className="font-semibold text-blue-900">Asignaturas por Suficiencia</h4>
                            <p className="text-sm text-blue-800 mt-1">
                              Costo de una asignatura por suficiencia exonerado (una vez en la carrera,
                              con la obligación de aprobarla)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Acompañamiento</h3>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Apoyo Integral</h4>
                          <ul className="space-y-2 text-sm text-purple-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Seguimiento trimestral de tu progreso académico</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Revisión anual de condiciones de mantenimiento</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Orientación por parte de la DDBE</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange/20 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-900">Costos Asumidos por el Beneficiario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-orange-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Asignaturas retiradas o reprobadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Asignaturas adicionales o no pertenecientes al plan de estudios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Matrícula trimestral (porción no cubierta por el beneficio)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Cuota de inscripción</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Aranceles no especificados en las exoneraciones</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeModule === "compromisos" && (
              <div className="space-y-6">
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Compromisos del Beneficiario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">Responsabilidad Profesional</h3>
                        <p className="text-blue-800">
                          El beneficiario deberá reconocer que la Beca de Formación Docente es una inversión
                          en su desarrollo y en la mejora de la calidad educativa del país. Por tanto, deberá
                          asumir con responsabilidad y ética el beneficio, en aras de su crecimiento profesional
                          y en beneficio del sistema educativo venezolano.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Compromisos Académicos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 border-l-4 border-green-500">
                            <h4 className="font-semibold text-green-900 mb-2">Rendimiento Académico</h4>
                            <p className="text-sm text-green-800">
                              Mantener IAA ≥ 14.00 puntos al término de cada año lectivo
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                            <h4 className="font-semibold text-purple-900 mb-2">Progresión Constante</h4>
                            <p className="text-sm text-purple-800">
                              Cursar mínimo 5 asignaturas por trimestre o el remanente para culminar
                            </p>
                          </div>

                          <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-900 mb-2">Culminación a Tiempo</h4>
                            <p className="text-sm text-orange-800">
                              Finalizar estudios en máximo 8 períodos regulares consecutivos
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                            <h4 className="font-semibold text-blue-900 mb-2">Ejercicio Docente</h4>
                            <p className="text-sm text-blue-800">
                              Mantener condición de docente en ejercicio durante todo el programa
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Compromisos Administrativos</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Firma de Carta Compromiso</p>
                              <p className="text-sm text-muted-foreground">
                                Cumplir todo lo especificado en la Carta Compromiso del programa
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Conducta Ética</p>
                              <p className="text-sm text-muted-foreground">
                                Observar conducta ajustada a la ética profesional conforme a la Ley del
                                Ejercicio de la Profesión Docente
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Acompañamiento Obligatorio</p>
                              <p className="text-sm text-muted-foreground">
                                Participar del acompañamiento integral ofrecido por la DDBE
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900">Causales de Pérdida del Beneficio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-red-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Abandono voluntario del programa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incumplimiento de los términos y condiciones aceptados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>No mantener la condición de docente en ejercicio</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incumplimiento de pagos a la Universidad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Violación del Código de Ética de la Universidad</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-red-900 font-semibold">
                      Nota: Si pierdes el beneficio por estas causales, no podrás acceder nuevamente
                      al programa y no podrás retomar estudios con apoyo económico de la Universidad en el futuro.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormacionDocenteProgram;
