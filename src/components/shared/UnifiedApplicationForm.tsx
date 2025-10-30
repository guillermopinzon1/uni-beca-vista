import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Calendar, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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
  const [showOptionalAcademicData, setShowOptionalAcademicData] = useState(false);
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
  // Valores permitidos por el backend: 'Ayudantía', 'Impacto', 'Excelencia', 'Exoneración de Pago', 'Formación Docente'
  const getTipoBeca = (programTitle: string): string => {
    // Normalizar el título para búsqueda (minúsculas y sin acentos)
    const titleLower = programTitle.toLowerCase();

    // Si contiene "excelencia" en el título → Excelencia
    if (titleLower.includes('excelencia')) {
      return "Excelencia";
    }

    // Si contiene "formación" o "docente" → Formación Docente
    if (titleLower.includes('formación') || titleLower.includes('formacion') || titleLower.includes('docente')) {
      return "Formación Docente";
    }

    // Si contiene "ayudantía" → Ayudantía
    if (titleLower.includes('ayudantía') || titleLower.includes('ayudantia')) {
      return "Ayudantía";
    }

    // Si contiene "impacto" → Impacto
    if (titleLower.includes('impacto')) {
      return "Impacto";
    }

    // Si contiene "exoneración" → Exoneración de Pago
    if (titleLower.includes('exoneración') || titleLower.includes('exoneracion')) {
      return "Exoneración de Pago";
    }

    // Fallback: mapeo exacto como backup
    const mapeoBecas: { [key: string]: string } = {
      "Programa de Excelencia": "Excelencia",
      "Excelencia Académica": "Excelencia",
      "Excelencia": "Excelencia",
      "Beca de Formación Docente": "Formación Docente",
      "Formación Docente": "Formación Docente",
      "Programa de Ayudantía": "Ayudantía",
      "Ayudantía": "Ayudantía",
      "Programa de Impacto": "Impacto",
      "Impacto Social": "Impacto",
      "Impacto": "Impacto",
      "Programa de Exoneración": "Exoneración de Pago",
      "Exoneración de Pago": "Exoneración de Pago",
      "Exoneración": "Exoneración de Pago"
    };

    return mapeoBecas[programTitle] || "Ayudantía";
  };

  // Tipos de documentos permitidos
  const TIPOS_DOCUMENTO = [
    'cedula',
    'historico_notas',
    'flujograma_carrera',
    'plan_carrera_avalado',
    'curriculum',
    'carta_motivacion',
    'certificados_logros',
    'constancia_laboral',
    'comprobante_ingresos'
  ];

  // Validación de archivos
  const validarArchivo = (archivo: File): string | null => {
    // Tamaño máximo: 10MB
    if (archivo.size > 10485760) {
      return 'El archivo excede 10MB';
    }

    // Tipos permitidos
    const permitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!permitidos.includes(archivo.type)) {
      return 'Solo PDF, JPG, PNG permitidos';
    }

    return null; // válido
  };

  // Función para enviar la postulación
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

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

      // PASO 1: Crear postulación SIN documentos
      toast({
        title: "Creando postulación...",
        description: "Procesando su solicitud",
      });

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
        tipoBeca: getTipoBeca(programTitle)
        // NO incluir documentos aquí
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

      // ⚠️ CRÍTICO: Guardar el postulacionId para subir documentos
      const postulacionId = data.data.id;

      if (!postulacionId) {
        throw new Error("No se recibió el ID de la postulación");
      }

      // DEBUG: Verificar que tenemos el ID correcto
      console.log('✅ Postulación creada con ID:', postulacionId);

      toast({
        title: "✓ Postulación creada",
        description: `ID: ${postulacionId.substring(0, 8)}...`,
      });

      // PASO 2: Subir documentos (si hay)
      let documentosSubidos = 0;
      let documentosFallidos = 0;

      if (documentos.length > 0) {
        toast({
          title: "Subiendo documentos...",
          description: `Procesando ${documentos.length} documento(s)`,
        });

        for (let i = 0; i < documentos.length; i++) {
          const doc = documentos[i];

          // Validar archivo
          const errorValidacion = validarArchivo(doc.file);
          if (errorValidacion) {
            console.error(`Validación falló para ${doc.tipo}:`, errorValidacion);
            documentosFallidos++;
            continue;
          }

          try {
            // Crear FormData
            const formDataDoc = new FormData();
            formDataDoc.append('file', doc.file);
            formDataDoc.append('tipoDocumento', doc.tipo);
            formDataDoc.append('postulacionId', postulacionId); // ⚠️ IMPORTANTE

            // DEBUG: Verificar que el FormData tiene los 3 campos
            console.log('📎 Subiendo documento:', {
              tipo: doc.tipo,
              nombre: doc.file.name,
              postulacionId: postulacionId,
              formDataEntries: Array.from(formDataDoc.entries()).map(([key, value]) => ({
                key,
                value: value instanceof File ? `File: ${value.name}` : value
              }))
            });

            // Subir documento
            const uploadResponse = await fetch(`${API_BASE}/v1/documents/upload`, {
              method: 'POST',
              body: formDataDoc
            });

            if (!uploadResponse.ok) {
              const error = await uploadResponse.json().catch(() => null);
              console.error(`❌ Error subiendo ${doc.tipo}:`, {
                status: uploadResponse.status,
                statusText: uploadResponse.statusText,
                error: error
              });

              // Mostrar toast de error específico
              toast({
                title: `Error subiendo ${doc.tipo}`,
                description: error?.message || `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`,
                variant: "destructive",
                duration: 5000
              });

              documentosFallidos++;
              continue;
            }

            const uploadData = await uploadResponse.json();
            console.log(`✅ Documento ${doc.tipo} subido:`, uploadData);

            documentosSubidos++;

            // Verificar que el documento quedó asociado
            console.log(`🔗 Documento ${uploadData.data.id} asociado a postulación ${postulacionId}`);

            // Actualizar progreso
            toast({
              title: `Documento ${i + 1}/${documentos.length}`,
              description: `${doc.tipo} subido correctamente`,
            });

          } catch (error) {
            console.error(`❌ Excepción subiendo ${doc.tipo}:`, error);

            // Toast de error para excepciones
            toast({
              title: `Error subiendo ${doc.tipo}`,
              description: error instanceof Error ? error.message : "Error desconocido",
              variant: "destructive",
              duration: 5000
            });

            documentosFallidos++;
          }
        }
      }

      // PASO 3: Verificar que los documentos se asociaron correctamente
      if (documentosSubidos > 0) {
        try {
          console.log('🔍 Verificando documentos asociados a la postulación...');
          const verifyResponse = await fetch(`${API_BASE}/v1/documents/public/postulacion/${postulacionId}`);

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            const documentosAsociados = verifyData.data?.documentos || [];
            console.log('✅ Documentos verificados en BD:', documentosAsociados);

            if (documentosAsociados.length !== documentosSubidos) {
              console.warn(`⚠️ Advertencia: Se subieron ${documentosSubidos} pero solo se encontraron ${documentosAsociados.length} asociados`);
            }
          }
        } catch (error) {
          console.error('❌ Error verificando documentos:', error);
        }
      }

      // Mostrar resultado final
      setShowSuccess(true);

      // Determinar el estado del proceso de documentos
      if (documentos.length > 0) {
        if (documentosFallidos === 0) {
          // Éxito total
          toast({
            title: "🎉 ¡Postulación Completada!",
            description: `Postulación registrada exitosamente con ${documentosSubidos} documento(s).`,
            duration: 7000
          });
        } else if (documentosSubidos === 0) {
          // Todos los documentos fallaron
          toast({
            title: "⚠️ Postulación creada con errores",
            description: `Postulación registrada pero ningún documento se pudo subir. Revisa los errores en consola.`,
            variant: "destructive",
            duration: 10000
          });
        } else {
          // Éxito parcial
          toast({
            title: "⚠️ Postulación creada con advertencias",
            description: `${documentosSubidos} documento(s) subido(s), ${documentosFallidos} fallido(s). Revisa los errores.`,
            variant: "destructive",
            duration: 10000
          });
        }
      } else {
        // Sin documentos
        toast({
          title: "🎉 ¡Postulación Completada!",
          description: "Postulación registrada exitosamente. Puede agregar documentos posteriormente.",
          duration: 7000
        });
      }

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

      // Ocultar estado de éxito después de 7 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 7000);

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

  // Función para manejar la subida de documentos (solo guarda localmente hasta el submit)
  const handleUpload = (file: File, tipoDocumento: string) => {
    // Validar archivo antes de agregarlo
    const errorValidacion = validarArchivo(file);
    if (errorValidacion) {
      toast({
        title: "Error de validación",
        description: errorValidacion,
        variant: "destructive"
      });
      return;
    }

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
      description: `${file.name} listo para enviar (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    });
  };

  // Función para remover un documento
  const handleRemoveDocument = (tipoDocumento: string) => {
    setDocumentos(prev => prev.filter(doc => doc.tipo !== tipoDocumento));
    toast({
      title: "Documento removido",
      description: `Documento ${tipoDocumento} eliminado`
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
                <Label htmlFor="carrera">Carrera/Programa de estudios *</Label>
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
                <Label htmlFor="promedioBachillerato">Promedio de notas de bachillerato *</Label>
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
                <p className="text-xs text-muted-foreground">Para estudiantes de nuevo ingreso</p>
              </div>
            </div>

            {/* Botón para mostrar/ocultar datos académicos opcionales */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOptionalAcademicData(!showOptionalAcademicData)}
              className="w-full mt-4"
            >
              {showOptionalAcademicData ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Ocultar datos académicos opcionales
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Mostrar datos académicos opcionales
                </>
              )}
            </Button>

            {/* Datos académicos opcionales */}
            {showOptionalAcademicData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="trimestre">Trimestre actual (opcional)</Label>
                  <Input
                    id="trimestre"
                    placeholder="2025-1"
                    value={formData.trimestre}
                    onChange={(e) => handleInputChange("trimestre", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Formato: AÑO-TRIMESTRE (ej: 2025-1)</p>
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
            )}
          </div>

          {/* Documentos Requeridos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Documentos Requeridos</h3>
              <span className="text-xs text-muted-foreground">PDF, JPG, PNG (máx. 10MB)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cédula */}
              <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Cédula de Identidad</p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cedula')}
                    disabled={!!uploading}
                    className="text-xs cursor-pointer"
                  />
                  {documentos.find(d => d.tipo === 'cedula') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveDocument('cedula')}
                    >
                      Remover
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Histórico de notas */}
              <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Histórico de Notas</p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'historico_notas')}
                    disabled={!!uploading}
                    className="text-xs cursor-pointer"
                  />
                  {documentos.find(d => d.tipo === 'historico_notas') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveDocument('historico_notas')}
                    >
                      Remover
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Flujograma */}
              <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Flujograma de Carrera</p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'flujograma_carrera')}
                    disabled={!!uploading}
                    className="text-xs cursor-pointer"
                  />
                  {documentos.find(d => d.tipo === 'flujograma_carrera') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveDocument('flujograma_carrera')}
                    >
                      Remover
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Plan de carrera */}
              <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Plan de Carrera Avalado</p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'plan_carrera_avalado')}
                    disabled={!!uploading}
                    className="text-xs cursor-pointer"
                  />
                  {documentos.find(d => d.tipo === 'plan_carrera_avalado') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveDocument('plan_carrera_avalado')}
                    >
                      Remover
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Currículum - Solo Excelencia y Ayudantía */}
              {(programTitle.includes("Excelencia") || programTitle.includes("Ayudantía")) && (
                <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2 font-medium">Currículum/Dossier</p>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'curriculum')}
                      disabled={!!uploading}
                      className="text-xs cursor-pointer"
                    />
                    {documentos.find(d => d.tipo === 'curriculum') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveDocument('curriculum')}
                      >
                        Remover
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Lista de documentos seleccionados */}
            {documentos.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">
                    ✓ Documentos Seleccionados ({documentos.length})
                  </h4>
                  <ul className="space-y-2">
                    {documentos.map((doc, index) => (
                      <li key={`${doc.tipo}-${index}`} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-green-200">
                        <span className="flex items-center gap-2 text-green-800">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{doc.tipo.replace(/_/g, ' ')}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-green-600">{doc.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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