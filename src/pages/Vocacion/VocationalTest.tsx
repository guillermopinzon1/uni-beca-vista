import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, BrainCircuit, UserCircle, BellRing, BarChart3, ChevronRight, PlayCircle, Search, Sparkles, CheckCircle  } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

// Mock Questions for the Test
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

const VocationalTest = () => {
  const navigate = useNavigate();
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px"
    };

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsCtaVisible(true);
        }
      });
    }, observerOptions);

    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsFeaturesVisible(true);
        }
      });
    }, observerOptions);

    if (ctaRef.current) {
      ctaObserver.observe(ctaRef.current);
    }

    if (featuresRef.current) {
      featuresObserver.observe(featuresRef.current);
    }

    return () => {
      ctaObserver.disconnect();
      featuresObserver.disconnect();
    };
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Gestión de Becas",
      description: "Administra y monitorea todas las becas disponibles para estudiantes"
    },
    {
      icon: Users,
      title: "Estudiantes",
      description: "Gestiona perfiles de estudiantes y sus solicitudes de becas"
    },
    {
      icon: Award,
      title: "Seguimiento",
      description: "Realiza seguimiento del progreso y estado de las becas otorgadas"
    },
    {
      icon: FileText,
      title: "Reportes",
      description: "Genera reportes detallados sobre el programa de becas"
    }
  ];

  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..N = Questions, N+1 = Loading, N+2 = Result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const totalSteps = questions.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleStart = () => setCurrentStep(1);

  const handleNext = () => {
    if (selectedOption) {
      setAnswers({ ...answers, [questions[currentStep - 1].id]: selectedOption });
      setSelectedOption(null);
      
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(totalSteps + 1);
        // Simulate analysis
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
        // Find category for this answer
        for(const q of questions) {
            const opt = q.options.find(o => o.id === answerId);
            if(opt) {
                counts[opt.category] = (counts[opt.category] || 0) + 1;
            }
        }
    });
    
    // Find max category
    let maxCat = "logical";
    let maxVal = 0;
    for (const [cat, val] of Object.entries(counts)) {
        if (val > maxVal) {
            maxVal = val;
            maxCat = cat;
        }
    }
    return results[maxCat as keyof typeof results];
  };

  const resultData = currentStep > totalSteps + 1 ? calculateResult() : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-orange/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
                alt="Universidad Metropolitana" 
                className="h-12"
              />
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/postulaciones-becas")}
                className="bg-white text-primary hover:bg-white/90"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Postularme a Beca
              </Button>
            </nav>
          </div>
        </div>
      </header>
    

      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        
        {/* Progress Bar (Only during test) */}
        {currentStep > 0 && currentStep <= totalSteps && (
          <div className="fixed top-20 left-0 w-full h-1 bg-slate-200 z-40">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Intro */}
            {currentStep === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                  <BrainCircuit className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Test de Orientación Vocacional</h1>
                <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                  Responde unas breves preguntas para que nuestra IA analice tu perfil y te recomiende las carreras ideales para ti en la UNIMET.
                </p>
                <div className="flex justify-center gap-8 text-sm text-slate-500 mb-10">
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> 5 minutos</div>
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Gratis</div>
                    <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Resultados inmediatos</div>
                </div>
                <Button onClick={handleStart} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 h-14 rounded-full text-lg shadow-lg hover:scale-105 transition-transform">
                  Comenzar Test
                </Button>
              </motion.div>
            )}

            {/* Steps 1..N: Questions */}
            {currentStep > 0 && currentStep <= totalSteps && (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wider">
                      Pregunta {currentStep} de {totalSteps}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
                      {questions[currentStep - 1].question}
                    </h2>

                    <RadioGroup 
                      value={selectedOption || ""} 
                      onValueChange={setSelectedOption}
                      className="space-y-4"
                    >
                      {questions[currentStep - 1].options.map((option) => (
                        <div key={option.id} className={`relative flex items-center space-x-2 border-2 rounded-xl p-4 transition-all cursor-pointer hover:border-blue-200 ${selectedOption === option.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}>
                          <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer font-medium text-lg text-slate-700 w-full h-full flex items-center">
                            {option.text}
                          </Label>
                          {selectedOption === option.id && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <CheckCircle className="w-6 h-6 text-blue-600" />
                              </motion.div>
                          )}
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="mt-10 flex justify-end">
                      <Button 
                        onClick={handleNext} 
                        disabled={!selectedOption}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentStep === totalSteps ? "Finalizar" : "Siguiente"} 
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step N+1: Loading */}
            {currentStep === totalSteps + 1 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center w-full"
              >
                <div className="w-24 h-24 mx-auto mb-8 relative">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <BrainCircuit className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analizando tu perfil...</h2>
                <p className="text-slate-500 mb-8">Estamos comparando tus respuestas con nuestra oferta académica.</p>
                <div className="w-full max-w-md mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-600"
                        style={{ width: `${loadingProgress}%` }}
                    />
                </div>
              </motion.div>
            )}

            {/* Step N+2: Results */}
            {currentStep === totalSteps + 2 && resultData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className={`${resultData.color} p-10 text-white text-center relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
                        
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-sm font-bold mb-6">
                                PERFIL DETECTADO
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{resultData.title}</h2>
                            <p className="text-white/90 text-lg max-w-lg mx-auto leading-relaxed">
                                {resultData.description}
                            </p>
                        </motion.div>
                    </div>
                    
                    <div className="p-10">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <GraduationCap className="w-6 h-6 mr-2 text-slate-400" />
                            Carreras Recomendadas en UNIMET
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-10">
                            {resultData.careers.map((career, index) => (
                                <motion.div 
                                    key={career}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (index * 0.1) }}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <span className="font-semibold text-slate-700">{career}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-slate-100">
                             <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Repetir Test
                             </Button>
                             <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-8">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Ver Pensum de Estudios
                             </Button>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card border-t border-orange/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Universidad Metropolitana</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Universidad Metropolitana. Sistema Multiplataforma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalTest;
