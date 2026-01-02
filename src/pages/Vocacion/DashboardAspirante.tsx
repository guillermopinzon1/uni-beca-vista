import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText, BrainCircuit, Upload, User, LogOut, RefreshCcw, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Preguntas del test vocacional
const questions = [
  {
    id: 1,
    question: "¿Qué tipo de actividades prefieres en tu tiempo libre?",
    options: [
      { id: "a", text: "Resolver rompecabezas o juegos de lógica", category: "logical" },
      { id: "b", text: "Leer sobre historia, arte o literatura", category: "creative" },
      { id: "c", text: "Organizar eventos o liderar grupos", category: "social" },
      { id: "d", text: "Construir cosas o trabajar con herramientas", category: "technical" },
    ],
  },
  {
    id: 2,
    question: "¿Qué materia escolar disfrutabas más?",
    options: [
      { id: "a", text: "Matemáticas o Física", category: "logical" },
      { id: "b", text: "Literatura o Arte", category: "creative" },
      { id: "c", text: "Psicología o Ciencias Sociales", category: "social" },
      { id: "d", text: "Tecnología o Talleres", category: "technical" },
    ],
  },
  {
    id: 3,
    question: "¿Cómo te imaginas tu entorno de trabajo ideal?",
    options: [
      { id: "a", text: "En un laboratorio o centro de investigación", category: "logical" },
      { id: "b", text: "En un estudio creativo o agencia", category: "creative" },
      { id: "c", text: "En contacto directo con personas y comunidades", category: "social" },
      { id: "d", text: "En campo, obras o talleres industriales", category: "technical" },
    ],
  },
  {
    id: 4,
    question: "¿Qué habilidad consideras que es tu mayor fortaleza?",
    options: [
      { id: "a", text: "Pensamiento analítico y resolución de problemas", category: "logical" },
      { id: "b", text: "Creatividad y expresión artística", category: "creative" },
      { id: "c", text: "Empatía y comunicación efectiva", category: "social" },
      { id: "d", text: "Habilidad manual y comprensión técnica", category: "technical" },
    ],
  },
];

const results = {
  logical: {
    title: "Ingeniería y Ciencias",
    description: "Tienes un perfil analítico y te apasiona resolver problemas complejos. Las carreras ideales para ti involucran lógica, matemáticas y tecnología.",
    careers: ["Ingeniería de Sistemas", "Ingeniería Civil", "Ingeniería Química", "Matemáticas"],
    color: "bg-blue-500",
  },
  creative: {
    title: "Artes y Humanidades",
    description: "Tu creatividad es tu motor. Disfrutas de la expresión, la cultura y el pensamiento abstracto.",
    careers: ["Estudios Liberales", "Idiomas Modernos", "Derecho", "Psicología"],
    color: "bg-purple-500",
  },
  social: {
    title: "Ciencias Sociales y Administrativas",
    description: "Eres un líder natural y te gusta trabajar con personas. Tienes habilidades para la gestión y la comunicación.",
    careers: ["Psicología", "Ciencias Administrativas", "Economía", "Educación"],
    color: "bg-green-500",
  },
  technical: {
    title: "Tecnología y Producción",
    description: "Te gusta ver resultados tangibles. Tienes habilidades prácticas y disfrutas entendiendo cómo funcionan las cosas.",
    careers: ["Ingeniería Mecánica", "Ingeniería de Producción", "Ingeniería Eléctrica"],
    color: "bg-orange-500",
  },
};

const DashboardAspirante = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<string>("tests");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [notasColegio, setNotasColegio] = useState({
    primerAno: "",
    segundoAno: "",
    tercerAno: "",
    cuartoAno: "",
    promedio: ""
  });

  // Estados para el test vocacional
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const totalSteps = questions.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarItems = [
    {
      title: "Tests Vocacionales",
      icon: BrainCircuit,
      module: "tests"
    },
    {
      title: "Subir Notas del Colegio",
      icon: Upload,
      module: "notas"
    },
    {
      title: "Mi Perfil",
      icon: User,
      module: "perfil"
    },
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

  // Funciones para el test vocacional
  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [questions[currentStep - 1].id]: selectedOption });
      setSelectedOption(null);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(totalSteps + 1);
        let p = 0;
        const interval = setInterval(() => {
          p += 5;
          setLoadingProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            setCurrentStep(totalSteps + 2);
          }
        }, 100);
      }
    }
  };

  const calculateResult = () => {
    const counts: Record<string, number> = { logical: 0, creative: 0, social: 0, technical: 0 };
    Object.values(answers).forEach((answerId) => {
      for(const q of questions) {
        const opt = q.options.find(o => o.id === answerId);
        if(opt) counts[opt.category]++;
      }
    });
    let maxCat = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return results[maxCat as keyof typeof results];
  };

  const resultData = currentStep > totalSteps + 1 ? calculateResult() : null;

  const handleSubirNotas = async () => {
    // Validar que todos los campos estén llenos
    if (!notasColegio.primerAno || !notasColegio.segundoAno || !notasColegio.tercerAno || !notasColegio.cuartoAno) {
      toast({
        title: "Error",
        description: "Por favor completa todas las notas",
        variant: "destructive"
      });
      return;
    }

    // Calcular promedio
    const promedio = (
      (parseFloat(notasColegio.primerAno) +
       parseFloat(notasColegio.segundoAno) +
       parseFloat(notasColegio.tercerAno) +
       parseFloat(notasColegio.cuartoAno)) / 4
    ).toFixed(2);

    setNotasColegio({ ...notasColegio, promedio });

    // Aquí puedes agregar la lógica para guardar en el backend
    toast({
      title: "Éxito",
      description: `Notas guardadas. Promedio calculado: ${promedio}`,
    });
  };

  const renderContent = () => {
    if (activeModule === "tests") {
      return (
        <div className="space-y-6">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Vocacional</h2>
                  <p className="text-gray-500 mb-10 text-lg">Selecciona las opciones que mejor describan tu perfil</p>
                  <Card className="border-none shadow-sm rounded-xl p-10 bg-white">
                    <BrainCircuit className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                      Responde estas preguntas con sinceridad para que podamos sugerirte las carreras que mejor se adaptan a tus intereses.
                    </p>
                    <Button 
                      onClick={() => setCurrentStep(1)} 
                      className="bg-[#F37021] hover:bg-orange-600 text-white rounded-md px-10 h-12 font-bold transition-all text-lg"
                    >
                      Comenzar Evaluación
                    </Button>
                  </Card>
                </motion.div>
              )}

              {currentStep > 0 && currentStep <= totalSteps && (
                <motion.div key="test" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="mb-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500" 
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                  <Card className="border-none shadow-sm rounded-xl overflow-hidden text-left bg-white">
                    <div className="p-8 md:p-12">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 block">
                        Pregunta {currentStep} de {totalSteps}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
                        {questions[currentStep - 1].question}
                      </h3>
                      <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-4">
                        {questions[currentStep - 1].options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`flex items-center space-x-3 p-5 rounded-lg border transition-all cursor-pointer ${
                              selectedOption === option.id 
                              ? 'border-orange-500 bg-orange-50 shadow-sm' 
                              : 'border-gray-100 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedOption(option.id)}
                          >
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium text-lg text-gray-700">
                              {option.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="mt-10 flex justify-end">
                        <Button onClick={handleNext} disabled={!selectedOption} className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-md font-bold text-lg">
                          {currentStep === totalSteps ? "Finalizar" : "Siguiente"} 
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {currentStep === totalSteps + 1 && (
                <div className="py-20">
                  <RefreshCcw className="w-16 h-16 animate-spin mx-auto text-orange-500 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900">Analizando tu perfil...</h2>
                  <div className="w-full max-w-md mx-auto bg-gray-200 h-2 rounded-full mt-6 overflow-hidden">
                    <motion.div className="h-full bg-orange-500" style={{ width: `${loadingProgress}%` }} />
                  </div>
                </div>
              )}

              {currentStep === totalSteps + 2 && resultData && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white text-left">
                    <div className={`${resultData.color} p-10 text-white text-center`}>
                      <h2 className="text-4xl font-black mb-4">{resultData.title}</h2>
                      <p className="text-white/90 text-lg">{resultData.description}</p>
                    </div>
                    <CardContent className="p-10">
                      <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-6">Carreras Sugeridas</h3>
                      <div className="grid gap-3">
                        {resultData.careers.map(c => (
                          <div key={c} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-all">
                            <span className="font-bold text-gray-700">{c}</span>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-orange-500" />
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => { setCurrentStep(0); setAnswers({}); setSelectedOption(null); }} variant="outline" className="w-full mt-10 h-12 font-bold rounded-md">
                        Repetir Evaluación
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    if (activeModule === "notas") {
      return (
        <div className="space-y-6">
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Upload className="h-6 w-6" />
                Subir Notas del Colegio
              </CardTitle>
              <CardDescription>
                Ingresa tus notas de 1ro a 4to año de bachillerato para calcular tu promedio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  El promedio mínimo requerido para postular es de <strong>15,00 puntos</strong>
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primerAno">1er Año</Label>
                  <Input
                    id="primerAno"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={notasColegio.primerAno}
                    onChange={(e) => setNotasColegio({ ...notasColegio, primerAno: e.target.value })}
                    placeholder="Ej: 16.50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segundoAno">2do Año</Label>
                  <Input
                    id="segundoAno"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={notasColegio.segundoAno}
                    onChange={(e) => setNotasColegio({ ...notasColegio, segundoAno: e.target.value })}
                    placeholder="Ej: 17.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tercerAno">3er Año</Label>
                  <Input
                    id="tercerAno"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={notasColegio.tercerAno}
                    onChange={(e) => setNotasColegio({ ...notasColegio, tercerAno: e.target.value })}
                    placeholder="Ej: 16.75"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuartoAno">4to Año</Label>
                  <Input
                    id="cuartoAno"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={notasColegio.cuartoAno}
                    onChange={(e) => setNotasColegio({ ...notasColegio, cuartoAno: e.target.value })}
                    placeholder="Ej: 18.00"
                  />
                </div>
              </div>

              {notasColegio.promedio && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Promedio Calculado:</span>
                    <span className={`text-2xl font-bold ${
                      parseFloat(notasColegio.promedio) >= 15 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {notasColegio.promedio}
                    </span>
                  </div>
                  {parseFloat(notasColegio.promedio) >= 15 ? (
                    <p className="text-sm text-green-700 mt-2">
                      ✓ Cumples con el requisito mínimo de 15,00 puntos
                    </p>
                  ) : (
                    <p className="text-sm text-red-700 mt-2">
                      ✗ No cumples con el requisito mínimo de 15,00 puntos
                    </p>
                  )}
                </div>
              )}

              <Button 
                onClick={handleSubirNotas}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Guardar Notas
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeModule === "perfil") {
      return (
        <div className="space-y-6">
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-6 w-6" />
                Mi Perfil
              </CardTitle>
              <CardDescription>
                Información personal y datos de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información Personal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                  <p className="text-base font-medium text-primary">
                    {user?.nombre || 'No disponible'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Apellido</Label>
                  <p className="text-base font-medium text-primary">
                    {user?.apellido || 'No disponible'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Correo Electrónico</Label>
                  <p className="text-base font-medium text-primary">
                    {user?.email || 'No disponible'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Cédula</Label>
                  <p className="text-base font-medium text-primary">
                    {user?.cedula || 'No disponible'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                  <p className="text-base font-medium text-primary">
                    {user?.telefono || 'No disponible'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                  <p className="text-base font-medium text-primary capitalize">
                    {user?.role || 'Aspirante'}
                  </p>
                </div>
              </div>

              {/* Estado de la cuenta */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado de la cuenta:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user?.activo 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.activo ? 'Activa' : 'Pendiente de aprobación'}
                  </span>
                </div>
                {!user?.emailVerified && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ⚠️ Tu correo electrónico aún no ha sido verificado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

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
              <h1 className="text-2xl font-bold text-primary">Orientación Vocacional</h1>
              <p className="text-sm text-muted-foreground">Sistema de Orientación</p>
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

          {/* Botón Cerrar Sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-primary hover:text-primary/90 border-orange/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
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