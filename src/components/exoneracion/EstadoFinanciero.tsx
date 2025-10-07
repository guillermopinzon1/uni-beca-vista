import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Calendar, AlertTriangle, ExternalLink } from "lucide-react";

const EstadoFinanciero = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Estado Financiero</h1>
        <p className="text-muted-foreground">
          Resumen de cobertura y proyecciones financieras del beneficio
        </p>
      </div>

      {/* Subsección: Resumen de Cobertura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Resumen de Cobertura</span>
          </CardTitle>
          <CardDescription>Beneficios económicos del programa de exoneración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Matrícula Cubierta</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">100%</Badge>
              </div>
              <p className="text-lg font-bold text-green-900">Bs. 185.000</p>
              <p className="text-xs text-green-700">Este período</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Monto Exonerado</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-900">Bs. 185.000</p>
              <p className="text-xs text-blue-700">Período 2024-3</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Ahorro Acumulado</span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-900">Bs. 1.110.000</p>
              <p className="text-xs text-purple-700">Desde ingreso</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800">Costo Regular</span>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-orange-900">Bs. 185.000</p>
              <p className="text-xs text-orange-700">Sin beneficio</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Porcentaje de Cobertura Total</h4>
                <p className="text-sm text-green-700">Matrícula completamente cubierta</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">100%</p>
                <Progress value={100} className="w-24 mt-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Alerta de Renovación */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Verificación Trimestral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Próxima verificación:</strong> 15 de Octubre de 2024
            </p>
            <p className="text-xs text-blue-700">
              El sistema verificará automáticamente tu cumplimiento del IAA mínimo, 
              créditos inscritos y asistencia a tutorías DDBE.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoFinanciero;