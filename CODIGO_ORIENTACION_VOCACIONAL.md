# Código del Sistema de Orientación Vocacional

Este documento contiene todo el código relacionado con el sistema de orientación vocacional que fue implementado en el frontend.

## Archivos incluidos

1. **SeleccionarTest.tsx** - Selección del tipo de test (Holland RIASEC o Kuder)
2. **Ronda1.tsx** - Primera ronda de preguntas
3. **Ronda2.tsx** - Segunda ronda de preguntas adaptativas
4. **Resultados.tsx** - Visualización de resultados del test
5. **PerfilVocacional.tsx** - Perfil vocacional consolidado del usuario
6. **Historial.tsx** - Historial de tests realizados
7. **orientacionVocacional.ts** - API service con todas las funciones y tipos

---

## 1. SeleccionarTest.tsx

```typescript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, BrainCircuit, 
  ChevronLeft, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { iniciarTest, TipoTest } from "@/lib/api/orientacionVocacional";

const SeleccionarTest = () => {
  const navigate = useNavigate();
  const { tokens, logout, user } = useAuth();
  const { toast } = useToast();
  const [tipoTest, setTipoTest] = useState<TipoTest | null>(null);
  const [cargando, setCargando] = useState(false);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  // Debug: Verificar información del usuario
  useEffect(() => {
    console.log('👤 Usuario actual:', user);
    console.log('👤 Rol del usuario:', user?.role);
    console.log('🔑 Token disponible:', !!accessToken);
  }, [user, accessToken]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleIniciarTest = async () => {
    if (!tipoTest) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona un tipo de test para continuar",
        variant: "destructive",
      });
      return;
    }

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

    // Debug: Verificar token
    console.log('🔑 Token disponible:', !!accessToken);
    console.log('🔑 Token (primeros 20 chars):', accessToken?.substring(0, 20));
    console.log('📝 Tipo de test seleccionado:', tipoTest);

    try {
      const respuesta = await iniciarTest(accessToken, tipoTest);
      console.log('✅ Test iniciado correctamente:', respuesta);
      
      // Guardar datos en localStorage
      localStorage.setItem('sesionId', respuesta.data.sesionId);
      localStorage.setItem('tipoTest', respuesta.data.tipoTest);
      localStorage.setItem('estadoSesion', respuesta.data.estado);
      localStorage.setItem('preguntasRonda1', JSON.stringify(respuesta.data.preguntas));
      
      toast({
        title: "Test iniciado",
        description: `Has comenzado el test ${tipoTest === 'Holland_RIASEC' ? 'Holland RIASEC' : 'Kuder'}`,
      });

      // Redirigir a Ronda 1
      navigate('/orientacion/ronda-1');
      
    } catch (error: any) {
      console.error('Error al iniciar test:', error);
      
      // Manejo específico de errores 401 y 403
      if (error.status === 401) {
        toast({
          title: "Sesión expirada",
          description: error.message || "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/login");
      } else if (error.status === 403) {
        toast({
          title: "Sin permisos",
          description: error.message || "No tienes permisos para realizar este test. Contacta al administrador.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Error al iniciar el test. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/modules")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Orientación Vocacional
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

      {/* BREADCRUMB */}
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
          <span className="font-bold text-gray-900">Seleccionar Test</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <BrainCircuit className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selecciona el Tipo de Test
            </h2>
            <p className="text-gray-500 text-lg">
              Elige el test que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Test Holland RIASEC */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Holland_RIASEC' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Holland_RIASEC')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Holland RIASEC
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 6 dimensiones de personalidad vocacional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Realista (R)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Investigador (I)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico (A)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social (S)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Emprendedor (E)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Convencional (C)
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Holland_RIASEC' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test Kuder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Kuder' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Kuder')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Kuder
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 10 áreas de interés profesional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Mecánico, Científico, Computacional
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico, Literario, Musical
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social, Administrativo, Al aire libre
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Kuder' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleIniciarTest}
              disabled={!tipoTest || cargando}
              className="bg-[#F37021] hover:bg-orange-600 text-white rounded-md px-10 h-12 font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Iniciando...
                </>
              ) : (
                "Comenzar Test"
              )}
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

export default SeleccionarTest;
```

---

## 2. Ronda1.tsx

**Ubicación:** `src/pages/Vocacion/Ronda1.tsx`  
**Líneas:** 597

El archivo completo está disponible en el repositorio. Contiene:
- Carga de preguntas desde localStorage
- Manejo de respuestas con tiempo de respuesta
- Cálculo de nivel de seguridad basado en tiempo
- Envío de respuestas al backend
- Manejo robusto de errores de sesión
- Verificación de estado de sesión antes de guardar
- Redirección automática a Ronda 2

---

## 3. Ronda2.tsx

**Ubicación:** `src/pages/Vocacion/Ronda2.tsx`  
**Líneas:** 549

