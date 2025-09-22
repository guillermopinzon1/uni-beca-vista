import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  HelpCircle, 
  Calendar, 
  Download, 
  Phone, 
  Mail,
  Clock,
  FileText,
  Award
} from "lucide-react";

const InformacionAyuda = () => {
  const categorias = [
    {
      nombre: "Académica",
      iaaMinimo: 17.5,
      requisitos: [
        "IAA mínimo de 17.5",
        "Mínimo 12 créditos aprobados por período",
        "No haber perdido beca anteriormente"
      ],
      cobertura: ["15%", "25%", "50%"],
      causalesPerdida: [
        "IAA menor a 17.5 en cualquier período",
        "Menos de 12 créditos aprobados",
        "Más de 15 períodos cursados"
      ]
    },
    {
      nombre: "Deportiva",
      iaaMinimo: 15.0,
      requisitos: [
        "IAA mínimo de 15.0",
        "Pertenecer a selección deportiva UNIMET",
        "Participación activa en competencias"
      ],
      cobertura: ["15%", "25%", "50%"],
      causalesPerdida: [
        "IAA menor a 15.0 en cualquier período",
        "Abandono de actividad deportiva",
        "Incumplimiento de compromisos deportivos"
      ]
    },
    {
      nombre: "Artística",
      iaaMinimo: 15.0,
      requisitos: [
        "IAA mínimo de 15.0",
        "Participación en actividades culturales UNIMET",
        "Proyecto artístico aprobado"
      ],
      cobertura: ["15%", "25%", "50%"],
      causalesPerdida: [
        "IAA menor a 15.0 en cualquier período",
        "Abandono de actividad artística",
        "Incumplimiento de proyecto"
      ]
    }
  ];

  const faqs = [
    {
      pregunta: "¿Cuándo debo renovar mi beca?",
      respuesta: "La renovación se debe realizar cada año académico antes del 15 de diciembre."
    },
    {
      pregunta: "¿Puedo cambiar de categoría de beca?",
      respuesta: "Sí, puedes postularte a otra categoría en el próximo período de convocatoria, pero debes cumplir los requisitos específicos."
    },
    {
      pregunta: "¿Qué pasa si mi IAA baja del mínimo?",
      respuesta: "Tendrás un período de gracia para recuperar el IAA requerido. Si no lo logras, perderás la beca."
    },
    {
      pregunta: "¿Puedo tener más de una beca simultaneamente?",
      respuesta: "No, solo puedes tener una beca de excelencia activa a la vez."
    }
  ];

  const fechasImportantes = [
    { fecha: "15 de marzo", evento: "Apertura convocatoria Período I" },
    { fecha: "30 de abril", evento: "Cierre convocatoria Período I" },
    { fecha: "15 de agosto", evento: "Apertura convocatoria Período II" },
    { fecha: "30 de septiembre", evento: "Cierre convocatoria Período II" },
    { fecha: "15 de diciembre", evento: "Renovación anual de becas" }
  ];

  const documentos = [
    { nombre: "Reglamento de Becas de Excelencia", tipo: "PDF" },
    { nombre: "Formato de Carta Compromiso", tipo: "DOC" },
    { nombre: "Guía de Postulación", tipo: "PDF" },
    { nombre: "Formulario de Renovación", tipo: "PDF" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Información y Ayuda</h2>
        <p className="text-muted-foreground">
          Todo lo que necesitas saber sobre el Programa de Excelencia
        </p>
      </div>

      <Tabs defaultValue="requisitos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="requisitos" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Requisitos
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="contacto" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contacto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requisitos" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Requisitos por Categoría</h3>
            <div className="grid gap-6">
              {categorias.map((categoria, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">
                      Beca {categoria.nombre}
                    </CardTitle>
                    <CardDescription>
                      IAA mínimo: {categoria.iaaMinimo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requisitos de Postulación:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {categoria.requisitos.map((req, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Porcentajes de Cobertura:</h4>
                      <div className="flex space-x-2">
                        {categoria.cobertura.map((porcentaje, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                            {porcentaje}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Causales de Pérdida:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {categoria.causalesPerdida.map((causal, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {causal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Preguntas Frecuentes</h3>
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.pregunta}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.respuesta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Calendario de Convocatorias</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {fechasImportantes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{item.fecha}</span>
                      </div>
                      <span className="text-muted-foreground">{item.evento}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Documentos de Referencia</h3>
            <div className="grid gap-4">
              {documentos.map((doc, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.nombre}</p>
                        <p className="text-sm text-muted-foreground">{doc.tipo}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacto" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contacto de Soporte</h3>
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Desarrollo y Bienestar Estudiantil (DDBE)</CardTitle>
                <CardDescription>
                  Personal especializado para atender tus consultas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">becas@unimet.edu.ve</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-sm text-muted-foreground">+58 212-240-4444</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Horario de Atención</p>
                      <p className="text-sm text-muted-foreground">Lun - Vie: 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformacionAyuda;