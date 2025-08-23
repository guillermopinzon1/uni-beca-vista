import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";

const ApplicationForm = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Postulación - Beca de Excelencia</CardTitle>
          <CardDescription>
            Complete el formulario con sus datos personales y académicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input id="nombre" placeholder="Ingrese su nombre completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula de Identidad</Label>
                <Input id="cedula" placeholder="V-12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Institucional</Label>
                <Input id="email" type="email" placeholder="estudiante@unimet.edu.ve" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="+58 412 1234567" />
              </div>
            </div>
          </div>

          {/* Datos Académicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Datos Académicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                    <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="administracion">Administración de Empresas</SelectItem>
                    <SelectItem value="comunicacion">Comunicación Social</SelectItem>
                    <SelectItem value="psicologia">Psicología</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nivel Académico</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pregrado">Pregrado</SelectItem>
                    <SelectItem value="postgrado">Postgrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre Actual</Label>
                <Input id="semestre" placeholder="Ej: 5to semestre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iaa">Índice Académico Acumulado (IAA)</Label>
                <Input id="iaa" type="number" step="0.01" min="0" max="20" placeholder="18.50" />
              </div>
            </div>
          </div>

          {/* Categoría de Beca */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Categoría de Beca</h3>
            <div className="space-y-2">
              <Label htmlFor="categoria">Seleccione la categoría</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academica">Académica (IAA ≥ 17.5/18)</SelectItem>
                  <SelectItem value="deportiva">Deportiva (IAA ≥ 15)</SelectItem>
                  <SelectItem value="artistica">Artística (IAA ≥ 15)</SelectItem>
                  <SelectItem value="civico">Compromiso Cívico (IAA ≥ 15)</SelectItem>
                  <SelectItem value="emprendimiento">Emprendimiento (IAA ≥ 15)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="justificacion">Justificación</Label>
              <Textarea 
                id="justificacion" 
                placeholder="Explique por qué merece esta beca y cómo cumple con los requisitos de la categoría seleccionada..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Documentos Requeridos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Histórico de Notas</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Flujograma de Carrera</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Copia de Cédula</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Currículum/Dossier</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">Guardar Borrador</Button>
            <Button>Enviar Postulación</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;