El archivo completo está disponible en el repositorio. Contiene:
- Carga de preguntas desde localStorage o backend
- Sistema de reintentos para obtener preguntas
- Botón manual para cargar preguntas
- Manejo de respuestas similar a Ronda 1
- Finalización del test y redirección a resultados

---

## 4. Resultados.tsx

**Ubicación:** `src/pages/Vocacion/Resultados.tsx`  
**Líneas:** 385

El archivo completo está disponible en el repositorio. Contiene:
- Visualización de perfil dominante y perfiles secundarios
- Gráfico de barras con puntuaciones por dimensión (usando Recharts)
- Lista de carreras recomendadas con match scores
- Lista de actividades recomendadas
- Análisis LLM personalizado
- Discrepancias detectadas

---

## 5. PerfilVocacional.tsx

**Ubicación:** `src/pages/Vocacion/PerfilVocacional.tsx`  
**Líneas:** 416

El archivo completo está disponible en el repositorio. Contiene:
- Perfil vocacional consolidado del usuario
- Puntuaciones por dimensión
- Carreras recomendadas con opción de actualizar
- Actividades recomendadas
- Diálogo para actualizar recomendaciones con contexto adicional

---

## 6. Historial.tsx

**Ubicación:** `src/pages/Vocacion/Historial.tsx`  
**Líneas:** 279

El archivo completo está disponible en el repositorio. Contiene:
- Lista de todos los tests realizados
- Estado de cada test (completado, en ronda 1, en ronda 2)
- Fechas de inicio y fin
- Perfil dominante de cada test
- Navegación a resultados de tests completados

---

## 7. orientacionVocacional.ts (API Service)

**Ubicación:** `src/lib/api/orientacionVocacional.ts`  
**Líneas:** 490

### Interfaces principales:

```typescript
export type TipoTest = 'Holland_RIASEC' | 'Kuder';

export interface Pregunta {
  id: string;
  texto: string;
  opciones?: string[] | null;
  tipo?: string;
  instrucciones?: string | null;
  dimension?: string;
}

export interface RespuestaPregunta {
  preguntaId: string;
  respuesta: string | boolean;
  tiempoSegundos?: number;
  nivelSeguridad?: 'muy_seguro' | 'seguro' | 'indeciso' | 'muy_indeciso';
}
```

### Funciones API:

1. `iniciarTest(accessToken, tipoTest)` - Inicia un nuevo test
2. `guardarRespuestasRonda1(accessToken, sesionId, respuestas)` - Guarda respuestas de Ronda 1
3. `guardarRespuestasRonda2(accessToken, sesionId, respuestas)` - Guarda respuestas de Ronda 2
4. `obtenerSesion(accessToken, sesionId)` - Obtiene información de una sesión
5. `obtenerResultados(accessToken, sesionId)` - Obtiene resultados completos
6. `obtenerPerfilVocacional(accessToken)` - Obtiene perfil consolidado
7. `obtenerHistorial(accessToken)` - Obtiene historial de tests
8. `generarRecomendacionesContinuas(accessToken, contextoAdicional)` - Genera recomendaciones actualizadas
9. `analizarCambioCarrera(accessToken, carreraDestinoId, razones, preocupaciones)` - Analiza cambio de carrera

El archivo completo está disponible en el repositorio.

---

## Rutas en App.tsx

Las siguientes rutas fueron agregadas al archivo `App.tsx`:

```typescript
// Imports
import SeleccionarTest from "./pages/Vocacion/SeleccionarTest";
import Ronda1 from "./pages/Vocacion/Ronda1";
import Ronda2 from "./pages/Vocacion/Ronda2";
import Resultados from "./pages/Vocacion/Resultados";
import PerfilVocacional from "./pages/Vocacion/PerfilVocacional";
import Historial from "./pages/Vocacion/Historial";

// Dentro de <Routes>:
<Route path="/orientacion/seleccionar-test" element={<SeleccionarTest/>}/>
<Route path="/orientacion/ronda-1" element={<Ronda1/>}/>
<Route path="/orientacion/ronda-2" element={<Ronda2/>}/>
<Route path="/orientacion/resultados/:sesionId?" element={<Resultados/>}/>
<Route path="/orientacion/perfil" element={<PerfilVocacional/>}/>
<Route path="/orientacion/historial" element={<Historial/>}/>
```

---

## Notas importantes

- Todos los archivos utilizan `localStorage` para persistir datos entre sesiones
- El sistema maneja estados de sesión: `iniciada`, `ronda_2`, `completado`
- Se implementó manejo robusto de errores, especialmente para errores 401 y 403
- El sistema permite múltiples intentos y maneja casos donde la sesión ya cambió de estado
- Las preguntas de Ronda 2 pueden generarse de forma asíncrona en el backend
- El nivel de seguridad se calcula basado en el tiempo de respuesta:
  - < 5s = muy_seguro
  - 5-15s = seguro
  - 15-30s = indeciso
  - > 30s = muy_indeciso

---

**Fecha de creación:** 2025-01-14  
**Última actualización:** 2025-01-14
