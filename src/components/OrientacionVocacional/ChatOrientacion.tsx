import React, { useState, useRef, useEffect } from 'react';
import { useLLM } from '@/hooks/useLLM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatOrientacion: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const { chatLLM, loading, error } = useLLM();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automático al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Focus en el input cuando se carga el componente
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMensaje.trim() || loading) return;

    const nuevoMensaje: Mensaje = {
      role: 'user',
      content: inputMensaje.trim(),
      timestamp: new Date()
    };

    // Agregar mensaje del usuario inmediatamente
    setMensajes(prev => [...prev, nuevoMensaje]);
    const mensajeTemporal = inputMensaje;
    setInputMensaje('');

    try {
      // Preparar historial para el LLM (incluye el nuevo mensaje)
      const historialParaLLM = [...mensajes, nuevoMensaje].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Llamar al LLM
      const respuesta = await chatLLM(historialParaLLM);

      // Agregar respuesta del asistente
      const mensajeRespuesta: Mensaje = {
        role: 'assistant',
        content: respuesta,
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, mensajeRespuesta]);
      
      // Focus de vuelta al input
      inputRef.current?.focus();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al enviar mensaje. Intenta de nuevo.',
        variant: 'destructive'
      });
      
      // Si falla, mantener el mensaje del usuario pero mostrar error
      // El mensaje del usuario ya se agregó arriba
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Enviar con Enter (pero no con Shift+Enter para permitir saltos de línea)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje(e);
    }
  };

  const limpiarChat = () => {
    setMensajes([]);
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Chat de Orientación Vocacional
          </CardTitle>
          {mensajes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={limpiarChat}
              className="text-xs"
            >
              Limpiar Chat
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Haz preguntas sobre carreras, orientación vocacional y más
        </p>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
        {/* Área de mensajes - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50">
          {mensajes.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">¡Hola! 👋</p>
              <p className="text-sm">
                Soy tu asistente de orientación vocacional.
                <br />
                Puedes preguntarme sobre carreras, intereses profesionales, o cualquier duda que tengas.
              </p>
              <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                <p className="text-xs font-medium text-gray-700 mb-2">Ejemplos de preguntas:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• ¿Qué carrera me recomiendas si me gusta la tecnología?</li>
                  <li>• ¿Cuál es la diferencia entre Ingeniería de Sistemas e Informática?</li>
                  <li>• ¿Qué habilidades necesito para estudiar programación?</li>
                </ul>
              </div>
            </div>
          )}

          {mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                mensaje.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {mensaje.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  mensaje.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {mensaje.content}
                </p>
                <p className={`text-xs mt-2 ${
                  mensaje.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {mensaje.timestamp.toLocaleTimeString('es-VE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {mensaje.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {/* Indicador de carga */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-500">Pensando...</span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje - Fixed en la parte inferior */}
        <div className="border-t bg-white p-4">
          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleEnviarMensaje} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí..."
              disabled={loading}
              className="flex-1"
              maxLength={1000}
            />
            <Button 
              type="submit" 
              disabled={loading || !inputMensaje.trim()}
              className="px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Presiona Enter para enviar • Shift+Enter para nueva línea
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatOrientacion;