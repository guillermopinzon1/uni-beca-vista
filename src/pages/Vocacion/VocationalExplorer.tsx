import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  ChevronRight,
  Clock,
  FlaskConical,
  GraduationCap,
  LogIn,
  MapPin,
  Palette,
  Search,
} from "lucide-react";
import { API_BASE } from "@/lib/api/config";

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
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.faculty) qs.set("faculty", params.faculty);
  if (params.area) qs.set("area", params.area);
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 50));

  const res = await fetch(`${API_BASE}/careers?${qs.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} cargando carreras`);
  }
  const json = (await res.json()) as CareersListResponse | { success?: boolean; data?: { items?: Career[] } };
  // Backend puede devolver { data: Career[] } o { data: { items: Career[] } }
  if (Array.isArray((json as CareersListResponse).data)) {
    return json as CareersListResponse;
  }
  const wrapped = json as { data?: { items?: Career[] }; page?: number; limit?: number; total?: number; totalPages?: number };
  if (wrapped.data?.items) {
    return {
      data: wrapped.data.items,
      page: wrapped.page ?? 1,
      limit: wrapped.limit ?? 50,
      total: (wrapped as { total?: number }).total ?? wrapped.data.items.length,
      totalPages: (wrapped as { totalPages?: number }).totalPages ?? 1,
    } as CareersListResponse;
  }
  return { data: [], page: 1, limit: 50, total: 0, totalPages: 0 };
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
              Catálogo Académico
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Explora tu futuro
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Descubre nuestra oferta académica. Filtra por facultad y encuentra la carrera que mejor se adapte a ti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Barra flotante con búsqueda (estilo Home) */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <span className="text-slate-600 font-medium text-sm sm:text-base shrink-0">Buscar carrera</span>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Ej. Ingeniería, Psicología..."
                className="pl-12 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-6 ${
                  selectedCategory === cat
                    ? "bg-[#f37021] hover:bg-[#d65f1a]"
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
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-slate-200 overflow-hidden flex flex-col bg-white">
                      <div className={`h-1.5 w-full ${visuals.color}`} />
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                            {career.faculty}
                          </Badge>
                          <div className={`p-2 rounded-lg ${visuals.color} bg-opacity-10 text-opacity-100`}>
                            <div className="text-slate-700">{visuals.icon}</div>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-[#d65f1a] transition-colors">
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
                          className="w-full justify-between text-[#f37021] hover:text-[#d65f1a] hover:bg-orange-50 group-hover:pr-2 transition-all font-semibold"
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
                  className="mt-2 text-[#f37021] hover:text-[#d65f1a]"
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

export default VocationalExplorer;
