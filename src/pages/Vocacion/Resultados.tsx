import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, TrendingUp, BookOpen, Lightbulb, Target, CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { obtenerResultados, ResultadosResponse } from "@/lib/api/orientacionVocacional";

const Resultados = () => {
  const navigate = useNavigate();
  const { sesionId: sesionIdParam } = useParams();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [resultados, setResultados] = useState<ResultadosResponse['data'] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    const cargarResultados = async () => {
      if (!accessToken) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const sesionId = sesionIdParam || localStorage.getItem('sesionId');
      if (!sesionId) {
        toast({
          title: "Error",
          description: "No se encontró la sesión. Por favor inicia un nuevo test.",
          variant: "destructive",
        });
        navigate('/orientacion/seleccionar-test');
        return;
      }

      setCargando(true);
      setError(null);

      try {
        // Intentar múltiples veces si los resultados no están listos
        let respuesta: any = null;
        let intentos = 0;
        const maxIntentos = 5;
        
        while (intentos < maxIntentos) {
          // Esperar antes de cada intento (más tiempo en los primeros intentos)
          if (intentos > 0) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          
          try {
            respuesta = await obtenerResultados(accessToken, sesionId);
            console.log(`📊 Intento ${intentos + 1} - Respuesta completa:`, JSON.stringify(respuesta, null, 2));
            console.log('📊 respuesta.data:', respuesta.data);
            console.log('📊 respuesta.data.resultado:', respuesta.data?.resultado);
            console.log('📊 Tipo de respuesta.data:', typeof respuesta.data);
            
            // Verificar diferentes estructuras posibles
            if (respuesta.data) {
              // Estructura esperada: respuesta.data.resultado (con perfilVocacional, planDesarrollo, etc.)
              if (respuesta.data.resultado) {
                console.log('✅ Resultados encontrados en respuesta.data.resultado');
                console.log('📊 perfilVocacional:', respuesta.data.resultado.perfilVocacional);
                console.log('📊 planDesarrollo:', respuesta.data.resultado.planDesarrollo);
                console.log('📊 areasDesarrollo:', respuesta.data.resultado.areasDesarrollo);
                setResultados(respuesta.data);
                return; // Salir del loop si encontramos los resultados
              }
              // Estructura alternativa: respuesta.data puede ser el resultado directamente
              else if (respuesta.data.perfilDominante || respuesta.data.codigoHolland) {
                console.log('✅ Resultados encontrados directamente en respuesta.data');
                console.log('📊 perfilVocacional:', respuesta.data.perfilVocacional);
                console.log('📊 planDesarrollo:', respuesta.data.planDesarrollo);
                console.log('📊 areasDesarrollo:', respuesta.data.areasDesarrollo);
                // Reestructurar para que coincida con la interfaz esperada
                setResultados({
                  sesionId: respuesta.data.sesionId || sesionId,
                  resultado: respuesta.data,
                  puntuacionesFinales: respuesta.data.puntuacionesFinales || respuesta.data.puntuaciones || {},
                });
                return;
              }
            }
            
            // Si llegamos aquí, los resultados no están listos
            console.log(`⚠️ Intento ${intentos + 1}: Los resultados aún no están disponibles`);
            intentos++;
            
          } catch (intentoError: any) {
            console.error(`❌ Error en intento ${intentos + 1}:`, intentoError);
            // Si es un error 404 o similar, no tiene sentido seguir intentando
            if (intentoError.status === 404) {
              throw intentoError;
            }
            intentos++;
          }
        }
        
        // Si llegamos aquí, agotamos los intentos
        throw new Error('Los resultados están siendo procesados. Por favor espera unos segundos y recarga la página, o intenta verlos desde el historial.');
        
      } catch (error: any) {
        console.error('❌ Error final al cargar resultados:', error);
        console.error('❌ Stack:', error.stack);
        const mensajeError = error.message || "Error al cargar resultados";
        setError(mensajeError);
        toast({
          title: "Error",
          description: mensajeError,
          variant: "destructive",
        });
      } finally {
        setCargando(false);
      }
    };

    cargarResultados();
  }, [accessToken, sesionIdParam, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const datosGrafico = resultados?.puntuacionesFinales 
    ? Object.entries(resultados.puntuacionesFinales).map(([dimension, puntuacion]) => ({
        dimension,
        puntuacion: Math.round(puntuacion),
      }))
    : [];

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Generando tus resultados...</p>
        </div>
      </div>
    );
  }

  // Verificar si tenemos resultados válidos
  const tieneResultados = resultados && (
    resultados.resultado || 
    (resultados as any).perfilDominante || 
    (resultados as any).codigoHolland
  );

  if (error || !tieneResultados) {
    // Si hay resultados pero no tienen la estructura esperada, intentar mostrar lo que hay
    if (resultados && !resultados.resultado) {
      console.warn('⚠️ Resultados sin estructura esperada:', resultados);
    }
    return (
      <div className="w-full">
        <main className="w-full">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || "No se pudieron cargar los resultados"}</p>
              <Button onClick={() => navigate('/orientacion/historial')}>
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Manejar diferentes estructuras de respuesta
  const resultado = resultados.resultado || resultados as any;
  
  // Validar que tenemos los datos mínimos necesarios
  if (!resultado || (!resultado.perfilDominante && !(resultado as any).perfil_dominante)) {
    console.error('❌ No se encontraron datos de resultado válidos');
    console.error('❌ Estructura recibida:', JSON.stringify(resultados, null, 2));
    setError('Los resultados no tienen la estructura esperada. Por favor contacta al administrador.');
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">Los resultados no tienen la estructura esperada.</p>
              <p className="text-gray-500 text-sm mb-6">Revisa la consola del navegador para más detalles.</p>
              <Button onClick={() => navigate('/orientacion/historial')}>
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  // Normalizar nombres de propiedades (por si el backend usa snake_case)
  const perfilDominante = resultado.perfilDominante || (resultado as any).perfil_dominante || 'No disponible';
  const perfilSecundario = resultado.perfilSecundario || (resultado as any).perfil_secundario;
  const recomendacionesCarreras = resultado.recomendacionesCarreras ?? (resultado as any).recomendaciones_carreras ?? [];
  const codigoHolland = resultado.codigoHolland || (resultado as any).codigo_holland || 'N/A';
  const nivelConfianza = resultado.nivelConfianza || (resultado as any).nivel_confianza || 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Perfil Dominante */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Tu Perfil Vocacional</h2>
              </div>
              <div className="mb-4">
                <h3 className="text-4xl font-black mb-2">{perfilDominante}</h3>
                {perfilSecundario && (
                  <p className="text-orange-50 text-lg">
                    Perfil Secundario: <span className="font-bold">{perfilSecundario}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-orange-50 text-lg">
                  Código Holland: <span className="font-bold text-2xl">{codigoHolland}</span>
                </p>
                <p className="text-orange-50 text-lg">
                  Nivel de confianza: <span className="font-bold">{Math.round(nivelConfianza)}%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Puntuaciones */}
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
                      formatter={(value: number) => [`${value}`, 'Puntuación']}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recomendaciones de Carreras */}
          {recomendacionesCarreras.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Carreras Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recomendacionesCarreras.map((carrera: any, index: number) => {
                    const facultad = carrera.faculty ?? carrera.facultad ?? "";
                    const area = carrera.area ?? carrera.área ?? "";
                    const facultadArea = [facultad, area].filter(Boolean).join(" · ") || "—";
                    return (
                    <div 
                      key={carrera.id ?? index}
                      className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{carrera.name}</h4>
                      <p className="text-orange-600 text-sm font-medium mb-2">
                        {facultadArea}
                      </p>
                      <p className="text-gray-600 text-sm">{carrera.razon}</p>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Perfil Vocacional */}
          {(() => {
            const perfilVoc = resultado.perfilVocacional || (resultado as any).perfil_vocacional || {};
            const fortalezas = perfilVoc.fortalezas || perfilVoc.fortaleza || [];
            const debilidades = perfilVoc.debilidades || perfilVoc.debilidad || [];
            const oportunidades = perfilVoc.oportunidades || perfilVoc.oportunidad || [];
            const tieneDatos = fortalezas.length > 0 || debilidades.length > 0 || oportunidades.length > 0;
            
            // Mostrar la sección si existe el objeto (aunque esté vacío) o si tiene datos
            if (!resultado.perfilVocacional && !(resultado as any).perfil_vocacional && !tieneDatos) {
              return null; // No mostrar si no existe y no tiene datos
            }
            
            return (
              <Card className="border-none shadow-sm rounded-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-orange-500" />
                    Perfil Vocacional
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {fortalezas.length > 0 && (
                      <div>
                        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          Fortalezas
                        </h4>
                        <ul className="space-y-2">
                          {fortalezas.map((fortaleza: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {fortaleza}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {debilidades.length > 0 && (
                      <div>
                        <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Debilidades
                        </h4>
                        <ul className="space-y-2">
                          {debilidades.map((debilidad: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {debilidad}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {oportunidades.length > 0 && (
                      <div>
                        <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Oportunidades
                        </h4>
                        <ul className="space-y-2">
                          {oportunidades.map((oportunidad: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {oportunidad}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {fortalezas.length === 0 && debilidades.length === 0 && oportunidades.length === 0 && (
                      <div className="col-span-3 text-center text-gray-500 py-8">
                        No hay información de perfil vocacional disponible.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Áreas de Desarrollo */}
          {resultado.areasDesarrollo && resultado.areasDesarrollo.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Áreas de Desarrollo
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {resultado.areasDesarrollo.map((area, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sugerencias de Acompañamiento */}
          {resultado.sugerenciasAcompanamiento && resultado.sugerenciasAcompanamiento.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                  Sugerencias de Acompañamiento
                </h3>
                <ul className="space-y-3">
                  {resultado.sugerenciasAcompanamiento.map((sugerencia, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{sugerencia}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Plan de Desarrollo */}
          {(() => {
            const planDes = resultado.planDesarrollo || (resultado as any).plan_desarrollo || {};
            const cortoPlazo = planDes.cortoPlazo || planDes.corto_plazo || [];
            const medianoPlazo = planDes.medianoPlazo || planDes.mediano_plazo || [];
            const largoPlazo = planDes.largoPlazo || planDes.largo_plazo || [];
            const tieneDatos = cortoPlazo.length > 0 || medianoPlazo.length > 0 || largoPlazo.length > 0;
            
            // Mostrar la sección si existe el objeto (aunque esté vacío) o si tiene datos
            if (!resultado.planDesarrollo && !(resultado as any).plan_desarrollo && !tieneDatos) {
              return null; // No mostrar si no existe y no tiene datos
            }
            
            return (
              <Card className="border-none shadow-sm rounded-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-orange-500" />
                    Plan de Desarrollo
                  </h3>
                  <div className="space-y-6">
                    {cortoPlazo.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Corto Plazo</h4>
                        <ul className="space-y-2">
                          {cortoPlazo.map((item: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medianoPlazo.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Mediano Plazo</h4>
                        <ul className="space-y-2">
                          {medianoPlazo.map((item: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {largoPlazo.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Largo Plazo</h4>
                        <ul className="space-y-2">
                          {largoPlazo.map((item: string, index: number) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {cortoPlazo.length === 0 && medianoPlazo.length === 0 && largoPlazo.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        No hay plan de desarrollo disponible.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/orientacion/perfil')}
              className="bg-[#F37021] hover:bg-orange-600 text-white px-8 h-12 font-bold"
            >
              Ver Mi Perfil Completo
            </Button>
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

export default Resultados;
