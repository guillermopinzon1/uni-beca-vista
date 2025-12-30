import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, LogOut, Compass, BrainCircuit, 
  ChevronRight, RefreshCcw, ChevronLeft 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Restauradas las preguntas originales para el Test
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
  const { logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const totalSteps = questions.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* HEADER SUPERIOR (Sin logo, idéntico a becas) */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/modules")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Orientación Vocacional
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* BREADCRUMB (Inicio > Orientación Vocacional) */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Compass className="h-4 w-4" />
          <button 
            onClick={() => navigate("/modules")}
            className="hover:text-orange-500 transition-colors"
          >
            Inicio
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-gray-900">Orientación Vocacional</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 text-center">
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
                    <Button onClick={() => window.location.reload()} variant="outline" className="w-full mt-10 h-12 font-bold rounded-md">
                      Repetir Evaluación
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center mt-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <GraduationCap className="h-5 w-5 text-orange-500" /> Universidad Metropolitana
          </div>
          <p className="text-gray-400 text-xs">© 2025 Universidad Metropolitana. Sistema Multiplataforma.</p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalTest;