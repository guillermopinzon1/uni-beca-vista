# Dashboard de Estadísticas - Guía Flutter

## 📊 Vista General

El Dashboard de Estadísticas es un panel visual que muestra métricas clave del sistema de becas. Incluye KPIs, alertas, y gráficos de tendencias.

---

## 🎨 Diseño Visual

### Layout Principal

```
┌─────────────────────────────────────────────────────────┐
│  📊 Reportes y Estadísticas            [🔄] [📥 Excel]  │
│  Panel de control y métricas del sistema                │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Banner de Alertas (si hay errores del backend)      │
├─────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │
│  │   📄      │ │   👥      │ │   📈      │ │   ⏰    │ │
│  │  Total    │ │Benefi-    │ │   Tasa    │ │  Horas  │ │
│  │Solicitudes│ │ciarios    │ │Aprobación │ │Registr. │ │
│  │   125     │ │    89     │ │   78.5%   │ │  2,340  │ │
│  │ 12 pend.  │ │ 89 activos│ │98 aprobadas│ │Prom:26.3│ │
│  └───────────┘ └───────────┘ └───────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────┤
│  ⚠️ Alertas del Sistema (5 críticas, 3 advertencias)    │
│  • [🔴 Alta] Estudiante X sin reportar horas - Sem 3    │
│  • [🟡 Media] Plaza Y sin asignar hace 2 semanas        │
├─────────────────────────────────────────────────────────┤
│  📑 Tabs: [General] [Solicitudes] [Beneficiarios] [...]│
│  ┌─────────────────────────────────────────────────────┐│
│  │  [Contenido del tab activo]                         ││
│  │  - Gráficos                                          ││
│  │  - Tablas                                            ││
│  │  - Detalles                                          ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 Endpoints del Dashboard

### 1. Resumen General
```
GET /api/v1/reportes/estadisticas/resumen-general
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_solicitudes": 125,
    "total_beneficiarios": 89,
    "tasa_aprobacion": 78.5,
    "horas_totales": 2340,
    "evaluaciones_pendientes": 12,
    "alertas_activas": 8,
    "fecha_actualizacion": "2025-01-15T10:30:00Z"
  }
}
```

### 2. Estadísticas de Solicitudes
```
GET /api/v1/reportes/estadisticas/solicitudes
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_solicitudes": 125,
    "aprobadas": 98,
    "rechazadas": 15,
    "pendientes": 12,
    "tasa_aprobacion": 78.5,
    "por_periodo": [...],
    "por_tipo": [...]
  }
}
```

### 3. Estadísticas de Beneficiarios
```
GET /api/v1/reportes/estadisticas/beneficiarios
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_beneficiarios": 89,
    "activos": 89,
    "inactivos": 0,
    "por_facultad": [...],
    "por_programa": [...],
    "por_tipo_beneficio": [...]
  }
}
```

### 4. Estadísticas de Horas
```
GET /api/v1/reportes/estadisticas/horas
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_horas_registradas": 2340,
    "promedio_horas_estudiante": 26.3,
    "cumplimiento_global": 87.5,
    "por_estudiante": [...],
    "alertas_incumplimiento": [...]
  }
}
```

### 5. Alertas del Sistema
```
GET /api/v1/reportes/estadisticas/alertas
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_alertas": 8,
    "criticas": 5,
    "advertencias": 3,
    "alertas": [
      {
        "id": 1,
        "tipo": "incumplimiento_horas",
        "prioridad": "alta",
        "mensaje": "Estudiante Juan Pérez sin reportar horas - Semana 3",
        "fecha": "2025-01-14T15:30:00Z"
      },
      {
        "id": 2,
        "tipo": "plaza_sin_asignar",
        "prioridad": "media",
        "mensaje": "Plaza MAT-101 sin estudiantes asignados hace 2 semanas",
        "fecha": "2025-01-13T10:00:00Z"
      }
    ]
  }
}
```

### 6. Exportar a Excel
```
GET /api/v1/reportes/estadisticas/export/excel?fecha_inicio=2025-01-01&fecha_fin=2025-01-31
Authorization: Bearer {token}

Response: Binary file (Excel)
```

---

## 📱 Implementación Flutter

### Modelos de Datos

```dart
// lib/models/estadisticas_models.dart

class ResumenGeneral {
  final int totalSolicitudes;
  final int totalBeneficiarios;
  final double tasaAprobacion;
  final int horasTotales;
  final int evaluacionesPendientes;
  final int alertasActivas;
  final DateTime fechaActualizacion;

