import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  LogIn,
  UserPlus,
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Compass,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const vocationalBg =
  "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

// Eventos públicos que puede ver cualquier persona (estilo CRM)
const EVENTOS_PUBLICOS = [
  {
    id: "1",
    titulo: "Jornada de Orientación Vocacional",
    descripcion: "Conoce el test y resuelve dudas sobre carreras con orientadores.",
    fecha: "15 Dic",
    dia: "15",
    mes: "DIC",
    hora: "9:00 AM",
    lugar: "Auditorio principal - UNIMET",
    colorBar: "bg-primary",
    cta: "Más información",
  },
  {
    id: "2",
    titulo: "Webinar: El futuro del trabajo",
    descripcion: "Tendencias laborales y cómo elegir una carrera con proyección.",
    fecha: "20 Ene",
    dia: "20",
    mes: "ENE",
    hora: "10:00 AM",
    lugar: "Zoom",
    colorBar: "bg-blue-500",
    cta: "Inscribirse",
  },
  {
    id: "3",
    titulo: "Visita al campus",
    descripcion: "Recorrido por facultades y charla con estudiantes.",
    fecha: "5 Feb",
    dia: "5",
    mes: "FEB",
    hora: "9:00 AM",
    lugar: "Presencial - UNIMET",
    colorBar: "bg-teal-500",
    cta: "Ver detalles",
  },
];

const VocationalIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-orange/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/lovable-uploads/UNIMETLogo.png"
                alt="Universidad Metropolitana"
                className="h-12 object-contain"
              />
            </div>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary hover:bg-primary/10"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/")}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Volver al portal
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero: Regístrate para realizar el test */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src={vocationalBg}
            alt="Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium">Orientación Vocacional UNIMET</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Descubre tu camino profesional
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Regístrate y realiza tu test de orientación vocacional. Obtén recomendaciones personalizadas y explora las carreras de la Universidad Metropolitana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg bg-white text-slate-900 border border-slate-200/50 transition-colors hover:bg-slate-100"
            >
              <UserPlus className="mr-2 h-4 w-4 shrink-0" />
              <span>Registrarme para hacer el test</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-lg border border-white/60 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <LogIn className="mr-2 h-4 w-4 shrink-0" aria-hidden />
              <span>Ya tengo cuenta</span>
            </button>
          </div>
        </div>
      </section>

      {/* Eventos públicos (estilo CRM, para todas las personas) */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Eventos y actividades
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Actividades abiertas que puedes ver sin iniciar sesión
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTOS_PUBLICOS.map((evento, index) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className={`h-2 ${evento.colorBar} w-full`} />
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex gap-4 mb-4">
                      <div className="text-center px-3 py-2 bg-slate-100 rounded-xl shrink-0">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          {evento.mes}
                        </div>
                        <div className="text-xl font-bold text-slate-900">
                          {evento.dia}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 leading-tight">
                          {evento.titulo}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                          {evento.descripcion}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{evento.hora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{evento.lugar}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full rounded-full mt-auto"
                      variant={index === 0 ? "default" : "outline"}
                      onClick={() => navigate("/register")}
                    >
                      {evento.cta}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accesos: Ver carreras y Centro de novedades (CRM) */}
      <section className="py-16 px-4 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Explora más
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card
                className="rounded-2xl border-slate-200 shadow-sm overflow-hidden cursor-pointer h-full transition-shadow hover:shadow-md"
                onClick={() => navigate("/vocational-explorer")}
              >
                <div className="h-2 bg-blue-500 w-full" />
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Compass className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Ver carreras
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Conoce las carreras de la UNIMET, perfiles y campo laboral
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card
                className="rounded-2xl border-slate-200 shadow-sm overflow-hidden cursor-pointer h-full transition-shadow hover:shadow-md"
                onClick={() => navigate("/vocational-crm")}
              >
                <div className="h-2 bg-pink-500 w-full" />
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                    <Bell className="w-7 h-7 text-pink-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-pink-700 transition-colors">
                      Centro de novedades
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Notificaciones, eventos y comunicación (requiere sesión)
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-500 shrink-0" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-orange/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">
              Universidad Metropolitana
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Universidad Metropolitana. Sistema Multiplataforma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalIndex;
