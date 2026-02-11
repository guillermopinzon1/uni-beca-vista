import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogIn,
  UserPlus,
  MapPin,
  Clock,
  ChevronRight,
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
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* Encabezado igual al Home: mismo fondo, fuente y estilo */}
      <header className="fixed top-0 w-full z-50 bg-white backdrop-blur-md border-b border-slate-100 font-sans antialiased text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <img
              src="/lovable-uploads/UNIMETLogo.png"
              alt="UNIMET"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-slate-600 font-semibold" onClick={() => navigate("/login")}>
              <LogIn className="w-4 h-4 mr-2" /> Entrar
            </Button>
            <Button className="bg-[#f37021] hover:bg-[#d65f1a] text-white px-6 rounded-full shadow-lg shadow-orange-200" onClick={() => navigate("/register")}>
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero: mismo estilo que Home (imagen + overlay + texto a la izquierda) */}
      <section className="relative min-h-[75vh] flex flex-col justify-end pt-20">
        <div className="absolute inset-0">
          <img src={vocationalBg} alt="Campus UNIMET" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-24 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-white/90 text-sm font-medium uppercase tracking-wide mb-2">
              Orientación Vocacional
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Descubre tu camino profesional
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Regístrate y realiza tu test de orientación vocacional. Obtén recomendaciones personalizadas y explora las carreras de la Universidad Metropolitana.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                size="lg"
                className="bg-[#f37021] hover:bg-orange-600 text-white rounded-xl px-6 h-12 font-semibold shadow-xl"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="w-4 h-4 mr-2" /> Registrarme para el test
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/15 hover:bg-white/25 rounded-xl px-6 h-12 font-semibold shadow-lg"
                onClick={() => navigate("/login")}
              >
                <LogIn className="w-5 h-5 mr-2" /> Ya tengo cuenta
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barra de acceso rápido (estilo Home) */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between"
        >
          <span className="text-slate-600 font-medium text-sm sm:text-base shrink-0">¿Qué quieres hacer?</span>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none rounded-xl font-medium bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              onClick={() => navigate("/vocational-explorer")}
            >
              <Compass className="w-4 h-4 mr-2 shrink-0" /> Ver carreras
            </Button>
            <Button
              type="button"
              className="flex-1 sm:flex-none bg-[#f37021] text-white border-[#f37021] rounded-xl font-medium shadow-md hover:bg-[#d65f1a]"
              onClick={() => navigate("/register")}
            >
              <UserPlus className="w-4 h-4 mr-2 shrink-0" /> Hacer test vocacional
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Eventos públicos */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Eventos y actividades</h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Actividades abiertas que puedes ver sin iniciar sesión
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTOS_PUBLICOS.map((evento, index) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col bg-white">
                  <div className={`h-1.5 ${evento.colorBar} w-full`} />
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
                      className="w-full rounded-xl mt-auto bg-[#f37021] hover:bg-orange-600 text-white"
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

      {/* Accesos: Ver carreras y Centro de novedades (estilo Home) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Explora más</h2>
            <p className="text-slate-600 max-w-lg mx-auto">Accede al catálogo de carreras o al centro de novedades.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card
                className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer h-full transition-all hover:shadow-lg hover:border-orange-200"
                onClick={() => navigate("/vocational-explorer")}
              >
                <div className="h-1.5 bg-[#f37021] w-full" />
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                    <Compass className="w-7 h-7 text-[#f37021]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#d65f1a] transition-colors">
                      Ver carreras
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Conoce las carreras de la UNIMET, perfiles y campo laboral
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#f37021] shrink-0" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card
                className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer h-full transition-all hover:shadow-lg hover:border-orange-200"
                onClick={() => navigate("/vocational-crm")}
              >
                <div className="h-1.5 bg-slate-600 w-full" />
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <Bell className="w-7 h-7 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      Centro de novedades
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Notificaciones, eventos y comunicación (requiere sesión)
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer igual al Home */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className="w-10 h-1 bg-orange-500" />
            <img
              src="/lovable-uploads/UNIMETLogo.png"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
            <div className="w-10 h-1 bg-orange-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} Universidad Metropolitana | Dirección de Bienestar y Desarrollo Estudiantil
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalIndex;
