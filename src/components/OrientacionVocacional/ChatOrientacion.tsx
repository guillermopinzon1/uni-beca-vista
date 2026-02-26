import React, { useState, useRef, useEffect } from 'react';
import { useLLM } from '@/hooks/useLLM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2, Send, Bot, User, Trash2,
  GraduationCap, ClipboardList, MapPin, CalendarDays, Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const OPCIONES_SUGERIDAS = [
  { label: 'Carreras disponibles', texto: '¿Qué carreras tiene la UNIMET?', icon: GraduationCap },
  { label: 'Mi resultado de test', texto: '¿Qué me recomiendas según mi resultado de test?', icon: ClipboardList },
  { label: 'Información de admisión', texto: '¿Cuáles son las vías de ingreso a la UNIMET?', icon: MapPin },
  { label: 'Fecha del PDU', texto: '¿Cuándo es la próxima fecha del PDU?', icon: CalendarDays },
  { label: 'Contacto', texto: '¿A quién puedo contactar para información de becas?', icon: Phone },
];

const ChatOrientacion: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState('');
  const { chatLLM, loading, error } = useLLM();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const enviarMensaje = async (texto: string) => {
    if (!texto.trim() || loading) return;

    const nuevoMensaje: Mensaje = {
      role: 'user',
      content: texto.trim(),
      timestamp: new Date(),
    };

    setMensajes(prev => [...prev, nuevoMensaje]);
    setInputMensaje('');

    try {
      const historial = [...mensajes, nuevoMensaje].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const respuesta = await chatLLM(historial);

      setMensajes(prev => [
        ...prev,
        { role: 'assistant', content: respuesta, timestamp: new Date() },
      ]);

      inputRef.current?.focus();
    } catch (err: any) {
      const isRateLimit = err.status === 429;
      toast({
        title: isRateLimit ? 'Límite alcanzado' : 'Error',
        description: err.message || 'Error al enviar mensaje. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarMensaje(inputMensaje);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje(inputMensaje);
    }
  };

  const limpiarChat = () => {
    setMensajes([]);
    inputRef.current?.focus();
  };

  const mostrarWelcome = mensajes.length === 0 && !loading;

  return (
    <Card className="w-full max-w-4xl mx-auto h-[620px] flex flex-col shadow-lg overflow-hidden border-orange-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-orange-50 to-amber-50 px-5 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/UNIMETLogo.png"
            alt="UNIMET"
            className="h-9 w-9 rounded-full object-contain bg-white p-0.5 shadow-sm"
          />
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              Asistente UNIMET
            </h2>
            <p className="text-xs text-gray-500">Orientación Vocacional</p>
          </div>
        </div>

        {mensajes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarChat}
            className="text-xs text-gray-500 hover:text-red-500 gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/60">
          {/* Pantalla de bienvenida */}
          {mostrarWelcome && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in duration-300">
              <img
                src="/lovable-uploads/UNIMETLogo.png"
                alt="UNIMET"
                className="h-16 w-16 mb-5 rounded-full object-contain bg-white p-1 shadow-md"
              />
              <p className="text-base font-semibold text-gray-800 mb-1">
                Hola, soy tu asistente de orientación vocacional
              </p>
              <p className="text-base font-semibold text-[#F37021] mb-3">
                de la Universidad Metropolitana.
              </p>
              <p className="text-sm text-gray-500 max-w-md mb-8">
                Puedo ayudarte con información sobre carreras, resultados de tu
                test vocacional, fechas de admisión y más.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {OPCIONES_SUGERIDAS.map(op => (
                  <button
                    key={op.label}
                    onClick={() => enviarMensaje(op.texto)}
                    className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-all hover:border-[#F37021] hover:bg-orange-50 hover:shadow-md active:scale-95"
                  >
                    <op.icon className="h-4 w-4 text-[#F37021]" />
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensajes de la conversación */}
          {!mostrarWelcome && (
            <div className="space-y-4">
              {mensajes.map((mensaje, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    mensaje.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {mensaje.role === 'assistant' && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
                      <Bot className="h-4.5 w-4.5 text-[#F37021]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      mensaje.role === 'user'
                        ? 'bg-[#F37021] text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {mensaje.content}
                    </p>
                    <p
                      className={`text-[10px] mt-1.5 ${
                        mensaje.role === 'user'
                          ? 'text-orange-200'
                          : 'text-gray-400'
                      }`}
                    >
                      {mensaje.timestamp.toLocaleTimeString('es-VE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {mensaje.role === 'user' && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                      <User className="h-4.5 w-4.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
                    <Bot className="h-4.5 w-4.5 text-[#F37021]" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#F37021]" />
                      <span className="text-sm text-gray-500">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-white px-4 py-3">
          {error && (
            <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMensaje}
              onChange={e => setInputMensaje(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta aquí..."
              disabled={loading}
              className="flex-1"
              maxLength={1000}
            />
            <Button
              type="submit"
              disabled={loading || !inputMensaje.trim()}
              className="bg-[#F37021] hover:bg-orange-600 px-5"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatOrientacion;
