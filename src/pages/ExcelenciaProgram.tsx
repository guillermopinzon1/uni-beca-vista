import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, User, FileText, Info, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationForm from "@/components/excelencia/ApplicationForm";
import ApplicationsList from "@/components/excelencia/ApplicationsList";
import RequirementsInfo from "@/components/excelencia/RequirementsInfo";
import StudentProfile from "@/components/excelencia/StudentProfile";
import AdminPanel from "@/components/excelencia/AdminPanel";

const ExcelenciaProgram = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Programa de Becas - Excelencia</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Programa de Excelencia</h2>
          <p className="text-muted-foreground">Gestiona tus postulaciones y consulta información sobre las becas de excelencia</p>
        </div>

        <Tabs defaultValue="postular" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="postular" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Postular
            </TabsTrigger>
            <TabsTrigger value="solicitudes" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mis Solicitudes
            </TabsTrigger>
            <TabsTrigger value="requisitos" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Requisitos
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Administración
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="postular" className="mt-6">
            <ApplicationForm />
          </TabsContent>
          
          <TabsContent value="solicitudes" className="mt-6">
            <ApplicationsList />
          </TabsContent>
          
          <TabsContent value="requisitos" className="mt-6">
            <RequirementsInfo />
          </TabsContent>
          
          <TabsContent value="perfil" className="mt-6">
            <StudentProfile />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-6">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ExcelenciaProgram;