import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Building2,
  ChevronRight,
  Clock,
  FlaskConical,
  GraduationCap,
  LogIn,
  MapPin,
  Palette,
  Search,
  UserPlus,
} from "lucide-react";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

type Career = {
  id: number;
  code?: string | null;
  name: string;
  faculty: string;
  area?: string | null;
  description?: string | null;
  // Si el backend los agrega luego, ya quedan soportados:
  duration?: string | null;
  modality?: string | null;
};

type CareersListResponse = {
  data: Career[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function getVisuals(career: Career) {
  const bucket = `${career.faculty} ${career.area ?? ""}`.toLowerCase();

  if (bucket.includes("ingenier")) {
    return { color: "bg-blue-500", icon: <Building2 className="w-6 h-6" /> };
  }
  if (bucket.includes("quím") || bucket.includes("quim") || bucket.includes("ciencia") || bucket.includes("laboratorio")) {
    return { color: "bg-teal-500", icon: <FlaskConical className="w-6 h-6" /> };
  }
  if (bucket.includes("diseñ") || bucket.includes("disen") || bucket.includes("arte")) {
    return { color: "bg-pink-500", icon: <Palette className="w-6 h-6" /> };
  }

  return { color: "bg-purple-500", icon: <GraduationCap className="w-6 h-6" /> };
}

async function fetchCareers(params: {
  q?: string;
  faculty?: string;
  area?: string;
  page?: number;
  limit?: number;
}) {
  const base = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.faculty) qs.set("faculty", params.faculty);
  if (params.area) qs.set("area", params.area);
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 50));

  const res = await fetch(`${base}/careers?${qs.toString()}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} cargando carreras`);
  }
  return (await res.json()) as CareersListResponse;
}

const VocationalExplorer = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Si más adelante quieres paginación real desde backend:
  // const [page, setPage] = useState(1);
  // const limit = 50;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // MVP: traemos todo y filtramos por categoría en frontend
        // (cuando el backend soporte filtros, puedes pasar faculty/area directamente)
        const result = await fetchCareers({
          q: searchQuery.trim() ? searchQuery.trim() : undefined,
          page: 1,
          limit: 200,
        });

        if (!cancelled) {
          setCareers(result.data ?? []);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          if (e instanceof Error) {
            setError(e.message);
          } else{
          setError("Error cargando carreras");
        }
      }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // pequeño debounce para no spamear el backend al escribir
    const t = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchQuery]);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(careers.map((c) => c.faculty).filter(Boolean)));
    uniq.sort((a, b) => a.localeCompare(b));
    return ["Todas", ...uniq];
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const matchesCategory = selectedCategory === "Todas" || career.faculty === selectedCategory;
      const text = `${career.name} ${career.description ?? ""}`.toLowerCase();
      const matchesSearch = !searchQuery.trim() || text.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [careers, selectedCategory, searchQuery]);

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

      {/* Hero Header */}
      <div className="relative bg-slate-900 py-20 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${vocationalBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="text-blue-300 border-blue-500/30 mb-4 px-4 py-1">
              Catálogo Académico 2025
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Explora tu Futuro</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
              Descubre nuestra oferta académica diseñada para formar a los líderes del mañana.
              Filtra por facultad y encuentra la carrera perfecta para ti.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Buscar carrera (ej. Ingeniería, Psicología...)"
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-full focus:bg-white/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 ${
                  selectedCategory === cat
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Status */}
          {error ? <div className="text-center text-red-600 mb-6">{error}</div> : null}
          {loading ? <div className="text-center text-slate-500 mb-6">Cargando carreras...</div> : null}

          {/* Careers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((career, index) => {
                const visuals = getVisuals(career);
                const duration = career.duration ?? "—";
                const modality = career.modality ?? "—";

                return (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-slate-200 overflow-hidden flex flex-col">
                      <div className={`h-2 w-full ${visuals.color}`} />
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                            {career.faculty}
                          </Badge>
                          <div className={`p-2 rounded-lg ${visuals.color} bg-opacity-10 text-opacity-100`}>
                            <div className="text-slate-700">{visuals.icon}</div>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {career.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                          {career.description ?? "Sin descripción."}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5" /> {duration}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5" /> {modality}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/50">
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:pr-2 transition-all"
                          onClick={() => navigate(`/career/${career.id}`)}
                        >
                          Ver detalle
                          <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No se encontraron carreras</h3>
                <p className="text-slate-500">Intenta ajustar tu búsqueda o filtros.</p>
                <Button
                  variant="link"
                  className="mt-2 text-blue-600"
                  onClick={() => {
                    setSelectedCategory("Todas");
                    setSearchQuery("");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-orange/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Universidad Metropolitana</span>
          </div>
          <p className="text-muted-foreground">© 2025 Universidad Metropolitana. Sistema Multiplataforma.</p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalExplorer;
