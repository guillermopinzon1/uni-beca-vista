import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfiguracionBeca {
  nombre: string;
  montoMensual: number;
  promedioMinimo: number;
  edadMaxima: number;
  semestreMinimo: number;
  semestreMaximo: number;
  duracionMeses: number;
  requisitoEspecial: string;
  activa: boolean;
  cuposDisponibles: number;
  documentosRequeridos: string[];
}

const ConfiguracionBecas = () => {
  const [hasChanges, setHasChanges] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  // Mock data para configuraciones actuales
  const [configuraciones, setConfiguraciones] = useState<Record<string, ConfiguracionBeca>>({
    excelencia: {
      nombre: "Beca de Excelencia Académica",
      montoMensual: 500000,
      promedioMinimo: 18.0,
      edadMaxima: 25,
      semestreMinimo: 3,
      semestreMaximo: 10,
      duracionMeses: 12,
      requisitoEspecial: "No haber reprobado materias",
      activa: true,
      cuposDisponibles: 50,
      documentosRequeridos: ["Certificado de notas", "Carta de motivación", "CV actualizado"]
    },
    ayudantia: {
      nombre: "Beca de Ayudantía",
      montoMensual: 300000,
      promedioMinimo: 16.0,
      edadMaxima: 28,
      semestreMinimo: 4,
      semestreMaximo: 12,
      duracionMeses: 6,
      requisitoEspecial: "Disponibilidad de 20 horas semanales",
      activa: true,
      cuposDisponibles: 100,
      documentosRequeridos: ["Certificado de notas", "Carta de disponibilidad", "Referencias académicas"]
    },
    impacto: {
      nombre: "Beca de Impacto Social",
      montoMensual: 400000,
      promedioMinimo: 16.5,
      edadMaxima: 26,
      semestreMinimo: 5,
      semestreMaximo: 11,
      duracionMeses: 10,
      requisitoEspecial: "Proyecto de impacto social aprobado",
      activa: true,
      cuposDisponibles: 30,
      documentosRequeridos: ["Certificado de notas", "Propuesta de proyecto", "Carta de motivación", "Referencias"]
    },
    formacion: {
      nombre: "Beca de Formación Docente",
      montoMensual: 350000,
      promedioMinimo: 17.0,
      edadMaxima: 30,
      semestreMinimo: 6,
      semestreMaximo: 12,
      duracionMeses: 8,
      requisitoEspecial: "Interés comprobado en docencia universitaria",
      activa: true,
      cuposDisponibles: 25,
      documentosRequeridos: ["Certificado de notas", "Ensayo vocacional", "Certificados de cursos", "Referencias"]
    }
  });

  const handleSave = () => {
    // Aquí iría la lógica para guardar las configuraciones
    setSavedMessage(true);
    setHasChanges(false);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleConfigChange = (tipo: string, campo: string, valor: any) => {
    setConfiguraciones(prev => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        [campo]: valor
      }
    }));
    setHasChanges(true);
  };

  const ConfiguracionForm = ({ tipo, config }: { tipo: string; config: ConfiguracionBeca }) => (
    <div className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Información Básica
            <Switch 
              checked={config.activa}
              onCheckedChange={(checked) => handleConfigChange(tipo, 'activa', checked)}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${tipo}-monto`}>Monto Mensual (Bs.)</Label>
              <Input
                id={`${tipo}-monto`}
                type="number"
                value={config.montoMensual}
                onChange={(e) => handleConfigChange(tipo, 'montoMensual', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-cupos`}>Cupos Disponibles</Label>
              <Input
                id={`${tipo}-cupos`}
                type="number"
                value={config.cuposDisponibles}
                onChange={(e) => handleConfigChange(tipo, 'cuposDisponibles', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`${tipo}-duracion`}>Duración (meses)</Label>
            <Input
              id={`${tipo}-duracion`}
              type="number"
              value={config.duracionMeses}
              onChange={(e) => handleConfigChange(tipo, 'duracionMeses', parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requisitos académicos */}
      <Card>
        <CardHeader>
          <CardTitle>Requisitos Académicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`${tipo}-promedio`}>Promedio Mínimo</Label>
              <Input
                id={`${tipo}-promedio`}
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={config.promedioMinimo}
                onChange={(e) => handleConfigChange(tipo, 'promedioMinimo', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-sem-min`}>Semestre Mínimo</Label>
              <Input
                id={`${tipo}-sem-min`}
                type="number"
                min="1"
                max="12"
                value={config.semestreMinimo}
                onChange={(e) => handleConfigChange(tipo, 'semestreMinimo', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor={`${tipo}-sem-max`}>Semestre Máximo</Label>
              <Input
                id={`${tipo}-sem-max`}
                type="number"
                min="1"
                max="12"
                value={config.semestreMaximo}
                onChange={(e) => handleConfigChange(tipo, 'semestreMaximo', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${tipo}-edad`}>Edad Máxima</Label>
              <Input
                id={`${tipo}-edad`}
                type="number"
                min="18"
                max="50"
                value={config.edadMaxima}
                onChange={(e) => handleConfigChange(tipo, 'edadMaxima', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requisitos especiales */}
      <Card>
        <CardHeader>
          <CardTitle>Requisitos Especiales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`${tipo}-especial`}>Requisito Especial</Label>
            <Textarea
              id={`${tipo}-especial`}
              value={config.requisitoEspecial}
              onChange={(e) => handleConfigChange(tipo, 'requisitoEspecial', e.target.value)}
              placeholder="Describe requisitos adicionales específicos para esta beca..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentos requeridos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Requeridos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {config.documentosRequeridos.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{doc}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Editar Lista de Documentos
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Configuración de Becas</h2>
          <p className="text-muted-foreground">Administración de parámetros y requisitos para cada tipo de beca</p>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <Alert className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Hay cambios sin guardar</AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {savedMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuraciones guardadas exitosamente
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">Tipos de Becas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">205</p>
              <p className="text-sm text-muted-foreground">Cupos Totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1,550,000</p>
              <p className="text-sm text-muted-foreground">Presupuesto Mensual (Bs.)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">17.1</p>
              <p className="text-sm text-muted-foreground">Promedio Mín. General</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para cada tipo de beca */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="excelencia" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="excelencia" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Excelencia</span>
              </TabsTrigger>
              <TabsTrigger value="ayudantia" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Ayudantía</span>
              </TabsTrigger>
              <TabsTrigger value="impacto" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Impacto Social</span>
              </TabsTrigger>
              <TabsTrigger value="formacion" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Formación Docente</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excelencia" className="mt-6">
              <ConfiguracionForm tipo="excelencia" config={configuraciones.excelencia} />
            </TabsContent>

            <TabsContent value="ayudantia" className="mt-6">
              <ConfiguracionForm tipo="ayudantia" config={configuraciones.ayudantia} />
            </TabsContent>

            <TabsContent value="impacto" className="mt-6">
              <ConfiguracionForm tipo="impacto" config={configuraciones.impacto} />
            </TabsContent>

            <TabsContent value="formacion" className="mt-6">
              <ConfiguracionForm tipo="formacion" config={configuraciones.formacion} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracionBecas;