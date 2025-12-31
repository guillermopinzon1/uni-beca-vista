import React, { useState } from 'react';
import { useLLM } from '@/hooks/useLLM';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, GraduationCap, TrendingUp, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerfilEstudiante {
  intereses?: string[];
  habilidades?: string[];
  resultadosTest?: Record<string, any>;
  preferencias?: Record<string, any>;
}

interface Carrera {
  nombre: string;
  descripcion?: string;
}

interface Recomendacion {
  carrera: string;
  puntuacion: number;
  razones: string[];
  match: 'alto' | 'medio' | 'bajo';
}

interface RecomendacionesResponse {
  carrerasRecomendadas?: Recomendacion[];
  analisis?: string;
  sugerencias?: string[];
  respuesta?: string;
}

const RecomendacionesCarrera: React.FC<{
  perfilEstudiante: PerfilEstudiante;
  carrerasDisponibles: Carrera[];
}> = ({ perfilEstudiante, carrerasDisponibles }) => {
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionesResponse | null>(null);
  const { generarRecomendaciones, loading, error } = useLLM();
  const { toast } = useToast();

  const handleGenerarRecomendaciones = async () => {
    try {
      const resultado = await generarRecomendaciones(perfilEstudiante, carrerasDisponibles);

      // Si viene como texto, intentar parsear
      if (typeof resultado === 'string') {
        try {
          const jsonMatch = resultado.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setRecomendaciones(parsed);
          } else {
            setRecomendaciones({
              analisis: resultado,
              sugerencias: []
            });
          }
        } catch {
          setRecomendaciones({
            analisis: resultado,
            sugerencias: []
          });
        }
      } else {
        setRecomendaciones(resultado);
      }

      toast({
        title: 'Recomendaciones generadas',
        description: 'Se han generado recomendaciones personalizadas para ti'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al generar recomendaciones',
        variant: 'destructive'
      });
    }
  };

  const getMatchColor = (match: string) => {
    switch (match) {
      case 'alto':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bajo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Recomendaciones de Carrera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerarRecomendaciones}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando recomendaciones...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Generar Recomendaciones
              </>
            )}
          </Button>
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {recomendaciones && (
        <div className="space-y-4">
          {/* Análisis General */}
          {recomendaciones.analisis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análisis de tu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{recomendaciones.analisis}</p>
              </CardContent>
            </Card>
          )}

          {/* Respuesta simple si no hay estructura */}
          {recomendaciones.respuesta && !recomendaciones.carrerasRecomendadas && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm whitespace-pre-wrap">{recomendaciones.respuesta}</p>
              </CardContent>
            </Card>
          )}

          {/* Carreras Recomendadas */}
          {recomendaciones.carrerasRecomendadas && recomendaciones.carrerasRecomendadas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carreras Recomendadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recomendaciones.carrerasRecomendadas.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{rec.carrera}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getMatchColor(rec.match)}`}>
                          Match {rec.match}
                        </span>
                        <span className="text-sm font-medium">
                          {rec.puntuacion}%
                        </span>
                      </div>
                    </div>

                    {rec.razones && rec.razones.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Razones:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {rec.razones.map((razon, idx) => (
                            <li key={idx}>{razon}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Sugerencias */}
          {recomendaciones.sugerencias && recomendaciones.sugerencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Sugerencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  {recomendaciones.sugerencias.map((sugerencia, idx) => (
                    <li key={idx}>{sugerencia}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RecomendacionesCarrera;