import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

type CareerDetail = {
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

async function fetchCareer(id: string) {
  const base = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
  const res = await fetch(`${base}/api/careers/${id}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status} cargando carrera`);
  }
  return (await res.json()) as CareerDetail;
}

export default function CareerDetailPage() {
  const { id } = useParams();
  const [career, setCareer] = useState<CareerDetail | null>(null);
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
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link to="/vocational-explorer">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>

        {loading ? <div className="text-slate-600">Cargando…</div> : null}
        {error ? <div className="text-red-600">{error}</div> : null}

        {career ? (
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{career.faculty}</Badge>
                {career.area ? <Badge variant="outline">{career.area}</Badge> : null}
                {career.code ? <Badge variant="outline">{career.code}</Badge> : null}
              </div>

              <CardTitle className="text-2xl">{career.name}</CardTitle>

              <div className="text-sm text-muted-foreground">
                {career.duration ? `Duración: ${career.duration}` : null}
                {career.duration && career.modality ? " · " : null}
                {career.modality ? `Modalidad: ${career.modality}` : null}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-semibold">Descripción</h3>
                <p className="text-sm whitespace-pre-wrap text-slate-700">
                  {career.description || "—"}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-semibold">Perfil del egresado</h3>
                <p className="text-sm whitespace-pre-wrap text-slate-700">
                  {career.profile || "—"}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-semibold">Campo laboral</h3>
                <p className="text-sm whitespace-pre-wrap text-slate-700">
                  {career.job_field || "—"}
                </p>
              </section>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}