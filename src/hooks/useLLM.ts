import { useState } from 'react';
import { API_BASE } from '@/lib/api/config';

export const useLLM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultaLLM = async (prompt: string, context: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/v1/llm/consulta`;
      console.log('🔍 Consultando LLM:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      console.log('🔍 Generando recomendaciones:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

  const chatLLM = async (mensajes: Array<{role?: 'user' | 'assistant', content: string}>, contexto: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/v1/llm/chat`;
      console.log('🔍 Chat LLM:', url);
      console.log('📤 Mensajes enviados:', mensajes);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensajes, contexto })
      });

      console.log('📥 Status de respuesta:', response.status, response.statusText);
      console.log('📥 Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            console.error('❌ Error del servidor:', errorData);
          } catch {
            try {
              const textError = await response.text();
              if (textError) {
                errorMessage = textError;
              }
            } catch {
              // Ignorar
            }
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
      console.log('📥 Respuesta recibida (texto):', responseText.substring(0, 200));
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('El servidor devolvió una respuesta vacía');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ JSON parseado correctamente:', data);
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        console.error('📄 Respuesta completa:', responseText);
        throw new Error(`El servidor devolvió una respuesta no válida: ${responseText.substring(0, 100)}`);
      }

      return data.data?.respuesta || data.respuesta || data.message || 'Sin respuesta';
    } catch (err: any) {
      const errorMessage = err.message || 'Error en chat';
      setError(errorMessage);
      console.error('❌ Error en chatLLM:', err);
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