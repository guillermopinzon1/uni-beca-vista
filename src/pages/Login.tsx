import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import universityCampus from "/lovable-uploads/7fff67cf-5355-4c7a-9671-198edb21dc3d.png";
import { loginUser, forgotPassword } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const BECA_ROUTES: Record<string, string> = {
  "Ayudantía": "/pasante-ayudantias-modules",
  "Excelencia": "/excelencia",
  "Impacto": "/impacto",
  "Exoneración de Pago": "/exoneracion",
  "Formación Docente": "/formacion-docente",
};

const ROLE_ROUTES: Record<string, string> = {
  "supervisor": "/supervisor-laboral-dashboard",
  "supervisor-laboral": "/supervisor-laboral-dashboard",
  "mentor": "/mentor-dashboard",
  "admin": "/admin-dashboard",
  "director-area": "/director-area-dashboard",
  "capital-humano": "/capital-humano-dashboard",
  "aspirante": "/modules",
  "especialista": "/dashboard-especialista",
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const getRedirectPath = (user: any) => {
    if (user.role === "estudiante") {
      return BECA_ROUTES[user.tipoBeca] || "/modules";
    }
    return ROLE_ROUTES[user.role] || "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Por favor, ingresa un correo electrónico válido");
      }

      const result = await loginUser({ email, password });
      const { user, tokens } = result.data;

      loginSuccess({
        ...user,
        apellido: user.apellido || ""
      }, tokens);

      if (user.firstLogin) {
        toast({
          title: "Cambio de contraseña requerido",
          description: "Por seguridad, debes cambiar tu contraseña temporal",
        });
        return navigate("/cambiar-password-obligatorio");
      }

      toast({
        title: "Bienvenido",
        description: `Hola, ${user.nombre}. Inicio de sesión exitoso.`,
      });

      navigate(getRedirectPath(user));

    } catch (err: any) {
      const errorMessage = err?.message || "Credenciales inválidas";
      toast({
        title: "Error de acceso",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);

    try {
      await forgotPassword(forgotEmail);
      toast({
        title: "Correo enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
      });
      setIsForgotPasswordOpen(false);
      setForgotEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* 1. Fondo (Igual al Registro) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105" 
          style={{ backgroundImage: `url(${universityCampus})` }} 
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />
      </div>

      {/* 2. Tarjeta Centrada (Ajustada a max-w-lg) */}
      <div className="relative z-10 w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden flex flex-col rounded-2xl">
          
          <CardHeader className="pt-8 pb-4 text-center shrink-0">
            {/* Logo integrado dentro de la tarjeta igual que en Registro */}
            <div className="mb-4">
              <img 
                src="/lovable-uploads/UNIMETLogo.png" 
                alt="UNIMET Logo" 
                className="w-48 h-auto mx-auto" 
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 tracking-tight">Iniciar Sesión</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Usa tu cuenta institucional para acceder al sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.unimet.edu.ve"
                  required
                  className="h-11 rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase text-gray-500 tracking-wider ml-1">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10 rounded-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-bold shadow-lg transition-all rounded-lg mt-6 active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Accediendo...</>
                ) : (
                  "Entrar al Sistema"
                )}
              </Button>
            </form>
            
            <div className="flex flex-col gap-3 text-center pt-6 mt-4 border-t border-gray-100">
              <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm font-medium text-gray-500 hover:text-orange-600">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Recuperar Acceso</DialogTitle>
                    <DialogDescription>
                      Te enviaremos las instrucciones de restablecimiento a tu email.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
                    <Input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="tu-email@unimet.edu.ve"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-600 font-bold" 
                      disabled={isForgotPasswordLoading}
                    >
                      {isForgotPasswordLoading ? "Enviando..." : "Enviar Instrucciones"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <p className="text-sm text-gray-500">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-orange-600 font-bold hover:underline ml-1">
                  Regístrate
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="w-full mt-6 text-white/70 hover:text-white hover:bg-white/10 transition-all font-medium"
        >
          Volver a la página de inicio
        </Button>
      </div>
    </div>
  );
};

export default Login;