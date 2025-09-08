import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, UserPlus, GraduationCap } from "lucide-react";

interface EstudianteSinPlaza {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  carrera: string;
  trimestre: number;
  promedio: number;
  email: string;
  telefono: string;
  tieneCV: boolean;
}

const estudiantesDummy: EstudianteSinPlaza[] = [
  {
    id: "1",
    nombre: "Pedro",
    apellido: "Jiménez",
    cedula: "29.456.789",
    carrera: "Ingeniería en Sistemas",
    trimestre: 6,
    promedio: 17.8,
    email: "pedro.jimenez@universidad.edu",
    telefono: "0412-1234567",
    tieneCV: true
  },
  {
    id: "2",
    nombre: "Elena",
    apellido: "Vargas",
    cedula: "28.987.654",
    carrera: "Administración",
    trimestre: 5,
    promedio: 16.5,
    email: "elena.vargas@universidad.edu",
    telefono: "0424-7654321",
    tieneCV: true
  },
  {
    id: "3",
    nombre: "Roberto",
    apellido: "Silva",
    cedula: "30.234.567",
    carrera: "Contaduría Pública",
    trimestre: 7,
    promedio: 18.2,
    email: "roberto.silva@universidad.edu",
    telefono: "0416-9876543",
    tieneCV: false
  },
  {
    id: "4",
    nombre: "Carmen",
    apellido: "Morales",
    cedula: "27.678.901",
    carrera: "Ingeniería Industrial",
    trimestre: 8,
    promedio: 17.1,
    email: "carmen.morales@universidad.edu",
    telefono: "0414-5432109",
    tieneCV: true
  },
  {
    id: "5",
    nombre: "Diego",
    apellido: "Ramos",
    cedula: "29.123.890",
    carrera: "Derecho",
    trimestre: 4,
    promedio: 16.9,
    email: "diego.ramos@universidad.edu",
    telefono: "0426-8765432",
    tieneCV: true
  }
];

const BuscarAyudantes = () => {
  const handleVerCV = (estudiante: EstudianteSinPlaza) => {
    if (!estudiante.tieneCV) {
      alert("Este estudiante no ha subido su CV");
      return;
    }
    // TODO: Implementar modal para mostrar CV
    console.log("Ver CV de:", estudiante.nombre, estudiante.apellido);
  };

  const handleProponer = (estudiante: EstudianteSinPlaza) => {
    // TODO: Implementar modal de propuesta
    console.log("Proponer a:", estudiante.nombre, estudiante.apellido);
  };

  const getPromedioColor = (promedio: number) => {
    if (promedio >= 18) return "text-green-600";
    if (promedio >= 16) return "text-orange";
    return "text-yellow-600";
  };

  const getPromedioVariant = (promedio: number) => {
    if (promedio >= 18) return "default";
    if (promedio >= 16) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Buscar Ayudantes</h2>
          <p className="text-muted-foreground">Encuentra estudiantes sin plaza y propón su incorporación como ayudantes</p>
        </div>
        <Badge variant="secondary" className="text-orange">
          {estudiantesDummy.length} estudiantes disponibles
        </Badge>
      </div>

      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <CardTitle className="text-primary flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Estudiantes sin Plaza de Ayudantía
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Estudiante</th>
                  <th className="text-left p-4 font-semibold text-primary">Cédula</th>
                  <th className="text-left p-4 font-semibold text-primary">Carrera</th>
                  <th className="text-center p-4 font-semibold text-primary">Trimestre</th>
                  <th className="text-center p-4 font-semibold text-primary">Promedio</th>
                  <th className="text-left p-4 font-semibold text-primary">Contacto</th>
                  <th className="text-center p-4 font-semibold text-primary">CV</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesDummy.map((estudiante, index) => (
                  <tr 
                    key={estudiante.id} 
                    className={`border-b border-orange/10 hover:bg-orange/5 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-primary">{estudiante.nombre} {estudiante.apellido}</p>
                        <p className="text-sm text-muted-foreground">{estudiante.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{estudiante.cedula}</td>
                    <td className="p-4 text-primary">{estudiante.carrera}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="border-orange/40">
                        {estudiante.trimestre}°
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge 
                        variant={getPromedioVariant(estudiante.promedio)}
                        className={`${getPromedioColor(estudiante.promedio)} border-orange/40`}
                      >
                        {estudiante.promedio}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">{estudiante.telefono}</p>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerCV(estudiante)}
                        disabled={!estudiante.tieneCV}
                        className={`${estudiante.tieneCV 
                          ? 'hover:bg-orange/10 text-orange' 
                          : 'text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProponer(estudiante)}
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Proponer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Tip: Los estudiantes con promedio verde (≥18) tienen prioridad para ayudantías académicas</p>
      </div>
    </div>
  );
};

export default BuscarAyudantes;