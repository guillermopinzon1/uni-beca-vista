import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, LogIn } from "lucide-react";
import { API_BASE } from "@/lib/api/config";

export type CareerDetailData = {
  id: number;
  code?: string | null;
  name: string;
  faculty: string;
  area?: string | null;
  description?: string | null;
  profile?: string | null;
  job_field?: string | null;
  duration?: string | null;
  modality?: string | null;
};

/** Normaliza objeto de carrera: backend puede devolver { data } o directo, y claves en inglés o español */
function normalizeCareer(raw: Record<string, unknown>): CareerDetailData {
  const id = Number(raw.id ?? raw.ID ?? 0);
  const name = String(raw.name ?? raw.nombre ?? raw.title ?? "");
  const faculty = String(raw.faculty ?? raw.facultad ?? "");
  const area = raw.area ?? raw.área ?? raw.area_academica ?? null;
  const code = raw.code ?? raw.codigo ?? raw.código ?? null;
  const description = raw.description ?? raw.descripcion ?? null;
  const profile = raw.profile ?? raw.perfil ?? null;
  const job_field = raw.job_field ?? raw.campo_laboral ?? raw.campoLaboral ?? null;
  const duration = raw.duration ?? raw.duración ?? raw.duracion ?? null;
  const modality = raw.modality ?? raw.modalidad ?? null;
  return {
    id: Number.isNaN(id) ? 0 : id,
    name: name || "Sin nombre",
    faculty: faculty || "—",
    area: area != null ? String(area) : null,
    code: code != null ? String(code) : null,
    description: description != null ? String(description) : null,
    profile: profile != null ? String(profile) : null,
    job_field: job_field != null ? String(job_field) : null,
    duration: duration != null ? String(duration) : null,
    modality: modality != null ? String(modality) : null,
  };
}

async function fetchCareer(id: string): Promise<CareerDetailData> {
  const res = await fetch(`${API_BASE}/careers/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} cargando carrera`);
  }
  const json = (await res.json()) as Record<string, unknown>;
  const raw = (json?.data ?? json) as Record<string, unknown>;
  if (!raw || typeof raw !== "object") throw new Error("Respuesta inválida del servidor");
  return normalizeCareer(raw);
}

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError("");

      try {
        const data = await fetchCareer(id);
        if (!cancelled) setCareer(data);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error cargando carrera");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {/* Encabezado de la app: logo a home, Entrar y Registrarse */}
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

      {/* Contenido: padding-top para no quedar bajo el header */}
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Navegación */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/vocational-explorer" className="gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  Ver carreras
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/vocational" className="text-slate-600">
                  Orientación vocacional
                </Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-600">Cargando…</div>
          ) : error ? (
            <div className="py-8 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3">{error}</div>
          ) : career ? (
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-medium">{career.faculty}</Badge>
                  {career.area ? <Badge variant="outline">{career.area}</Badge> : null}
                  {career.code ? <Badge variant="outline">{career.code}</Badge> : null}
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900">{career.name}</CardTitle>
                <div className="text-sm text-slate-500">
                  {career.duration ? `Duración: ${career.duration}` : null}
                  {career.duration && career.modality ? " · " : null}
                  {career.modality ? `Modalidad: ${career.modality}` : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-4">
                <section className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Descripción</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {career.description || "—"}
                  </p>
                </section>
                <section className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Perfil del egresado</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {career.profile || "—"}
                  </p>
                </section>
                <section className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Campo laboral</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {career.job_field || "—"}
                  </p>
                </section>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}