  ResumenGeneral({
    required this.totalSolicitudes,
    required this.totalBeneficiarios,
    required this.tasaAprobacion,
    required this.horasTotales,
    required this.evaluacionesPendientes,
    required this.alertasActivas,
    required this.fechaActualizacion,
  });

  factory ResumenGeneral.fromJson(Map<String, dynamic> json) {
    return ResumenGeneral(
      totalSolicitudes: json['total_solicitudes'] ?? 0,
      totalBeneficiarios: json['total_beneficiarios'] ?? 0,
      tasaAprobacion: (json['tasa_aprobacion'] ?? 0).toDouble(),
      horasTotales: json['horas_totales'] ?? 0,
      evaluacionesPendientes: json['evaluaciones_pendientes'] ?? 0,
      alertasActivas: json['alertas_activas'] ?? 0,
      fechaActualizacion: DateTime.parse(
        json['fecha_actualizacion'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  // Valores por defecto para errores
  factory ResumenGeneral.empty() {
    return ResumenGeneral(
      totalSolicitudes: 0,
      totalBeneficiarios: 0,
      tasaAprobacion: 0,
      horasTotales: 0,
      evaluacionesPendientes: 0,
      alertasActivas: 0,
      fechaActualizacion: DateTime.now(),
    );
  }
}

class EstadisticasSolicitudes {
  final int totalSolicitudes;
  final int aprobadas;
  final int rechazadas;
  final int pendientes;
  final double tasaAprobacion;

  EstadisticasSolicitudes({
    required this.totalSolicitudes,
    required this.aprobadas,
    required this.rechazadas,
    required this.pendientes,
    required this.tasaAprobacion,
  });

  factory EstadisticasSolicitudes.fromJson(Map<String, dynamic> json) {
    return EstadisticasSolicitudes(
      totalSolicitudes: json['total_solicitudes'] ?? 0,
      aprobadas: json['aprobadas'] ?? 0,
      rechazadas: json['rechazadas'] ?? 0,
      pendientes: json['pendientes'] ?? 0,
      tasaAprobacion: (json['tasa_aprobacion'] ?? 0).toDouble(),
    );
  }

  factory EstadisticasSolicitudes.empty() {
    return EstadisticasSolicitudes(
      totalSolicitudes: 0,
      aprobadas: 0,
      rechazadas: 0,
      pendientes: 0,
      tasaAprobacion: 0,
    );
  }
}

class EstadisticasBeneficiarios {
  final int totalBeneficiarios;
  final int activos;
  final int inactivos;

  EstadisticasBeneficiarios({
    required this.totalBeneficiarios,
    required this.activos,
    required this.inactivos,
  });

  factory EstadisticasBeneficiarios.fromJson(Map<String, dynamic> json) {
    return EstadisticasBeneficiarios(
      totalBeneficiarios: json['total_beneficiarios'] ?? 0,
      activos: json['activos'] ?? 0,
      inactivos: json['inactivos'] ?? 0,
    );
  }

  factory EstadisticasBeneficiarios.empty() {
    return EstadisticasBeneficiarios(
      totalBeneficiarios: 0,
      activos: 0,
      inactivos: 0,
    );
  }
}

class EstadisticasHoras {
  final int totalHorasRegistradas;
  final double promedioHorasEstudiante;
  final double cumplimientoGlobal;

  EstadisticasHoras({
    required this.totalHorasRegistradas,
    required this.promedioHorasEstudiante,
    required this.cumplimientoGlobal,
  });

  factory EstadisticasHoras.fromJson(Map<String, dynamic> json) {
    return EstadisticasHoras(
      totalHorasRegistradas: json['total_horas_registradas'] ?? 0,
      promedioHorasEstudiante: (json['promedio_horas_estudiante'] ?? 0).toDouble(),
      cumplimientoGlobal: (json['cumplimiento_global'] ?? 0).toDouble(),
    );
  }

  factory EstadisticasHoras.empty() {
    return EstadisticasHoras(
      totalHorasRegistradas: 0,
      promedioHorasEstudiante: 0,
      cumplimientoGlobal: 0,
    );
  }
}

enum PrioridadAlerta { alta, media, baja }

class Alerta {
  final int id;
  final String tipo;
  final PrioridadAlerta prioridad;
  final String mensaje;
  final DateTime fecha;

  Alerta({
    required this.id,
    required this.tipo,
    required this.prioridad,
    required this.mensaje,
    required this.fecha,
  });

  factory Alerta.fromJson(Map<String, dynamic> json) {
    PrioridadAlerta parsePrioridad(String prioridad) {
      switch (prioridad.toLowerCase()) {
        case 'alta':
          return PrioridadAlerta.alta;
        case 'media':
          return PrioridadAlerta.media;
        default:
          return PrioridadAlerta.baja;
      }
    }

    return Alerta(
      id: json['id'],
      tipo: json['tipo'],
      prioridad: parsePrioridad(json['prioridad']),
      mensaje: json['mensaje'],
      fecha: DateTime.parse(json['fecha']),
    );
  }
}

class Alertas {
  final int totalAlertas;
  final int criticas;
  final int advertencias;
  final List<Alerta> alertas;

  Alertas({
    required this.totalAlertas,
    required this.criticas,
    required this.advertencias,
    required this.alertas,
  });

  factory Alertas.fromJson(Map<String, dynamic> json) {
    return Alertas(
      totalAlertas: json['total_alertas'] ?? 0,
      criticas: json['criticas'] ?? 0,
      advertencias: json['advertencias'] ?? 0,
      alertas: (json['alertas'] as List?)
              ?.map((a) => Alerta.fromJson(a))
              .toList() ??
          [],
    );
  }

  factory Alertas.empty() {
    return Alertas(
      totalAlertas: 0,
      criticas: 0,
      advertencias: 0,
      alertas: [],
    );
  }
}
```

---

### Servicio de Estadísticas

```dart
// lib/services/estadisticas_service.dart

import 'package:dio/dio.dart';
import '../models/estadisticas_models.dart';
import 'api_client.dart';

class EstadisticasService {
  final ApiClient _apiClient = ApiClient();

  /// Cargar todos los datos del dashboard en paralelo
  /// Usa Promise.allSettled pattern para manejar errores individuales
  Future<DashboardData> cargarDashboard() async {
    try {
      // Ejecutar todas las peticiones en paralelo
      final results = await Future.wait([
        getResumenGeneral().catchError((e) => null),
        getEstadisticasSolicitudes().catchError((e) => null),
        getEstadisticasBeneficiarios().catchError((e) => null),
        getEstadisticasHoras().catchError((e) => null),
        getAlertas().catchError((e) => null),
      ]);

      return DashboardData(
        resumen: results[0] as ResumenGeneral? ?? ResumenGeneral.empty(),
        solicitudes: results[1] as EstadisticasSolicitudes? ??
            EstadisticasSolicitudes.empty(),
        beneficiarios: results[2] as EstadisticasBeneficiarios? ??
            EstadisticasBeneficiarios.empty(),
        horas: results[3] as EstadisticasHoras? ?? EstadisticasHoras.empty(),
        alertas: results[4] as Alertas? ?? Alertas.empty(),
        hasErrors: results.any((r) => r == null),
      );
    } catch (e) {
      throw Exception('Error cargando dashboard: $e');
    }
  }

  Future<ResumenGeneral> getResumenGeneral() async {
    try {
      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/resumen-general',
      );
      return ResumenGeneral.fromJson(response.data['data']);
    } catch (e) {
      throw Exception('Error obteniendo resumen general: $e');
    }
  }

  Future<EstadisticasSolicitudes> getEstadisticasSolicitudes() async {
    try {
      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/solicitudes',
      );
      return EstadisticasSolicitudes.fromJson(response.data['data']);
    } catch (e) {
      throw Exception('Error obteniendo estadísticas de solicitudes: $e');
    }
  }

  Future<EstadisticasBeneficiarios> getEstadisticasBeneficiarios() async {
    try {
      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/beneficiarios',
      );
      return EstadisticasBeneficiarios.fromJson(response.data['data']);
    } catch (e) {
      throw Exception('Error obteniendo estadísticas de beneficiarios: $e');
    }
  }

  Future<EstadisticasHoras> getEstadisticasHoras() async {
    try {
      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/horas',
      );
      return EstadisticasHoras.fromJson(response.data['data']);
    } catch (e) {
      throw Exception('Error obteniendo estadísticas de horas: $e');
    }
  }

