import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, TrendingUp, BookOpen, Lightbulb, RefreshCw 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  obtenerPerfilVocacional, 
  generarRecomendacionesContinuas,
  PerfilVocacionalResponse 
} from "@/lib/api/orientacionVocacional";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PerfilVocacional = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [perfil, setPerfil] = useState<PerfilVocacionalResponse['data'] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [contextoAdicional, setContextoAdicional] = useState("");
  const [dialogAbierto, setDialogAbierto] = useState(false);

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

  const handleGenerarRecomendaciones = async () => {
    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setActualizando(true);

    try {
      const respuesta = await generarRecomendacionesContinuas(accessToken, contextoAdicional);
      
      if (perfil) {
        setPerfil({
          ...perfil,
          recomendaciones_carreras: respuesta.data.recomendaciones_carreras,
          recomendaciones_actividades: respuesta.data.recomendaciones_actividades,
        });
      }
      
      setContextoAdicional("");
      setDialogAbierto(false);
      
      toast({
        title: "Recomendaciones actualizadas",
        description: "Tus recomendaciones han sido actualizadas con éxito",
      });
    } catch (error: any) {
      console.error('Error al generar recomendaciones:', error);
      toast({
        title: "Error",
        description: error.message || "Error al generar recomendaciones",
        variant: "destructive",
      });
    } finally {
      setActualizando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const datosGrafico = perfil?.puntuaciones 
    ? Object.entries(perfil.puntuaciones).map(([dimension, puntuacion]) => ({
        dimension,
        puntuacion: Math.round(puntuacion * 100),
      }))
    : [];

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

  if (!perfil) {
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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/orientacion/historial")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Mi Perfil Vocacional
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
          <span className="font-bold text-gray-900">Mi Perfil Vocacional</span>
        </div>
      </div>

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
                  <p className="text-orange-50 text-sm">Total de tests: {perfil.total_sesiones}</p>
                  {perfil.ultima_sesion_id && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/orientacion/resultados/${perfil.ultima_sesion_id}`)}
                      className="mt-2"
                    >
                      Ver Último Test
                    </Button>
                  )}
                </div>
              </div>
              <h3 className="text-4xl font-black mb-2">{perfil.perfil_dominante}</h3>
              <p className="text-orange-50 text-lg mb-4">
                Nivel de confianza: <span className="font-bold">{Math.round(perfil.nivel_confianza * 100)}%</span>
              </p>
              {perfil.perfiles_secundarios && perfil.perfiles_secundarios.length > 0 && (
                <div className="mt-4">
                  <p className="text-orange-50 mb-2">Perfiles Secundarios:</p>
                  <div className="flex flex-wrap gap-2">
                    {perfil.perfiles_secundarios.map((perfilSec, index) => (
                      <span 
                        key={index}
                        className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {perfilSec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {datosGrafico.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Puntuaciones por Dimensión
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="dimension" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Puntuación']}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {perfil.recomendaciones_carreras && perfil.recomendaciones_carreras.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                    Carreras Recomendadas
                  </h3>
                  <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar Recomendaciones
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Actualizar Recomendaciones</DialogTitle>
                        <DialogDescription>
                          Comparte información adicional sobre tus intereses, actividades recientes o cambios en tus preferencias para obtener recomendaciones más precisas.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="contexto">Información adicional (opcional)</Label>
                          <Textarea
                            id="contexto"
                            placeholder="Ej: He estado interesado en programación, participé en un taller de diseño, etc."
                            value={contextoAdicional}
                            onChange={(e) => setContextoAdicional(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDialogAbierto(false);
                            setContextoAdicional("");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleGenerarRecomendaciones}
                          disabled={actualizando}
                          className="bg-[#F37021] hover:bg-orange-600"
                        >
                          {actualizando ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Actualizando...
                            </>
                          ) : (
                            "Actualizar"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {perfil.recomendaciones_carreras.map((carrera, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900">{carrera.nombre}</h4>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                          {Math.round(carrera.match_score * 100)}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{carrera.descripcion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {perfil.recomendaciones_actividades && perfil.recomendaciones_actividades.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                  Actividades Recomendadas
                </h3>
                <ul className="space-y-3">
                  {perfil.recomendaciones_actividades.map((actividad, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{actividad}</span>
                    </li>
                  ))}
                </ul>
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
            <Button
              onClick={() => navigate('/orientacion/seleccionar-test')}
              className="bg-[#F37021] hover:bg-orange-600 text-white px-8 h-12 font-bold"
            >
              Realizar Nuevo Test
            </Button>
          </div>
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

export default PerfilVocacional;
