import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, Users, TrendingUp, Shield, 
  Compass, LogIn, UserPlus, ArrowRight 
} from "lucide-react";

// --- Componentes Atómicos para un Diseño Limpio ---

const StatCard = ({ icon: Icon, number, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative overflow-hidden group bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center"
  >
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
    <Icon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
    <div className="text-3xl font-bold text-white mb-1">{number}</div>
    <div className="text-orange-100/70 text-sm font-medium uppercase tracking-wider">{label}</div>
  </motion.div>
);

const ServiceCard = ({ title, description, icon: Icon, onClick, primary }: any) => (
  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    className={`cursor-pointer p-8 rounded-3xl border transition-all shadow-sm ${
      primary 
      ? "bg-white border-slate-100 hover:shadow-orange-200/50 hover:shadow-2xl" 
      : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
      primary ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600"
    }`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
    <div className={`flex items-center font-bold text-sm uppercase tracking-widest ${
      primary ? "text-orange-500" : "text-slate-400"
    }`}>
      Explorar ahora <ArrowRight className="ml-2 w-4 h-4" />
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* Navbar Minimalista estilo Unimet */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <img 
            src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
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

      {/* Hero Section: Inspirado en el banner de "El futuro se diseña" */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="z-10"
          >
            <span className="inline-block py-1 px-4 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Dirección de Bienestar y Desarrollo Estudiantil
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Tu éxito <span className="text-orange-500">Unimetano</span> comienza aquí.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-10">
              Accede a becas, orientación vocacional y herramientas digitales diseñadas para potenciar tu carrera universitaria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 h-14 px-8 rounded-2xl text-lg font-bold" onClick={() => navigate("/postulaciones-becas")}>
                Postularse a una Beca
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-slate-200 h-14 px-8 rounded-2xl text-lg font-bold" onClick={() => navigate("/vocational")}>
                Test Vocacional
              </Button>
            </div>
          </motion.div>

          {/* Elemento Visual Moderno */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500 rounded-[40px] rotate-6 opacity-10 blur-3xl" />
            <img 
              src="https://www.unimet.edu.ve/wp-content/uploads/2023/12/FOTOS-CAMPUS-2023-24-1-1024x683.jpg" 
              className="relative rounded-[32px] shadow-2xl border-8 border-white object-cover h-[500px] w-full"
              alt="Campus Unimet"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats en Banner Oscuro (como el footer de Unimet) */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={GraduationCap} number="500+" label="Becas Activas" delay={0.1} />
          <StatCard icon={Users} number="1,200+" label="Estudiantes" delay={0.2} />
          <StatCard icon={TrendingUp} number="95%" label="Efectividad" delay={0.3} />
          <StatCard icon={Shield} number="SISE" label="Seguridad" delay={0.4} />
        </div>
      </section>

      {/* Grid de Servicios "Bento" */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Nuestros Pilares</h2>
            <p className="text-lg text-slate-500 max-w-md">Ecosistema digital pensado para la comunidad universitaria de la Unimet.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard 
            primary
            title="Gestión de Becas"
            description="Administra tu solicitud de ayuda económica de forma transparente y digital. Consulta estados y requisitos en tiempo real."
            icon={GraduationCap}
            onClick={() => navigate("/postulaciones-becas")}
          />
          <ServiceCard 
            title="Orientación Vocacional"
            description="¿Aún no decides tu camino? Realiza nuestras pruebas psicométricas diseñadas por expertos de la universidad."
            icon={Compass}
            onClick={() => navigate("/vocational")}
          />
        </div>
      </section>

      {/* Footer Estilo Corporativo */}
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
            © 2025 Universidad Metropolitana | Dirección de Bienestar y Desarrollo Estudiantil
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;