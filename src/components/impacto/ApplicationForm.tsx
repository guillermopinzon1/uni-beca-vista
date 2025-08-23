import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Upload, FileCheck, ExternalLink } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido"),
  cedula: z.string().min(7, "Cédula debe tener al menos 7 dígitos"),
  age: z.number().min(16).max(21, "Edad debe estar entre 16 y 21 años"),
  institutionalEmail: z.string().email("Email institucional inválido").optional(),
  personalEmail: z.string().email("Email personal es requerido"),
  academicStatus: z.enum(["bachiller", "ultimo_año"], {
    required_error: "Selecciona tu estatus académico",
  }),
  gradeAverage: z.number().min(15, "Promedio mínimo requerido: 15 puntos").max(20),
  phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
  address: z.string().min(1, "Dirección es requerida"),
  emergencyContact: z.string().min(1, "Contacto de emergencia es requerido"),
  emergencyPhone: z.string().min(10, "Teléfono de emergencia requerido"),
  motivationalLetter: z.string().min(100, "Carta motivacional debe tener al menos 100 caracteres"),
  pduCompleted: z.boolean().refine(val => val === true, "Debe completar la PDU"),
  documentsAgreement: z.boolean().refine(val => val === true, "Debe aceptar cargar los documentos"),
  commitmentLetter: z.boolean().refine(val => val === true, "Debe firmar la carta compromiso"),
});

type FormData = z.infer<typeof formSchema>;

const ApplicationForm = () => {
  const [documents, setDocuments] = useState({
    bachillerato: null as File | null,
    notas: null as File | null,
    cedula: null as File | null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      cedula: "",
      age: 18,
      institutionalEmail: "",
      personalEmail: "",
      phone: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      motivationalLetter: "",
      gradeAverage: 15,
      pduCompleted: false,
      documentsAgreement: false,
      commitmentLetter: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Formulario enviado:", data);
    console.log("Documentos:", documents);
    toast.success("Postulación enviada exitosamente. Recibirás una confirmación por email.");
    form.reset();
    setDocuments({ bachillerato: null, notas: null, cedula: null });
  };

  const handleFileUpload = (type: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Postulación a Beca Impacto
          </CardTitle>
          <CardDescription>
            Complete todos los campos para postular a la Beca Impacto. Asegúrese de cumplir con todos los requisitos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese su nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula de Identidad</FormLabel>
                      <FormControl>
                        <Input placeholder="V-12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="16" 
                          max="21" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Personal</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="ejemplo@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institutionalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Institucional (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="nombre@unimet.edu.ve" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="0412-1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Residencia</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese su dirección completa"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contacto de Emergencia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto de Emergencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del contacto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Emergencia</FormLabel>
                      <FormControl>
                        <Input placeholder="0412-1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Información Académica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academicStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estatus Académico</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione su estatus" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bachiller">Bachiller graduado</SelectItem>
                          <SelectItem value="ultimo_año">Cursando último año de bachillerato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeAverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promedio de Notas (1º-4º año)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="20" 
                          step="0.01"
                          placeholder="15.00"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="motivationalLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carta Motivacional</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explique por qué merece la Beca Impacto y cómo planea contribuir..."
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carga de Documentos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documentos Requeridos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título/Constancia de Bachillerato</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('bachillerato', e.target.files?.[0] || null)}
                        className="hidden"
                        id="bachillerato-upload"
                      />
                      <label
                        htmlFor="bachillerato-upload"
                        className="flex items-center justify-center w-full h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Cargar archivo
                      </label>
                    </div>
                    {documents.bachillerato && (
                      <p className="text-sm text-green-600">✓ {documents.bachillerato.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notas Certificadas</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('notas', e.target.files?.[0] || null)}
                        className="hidden"
                        id="notas-upload"
                      />
                      <label
                        htmlFor="notas-upload"
                        className="flex items-center justify-center w-full h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Cargar archivo
                      </label>
                    </div>
                    {documents.notas && (
                      <p className="text-sm text-green-600">✓ {documents.notas.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cédula de Identidad</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('cedula', e.target.files?.[0] || null)}
                        className="hidden"
                        id="cedula-upload"
                      />
                      <label
                        htmlFor="cedula-upload"
                        className="flex items-center justify-center w-full h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Cargar archivo
                      </label>
                    </div>
                    {documents.cedula && (
                      <p className="text-sm text-green-600">✓ {documents.cedula.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Validaciones y Compromisos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Validaciones y Compromisos</h3>
                
                <FormField
                  control={form.control}
                  name="pduCompleted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Compromiso a presentar la Prueba Diagnóstica de Ubicación (PDU)
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Confirmo que presentaré la PDU según las fechas establecidas por la universidad.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentsAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Acepto cargar todos los documentos requeridos
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Los documentos deben ser legibles y en formato PDF o imagen.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commitmentLetter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          He leído y acepto firmar la Carta Compromiso
                        </FormLabel>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground">
                            Revise los términos y condiciones.
                          </p>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-primary"
                            onClick={() => window.open('#', '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Carta Compromiso
                          </Button>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Enviar Postulación
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;