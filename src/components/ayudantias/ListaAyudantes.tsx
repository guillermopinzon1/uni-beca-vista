import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface Ayudante {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  horasRegistradas: number;
  horasPendientes: number;
}

const ayudantesDummy: Ayudante[] = [
  {
    id: "1",
    nombre: "María",
    apellido: "González",
    cedula: "27.543.123",
    horasRegistradas: 45,
    horasPendientes: 8
  },
  {
    id: "2", 
    nombre: "Carlos",
    apellido: "Rodríguez",
    cedula: "29.876.456",
    horasRegistradas: 32,
    horasPendientes: 12
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    cedula: "28.234.789",
    horasRegistradas: 67,
    horasPendientes: 5
  },
  {
    id: "4",
    nombre: "Luis",
    apellido: "Hernández", 
    cedula: "26.987.321",
    horasRegistradas: 28,
    horasPendientes: 15
  },
  {
    id: "5",
    nombre: "Sofia",
    apellido: "López",
    cedula: "30.123.654",
    horasRegistradas: 41,
    horasPendientes: 7
  }
];

const ListaAyudantes = () => {
  const handleVerHoras = (ayudante: Ayudante) => {
    // TODO: Implementar modal para ver y aprobar/rechazar horas
    console.log("Ver horas de:", ayudante.nombre, ayudante.apellido);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Lista de Ayudantes</h2>
          <p className="text-muted-foreground">Gestiona los estudiantes ayudantes y sus horas registradas</p>
        </div>
        <Badge variant="secondary" className="text-orange">
          {ayudantesDummy.length} ayudantes activos
        </Badge>
      </div>

      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <CardTitle className="text-primary">Estudiantes Ayudantes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left p-4 font-semibold text-primary">Apellido</th>
                  <th className="text-left p-4 font-semibold text-primary">Cédula</th>
                  <th className="text-center p-4 font-semibold text-primary">Horas Registradas</th>
                  <th className="text-center p-4 font-semibold text-primary">Horas Pendientes</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ayudantesDummy.map((ayudante, index) => (
                  <tr 
                    key={ayudante.id} 
                    className={`border-b border-orange/10 hover:bg-orange/5 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4 text-primary font-medium">{ayudante.nombre}</td>
                    <td className="p-4 text-primary font-medium">{ayudante.apellido}</td>
                    <td className="p-4 text-muted-foreground">{ayudante.cedula}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="border-orange/40 text-orange">
                        {ayudante.horasRegistradas}h
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {ayudante.horasPendientes > 0 ? (
                        <Badge variant="destructive" className="bg-orange/10 text-orange border-orange/40">
                          {ayudante.horasPendientes}h
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground">
                          0h
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerHoras(ayudante)}
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Horas
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListaAyudantes;