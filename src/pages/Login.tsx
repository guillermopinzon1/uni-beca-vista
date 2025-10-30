import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Clock, Eye, EyeOff } from "lucide-react";
import universityCampus from "/lovable-uploads/7fff67cf-5355-4c7a-9671-198edb21dc3d.png";
import { loginUser, forgotPassword } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState as useStateReact } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación de dominio de email
      if (!email.endsWith("@unimet.edu.ve") && !email.endsWith("@correo.unimet.edu.ve")) {
        throw new Error("El correo debe ser del dominio @unimet.edu.ve o @correo.unimet.edu.ve");
      }

      const result = await loginUser({ email, password });

      // Guardar en contexto + localStorage
      loginSuccess({
        ...result.data.user,
        apellido: result.data.user.apellido || ""
      }, result.data.tokens);

      // Verificar si es primer login (debe cambiar contraseña)
      if (result.data.user.firstLogin === true) {
        toast({
          title: "Cambio de contraseña requerido",
          description: "Por seguridad, debes cambiar tu contraseña temporal antes de continuar",
        });
        navigate("/cambiar-password-obligatorio");
        return;
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: result.message || "Bienvenido al Sistema de Gestión de Becas",
      });

      // Navegar según el rol que retorna el backend
      const role = result.data.user.role;
      const tipoBeca = result.data.user.tipoBeca; // El backend ahora incluye tipoBeca en la respuesta del login

      if (role === "estudiante") {
        // Redirigir según el tipo de beca del estudiante
        if (tipoBeca === "Ayudantía") {
          navigate("/pasante-ayudantias-modules");
        } else if (tipoBeca === "Excelencia") {
          navigate("/excelencia");
        } else if (tipoBeca === "Impacto") {
          navigate("/impacto");
        } else if (tipoBeca === "Exoneración de Pago") {
          navigate("/exoneracion");
        } else if (tipoBeca === "Formación Docente") {
          navigate("/formacion-docente");
        } else {
          // Fallback: si no coincide ningún tipo, ir a selección de módulos
          navigate("/modules");
        }
      } else if (role === "supervisor") {
        navigate("/supervisor-laboral-dashboard");
      } else if (role === "mentor") {
        navigate("/mentor-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "director-area") {
        navigate("/director-area-dashboard");
      } else if (role === "capital-humano") {
        navigate("/capital-humano-dashboard");
      } else if (role === "supervisor-laboral") {
        navigate("/supervisor-laboral-dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Credenciales inválidas";
      const isPendingApproval = errorMessage.toLowerCase().includes('pendiente de aprobación');

      toast({
        title: isPendingApproval ? "Cuenta Pendiente de Aprobación" : "Error de inicio de sesión",
        description: errorMessage,
        variant: isPendingApproval ? "default" : "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);

    try {
      if (!forgotEmail.endsWith("@unimet.edu.ve") && !forgotEmail.endsWith("@correo.unimet.edu.ve")) {
        throw new Error("El correo debe ser del dominio @unimet.edu.ve o @correo.unimet.edu.ve");
      }

      await forgotPassword(forgotEmail);
      toast({
        title: "Solicitud enviada",
        description: "Si el email existe, recibirás instrucciones para restablecer tu contraseña",
      });
      setIsForgotPasswordOpen(false);
      setForgotEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la solicitud de recuperación",
        variant: "destructive",
      });
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

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

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Universidad Metropolitana</h1>
            <p className="text-muted-foreground">Sistema de Gestión de Becas</p>
          </div>
          
          <Card className="border-orange/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.email@universidad.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                {/* El rol ahora lo determina el backend a partir del email */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Recuperar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu correo electrónico institucional y te enviaremos instrucciones para restablecer tu contraseña.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <Label htmlFor="forgot-email">Correo Electrónico</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="tu.email@unimet.edu.ve o @correo.unimet.edu.ve"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsForgotPasswordOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isForgotPasswordLoading}
                        >
                          {isForgotPasswordLoading ? "Enviando..." : "Enviar"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Regístrate aquí
                  </Link>
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="mt-4"
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;