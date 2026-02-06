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
import { ChevronsUpDown, Eye, EyeOff, Loader2, CheckCircle, Clock, User, UserCog, Shield, ArrowLeft, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import universityCampus from "../assets/Universidad-Metropolitana.jpg";
import { registerUser, loginUser } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";

type RegistrationType = "student" | "admin" | "supervisor" | "especialista" | "aspirante";

const Register = () => {
  const { loginSuccess } = useAuth();
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);
  const [formData, setFormData] = useState({
    name: "", lastName: "", email: "", password: "", confirmPassword: "",
    studentId: "", cedula: "", telefono: "+58 ", carrera: "", trimestre: "",
    puestoLaboral: "", departamento: "", cargo: "",
    nombrePlaza: "", cedulaTipo: "V", cedulaNumero: "",
    especialidad: "", numColegiado: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isOtherDept, setIsOtherDept] = useState(false);
  const [isOtherCarrera, setIsOtherCarrera] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCedulaChange = (tipo: string, numero: string) => {
    const cleanNumero = numero.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      cedulaTipo: tipo,
      cedulaNumero: cleanNumero,
      cedula: cleanNumero ? `${tipo}-${cleanNumero}` : ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const telefonoTrim = (formData.telefono || "").trim();
      if (telefonoTrim.length < 7) {
        throw new Error("El teléfono debe tener al menos 7 caracteres (incluye código de país, ej: +58 412 1234567)");
      }

      const registerData: any = {
        email: formData.email,
        password: formData.password,
        nombre: formData.name,
        apellido: formData.lastName,
        cedula: formData.cedula,
        telefono: telefonoTrim,
        role: selectedType === "student" ? "estudiante" : (selectedType || "estudiante")
      };

      if (selectedType === "student") {
        if (formData.studentId) registerData.carnet = formData.studentId;
        if (formData.carrera) registerData.carrera = formData.carrera;
        if (formData.trimestre) registerData.trimestre = parseInt(formData.trimestre);
      } else if (selectedType === "admin" || selectedType === "supervisor" || selectedType === "especialista") {
        if (formData.departamento) registerData.departamento = formData.departamento;
        if (formData.cargo) registerData.cargo = formData.cargo;
      }

      await registerUser(registerData);

      if (selectedType === "student" || selectedType === "aspirante") {
        const loginResult = await loginUser({ email: formData.email, password: formData.password });
        loginSuccess(loginResult.data.user, loginResult.data.tokens);
        navigate('/modules', { state: { newRegistration: true, userEmail: formData.email } });
      } else {
        setShowSuccessMessage(true);
      }
    } catch (err: any) {
      let description = err?.message || "No se pudo completar el registro";
      try {
        const parsed = typeof err?.message === "string" && err.message.startsWith("{") ? JSON.parse(err.message) : null;
        if (parsed?.details?.validationErrors?.length) {
          description = parsed.details.validationErrors.map((e: { field: string; message: string }) => e.message).join(". ");
        }
      } catch (_) {}
      toast({
        title: "Error en el registro",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registrationTypes = [
    { id: "student" as RegistrationType, title: "Registro Usuario", description: "Estudiantes de la universidad", icon: User },
    { id: "supervisor" as RegistrationType, title: "Registro Supervisor", description: "Supervisores de plazas", icon: Shield },
    { id: "especialista" as RegistrationType, title: "Registro Especialista", description: "Psicólogo / Orientador", icon: UserCog },
    { id: "aspirante" as RegistrationType, title: "Registro Aspirante", description: "Aspirante de Orientación Vocacional", icon: Compass }
  ];

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* 1. Fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${universityCampus})` }} />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />
      </div>

      {/* 2. Tarjeta Centrada */}
      <div className="relative z-10 w-full max-w-lg flex flex-col max-h-[95vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden flex flex-col rounded-2xl">
          
          <CardHeader className="pt-8 pb-4 text-center shrink-0">
            {/* Logo integrado dentro de la tarjeta */}
            <div className="mb-4">
              <img 
                src="/lovable-uploads/UNIMETLogo.png" 
                alt="UNIMET Logo" 
                className="w-48 h-auto mx-auto" 
              />
            </div>
            
            {!selectedType ? (
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-800 tracking-tight">Crear Cuenta</CardTitle>
                <CardDescription className="text-gray-500 text-sm">Selecciona tu perfil de usuario</CardDescription>
              </div>
            ) : (
              <div className="flex items-center justify-between px-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)} className="text-gray-500 hover:text-orange-600">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Volver
                </Button>
                <CardTitle className="text-lg font-bold text-gray-800">
                  {registrationTypes.find(t => t.id === selectedType)?.title}
                </CardTitle>
                <div className="w-16"></div>
              </div>
            )}
          </CardHeader>

          {/* CONTENIDO SCROLLABLE EN UNA SOLA COLUMNA */}
          <CardContent className="overflow-y-auto px-8 py-2 scrollbar-thin scrollbar-thumb-orange-200">
            {!selectedType ? (
              <div className="space-y-3 pb-6">
                {registrationTypes.map((type) => (
                  <div 
                    key={type.id} 
                    onClick={() => setSelectedType(type.id)} 
                    className="flex items-center p-4 rounded-xl border border-gray-100 bg-white hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <type.icon size={22} />
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-bold text-gray-800 text-sm">{type.title}</h3>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Nombre</Label>
                  <Input name="name" required onChange={handleChange} className="h-11 rounded-lg border-gray-200" placeholder="Ej: Juan" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Apellido</Label>
                  <Input name="lastName" required onChange={handleChange} className="h-11 rounded-lg border-gray-200" placeholder="Ej: Pérez" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Correo Electrónico</Label>
                  <Input name="email" type="email" required onChange={handleChange} className="h-11 rounded-lg border-gray-200" placeholder={selectedType === "aspirante" ? "tu@gmail.com" : "usuario@unimet.edu.ve"} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Cédula de Identidad</Label>
                  <div className="flex gap-2">
                    <Select value={formData.cedulaTipo} onValueChange={(t) => handleCedulaChange(t, formData.cedulaNumero)}>
                      <SelectTrigger className="w-24 h-11 rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="V">V-</SelectItem><SelectItem value="E">E-</SelectItem></SelectContent>
                    </Select>
                    <Input placeholder="12345678" value={formData.cedulaNumero} onChange={(e) => handleCedulaChange(formData.cedulaTipo, e.target.value)} required className="h-11 rounded-lg flex-1" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Teléfono</Label>
                  <Input
                    name="telefono"
                    type="tel"
                    required
                    minLength={7}
                    value={formData.telefono}
                    onChange={handleChange}
                    className="h-11 rounded-lg border-gray-200"
                    placeholder="Ej: +58 412 1234567"
                  />
                  <p className="text-xs text-gray-500 ml-1">Mínimo 7 caracteres (incl. código de país)</p>
                </div>

                {selectedType === "especialista" && (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Nro. Colegiado</Label>
                    <Input name="numColegiado" placeholder="FPV-XXXXX" onChange={handleChange} className="h-11 rounded-lg" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Contraseña</Label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange} className="h-11 pr-10 rounded-lg" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required onChange={handleChange} className="h-11 pr-10 rounded-lg" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-bold shadow-lg transition-all rounded-lg mt-6">
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Completar Registro"}
                </Button>
              </form>
            )}
          </CardContent>
          
          <div className="py-5 text-center border-t border-gray-100 bg-gray-50/50 shrink-0">
            <p className="text-sm text-gray-500 font-medium">
              ¿Ya eres usuario? <Link to="/login" className="text-orange-600 font-bold hover:underline ml-1">Inicia sesión</Link>
            </p>
          </div>
        </Card>
      </div>

      <Dialog open={showSuccessMessage} onOpenChange={setShowSuccessMessage}>
        <DialogContent className="sm:max-w-md text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-2" />
          <DialogTitle className="text-xl font-bold">¡Registro Exitoso!</DialogTitle>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-left mt-2 flex gap-3">
            <Clock className="text-orange-600 shrink-0" size={20} />
            <p className="text-sm text-orange-900 leading-relaxed">Tu cuenta ha sido creada y está <strong>pendiente de aprobación</strong>.</p>
          </div>
          <Button onClick={() => navigate("/login")} className="w-full bg-orange-600 mt-6 h-11 font-bold rounded-lg">Volver al Login</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;