  Future<Alertas> getAlertas() async {
    try {
      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/alertas',
      );
      return Alertas.fromJson(response.data['data']);
    } catch (e) {
      throw Exception('Error obteniendo alertas: $e');
    }
  }

  Future<void> exportarExcel({
    String? fechaInicio,
    String? fechaFin,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (fechaInicio != null) queryParams['fecha_inicio'] = fechaInicio;
      if (fechaFin != null) queryParams['fecha_fin'] = fechaFin;

      final response = await _apiClient.dio.get(
        '/v1/reportes/estadisticas/export/excel',
        queryParameters: queryParams,
        options: Options(responseType: ResponseType.bytes),
      );

      // Guardar archivo en el dispositivo
      // Implementación específica de la plataforma
      // Ver sección de "Descargar Archivos" más abajo
    } catch (e) {
      throw Exception('Error exportando a Excel: $e');
    }
  }
}

// Clase helper para agrupar todos los datos
class DashboardData {
  final ResumenGeneral resumen;
  final EstadisticasSolicitudes solicitudes;
  final EstadisticasBeneficiarios beneficiarios;
  final EstadisticasHoras horas;
  final Alertas alertas;
  final bool hasErrors;

  DashboardData({
    required this.resumen,
    required this.solicitudes,
    required this.beneficiarios,
    required this.horas,
    required this.alertas,
    required this.hasErrors,
  });
}
```

---

### Pantalla del Dashboard

```dart
// lib/screens/estadisticas_dashboard.dart

