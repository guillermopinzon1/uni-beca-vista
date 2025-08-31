import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, UserCog, Shield } from "lucide-react";
import universityCampus from "/lovable-uploads/7fff67cf-5355-4c7a-9671-198edb21dc3d.png";

type RegistrationType = "student" | "admin" | "supervisor";

const Register = () => {
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
    carrera: "",
    periodoAcademico: "",
    // Admin specific
    puestoLaboral: "",
    // Supervisor specific
    nombrePlaza: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate required fields based on registration type
    const requiredFields = selectedType === "student" 
      ? [formData.name, formData.lastName, formData.email, formData.studentId, formData.cedula, formData.carrera, formData.periodoAcademico, formData.password]
      : selectedType === "admin"
      ? [formData.name, formData.lastName, formData.email, formData.puestoLaboral, formData.password]
      : [formData.name, formData.lastName, formData.nombrePlaza, formData.password];

    if (requiredFields.some(field => !field)) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show verification modal
    setShowVerification(true);
    setIsLoading(false);
  };

  const handleVerification = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast({
        title: "Error",
        description: "Por favor ingrese el código de verificación",
        variant: "destructive",
      });
      return;
    }

    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada y verificada. Redirigiendo al inicio de sesión...",
    });
    
    setTimeout(() => navigate("/login"), 1500);
  };

  const registrationTypes = [
    {
      id: "student" as RegistrationType,
      title: "Registro Usuario Estudiante",
      description: "Para estudiantes de la universidad",
      icon: User
    },
    {
      id: "admin" as RegistrationType,
      title: "Registro Administrativo",
      description: "Para personal administrativo",
      icon: UserCog
    },
    {
      id: "supervisor" as RegistrationType,
      title: "Registro Supervisor",
      description: "Para supervisores de plazas",
      icon: Shield
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
                          placeholder="nombre.apellido@universidad.edu"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentId">Carnet Estudiantil</Label>
                          <Input
                            id="studentId"
                            name="studentId"
                            type="text"
                            value={formData.studentId}
                            onChange={handleChange}
                            placeholder="2024-0001"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cedula">Cédula</Label>
                          <Input
                            id="cedula"
                            name="cedula"
                            type="text"
                            value={formData.cedula}
                            onChange={handleChange}
                            placeholder="12345678"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carrera">Carrera</Label>
                        <Select onValueChange={(value) => handleSelectChange("carrera", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu carrera" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ingenieria-sistemas">Ingeniería en Sistemas</SelectItem>
                            <SelectItem value="administracion">Administración de Empresas</SelectItem>
                            <SelectItem value="contabilidad">Contabilidad</SelectItem>
                            <SelectItem value="derecho">Derecho</SelectItem>
                            <SelectItem value="psicologia">Psicología</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodoAcademico">Período Académico</Label>
                        <Select onValueChange={(value) => handleSelectChange("periodoAcademico", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024-1">2024-1</SelectItem>
                            <SelectItem value="2024-2">2024-2</SelectItem>
                            <SelectItem value="2025-1">2025-1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="nombrePlaza">Nombre de la Plaza</Label>
                      <Input
                        id="nombrePlaza"
                        name="nombrePlaza"
                        type="text"
                        value={formData.nombrePlaza}
                        onChange={handleChange}
                        placeholder="Supervisor de Laboratorio de Computación"
                        required
                      />
                    </div>
                  )}

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
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

          {/* Email Verification Modal */}
          <Dialog open={showVerification} onOpenChange={setShowVerification}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Correo</DialogTitle>
                <DialogDescription>
                  Hemos enviado un código de verificación a tu correo electrónico. 
                  Ingresa el código de 6 dígitos para confirmar tu cuenta.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Código de Verificación</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowVerification(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleVerification}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    Verificar
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