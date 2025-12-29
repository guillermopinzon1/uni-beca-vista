import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check, Eye, EyeOff, Brain, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { User, UserCog, Shield, CheckCircle, Clock } from "lucide-react";
import universityCampus from "/lovable-uploads/7fff67cf-5355-4c7a-9671-198edb21dc3d.png";
import { registerUser, loginUser } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";

type RegistrationType = "student" | "admin" | "supervisor" | "especialista" | "aspirante";

const Register = () => {
  const { loginSuccess } = useAuth();
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    studentId: "",
    cedula: "",
    telefono: "+58 212 1234567",
    carrera: "",
    trimestre: "",
    // Admin specific
    puestoLaboral: "",
    departamento: "",
    cargo: "",
    // Supervisor specific
    nombrePlaza: "",
    cedulaTipo: "V",
    cedulaNumero: "",
    // Especialista Especific
    especialidad: "",
    numColegiado: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isOtherDept, setIsOtherDept] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtherCarrera, setIsOtherCarrera] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCedulaChange = (tipo: string, numero: string) => {
    setFormData(prev => ({
      ...prev,
      cedulaTipo: tipo,
      cedulaNumero: numero,
      cedula: numero ? `${tipo}-${numero}` : ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      // Validate required fields based on registration type
      const requiredFields = selectedType === "student"
      ? [formData.name, formData.lastName, formData.email, formData.cedula, formData.password]
      : selectedType === "admin"
      ? [formData.name, formData.lastName, formData.email, formData.password]
      : selectedType === "especialista"
      ? [formData.name, formData.lastName, formData.email, formData.cedula, formData.password]
      : selectedType === "aspirante"
      ? [formData.name, formData.lastName, formData.email, formData.cedula, formData.password]
      : [formData.name, formData.lastName, formData.email, formData.cedula, formData.password];
      if (requiredFields.some(field => !field)) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      // Preparar datos para el registro
      const registerData: any = {
        email: formData.email,
        password: formData.password,
        nombre: formData.name,
        apellido: formData.lastName,
        cedula: formData.cedula,
        telefono: formData.telefono,
        role: selectedType === "student"
        ? "estudiante"
        : selectedType === "admin"
        ? "admin"
        : selectedType === "especialista"
        ? "especialista"
        : selectedType === "aspirante"
        ? "aspirante"
        : selectedType === "supervisor"
        ? "supervisor"
        : "estudiante"
      };

      if (selectedType === "student") {
        if (formData.studentId) registerData.carnet = formData.studentId;
        if (formData.carrera) registerData.carrera = formData.carrera;
        if (formData.trimestre) registerData.trimestre = parseInt(formData.trimestre);
      } else if (selectedType === "admin") {
        if (formData.departamento) registerData.departamento = formData.departamento;
        if (formData.cargo) registerData.cargo = formData.cargo;
      } else if (selectedType === "supervisor") {
        if (formData.departamento) registerData.departamento = formData.departamento;
        if (formData.cargo) registerData.cargo = formData.cargo;
      } else if (selectedType === "especialista") {
        // Agregar esto
        if (formData.departamento) registerData.departamento = formData.departamento;
        if (formData.cargo) registerData.cargo = formData.cargo;
      } else if (selectedType === "aspirante") {
        // Agregar esto (aspirante no necesita campos adicionales, pero puedes agregar si quieres)
        // Por ahora no necesita campos adicionales
      }

      // Llamar al endpoint de registro
      const result = await registerUser(registerData);

      console.log('✅ Usuario registrado exitosamente:', result);

      // Si es estudiante, hacer auto-login y redirigir a /modules
      if (selectedType === "student" || selectedType === "aspirante") {
        try {
          // Auto-login para entrar directamente
          const loginResult = await loginUser({
            email: formData.email,
            password: formData.password
          });

          console.log('🔐 Auto-login exitoso');

          // Guardar en el contexto
          loginSuccess(loginResult.data.user, loginResult.data.tokens);

          // Redirigir a modules con flag de nuevo registro
          navigate('/modules', {
            state: { newRegistration: true, userEmail: formData.email }
          });
          return;
        } catch (loginError) {
          console.error('❌ Error al hacer auto-login:', loginError);
          // Si hay error, mostrar el mensaje de éxito normal
          setShowSuccessMessage(true);
        }
      } else {
        // Para admin y supervisor, mostrar mensaje de éxito normal
        setShowSuccessMessage(true);
      }
    } catch (err: any) {
      console.error('Error en registro:', err);
      
      // Manejar errores de validación específicos
      if (err.message && err.message.includes('validationErrors')) {
        // Si el error contiene detalles de validación, mostrarlos
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.details && errorData.details.validationErrors) {
            const validationErrors = errorData.details.validationErrors;
            validationErrors.forEach((error: any) => {
              toast({
                title: "Error de validación",
                description: `${error.field}: ${error.message}`,
                variant: "destructive",
              });
            });
            return;
          }
        } catch (parseError) {
          // Si no se puede parsear, mostrar el mensaje original
        }
      }
      
      // Mostrar error general
      toast({
        title: "Error en el registro",
        description: err?.message || "No se pudo completar el registro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registrationTypes = [
    {
      id: "student" as RegistrationType,
      title: "Registro Usuario",
      description: "Para estudiantes de la universidad",
      icon: User
    },
    {
      id: "supervisor" as RegistrationType,
      title: "Registro Supervisor",
      description: "Para supervisores de plazas",
      icon: Shield
    },
    {
      id: "especialista" as RegistrationType,
      title: "Registro Especialista",
      description: "Para Psicólogo/Orientador",
      icon: UserCog
    },
    {
      id: "aspirante" as RegistrationType,
      title: "Registro Aspirante",
      description: "Para Aspirante",
      icon: User
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={universityCampus}
          alt="Universidad Metropolitana"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-hero flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Universidad Metropolitana</h1>
            <p className="text-xl opacity-90">Sistema de Gestión de Becas</p>
          </div> 
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Universidad Metropolitana</h1>
            <p className="text-muted-foreground">Sistema de Gestión de Becas</p>
          </div>
          
          {!selectedType ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary mb-2">Crear Cuenta</h2>
                <p className="text-muted-foreground">Selecciona el tipo de registro</p>
              </div>

              <div className="grid gap-4">
                {registrationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.id}
                      className="border-orange/20 hover:border-primary/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-primary">{type.title}</CardTitle>
                            <CardDescription className="text-sm">{type.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
              
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          ) : (
            <Card className="border-orange/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">
                  {registrationTypes.find(t => t.id === selectedType)?.title}
                </CardTitle>
                <CardDescription>
                  Complete los datos para crear su cuenta
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedType(null)}
                    className="flex-1"
                  >
                    Cambiar Tipo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    Volver al Inicio
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Common fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Juan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>

                  {/* Student specific fields */}
                  {selectedType === "student" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Institucional</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre.apellido@unimet.edu.ve"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula</Label>
                        <div className="flex gap-2">
                          <Select value={formData.cedulaTipo} onValueChange={(tipo) => handleCedulaChange(tipo, formData.cedulaNumero)}>
                            <SelectTrigger className="w-20">
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
                            value={formData.cedulaNumero}
                            onChange={(e) => handleCedulaChange(formData.cedulaTipo, e.target.value)}
                            className="flex-1"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Carnet Estudiantil <span className="text-muted-foreground">(opcional)</span></Label>
                        <Input
                          id="studentId"
                          name="studentId"
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setFormData({ ...formData, studentId: value });
                          }}
                          placeholder="20191110205"
                          maxLength={12}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carrera">Carrera <span className="text-muted-foreground">(opcional)</span></Label>
                        <Select
                          value={isOtherCarrera ? "Otra" : formData.carrera}
                          onValueChange={(value) => {
                            if (value === "Otra") {
                              setIsOtherCarrera(true);
                              handleSelectChange("carrera", "");
                            } else {
                              setIsOtherCarrera(false);
                              handleSelectChange("carrera", value);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu carrera (opcional)" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {/* Facultad de Ingeniería */}
                            <SelectItem value="Ingeniería Civil">Ingeniería Civil</SelectItem>
                            <SelectItem value="Ingeniería Eléctrica">Ingeniería Eléctrica</SelectItem>
                            <SelectItem value="Ingeniería Mecánica">Ingeniería Mecánica</SelectItem>
                            <SelectItem value="Ingeniería Química">Ingeniería Química</SelectItem>
                            <SelectItem value="Ingeniería de Sistemas">Ingeniería de Sistemas</SelectItem>
                            <SelectItem value="Ingeniería de Producción">Ingeniería de Producción</SelectItem>

                            {/* Facultad de Ciencias Económicas y Sociales */}
                            <SelectItem value="Ciencias Administrativas">Ciencias Administrativas</SelectItem>
                            <SelectItem value="Contaduría Pública">Contaduría Pública</SelectItem>
                            <SelectItem value="Economía Empresarial">Economía Empresarial</SelectItem>

                            {/* Facultad de Ciencias */}
                            <SelectItem value="Psicología">Psicología</SelectItem>
                            <SelectItem value="Matemáticas Industriales">Matemáticas Industriales</SelectItem>

                            {/* Facultad de Estudios Jurídicos y Políticos */}
                            <SelectItem value="Derecho">Derecho</SelectItem>
                            <SelectItem value="Estudios Liberales">Estudios Liberales</SelectItem>

                            {/* Facultad de Humanidades */}
                            <SelectItem value="Comunicación Social y Empresarial">Comunicación Social y Empresarial</SelectItem>
                            <SelectItem value="Educación">Educación</SelectItem>
                            <SelectItem value="Idiomas Modernos">Idiomas Modernos</SelectItem>
                            <SelectItem value="Turismo Sostenible">Turismo Sostenible</SelectItem>

                            {/* Opción para escribir otra carrera */}
                            <SelectItem value="Otra">Otra</SelectItem>
                          </SelectContent>
                        </Select>
                        {isOtherCarrera && (
                          <div className="mt-2">
                            <Input
                              id="carreraOtra"
                              name="carrera"
                              type="text"
                              value={formData.carrera}
                              onChange={handleChange}
                              placeholder="Escribe tu carrera"
                            />
                          </div>
                        )}
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="trimestre">Trimestre <span className="text-muted-foreground">(opcional)</span></Label>
                        <Select onValueChange={(value) => handleSelectChange("trimestre", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu trimestre (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
                              <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div> */}
                    </>
                  )}

                  {/* Admin specific fields */}
                  {selectedType === "admin" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Institucional Administrativo</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre.apellido@admin.universidad.edu"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="puestoLaboral">Puesto Laboral</Label>
                        <Select onValueChange={(value) => handleSelectChange("puestoLaboral", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu puesto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coordinador-becas">Coordinador de Becas</SelectItem>
                            <SelectItem value="director-academico">Director Académico</SelectItem>
                            <SelectItem value="secretario-general">Secretario General</SelectItem>
                            <SelectItem value="jefe-recursos-humanos">Jefe de Recursos Humanos</SelectItem>
                            <SelectItem value="analista-financiero">Analista Financiero</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {/* Supervisor specific fields */}
                  {selectedType === "supervisor" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Institucional</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre.apellido@unimet.edu.ve"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula</Label>
                        <div className="flex gap-2">
                          <Select value={formData.cedulaTipo} onValueChange={(tipo) => handleCedulaChange(tipo, formData.cedulaNumero)}>
                            <SelectTrigger className="w-20">
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
                            value={formData.cedulaNumero}
                            onChange={(e) => handleCedulaChange(formData.cedulaTipo, e.target.value)}
                            className="flex-1"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="+58 212 1234567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Popover open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={isDeptOpen}
                              className="w-full justify-between"
                            >
                              {formData.departamento ? formData.departamento : "Selecciona un departamento"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Buscar departamento..." />
                              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Matemáticas"); setIsDeptOpen(false); }}>Departamento de Matemáticas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Física"); setIsDeptOpen(false); }}>Departamento de Física</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Química y Biología"); setIsDeptOpen(false); }}>Departamento de Química y Biología</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Ciencias de la Computación"); setIsDeptOpen(false); }}>Departamento de Ciencias de la Computación</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Ingeniería Civil"); setIsDeptOpen(false); }}>Escuela de Ingeniería Civil</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Ingeniería Química"); setIsDeptOpen(false); }}>Escuela de Ingeniería Química</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Ingeniería de Sistemas"); setIsDeptOpen(false); }}>Escuela de Ingeniería de Sistemas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Ingeniería de Producción"); setIsDeptOpen(false); }}>Escuela de Ingeniería de Producción</CommandItem>
                                </CommandGroup>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Administración de Empresas"); setIsDeptOpen(false); }}>Departamento de Administración de Empresas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Finanzas"); setIsDeptOpen(false); }}>Departamento de Finanzas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Ciencias Administrativas"); setIsDeptOpen(false); }}>Escuela de Ciencias Administrativas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Economía Empresarial"); setIsDeptOpen(false); }}>Escuela de Economía Empresarial</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Contaduría Pública"); setIsDeptOpen(false); }}>Escuela de Contaduría Pública</CommandItem>
                                </CommandGroup>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Psicología"); setIsDeptOpen(false); }}>Escuela de Psicología</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Educación"); setIsDeptOpen(false); }}>Escuela de Educación</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Derecho"); setIsDeptOpen(false); }}>Escuela de Derecho</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Estudios Liberales"); setIsDeptOpen(false); }}>Escuela de Estudios Liberales</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Estudios Internacionales"); setIsDeptOpen(false); }}>Escuela de Estudios Internacionales</CommandItem>
                                </CommandGroup>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Administración de Empresas (Posgrado)"); setIsDeptOpen(false); }}>Departamento de Administración de Empresas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Finanzas (Posgrado)"); setIsDeptOpen(false); }}>Departamento de Finanzas</CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Departamento de Matemáticas (Posgrado)"); setIsDeptOpen(false); }}>Departamento de Matemáticas</CommandItem>
                                </CommandGroup>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(true); handleSelectChange("departamento", "Otro"); setIsDeptOpen(false); }}>Otro</CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {isOtherDept && (
                          <div className="mt-2">
                            <Label htmlFor="departamentoOtro">Especifica el departamento</Label>
                            <Input
                              id="departamentoOtro"
                              name="departamento"
                              type="text"
                              value={formData.departamento === "Otro" ? "" : formData.departamento}
                              onChange={(e) => handleSelectChange("departamento", e.target.value)}
                              placeholder="Escribe el nombre del departamento"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          name="cargo"
                          type="text"
                          value={formData.cargo}
                          onChange={handleChange}
                          placeholder="Ej: Profesor Asociado"
                        />
                      </div>
                    </>
                  )}

                  {/* Specialist specific fields */}
                  {selectedType === "especialista" && (
                    <>
                      {/* Email con validación visual */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Institucional</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre.apellido@unimet.edu.ve"
                          required
                          className={formData.email && !formData.email.endsWith('@unimet.edu.ve') ? "border-destructive" : ""}
                        />
                        <p className="text-xs text-muted-foreground">
                          Debe ser un email institucional @unimet.edu.ve
                        </p>
                      </div>

                      {/* Cédula - Asegúrate de que handleCedulaChange use value.replace(/\D/g, '') */}
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={formData.cedulaTipo || "V"} 
                            onValueChange={(tipo) => handleCedulaChange(tipo, formData.cedulaNumero)}
                          >
                            <SelectTrigger className="w-20">
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
                            value={formData.cedulaNumero}
                            onChange={(e) => handleCedulaChange(formData.cedulaTipo, e.target.value)}
                            className="flex-1"
                            required
                          />
                        </div>
                      </div>

                      {/* Departamento con lógica de "Otro" más segura */}
                      <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Popover open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {/* Si es "Otro", mostrar "Otro", sino mostrar el valor real */}
                              {isOtherDept ? "Otro" : (formData.departamento || "Selecciona un departamento")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput placeholder="Buscar departamento..." />
                              <CommandList>
                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                <CommandGroup>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Orientación Vocacional"); setIsDeptOpen(false); }}>
                                    Orientación Vocacional
                                  </CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(false); handleSelectChange("departamento", "Escuela de Psicología"); setIsDeptOpen(false); }}>
                                    Escuela de Psicología
                                  </CommandItem>
                                  <CommandItem onSelect={() => { setIsOtherDept(true); handleSelectChange("departamento", ""); setIsDeptOpen(false); }}>
                                    Otro
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {isOtherDept && (
                          <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                            <Label htmlFor="departamentoOtro">Especifique el departamento</Label>
                            <Input
                              id="departamentoOtro"
                              placeholder="Escriba el nombre del departamento"
                              value={formData.departamento}
                              onChange={(e) => handleSelectChange("departamento", e.target.value)}
                              required
                            />
                          </div>
                        )}
                      </div>
                      {/* Campos opcionales */}
                      <div className="space-y-2">
                        <Label htmlFor="especialidad">Especialidad <span className="text-muted-foreground">(opcional)</span></Label>
                        <Input
                          id="especialidad"
                          name="especialidad"
                          placeholder="Ej: Psicología Clínica / Orientador Vocacional"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numColegiado">Número de Colegiado <span className="text-muted-foreground">(opcional)</span></Label>
                        <Input
                          id="numColegiado"
                          name="numColegiado"
                          placeholder="FPV-XXXXX"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Aspirant specific fields */}
                  {selectedType === "aspirante" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="nombre.apellido@gmail.com"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Puedes usar cualquier email (no requiere email UNIMET)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula</Label>
                        <div className="flex gap-2">
                          <Select value={formData.cedulaTipo} onValueChange={(tipo) => handleCedulaChange(tipo, formData.cedulaNumero)}>
                            <SelectTrigger className="w-20">
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
                            value={formData.cedulaNumero}
                            onChange={(e) => handleCedulaChange(formData.cedulaTipo, e.target.value)}
                            className="flex-1"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="+58 212 1234567"
                        />
                      </div>
                    </>
                  )}

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message - Pendiente de Aprobación */}
          <Dialog open={showSuccessMessage} onOpenChange={setShowSuccessMessage}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <DialogTitle className="text-center text-2xl">¡Registro Exitoso!</DialogTitle>
                <DialogDescription className="text-center pt-4">
                  Tu cuenta ha sido creada correctamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Pendiente de Aprobación</h4>
                      <p className="text-sm text-yellow-800">
                        Un administrador debe aprobar tu cuenta antes de que puedas iniciar sesión.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-muted-foreground">Registro completado</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <p className="text-sm text-muted-foreground">Esperando aprobación</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <p className="text-sm text-muted-foreground">Recibirás un correo cuando sea aprobada</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <p className="text-sm text-muted-foreground">Podrás iniciar sesión</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setShowSuccessMessage(false);
                      navigate("/login");
                    }}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    Entendido
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Register;