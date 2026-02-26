import { useState } from 'react';
import { API_BASE } from '@/lib/api/config';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const stored = localStorage.getItem('auth_tokens');
    const token = stored ? JSON.parse(stored)?.accessToken : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch { /* ignore */ }
  return headers;
}

export const useLLM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultaLLM = async (prompt: string, context: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/v1/llm/consulta`;

      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt, context })
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // Ignorar si no se puede parsear
          }
        } else {
          try {
            const textError = await response.text();
            if (textError) {
              errorMessage = textError;
            }
          } catch {
            // Ignorar
          }
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError);
        console.error('Respuesta recibida:', responseText);
        throw new Error('El servidor devolvió una respuesta no válida');
      }

      return data.data?.respuesta || data.respuesta || data.message || 'Sin respuesta';
    } catch (err: any) {
      const errorMessage = err.message || 'Error al consultar LLM';
      setError(errorMessage);
      console.error('❌ Error en consultaLLM:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarRecomendaciones = async (perfilEstudiante: any, carrerasDisponibles: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/v1/llm/recomendaciones`;

      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          perfilEstudiante,
          carrerasDisponibles
        })
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // Ignorar
          }
        } else {
          try {
            const textError = await response.text();
            if (textError) {
              errorMessage = textError;
            }
          } catch {
            // Ignorar
          }
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError);
        console.error('Respuesta recibida:', responseText);
        throw new Error('El servidor devolvió una respuesta no válida');
      }

      return data.data || data;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al generar recomendaciones';
      setError(errorMessage);
      console.error('❌ Error en generarRecomendaciones:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const chatLLM = async (mensajes: Array<{role: 'user' | 'assistant', content: string}>) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/v1/llm/chat`;
      const headers = getAuthHeaders();

      console.log('[ChatLLM] URL:', url);
      console.log('[ChatLLM] Auth:', headers.Authorization ? 'Bearer ***' : 'Sin JWT');
      console.log('[ChatLLM] Mensajes:', mensajes.length);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ mensajes })
      });

      console.log('[ChatLLM] Status:', response.status, response.statusText);

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (response.status === 429) {
          errorMessage = 'Demasiados mensajes. Intenta de nuevo en 15 minutos.';
        } else if (isJson) {
          try {
            const errorData = await response.json();
            console.log('[ChatLLM] Error body:', errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            try {
              const textError = await response.text();
              if (textError) errorMessage = textError;
            } catch { /* ignore */ }
          }
        } else {
          try {
            const textError = await response.text();
            console.log('[ChatLLM] Error text:', textError);
            if (textError) errorMessage = textError;
          } catch { /* ignore */ }
        }

        const err = new Error(errorMessage);
        (err as any).status = response.status;
        throw err;
      }

      const responseText = await response.text();
      console.log('[ChatLLM] Respuesta raw (primeros 300 chars):', responseText.substring(0, 300));

      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('El servidor devolvió una respuesta no válida');
      }

      const respuesta = data.data?.respuesta || data.respuesta || data.message || 'Sin respuesta';
      console.log('[ChatLLM] Texto extraído (primeros 200 chars):', respuesta.substring(0, 200));
      return respuesta;
    } catch (err: any) {
      const errorMessage = err.message || 'Error en chat';
      console.error('[ChatLLM] ERROR:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    consultaLLM,
    generarRecomendaciones,
    chatLLM,
    loading,
    error
  };
};