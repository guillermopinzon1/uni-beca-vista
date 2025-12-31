import React, { useState } from 'react';
import ConsultaLLM from '@/components/OrientacionVocacional/ConsultaLLM';
import RecomendacionesCarrera from '@/components/OrientacionVocacional/RecomendacionesCarrera';
import ChatOrientacion from '@/components/OrientacionVocacional/ChatOrientacion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OrientacionVocacional: React.FC = () => {
  // Datos de ejemplo - en producción vendrían de tu estado/API
  const [perfilEstudiante] = useState({
    intereses: ['tecnología', 'programación', 'matemáticas'],
    habilidades: ['lógica', 'resolución de problemas', 'trabajo en equipo'],
    resultadosTest: {
      personalidad: 'INTJ',
      intereses: ['STEM', 'Tecnología']
    },
    preferencias: {
      modalidad: 'presencial',
      duracion: '5 años'
    }
  });

  const [carrerasDisponibles] = useState([
    {
      nombre: 'Ingeniería de Sistemas',
      descripcion: 'Carrera enfocada en el desarrollo de software y sistemas informáticos'
    },
    {
      nombre: 'Ingeniería Informática',
      descripcion: 'Carrera que combina hardware y software'
    },
    {
      nombre: 'Ingeniería en Computación',
      descripcion: 'Carrera con enfoque en algoritmos y estructuras de datos'
    },
    {
      nombre: 'Matemáticas Industriales',
      descripcion: 'Carrera que aplica matemáticas a problemas industriales'
    },
    {
      nombre: 'Psicología',
      descripcion: 'Carrera enfocada en el estudio del comportamiento humano'
    }
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Orientación Vocacional</h1>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="consulta">Consulta</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          <ChatOrientacion />
        </TabsContent>

        <TabsContent value="consulta" className="mt-4">
          <ConsultaLLM />
        </TabsContent>

        <TabsContent value="recomendaciones" className="mt-4">
          <RecomendacionesCarrera
            perfilEstudiante={perfilEstudiante}
            carrerasDisponibles={carrerasDisponibles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrientacionVocacional;