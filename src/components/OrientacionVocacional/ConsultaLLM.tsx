import React, { useState } from 'react';
import { useLLM } from '@/hooks/useLLM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConsultaLLM: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const { consultaLLM, loading, error } = useLLM();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una consulta',
        variant: 'destructive'
      });
      return;
    }

    try {
      const respuestaLLM = await consultaLLM(prompt);
      setRespuesta(respuestaLLM);
      toast({
        title: 'Consulta procesada',
        description: 'Respuesta generada exitosamente'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Error al procesar la consulta',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Consulta de Orientación Vocacional
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              ¿En qué te puedo ayudar?
            </label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: ¿Qué carrera me recomiendas si me gusta la tecnología y las matemáticas?"
              disabled={loading}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Consulta
              </>
            )}
          </Button>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
          {respuesta && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Respuesta:</h3>
              <p className="text-sm whitespace-pre-wrap">{respuesta}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ConsultaLLM;