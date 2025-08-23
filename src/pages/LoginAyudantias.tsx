import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { ArrowLeft } from "lucide-react";

const LoginAyudantias = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!email || !password || !selectedRole) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Inicio de sesión exitoso",
      description: `Bienvenido al módulo de ayudantías como ${selectedRole}`,
    });

    // Store user role in localStorage
    localStorage.setItem("userRole", selectedRole);
    
    // Navigate to scholarship programs
    navigate("/scholarship-programs");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={universityCampus}
          alt="Universidad Metropolitana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl font-bold mb-4">Universidad Metropolitana</h1>
            <p className="text-xl opacity-90">Módulo de Gestión de Ayudantías</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/modules")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Módulos
          </Button>

          <Card className="border-orange/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">Iniciar Sesión</CardTitle>
              <CardDescription>Módulo de Gestión de Ayudantías</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@unimet.edu.ve"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-orange/30 focus:border-orange"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-orange/30 focus:border-orange"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Tipo de usuario</Label>
                  <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="supervisor" id="supervisor" />
                      <Label htmlFor="supervisor">Supervisor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pasante" id="pasante" />
                      <Label htmlFor="pasante">Pasante</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aspirante" id="aspirante" />
                      <Label htmlFor="aspirante">Aspirante</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-primary hover:text-primary/80"
                    onClick={() => navigate("/register-ayudantias")}
                  >
                    Regístrate aquí
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginAyudantias;