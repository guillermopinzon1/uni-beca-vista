import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import universityCampus from "/lovable-uploads/7fff67cf-5355-4c7a-9671-198edb21dc3d.png";
import { changePassword } from "@/lib/api/auth";
import { useAuth } from "@/contexts/AuthContext";

const ChangePasswordRequired = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tokens, user } = useAuth();

  // Validar requisitos de contraseña
  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Mínimo 8 caracteres");
    }
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("Al menos una letra");
    }
    if (!/\d/.test(password)) {
      errors.push("Al menos un número");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Al menos un carácter especial (@$!%*?&)");
    }
    if (/\s/.test(password)) {
      errors.push("No puede contener espacios");
    }

    return errors;
  };

  const passwordErrors = validatePassword(newPassword);
  const isPasswordValid = passwordErrors.length === 0 && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña no cumple con los requisitos de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = tokens?.accessToken;
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso");
      }

      await changePassword({
        passwordActual: currentPassword,
        nuevaPassword: newPassword,
      }, accessToken);

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente. Ahora puedes acceder al sistema.",
      });

      // Redirigir al dashboard según el rol
      const role = user?.role;
      if (role === "estudiante") {
        navigate("/pasante-ayudantias-modules");
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
        navigate("/modules");
      }
    } catch (err: any) {
      toast({
        title: "Error al cambiar contraseña",
        description: err?.message || "No se pudo cambiar la contraseña. Verifica que la contraseña actual sea correcta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <Shield className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Seguridad de tu Cuenta</h1>
            <p className="text-xl opacity-90">Por tu seguridad, debes cambiar tu contraseña temporal</p>
          </div>
        </div>
      </div>

      {/* Right side - Change Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold text-primary mb-2">Cambio de Contraseña Obligatorio</h1>
            <p className="text-muted-foreground">Por seguridad, debes cambiar tu contraseña</p>
          </div>

          <Card className="border-orange/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Cambiar Contraseña Temporal</CardTitle>
              <CardDescription>
                Por seguridad, debes cambiar tu contraseña temporal antes de continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Alert info */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>Esta es tu contraseña temporal enviada por email. Debes cambiarla para acceder al sistema.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contraseña Actual */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Temporal (Actual)</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Ingresa la contraseña temporal"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Nueva Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {/* Requisitos de contraseña */}
                  {newPassword && (
                    <div className="text-sm space-y-1 mt-2">
                      <p className={`${newPassword.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                        {newPassword.length >= 8 ? '✓' : '✗'} Mínimo 8 caracteres
                      </p>
                      <p className={`${/[a-zA-Z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                        {/[a-zA-Z]/.test(newPassword) ? '✓' : '✗'} Al menos una letra
                      </p>
                      <p className={`${/\d/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                        {/\d/.test(newPassword) ? '✓' : '✗'} Al menos un número
                      </p>
                      <p className={`${/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                        {/[@$!%*?&]/.test(newPassword) ? '✓' : '✗'} Al menos un carácter especial (@$!%*?&)
                      </p>
                      <p className={`${!/\s/.test(newPassword) && newPassword.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {!/\s/.test(newPassword) && newPassword.length > 0 ? '✓' : '✗'} Sin espacios
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-600">Las contraseñas no coinciden</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
                >
                  {isLoading ? "Cambiando contraseña..." : "Cambiar Contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordRequired;
