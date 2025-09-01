import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UnifiedApplicationFormProps {
  programTitle: string;
}

const UnifiedApplicationForm = ({ programTitle }: UnifiedApplicationFormProps) => {
  const [birthDate, setBirthDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nueva Postulación - {programTitle}</CardTitle>
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
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="correo@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Número de Teléfono</Label>
                <Input id="telefono" placeholder="+58 412 1234567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "PPP") : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltero">Soltero(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viudo">Viudo(a)</SelectItem>
                    <SelectItem value="union-estable">Unión Estable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tipo de Postulante */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Tipo de Postulante</h3>
            <div className="space-y-2">
              <Label htmlFor="tipoPostulante">Selecciona una opción</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo de postulante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudiante-pregrado">Estudiante regular de pregrado</SelectItem>
                  <SelectItem value="estudiante-postgrado">Estudiante regular de postgrado</SelectItem>
                  <SelectItem value="estudiante-nuevo">Estudiante de nuevo ingreso (bachiller)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datos Académicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Datos Académicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedulaAcademica">Cédula de Identidad</Label>
                <Input id="cedulaAcademica" placeholder="V-12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera/Programa de estudios</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                    <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="ingenieria-civil">Ingeniería Civil</SelectItem>
                    <SelectItem value="administracion">Administración de Empresas</SelectItem>
                    <SelectItem value="comunicacion">Comunicación Social</SelectItem>
                    <SelectItem value="psicologia">Psicología</SelectItem>
                    <SelectItem value="derecho">Derecho</SelectItem>
                    <SelectItem value="contaduria">Contaduría Pública</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trimestre">Trimestre actual</Label>
                <Input id="trimestre" placeholder="Ej: 5to trimestre" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iaa">Índice Académico Acumulado (IAA)</Label>
                <Input 
                  id="iaa" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  placeholder="18.50"
                />
                <p className="text-xs text-muted-foreground">Solo para estudiantes regulares</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promedioBachillerato">Promedio de notas de bachillerato</Label>
                <Input 
                  id="promedioBachillerato" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="20" 
                  placeholder="17.50"
                />
                <p className="text-xs text-muted-foreground">Solo para estudiantes de nuevo ingreso</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asignaturasAprobadas">Número de asignaturas aprobadas</Label>
                <Input id="asignaturasAprobadas" type="number" placeholder="25" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditosInscritos">Número de créditos inscritos este trimestre</Label>
                <Input id="creditosInscritos" type="number" placeholder="18" />
              </div>
            </div>
          </div>

          {/* Documentos Requeridos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Documentos Requeridos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Fotocopia de Cédula de Identidad</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Flujograma de carrera</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Histórico de notas</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Plan de carrera avalado por el Director de Escuela</p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Currículum deportivo o dossier artístico</p>
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

export default UnifiedApplicationForm;