import 'package:flutter/material.dart';
import '../models/estadisticas_models.dart';
import '../services/estadisticas_service.dart';
import '../widgets/kpi_card.dart';
import '../widgets/alerta_banner.dart';

class EstadisticasDashboard extends StatefulWidget {
  const EstadisticasDashboard({super.key});

  @override
  State<EstadisticasDashboard> createState() => _EstadisticasDashboardState();
}

class _EstadisticasDashboardState extends State<EstadisticasDashboard> {
  final EstadisticasService _service = EstadisticasService();

  bool _isLoading = true;
  DashboardData? _data;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  Future<void> _cargarDatos() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await _service.cargarDashboard();
      setState(() {
        _data = data;
        _isLoading = false;
      });

      // Mostrar warning si hay errores parciales
      if (data.hasErrors && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Algunos datos no pudieron cargarse'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _exportarExcel() async {
    try {
      await _service.exportarExcel();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Reporte exportado exitosamente'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al exportar: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reportes y Estadísticas'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _cargarDatos,
            tooltip: 'Actualizar',
          ),
          IconButton(
            icon: const Icon(Icons.file_download),
            onPressed: _exportarExcel,
            tooltip: 'Exportar Excel',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? _buildErrorView()
              : _buildDashboardContent(),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 64, color: Colors.red),
          const SizedBox(height: 16),
          Text(
            'Error cargando estadísticas',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(_errorMessage ?? 'Error desconocido'),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _cargarDatos,
            icon: const Icon(Icons.refresh),
            label: const Text('Reintentar'),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardContent() {
    if (_data == null) return const SizedBox();

    return RefreshIndicator(
      onRefresh: _cargarDatos,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner de errores del backend
            if (_data!.hasErrors) _buildErrorBanner(),
            const SizedBox(height: 16),

            // KPIs principales
            _buildKPIs(),
            const SizedBox(height: 24),

            // Alertas
            if (_data!.alertas.totalAlertas > 0) ...[
              _buildAlertasSection(),
              const SizedBox(height: 24),
            ],

            // Detalles adicionales (opcional)
            _buildDetallesSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.orange.shade100,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.orange.shade300),
      ),
      child: Row(
        children: [
          Icon(Icons.warning, color: Colors.orange.shade800),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Datos incompletos',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.orange.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Algunos datos no pudieron cargarse del servidor',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.orange.shade800,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKPIs() {
    final resumen = _data!.resumen;
    final solicitudes = _data!.solicitudes;
    final beneficiarios = _data!.beneficiarios;
    final horas = _data!.horas;

    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: KpiCard(
                title: 'Total Solicitudes',
                value: resumen.totalSolicitudes.toString(),
                subtitle: '${solicitudes.pendientes} pendientes',
                icon: Icons.description,
                color: Colors.blue,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: KpiCard(
                title: 'Beneficiarios',
                value: resumen.totalBeneficiarios.toString(),
                subtitle: '${beneficiarios.activos} activos',
                icon: Icons.people,
                color: Colors.green,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: KpiCard(
                title: 'Tasa Aprobación',
                value: '${resumen.tasaAprobacion.toStringAsFixed(1)}%',
                subtitle: '${solicitudes.aprobadas} aprobadas',
                icon: Icons.trending_up,
                color: Colors.orange,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: KpiCard(
                title: 'Horas Totales',
                value: resumen.horasTotales.toString(),
                subtitle: 'Prom: ${horas.promedioHorasEstudiante.toStringAsFixed(1)}',
                icon: Icons.schedule,
                color: Colors.purple,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildAlertasSection() {
    final alertas = _data!.alertas;

    return Card(
      color: Colors.orange.shade50,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.warning_amber, color: Colors.orange.shade800),
                const SizedBox(width: 8),
                Text(
                  'Alertas del Sistema',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              '${alertas.criticas} críticas, ${alertas.advertencias} advertencias',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),
            ...alertas.alertas.take(3).map((alerta) => AlertaTile(alerta: alerta)),
            if (alertas.alertas.length > 3)
              TextButton(
                onPressed: () {
                  // Navegar a pantalla de alertas completa
                },
                child: const Text('Ver todas las alertas'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetallesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Detalles',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const Icon(Icons.check_circle, color: Colors.green),
            title: Text('${_data!.solicitudes.aprobadas} Solicitudes Aprobadas'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Ver detalles de solicitudes aprobadas
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.cancel, color: Colors.red),
            title: Text('${_data!.solicitudes.rechazadas} Solicitudes Rechazadas'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Ver detalles de solicitudes rechazadas
            },
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.people, color: Colors.blue),
            title: Text('${_data!.beneficiarios.activos} Beneficiarios Activos'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // Ver lista de beneficiarios
            },
          ),
        ),
      ],
    );
  }
}
```

---

### Widgets Reutilizables

#### KPI Card Widget

```dart
// lib/widgets/kpi_card.dart

import 'package:flutter/material.dart';

class KpiCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const KpiCard({
    super.key,
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Icon(icon, color: color.withOpacity(0.7), size: 20),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey.shade600,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
```

#### Alerta Tile Widget

```dart
// lib/widgets/alerta_tile.dart

import 'package:flutter/material.dart';
import '../models/estadisticas_models.dart';

class AlertaTile extends StatelessWidget {
  final Alerta alerta;

  const AlertaTile({
    super.key,
    required this.alerta,
  });

  Color _getPrioridadColor() {
    switch (alerta.prioridad) {
      case PrioridadAlerta.alta:
        return Colors.red;
      case PrioridadAlerta.media:
        return Colors.orange;
      case PrioridadAlerta.baja:
        return Colors.blue;
    }
  }

  IconData _getPrioridadIcon() {
    switch (alerta.prioridad) {
      case PrioridadAlerta.alta:
        return Icons.error;
      case PrioridadAlerta.media:
        return Icons.warning;
      case PrioridadAlerta.baja:
        return Icons.info;
    }
  }

  String _getPrioridadText() {
    switch (alerta.prioridad) {
      case PrioridadAlerta.alta:
        return 'Alta';
      case PrioridadAlerta.media:
        return 'Media';
      case PrioridadAlerta.baja:
        return 'Baja';
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getPrioridadColor();

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(_getPrioridadIcon(), color: color, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        _getPrioridadText(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        alerta.tipo,
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  alerta.mensaje,
                  style: const TextStyle(fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## 📥 Descargar Archivos Excel

```dart
// lib/utils/file_download_helper.dart

import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_file/open_file.dart';

class FileDownloadHelper {
  static Future<void> downloadAndOpenFile({
    required String url,
    required String fileName,
    required String token,
  }) async {
    try {
      final dio = Dio();

      // Obtener directorio de descargas
      Directory? directory;
      if (Platform.isAndroid) {
        directory = await getExternalStorageDirectory();
      } else if (Platform.isIOS) {
        directory = await getApplicationDocumentsDirectory();
      }

      if (directory == null) {
        throw Exception('No se pudo obtener el directorio de descargas');
      }

      final filePath = '${directory.path}/$fileName';

      // Descargar archivo
      await dio.download(
        url,
        filePath,
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
          responseType: ResponseType.bytes,
        ),
        onReceiveProgress: (received, total) {
          if (total != -1) {
            final progress = (received / total * 100).toStringAsFixed(0);
            print('Descargando: $progress%');
          }
        },
      );

      // Abrir archivo
      await OpenFile.open(filePath);
    } catch (e) {
      throw Exception('Error descargando archivo: $e');
    }
  }
}

// Uso en el servicio:
Future<void> exportarExcel() async {
  final token = await _storage.read(key: 'access_token');
  if (token == null) throw Exception('No hay token');

  await FileDownloadHelper.downloadAndOpenFile(
    url: 'https://srodriguez.intelcondev.org/api/v1/reportes/estadisticas/export/excel',
    fileName: 'estadisticas_${DateTime.now().millisecondsSinceEpoch}.xlsx',
    token: token,
  );
}
```

---

## 🎨 Paleta de Colores

```dart
// lib/theme/app_colors.dart

class AppColors {
  // Colores principales (del sistema web)
  static const primary = Color(0xFFFF6B35); // Naranja UNIMET
  static const primaryLight = Color(0xFFFF8555);
  static const primaryDark = Color(0xFFE55520);

  // KPI Cards
  static const kpiBlue = Color(0xFF2196F3);
  static const kpiGreen = Color(0xFF4CAF50);
  static const kpiOrange = Color(0xFFFF9800);
  static const kpiPurple = Color(0xFF9C27B0);

  // Alertas
  static const alertHigh = Color(0xFFE53935);
  static const alertMedium = Color(0xFFFF9800);
  static const alertLow = Color(0xFF2196F3);

  // Estados
  static const success = Color(0xFF4CAF50);
  static const warning = Color(0xFFFF9800);
  static const error = Color(0xFFE53935);
  static const info = Color(0xFF2196F3);
}
```

---

## 🔄 Manejo de Errores

### Estrategia de Degradación Graceful

```dart
// El dashboard usa Promise.allSettled pattern:
// 1. Ejecuta todas las peticiones en paralelo
// 2. Si alguna falla, usa datos por defecto (0s)
// 3. Muestra banner de advertencia si hay errores
// 4. El usuario ve SIEMPRE algo, nunca pantalla en blanco

// Ejemplo:
final results = await Future.wait([
  getResumenGeneral().catchError((_) => ResumenGeneral.empty()),
  getAlertas().catchError((_) => Alertas.empty()),
]);

// Si TODOS fallan, mostrar error general
// Si algunos fallan, mostrar datos parciales con warning
```

---

## 📋 Checklist de Implementación

### Fase 1: Setup Básico
- [ ] Crear modelos de datos (ResumenGeneral, EstadisticasSolicitudes, etc.)
- [ ] Crear servicio EstadisticasService
- [ ] Crear pantalla EstadisticasDashboard
- [ ] Integrar con ApiClient existente

### Fase 2: UI Components
- [ ] Crear KpiCard widget
- [ ] Crear AlertaTile widget
- [ ] Implementar layout responsive (Column/Row)
- [ ] Añadir RefreshIndicator

### Fase 3: Funcionalidades
- [ ] Implementar carga paralela de datos
- [ ] Añadir manejo de errores graceful
- [ ] Implementar pull-to-refresh
- [ ] Añadir botón de exportar Excel

### Fase 4: Polish
- [ ] Añadir animaciones de carga
- [ ] Mejorar transiciones entre estados
- [ ] Optimizar performance (caché, lazy loading)
- [ ] Testing

---

## 🚀 Tips de Performance

1. **Caché de Datos**: Guardar última respuesta en local storage
2. **Stale-While-Revalidate**: Mostrar datos cached mientras se recargan
3. **Lazy Loading**: Cargar tabs bajo demanda
4. **Debouncing**: Evitar múltiples refreshes simultáneos

```dart
// Ejemplo de caché simple:
class CachedDashboardData {
  final DashboardData data;
  final DateTime timestamp;

  CachedDashboardData(this.data, this.timestamp);

  bool isStale() {
    return DateTime.now().difference(timestamp).inMinutes > 5;
  }
}
```

---

## 📝 Notas Importantes

1. **Errores del Backend**: Actualmente hay problemas con columnas de BD (evaluacionsatisfactoria, horascompletadas). Por eso SIEMPRE usar datos por defecto.

2. **Tokens**: Todos los endpoints requieren Bearer token en header Authorization.

3. **Responsive**: Dashboard debe verse bien en pantallas pequeñas (320px+).

4. **Offline**: Considerar mostrar últimos datos cached si no hay internet.

5. **Tiempo Real**: No hay WebSockets, usar polling o pull-to-refresh.

---

**Fin de la Documentación Mini Dashboard**

Para más detalles, ver: `FLUTTER_APP_DOCUMENTATION.md`
