import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Compass, LogIn, Search, ArrowRight } from "lucide-react";
import imagenBecas from "@/assets/Universidad-Metropolitana.jpg";
import imagenOrientacion from "@/assets/university-hero.jpg";

const CAMPUS_IMAGE = "https://www.unimet.edu.ve/wp-content/uploads/2023/12/FOTOS-CAMPUS-2023-24-1-1024x683.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [barraSeleccion, setBarraSeleccion] = useState<"becas" | "orientacion" | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* Header como estaba: claro, logo sin invertir */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <img
            src="/lovable-uploads/UNIMETLogo.png"
            alt="UNIMET"
            className="h-10 w-auto object-contain"
          />
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

      {/* Hero: imagen completa + overlay + texto a la izquierda */}
      <section className="relative min-h-[75vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img src={CAMPUS_IMAGE} alt="Campus UNIMET" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-24 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-white/90 text-sm font-medium uppercase tracking-wide mb-2">
              Dirección de Bienestar y Desarrollo Estudiantil
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Encontrar tu camino es más simple
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Becas, orientación vocacional y apoyo para tu trayectoria. Todo en un solo lugar para la comunidad Unimetana.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-[#f37021] hover:bg-orange-600 text-white rounded-xl px-6 h-12 font-semibold shadow-xl"
                onClick={() => navigate("/postulaciones-becas")}
              >
                <Search className="w-4 h-4 mr-2" /> Postularme a Beca
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/15 hover:bg-white/25 rounded-xl px-6 h-12 font-semibold shadow-lg"
                onClick={() => navigate("/vocational")}
              >
                <Compass className="w-5 h-5 mr-2" /> Test Vocacional
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barra de acceso rápido: selector Becas / Orientación + Buscar */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between"
        >
          <span className="text-slate-600 font-medium text-sm sm:text-base shrink-0">¿Qué quieres hacer?</span>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              onClick={() => setBarraSeleccion("becas")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-all ${
                barraSeleccion === "becas"
                  ? "bg-[#f37021] text-white border-[#f37021] shadow-md"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" /> Becas
            </button>
            <button
              type="button"
              onClick={() => setBarraSeleccion("orientacion")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-all ${
                barraSeleccion === "orientacion"
                  ? "bg-[#f37021] text-white border-[#f37021] shadow-md"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" /> Orientación vocacional
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sección: frase La Metro al inicio; tarjetas al elegir Becas u Orientación */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {barraSeleccion === null ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Franja naranja superior */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#f37021] to-orange-400" />
                <div className="px-8 sm:px-12 py-14 sm:py-16 text-center">
                  <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-[0.25em] mb-6">
                    Universidad Metropolitana
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-[1.3]">
                    <span className="text-[#f37021]">Re-Imagina</span> tu carrera.
                  </h2>
                  <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-[1.3]">
                    <span className="text-[#f37021]">Re-Imagina</span> tu historia.
                  </h2>
                  <div className="mt-8 h-px w-16 mx-auto bg-slate-200" />
                  <p className="mt-6 text-slate-500 text-sm">
                    Elige Becas u Orientación vocacional arriba para continuar.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Lo más utilizado</h2>
                <p className="text-slate-600 max-w-lg mx-auto">
                  {barraSeleccion === "becas"
                    ? "Accede a becas, solicitudes y seguimiento en tiempo real."
                    : "Descubre tu perfil vocacional con tests y recomendaciones de carreras."}
                </p>
              </div>
              <div className="max-w-md mx-auto">
                {barraSeleccion === "becas" && (
                  <motion.div
                    key="becas"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate("/postulaciones-becas")}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden bg-slate-200">
                      <img src={imagenBecas} alt="Becas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Gestión de Becas</h3>
                      <p className="text-slate-600 text-sm mb-4">Solicitudes, requisitos y seguimiento en tiempo real.</p>
                      <span className="inline-flex items-center font-semibold text-[#f37021] text-sm">
                        Acceder <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </motion.div>
                )}
                {barraSeleccion === "orientacion" && (
                  <motion.div
                    key="orientacion"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate("/vocational")}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden bg-slate-200">
                      <img src={imagenOrientacion} alt="Orientación vocacional" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Orientación Vocacional</h3>
                      <p className="text-slate-600 text-sm mb-4">Tests y recomendaciones de carreras para tu perfil.</p>
                      <span className="inline-flex items-center font-semibold text-[#f37021] text-sm">
                        Acceder <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer como estaba: fondo claro, logo centrado con barras naranja */}
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

export default Home;
