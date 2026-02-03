import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, TrendingUp, BookOpen, Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { prepararDatosDimensiones } from "@/lib/riasec";
import { obtenerPerfilVocacional, PerfilVocacionalResponse, ResultadoVocacional } from "@/lib/api/orientacionVocacional";

const PerfilVocacional = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [perfil, setPerfil] = useState<PerfilVocacionalResponse['data'] | null>(null);
  const [cargando, setCargando] = useState(true);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await obtenerPerfilVocacional(accessToken);
      setPerfil(respuesta.data);
    } catch (error: any) {
      console.error('Error al cargar perfil:', error);
      toast({
        title: "Error",
        description: error.message || "Error al cargar el perfil vocacional",
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const datosGrafico = prepararDatosDimensiones(
    perfil?.resultadoActual?.puntuacionesFinales as Record<string, number> | undefined
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu perfil vocacional...</p>
        </div>
      </div>
    );
  }

  if (!perfil || !perfil.resultadoActual) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay perfil disponible</h2>
              <p className="text-gray-600 mb-6">Completa un test para ver tu perfil vocacional</p>
              <Button onClick={() => navigate('/orientacion/seleccionar-test')}>
                Realizar Test
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const { resultadoActual } = perfil;
  // Soporta: resultadoActual.resultado (anidado) o resultadoActual = resultado directo del back
  const resultado: ResultadoVocacional | null = resultadoActual?.resultado
    ? resultadoActual.resultado
    : resultadoActual && ('perfilDominante' in resultadoActual || 'codigoHolland' in resultadoActual || (resultadoActual as any).perfil_dominante)
      ? (resultadoActual as unknown as ResultadoVocacional)
      : null;

  if (!resultado || (!(resultado as any).perfilDominante && !(resultado as any).perfil_dominante)) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay datos disponibles</h2>
              <p className="text-gray-600 mb-6">El perfil vocacional no tiene datos de resultado. Completa un test para ver tu perfil.</p>
              <Button onClick={() => navigate('/orientacion/seleccionar-test')}>
                Realizar Test
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  // Normalizar nombres de propiedades
  const perfilDominante = resultado.perfilDominante || (resultado as any).perfil_dominante || 'No disponible';
  const perfilSecundario = resultado.perfilSecundario || (resultado as any).perfil_secundario;
  const codigoHolland = resultado.codigoHolland || (resultado as any).codigo_holland || 'N/A';
  const nivelConfianza = resultado.nivelConfianza || (resultado as any).nivel_confianza || 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8" />
                  <h2 className="text-3xl font-bold">Tu Perfil Vocacional Consolidado</h2>
                </div>
                <div className="text-right">
                  <p className="text-orange-50 text-sm">Total de tests: {Array.isArray(perfil.historial) ? perfil.historial.length : 0}</p>
                  {(resultadoActual as any)?.sesionId && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/orientacion/resultados/${(resultadoActual as any).sesionId}`)}
                      className="mt-2"
                    >
                      Ver Último Test
                    </Button>
                  )}
                </div>
              </div>
              <h3 className="text-4xl font-black mb-2">{perfilDominante}</h3>
              <div className="flex items-center gap-4">
                {perfilSecundario && (
                  <p className="text-orange-50 text-lg">
                    Perfil Secundario: <span className="font-bold">{perfilSecundario}</span>
                  </p>
                )}
                <p className="text-orange-50 text-lg">
                  Código Holland: <span className="font-bold text-2xl">{codigoHolland}</span>
                </p>
                <p className="text-orange-50 text-lg">
                  Nivel de confianza: <span className="font-bold">{Math.round(nivelConfianza)}%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {datosGrafico.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Puntuaciones por Dimensión (RIASEC)
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Cada barra representa tu puntuación en una dimensión del modelo Holland. Pasa el cursor sobre una barra o revisa la tabla para ver qué significa cada una.
                </p>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={datosGrafico} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="nombreCompleto"
                      angle={-35}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 13, fill: "#475569" }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, (dataMax: number) => Math.max(100, Math.ceil((dataMax || 0) * 1.1))]}
                      tick={{ fontSize: 12 }}
                      label={{ value: "Puntuación", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const p = payload[0].payload as { nombreCompleto: string; puntuacion: number; descripcion: string };
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 max-w-xs">
                            <p className="font-bold text-slate-900 mb-1">{p.nombreCompleto}</p>
                            <p className="text-orange-600 font-semibold mb-2">Puntuación: {p.puntuacion}</p>
                            <p className="text-slate-600 text-sm">{p.descripcion}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} name="Puntuación" />
                  </BarChart>
                </ResponsiveContainer>
                {/* Tabla detalle dimensiones */}
                <div className="mt-6 rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Dimensión</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700 w-24">Puntuación</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Qué significa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosGrafico.map((d, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{d.nombreCompleto}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[2.5rem] py-1 px-2 rounded-md bg-orange-100 text-orange-800 font-semibold">
                              {d.puntuacion}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{d.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {resultado.recomendacionesCarreras && resultado.recomendacionesCarreras.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Carreras Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultado.recomendacionesCarreras.map((carrera, index) => (
                    <div 
                      key={carrera.id ?? index}
                      className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{carrera.name}</h4>
                      {((carrera as any).faculty ?? (carrera as any).facultad ?? (carrera as any).area) && (
                        <p className="text-orange-600 text-sm font-medium mb-2">
                          {[(carrera as any).faculty ?? (carrera as any).facultad, (carrera as any).area].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">{carrera.razon}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {resultado.perfilVocacional && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Perfil Vocacional
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {resultado.perfilVocacional.fortalezas && resultado.perfilVocacional.fortalezas.length > 0 && (
                    <div>
                      <h4 className="font-bold text-green-700 mb-3">Fortalezas</h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.fortalezas.map((fortaleza, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {fortaleza}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.perfilVocacional.debilidades && resultado.perfilVocacional.debilidades.length > 0 && (
                    <div>
                      <h4 className="font-bold text-red-700 mb-3">Debilidades</h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.debilidades.map((debilidad, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {debilidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.perfilVocacional.oportunidades && resultado.perfilVocacional.oportunidades.length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3">Oportunidades</h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.oportunidades.map((oportunidad, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {oportunidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/orientacion/historial')}
              variant="outline"
              className="px-8 h-12 font-bold"
            >
              Ver Historial
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfilVocacional;