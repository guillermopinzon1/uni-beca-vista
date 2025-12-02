import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Gift, Target, BookOpen, Users, Clock, CheckCircle, GraduationCap, UserCheck, Briefcase, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useState } from "react";

const AyudantiasProgram = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string>("informacion");

  const sidebarItems = [
    {
      title: "Información del Programa",
      icon: FileText,
      onClick: () => setActiveModule("informacion")
    },
    {
      title: "Tipos de Ayudantía",
      icon: Users,
      onClick: () => setActiveModule("tipos")
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
    },
    {
      title: "Acceso al Reglamento",
      icon: BookOpen,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Diseño de fondo con líneas modernas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradientAyudantia" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Líneas diagonales principales */}
          <line x1="0" y1="10%" x2="100%" y2="25%" stroke="url(#lineGradientAyudantia)" strokeWidth="1.5" opacity="0.4"/>
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="url(#lineGradientAyudantia)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="55%" x2="100%" y2="70%" stroke="url(#lineGradientAyudantia)" strokeWidth="1.5" opacity="0.35"/>
          <line x1="0" y1="75%" x2="100%" y2="90%" stroke="url(#lineGradientAyudantia)" strokeWidth="1.5" opacity="0.3"/>

          {/* Líneas diagonales secundarias */}
          <line x1="0" y1="85%" x2="100%" y2="70%" stroke="url(#lineGradientAyudantia)" strokeWidth="1" opacity="0.25"/>
          <line x1="0" y1="50%" x2="100%" y2="35%" stroke="url(#lineGradientAyudantia)" strokeWidth="1" opacity="0.2"/>

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
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Programa de Ayudantías</h1>
              <p className="text-sm text-muted-foreground">
                Intercambio de valor y desarrollo profesional
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
              <Users className="h-3 w-3 mr-1" />
              Ayudantías
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
                      El Programa Ayudantía de la Universidad Metropolitana tiene por finalidad facilitar el intercambio
                      de valor entre el estudiante beneficiario y las unidades académicas y administrativas de la Universidad,
                      mediante el desarrollo de actividades relacionadas con el plan estratégico de la institución.
                    </p>
                    <p className="text-muted-foreground">
                      Este programa está dirigido a estudiantes activos de pregrado y postgrado que deseen desarrollar
                      competencias profesionales mientras contribuyen con el quehacer universitario.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle>Objetivo del Programa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Brindar oportunidades de desarrollo profesional a los estudiantes mientras colaboran en
                      actividades académicas y administrativas, recibiendo una contraprestación económica en forma de
                      descuento sobre el costo de las asignaturas inscritas.
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
                          <p className="font-semibold">Descuento de Matrícula</p>
                          <p className="text-sm text-muted-foreground">
                            Contraprestación económica mensual sobre el costo de las asignaturas inscritas
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Experiencia Profesional</p>
                          <p className="text-sm text-muted-foreground">
                            Desarrollo de competencias en entornos académicos y administrativos reales
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Flexibilidad</p>
                          <p className="text-sm text-muted-foreground">
                            Horario adaptado a tu carga académica (10 horas semanales)
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeModule === "tipos" && (
              <div className="space-y-6">
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Tipos de Ayudantía
                    </CardTitle>
                    <CardDescription>
                      El programa contempla cuatro tipos específicos de ayudantía
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="h-6 w-6 text-blue-700 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Ayudante Académico</h4>
                            <p className="text-sm text-blue-800">
                              Estudiante que se desempeña como asistente del área docente, apoyando en tareas académicas,
                              elaboración de materiales didácticos o como mentor para acompañar a otros estudiantes.
                            </p>
                            <p className="text-xs text-blue-700 mt-2">
                              No aplica para estudiantes del programa de Preparadurías
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-6 w-6 text-green-700 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-900 mb-2">Ayudante de Investigación</h4>
                            <p className="text-sm text-green-800">
                              Estudiante que apoya en investigaciones en curso, realizando tareas experimentales y de
                              recopilación de datos bajo la dirección de un investigador.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                        <div className="flex items-start gap-3">
                          <UserPlus className="h-6 w-6 text-orange-700 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-orange-900 mb-2">Embajador Naranja</h4>
                            <p className="text-sm text-orange-800">
                              Estudiante que brinda apoyo protocolar en eventos universitarios, actos de grado y en
                              actividades de promoción y difusión de la oferta académica y planes de apoyo de la Universidad.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                        <div className="flex items-start gap-3">
                          <Briefcase className="h-6 w-6 text-purple-700 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-purple-900 mb-2">Ayudante Administrativo</h4>
                            <p className="text-sm text-purple-800">
                              Estudiante que colabora en actividades administrativas como atención al público, gestión
                              documental, manejo de redes sociales, creación de contenido digital, bases de datos y proyectos
                              propios de la plaza asignada.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        <h3 className="font-semibold text-blue-900 mb-2">Requisitos Académicos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-blue-800 text-sm">
                              <strong>Pregrado:</strong> IAA ≥ 12.00 puntos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-blue-800 text-sm">
                              <strong>Postgrado:</strong> IAA ≥ 14.00 puntos
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Requisitos Adicionales</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Tener el perfil de competencias y habilidades acordes con las actividades a desarrollar
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Realizar la entrevista de evaluación de competencias pautada por la DDBE
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">
                              Disponer preferiblemente de una plaza de ayudantía activa y requerida
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
                          <p className="text-sm text-green-800">
                            Pregrado: ≥ 12.00 puntos<br/>
                            Postgrado: ≥ 14.00 puntos
                          </p>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Horas de Dedicación
                          </h4>
                          <p className="text-sm text-purple-800">
                            10 horas semanales<br/>
                            120 horas/trimestre regular<br/>
                            50 horas/período intensivo
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
                        <h3 className="font-semibold text-lg">Beneficios Económicos</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <h4 className="font-semibold text-green-900">Descuento Mensual</h4>
                            <p className="text-sm text-green-800 mt-1">
                              Contraprestación económica mensual aplicada sobre el costo de las asignaturas inscritas en
                              períodos regulares o intensivos
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                            <h4 className="font-semibold text-blue-900">Flexibilidad de Pago</h4>
                            <p className="text-sm text-blue-800 mt-1">
                              Pago mensual de asignaturas con reconocimiento del descuento asignado
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Beneficios de Desarrollo</h3>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Experiencia Profesional</h4>
                          <ul className="space-y-2 text-sm text-purple-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Desarrollo de competencias laborales en entornos reales</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Networking con profesores y personal administrativo</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Formación integral y profesional continua</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>Contribución al plan estratégico de la Universidad</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange/20 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-900">Costos Asumidos por el Ayudante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-orange-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Asignaturas retiradas o reprobadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Cuota de inscripción trimestral</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Porción de matrícula no cubierta por el descuento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Aranceles definidos por la Universidad</span>
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
                      Compromisos del Ayudante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">Responsabilidad Académica</h3>
                        <p className="text-blue-800">
                          El ayudante deberá reconocer que el Programa Ayudantía es una oportunidad de desarrollo
                          profesional que requiere dedicación y compromiso. Por tanto, deberá cumplir con todas las
                          actividades asignadas con responsabilidad y ética profesional.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Compromisos Específicos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 border-l-4 border-green-500">
                            <h4 className="font-semibold text-green-900 mb-2">Rendimiento Académico</h4>
                            <p className="text-sm text-green-800">
                              Mantener IAA ≥ 12.00 (pregrado) o ≥ 14.00 (postgrado)
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 border-l-4 border-purple-500">
                            <h4 className="font-semibold text-purple-900 mb-2">Cumplimiento de Horas</h4>
                            <p className="text-sm text-purple-800">
                              Completar 120 horas/trimestre o 50 horas/intensivo (10 horas semanales)
                            </p>
                          </div>

                          <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
                            <h4 className="font-semibold text-orange-900 mb-2">Plan de Trabajo</h4>
                            <p className="text-sm text-orange-800">
                              Cumplir con el plan establecido por el supervisor de la plaza
                            </p>
                          </div>

                          <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                            <h4 className="font-semibold text-blue-900 mb-2">Carta Compromiso</h4>
                            <p className="text-sm text-blue-800">
                              Cumplir todo lo especificado en la Carta Compromiso firmada
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-4">Compromisos Éticos</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Conducta Ética</p>
                              <p className="text-sm text-muted-foreground">
                                Cumplir con los Reglamentos, Normas y Código de Ética de la Universidad
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Uso Responsable de Recursos</p>
                              <p className="text-sm text-muted-foreground">
                                Utilizar adecuadamente los recursos y equipos de la unidad asignada
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Compromiso de Pago</p>
                              <p className="text-sm text-muted-foreground">
                                Cumplir con los compromisos administrativos de pago con la Universidad
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
                    <CardTitle className="text-red-900">Causales de Remoción y Pérdida del Beneficio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-red-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incumplimiento de las obligaciones establecidas en el Reglamento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incumplimiento de las funciones acordadas con el supervisor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Conductas inadecuadas o uso indebido de recursos y equipos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incumplimiento de compromisos de pago con la Universidad</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Incurrir en una sanción disciplinaria</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-red-900 font-semibold">
                      Nota: El ayudante que pierda el beneficio por estas causales no podrá acceder nuevamente
                      al programa Ayudantía.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeModule === "reglamento" && (
              <div className="flex justify-center">
                <ReglamentoAccess becaType="ayudantias" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AyudantiasProgram;
