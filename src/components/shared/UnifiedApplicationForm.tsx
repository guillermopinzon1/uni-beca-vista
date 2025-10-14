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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api";

interface UnifiedApplicationFormProps {
  programTitle: string;
}

interface FormData {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  estadoCivil: string;
  tipoPostulante: string;
  carrera: string;
  trimestre: string;
  iaa: number | null;
  promedioBachillerato: number | null;
  asignaturasAprobadas: number | null;
  creditosInscritos: number | null;
  tipoBeca: string;
}

const UnifiedApplicationForm = ({ programTitle }: UnifiedApplicationFormProps) => {
  const [birthDate, setBirthDate] = useState<Date>();
  const { toast } = useToast();
  const [uploading, setUploading] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<Array<{ tipo: string; nombre: string; file: File }>>([]);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    estadoCivil: "",
    tipoPostulante: "",
    carrera: "",
    trimestre: "",
    iaa: null,
    promedioBachillerato: null,
    asignaturasAprobadas: null,
    creditosInscritos: null,
    tipoBeca: programTitle || "Ayudantía"
  });
  const [cedulaTipo, setCedulaTipo] = useState<string>("V");
  const [cedulaNumero, setCedulaNumero] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando el usuario lo modifica
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Función para manejar el cambio de cédula
  const handleCedulaChange = (tipo: string, numero: string) => {
    setCedulaTipo(tipo);
    setCedulaNumero(numero);
    const cedulaCompleta = `${tipo}-${numero}`;
    handleInputChange("cedula", cedulaCompleta);
  };

  // Función para manejar la fecha de nacimiento (ya no se usa con los selectores)
  const handleBirthDateChange = (date: Date | undefined) => {
    setBirthDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      handleInputChange("fechaNacimiento", formattedDate);
    }
  };

  // Función para mapear carrera del select al nombre completo
  const getCarreraName = (carreraKey: string): string => {
    const carreras: { [key: string]: string } = {
      "ingenieria-sistemas": "Ingeniería de Sistemas",
      "ingenieria-industrial": "Ingeniería Industrial", 
      "ingenieria-civil": "Ingeniería Civil",
      "administracion": "Administración de Empresas",
      "comunicacion": "Comunicación Social",
      "psicologia": "Psicología",
      "derecho": "Derecho",
      "contaduria": "Contaduría Pública"
    };
    return carreras[carreraKey] || carreraKey;
  };

  // Función para mapear el título del programa al tipo de beca válido
  const getTipoBeca = (programTitle: string): string => {
    const mapeoBecas: { [key: string]: string } = {
      "Programa de Excelencia": "Excelencia",
      "Beca de Formación Docente": "Exoneración de Pago",
      "Programa de Ayudantía": "Ayudantía",
      "Excelencia Académica": "Excelencia",
      "Formación Docente": "Exoneración de Pago",
      "Ayudantía": "Ayudantía",
      "Impacto Social": "Impacto"
    };
    return mapeoBecas[programTitle] || "Ayudantía";
  };

  // Función para generar URL temporal para documentos
  const generateTempUrl = (fileName: string): string => {
    return `https://srodriguez.intelcondev.org/documentos/${fileName}`;
  };

  // Función para generar path temporal para documentos
  const generateTempPath = (fileName: string): string => {
    return `/uploads/documentos/${fileName}`;
  };

  // Función para enviar la postulación
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Ya no se requiere autenticación para postular

      // Validar campos requeridos
      const requiredFields = ['nombre', 'cedula', 'email', 'telefono', 'fechaNacimiento', 'estadoCivil', 'tipoPostulante', 'carrera'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        toast({ 
          title: "Campos requeridos", 
          description: `Por favor complete: ${missingFields.join(', ')}`, 
          variant: "destructive" 
        });
        return;
      }

      // Preparar documentos con URLs temporales
      const documentosSubidos = documentos.map(doc => ({
        tipo: doc.tipo,
        nombre: doc.nombre,
        url: generateTempUrl(doc.nombre),
        path: generateTempPath(doc.nombre)
      }));

      // Preparar el body del endpoint
      const postulacionBody = {
        nombre: formData.nombre,
        cedula: formData.cedula,
        email: formData.email,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        estadoCivil: formData.estadoCivil,
        tipoPostulante: formData.tipoPostulante,
        carrera: getCarreraName(formData.carrera),
        trimestre: formData.trimestre,
        iaa: formData.iaa,
        promedioBachillerato: formData.promedioBachillerato,
        asignaturasAprobadas: formData.asignaturasAprobadas,
        creditosInscritos: formData.creditosInscritos,
        tipoBeca: getTipoBeca(programTitle),
        documentos: documentosSubidos
      };

      const response = await fetch(`${API_BASE}/v1/postulaciones`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postulacionBody)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        
        // Si hay errores de validación específicos, mostrarlos
        if (error?.details?.validationErrors) {
          const validationMessages = error.details.validationErrors
            .map((err: any) => `${err.field}: ${err.message}`)
            .join('\n');
          
          // Mapear errores a campos específicos
          const newFieldErrors: {[key: string]: string} = {};
          error.details.validationErrors.forEach((err: any) => {
            // Mapear campos del API a campos del formulario
            let fieldName = err.field;
            if (fieldName.startsWith('documentos.')) {
              fieldName = 'documentos';
            } else if (fieldName.includes('.')) {
              fieldName = fieldName.split('.')[0];
            }
            newFieldErrors[fieldName] = err.message;
          });
          
          setFieldErrors(newFieldErrors);
          
          toast({ 
            title: "Errores de validación", 
            description: validationMessages, 
            variant: "destructive" 
          });
          
          throw new Error(`Errores de validación:\n${validationMessages}`);
        }
        
        throw new Error(error?.message || `Error al enviar postulación (${response.status})`);
      }

      const data = await response.json();
      
      // Mostrar estado de éxito visual
      setShowSuccess(true);
      
      // Mostrar mensaje de éxito más vistoso
      toast({ 
        title: "🎉 ¡Postulación Enviada Exitosamente!", 
        description: "Su postulación ha sido recibida y está siendo procesada. Recibirá una confirmación por correo electrónico.",
        duration: 5000
      });
      
      // Resetear formulario completamente
      setFormData({
        nombre: "",
        cedula: "",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        estadoCivil: "",
        tipoPostulante: "",
        carrera: "",
        trimestre: "",
        iaa: null,
        promedioBachillerato: null,
        asignaturasAprobadas: null,
        creditosInscritos: null,
        tipoBeca: programTitle || "Ayudantía"
      });
      setCedulaTipo("V");
      setCedulaNumero("");
      setBirthDate(undefined);
      setDocumentos([]);
      setFieldErrors({});
      
      // Ocultar estado de éxito después de 5 segundos
      setTimeout(() => {
        setShowSuccess(false);
        toast({
          title: "✅ Proceso Completado",
          description: "Todos los campos han sido limpiados. Puede realizar una nueva postulación si lo desea.",
          duration: 3000
        });
      }, 5000);

    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.message || "No se pudo enviar la postulación", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para manejar la subida de documentos (solo guarda localmente)
  const handleUpload = (file: File, tipoDocumento: string) => {
    // Remover documento anterior del mismo tipo si existe
    setDocumentos(prev => prev.filter(doc => doc.tipo !== tipoDocumento));
    
    // Agregar nuevo documento
    setDocumentos(prev => [...prev, {
      tipo: tipoDocumento,
      nombre: file.name,
      file: file
    }]);
    
    toast({ 
      title: "Documento seleccionado", 
      description: `${file.name} listo para enviar` 
    });
  };

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito visual */}
      {showSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  ¡Postulación Enviada Exitosamente!
                </h3>
                <p className="text-green-700">
                  Su postulación ha sido recibida y está siendo procesada.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Recibirá una confirmación por correo electrónico en breve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                <Input 
                  id="nombre" 
                  placeholder="Ingrese su nombre completo" 
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula de Identidad</Label>
                <div className="flex gap-2">
                  <Select value={cedulaTipo} onValueChange={(tipo) => handleCedulaChange(tipo, cedulaNumero)}>
                    <SelectTrigger className={`w-20 ${fieldErrors.cedula ? 'border-red-500' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="V">V</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    id="cedula" 
                    placeholder="12345678" 
                    value={cedulaNumero}
                    onChange={(e) => handleCedulaChange(cedulaTipo, e.target.value)}
                    className={`flex-1 ${fieldErrors.cedula ? 'border-red-500' : ''}`}
                  />
                </div>
                {fieldErrors.cedula && (
                  <p className="text-sm text-red-500">{fieldErrors.cedula}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="correo@email.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={fieldErrors.email ? 'border-red-500' : ''}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Número de Teléfono</Label>
                <Input 
                  id="telefono" 
                  placeholder="+58 412 1234567" 
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  className={fieldErrors.telefono ? 'border-red-500' : ''}
                />
                {fieldErrors.telefono && (
                  <p className="text-sm text-red-500">{fieldErrors.telefono}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={formData.fechaNacimiento.split('-')[0] || ""} onValueChange={(year) => {
                    const currentDate = formData.fechaNacimiento.split('-');
                    const newDate = `${year}-${currentDate[1] || '01'}-${currentDate[2] || '01'}`;
                    handleInputChange("fechaNacimiento", newDate);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - 18 - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <Select value={formData.fechaNacimiento.split('-')[1] || ""} onValueChange={(month) => {
                    const currentDate = formData.fechaNacimiento.split('-');
                    const newDate = `${currentDate[0] || '2000'}-${month.padStart(2, '0')}-${currentDate[2] || '01'}`;
                    handleInputChange("fechaNacimiento", newDate);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        const monthNames = [
                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                        ];
                        return (
                          <SelectItem key={month} value={month}>
                            {monthNames[i]}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <Select value={formData.fechaNacimiento.split('-')[2] || ""} onValueChange={(day) => {
                    const currentDate = formData.fechaNacimiento.split('-');
                    const newDate = `${currentDate[0] || '2000'}-${currentDate[1] || '01'}-${day.padStart(2, '0')}`;
                    handleInputChange("fechaNacimiento", newDate);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = (i + 1).toString().padStart(2, '0');
                        return (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
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
              <Select value={formData.tipoPostulante} onValueChange={(value) => handleInputChange("tipoPostulante", value)}>
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
                <Label htmlFor="carrera">Carrera/Programa de estudios</Label>
                <Select value={formData.carrera} onValueChange={(value) => handleInputChange("carrera", value)}>
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
                <Label htmlFor="trimestre">Trimestre actual (opcional)</Label>
                <Input 
                  id="trimestre" 
                  placeholder="2025-1" 
                  value={formData.trimestre}
                  onChange={(e) => handleInputChange("trimestre", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Formato: AÑO-TRIMESTRE (ej: 2025-1) - Campo opcional</p>
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
                  value={formData.iaa || ""}
                  onChange={(e) => handleInputChange("iaa", e.target.value ? parseFloat(e.target.value) : null)}
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
                  value={formData.promedioBachillerato || ""}
                  onChange={(e) => handleInputChange("promedioBachillerato", e.target.value ? parseFloat(e.target.value) : null)}
                />
                <p className="text-xs text-muted-foreground">Solo para estudiantes de nuevo ingreso</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asignaturasAprobadas">Número de asignaturas aprobadas</Label>
                <Input 
                  id="asignaturasAprobadas" 
                  type="number" 
                  placeholder="25" 
                  value={formData.asignaturasAprobadas || ""}
                  onChange={(e) => handleInputChange("asignaturasAprobadas", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditosInscritos">Número de créditos inscritos este trimestre</Label>
                <Input 
                  id="creditosInscritos" 
                  type="number" 
                  placeholder="18" 
                  value={formData.creditosInscritos || ""}
                  onChange={(e) => handleInputChange("creditosInscritos", e.target.value ? parseInt(e.target.value) : null)}
                />
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
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cedula')} disabled={!!uploading} />
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Flujograma de carrera</p>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'flujograma_carrera')} disabled={!!uploading} />
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Histórico de notas</p>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'historico_notas')} disabled={!!uploading} />
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Plan de carrera avalado por el Director de Escuela</p>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'plan_carrera_avalado')} disabled={!!uploading} />
                </CardContent>
              </Card>
              
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Currículum deportivo o dossier artístico</p>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'curriculum')} disabled={!!uploading} />
                </CardContent>
              </Card>
            </div>
            {documentos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Documentos seleccionados</h4>
                <div className={`text-sm rounded p-3 ${fieldErrors.documentos ? 'bg-red-50 border border-red-200' : 'bg-muted/30'}`}>
                    <ul className="list-disc pl-5 space-y-1">
                    {documentos.map((doc, index) => (
                      <li key={`${doc.tipo}-${index}`}>{doc.tipo} — {doc.nombre}</li>
                      ))}
                    </ul>
                </div>
                {fieldErrors.documentos && (
                  <p className="text-sm text-red-500">{fieldErrors.documentos}</p>
                  )}
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline" disabled={isSubmitting}>
              Guardar Borrador
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Postulación"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedApplicationForm;