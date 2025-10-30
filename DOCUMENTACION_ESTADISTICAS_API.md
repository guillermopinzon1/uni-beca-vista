# Documentación API de Estadísticas - `/api/v1/reportes/estadisticas/`

## Índice
- [Endpoints Disponibles](#endpoints-disponibles)
- [Autenticación y Permisos](#autenticación-y-permisos)
- [Endpoints Detallados](#endpoints-detallados)
- [Flujo en la Base de Datos](#flujo-en-la-base-de-datos)
- [Exportación de Datos](#exportación-de-datos)

---

## Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/solicitudes` | GET | Estadísticas de solicitudes/postulaciones |
| `/beneficiarios` | GET | Estadísticas de beneficiarios activos |
| `/productividad` | GET | Estadísticas de productividad de evaluación |
| `/horas` | GET | Control de horas (Ayudantías) |
| `/resumen-general` | GET | Resumen general del sistema (dashboard) |
| `/tendencias` | GET | Tendencias históricas |
| `/alertas` | GET | Alertas y notificaciones del sistema |
| `/cumplimiento` | GET | Reporte de cumplimiento de estudiantes |
| `/export/excel` | GET | Exportar estadísticas a Excel |
| `/export/csv` | GET | Exportar estadísticas a CSV |

---

## Valores de Enums del Sistema

### Tipos de Beca (tipoBeca)
Los valores válidos para el parámetro `tipoBeca` en todos los endpoints son:
- `"Ayudantía"`
- `"Excelencia"`
- `"Impacto"`
- `"Exoneración de Pago"`
- `"Formación Docente"`

---

## Autenticación y Permisos

**Todos los endpoints requieren autenticación mediante Bearer Token**

```http
Authorization: Bearer <token>
```

### Roles y Permisos por Endpoint

| Endpoint | Roles Autorizados |
|----------|------------------|
| `/solicitudes` | admin, capital-humano, director-area |
| `/beneficiarios` | admin, capital-humano, director-area |
| `/productividad` | admin, supervisor, mentor, capital-humano, director-area |
| `/horas` | admin, supervisor, mentor, capital-humano |
| `/resumen-general` | admin |
| `/tendencias` | admin |
| `/alertas` | admin, supervisor, mentor |
| `/cumplimiento` | admin, supervisor, mentor |
| `/export/excel` | admin, capital-humano |
| `/export/csv` | admin, capital-humano, supervisor |

---

## Endpoints Detallados

### 1. GET `/api/v1/reportes/estadisticas/solicitudes`

**Descripción:** Obtiene estadísticas detalladas de solicitudes/postulaciones

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico (ej: "2024-1")
tipoBeca (opcional): Enum - "Ayudantía" | "Impacto" | "Excelencia" | "Exoneración de Pago" | "Formación Docente"
tipoPostulante (opcional): Enum - "estudiante-pregrado" | "estudiante-postgrado" | "estudiante-nuevo"
fechaInicio (opcional): Date - Fecha inicio del rango (formato ISO8601)
fechaFin (opcional): Date - Fecha fin del rango (formato ISO8601)
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/solicitudes?tipoBeca=Ayudantía&periodoAcademico=2024-1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas de solicitudes obtenidas exitosamente",
  "data": {
    "resumen": {
      "totalPostulaciones": 150,
      "periodoAnalizado": {
        "inicio": "2024-01-01",
        "fin": "Actual"
      }
    },
    "distribucion": {
      "porEstado": [
        { "estado": "Pendiente", "cantidad": 20 },
        { "estado": "En Revisión", "cantidad": 30 },
        { "estado": "Aprobada", "cantidad": 80 },
        { "estado": "Rechazada", "cantidad": 20 }
      ],
      "porTipoBeca": [
        {
          "tipoBeca": "Ayudantía",
          "cantidad": 100,
          "aprobadas": 60,
          "rechazadas": 15
        }
      ],
      "porTipoPostulante": [
        {
          "tipoPostulante": "estudiante-pregrado",
          "cantidad": 120,
          "iaaPromedio": 4.2
        }
      ]
    },
    "tasasAprobacion": {
      "general": "53.33",
      "aprobadas": 80,
      "rechazadas": 20,
      "tasaRechazo": "13.33"
    },
    "tiemposEvaluacion": {
      "promedioDias": "5.50",
      "minDias": 1,
      "maxDias": 15
    },
    "motivosRechazo": [
      { "motiveRechazo": "IAA insuficiente", "frecuencia": 8 }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. Consulta tabla `postulaciones` con filtros aplicados
2. Agrupa por `estado`, `tipoBeca`, `tipoPostulante`
3. Calcula promedios de `iaa`
4. Calcula diferencias entre `fechaPostulacion` y `fechaEvaluacion`
5. Une con tabla `usuarios` para obtener datos de evaluadores

---

### 2. GET `/api/v1/reportes/estadisticas/beneficiarios`

**Descripción:** Estadísticas de beneficiarios activos con seguimiento de progreso

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
tipoBeca (opcional): Enum - Tipo de beca
estado (opcional): Enum - "Activa" | "Suspendida" | "Culminada" | "Cancelada"
incluirHistorico (opcional): Boolean - Incluir histórico de estados
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/beneficiarios?estado=Activa&tipoBeca=Ayudantía
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas de beneficiarios obtenidas exitosamente",
  "data": {
    "resumen": {
      "totalBeneficiarios": 85,
      "beneficiariosActivos": 75,
      "periodo": "2024-1"
    },
    "distribucion": {
      "porTipoBeca": [
        {
          "tipoBeca": "Ayudantía",
          "cantidad": 50,
          "horasPromedio": 80.5,
          "evaluacionesSatisfactorias": 45
        }
      ],
      "porEstado": [
        { "estado": "Activa", "cantidad": 75 },
        { "estado": "Suspendida", "cantidad": 5 }
      ]
    },
    "progresoHoras": {
      "promedio": "67.25",
      "enRiesgo": 8,
      "cumplidos": 25,
      "total": 50
    },
    "beneficiariosActivos": [
      {
        "id": "uuid",
        "estudiante": "Juan Pérez",
        "email": "jperez@unimet.edu.ve",
        "cedula": "V-12345678",
        "carrera": "Ingeniería de Sistemas",
        "tipoBeca": "Ayudantía",
        "supervisor": "Dr. María García",
        "plaza": "SIS-101 - Programación I",
        "horasCompletadas": 80,
        "horasRequeridas": 120,
        "porcentajeCompletado": "66.67",
        "evaluacionSatisfactoria": true
      }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. Consulta tabla `estudiantes_becarios` con filtros
2. Une con `usuarios` para datos del estudiante y supervisor
3. Une con `plazas` para datos de asignación
4. Agrupa por `tipoBeca` y `estado`
5. Calcula promedios de `horasCompletadas` / `horasRequeridas`
6. Filtra por estado de `evaluacionSatisfactoria`

---

### 3. GET `/api/v1/reportes/estadisticas/productividad`

**Descripción:** Estadísticas de productividad de evaluación de supervisores

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
supervisorId (opcional): UUID - ID del supervisor (requerido si el usuario es supervisor)
fechaInicio (opcional): Date - Fecha inicio
fechaFin (opcional): Date - Fecha fin
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/productividad?periodoAcademico=2024-1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas de productividad obtenidas exitosamente",
  "data": {
    "resumen": {
      "totalReportes": 450,
      "reportesPendientes": 35,
      "tasaAprobacionGeneral": "82.22"
    },
    "distribucion": {
      "porEstado": [
        { "estado": "Aprobada", "cantidad": 370 },
        { "estado": "Pendiente", "cantidad": 35 },
        { "estado": "Rechazada", "cantidad": 45 }
      ],
      "porSupervisor": [
        {
          "supervisor": {
            "nombre": "María",
            "apellido": "García"
          },
          "reportesRevisados": 120,
          "reportesAprobados": 100,
          "reportesRechazados": 20
        }
      ]
    },
    "tiemposAprobacion": {
      "promedioHoras": "18.50",
      "minHoras": "2.00",
      "maxHoras": "72.00"
    },
    "semanasConMasActividad": [
      {
        "semana": 5,
        "cantidadReportes": 85,
        "totalHoras": 680
      }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. Consulta tabla `reportes_actividades` con filtros
2. Agrupa por `estado` y `supervisorId`
3. Une con `usuarios` (alias 'supervisor')
4. Calcula diferencias entre `createdAt` y `fechaAprobacion`
5. Agrupa por `semana` para identificar picos de actividad
6. Filtra reportes con `estado` = 'Rechazada' para motivos

---

### 4. GET `/api/v1/reportes/estadisticas/horas`

**Descripción:** Estadísticas de control de horas (específico para Ayudantías)

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
plazaId (opcional): UUID - ID de la plaza
supervisorId (opcional): UUID - ID del supervisor
semana (opcional): Integer - Número de semana (1-12)
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/horas?periodoAcademico=2024-1&semana=8
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas de horas obtenidas exitosamente",
  "data": {
    "resumen": {
      "totalHorasRegistradas": 4250,
      "promedioHorasSemanales": 9.44,
      "estudiantesEnRiesgo": 12,
      "periodo": "2024-1"
    },
    "distribucionPorSemana": [
      {
        "semana": 1,
        "horasTotal": 350,
        "horasPromedio": 7.0,
        "reportes": 50
      },
      {
        "semana": 8,
        "horasTotal": 450,
        "horasPromedio": 9.0,
        "reportes": 50
      }
    ],
    "estudiantesEnRiesgo": [
      {
        "id": "uuid",
        "estudiante": "Pedro López",
        "horasCompletadas": 45,
        "horasRequeridas": 120,
        "porcentajeCompletado": "37.50",
        "horasRestantes": 75,
        "semanasRestantes": 4,
        "horasSemanalesRequeridas": "18.75"
      }
    ],
    "proyeccionCumplimiento": {
      "proyeccionCumpliran": 38,
      "proyeccionNoCumpliran": 12,
      "semanaActual": 8,
      "semanasRestantes": 4
    }
  }
}
```

**Flujo en la Base de Datos:**
1. Consulta `reportes_actividades` con filtro `estado = 'Aprobada'`
2. Suma campo `horasTrabajadas` agrupado por semana
3. Consulta `estudiantes_becarios` con `tipoBeca = 'Ayudantía'`
4. Calcula porcentaje: `horasCompletadas / horasRequeridas * 100`
5. Identifica estudiantes con porcentaje < umbral esperado (semana actual / 12 * 80%)
6. Une con tabla `usuarios` y `plazas` para detalles

---

### 5. GET `/api/v1/reportes/estadisticas/resumen-general`

**Descripción:** Resumen general del sistema (dashboard principal)

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/resumen-general?periodoAcademico=2024-1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Resumen general obtenido exitosamente",
  "data": {
    "periodo": "2024-1",
    "metricas": {
      "postulaciones": {
        "total": 150,
        "enRevision": 30,
        "pendientes": 20
      },
      "beneficiarios": {
        "activos": 85,
        "suspendidos": 5,
        "culminados": 45
      },
      "horas": {
        "totalRegistradas": 4250,
        "promedioSemanal": 9.44
      },
      "reportes": {
        "pendientesRevision": 35
      }
    },
    "estadisticasBecas": [
      {
        "tipoBeca": "Ayudantía",
        "total": 100,
        "activos": 85,
        "exitosos": 60
      }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. Ejecuta múltiples consultas en paralelo (`Promise.all`):
   - COUNT en `postulaciones` por estado
   - COUNT en `estudiantes_becarios` por estado
   - SUM de `horasTrabajadas` en `reportes_actividades`
   - COUNT de reportes pendientes
2. Agrupa `estudiantes_becarios` por `tipoBeca`
3. Aplica filtro de `periodoAcademico` en todas las consultas

---

### 6. GET `/api/v1/reportes/estadisticas/tendencias`

**Descripción:** Análisis de tendencias históricas (comparación entre períodos)

**Parámetros de Query:**
```
periodosComparar (requerido): String - Períodos separados por coma (ej: "2023-1,2023-2,2024-1")
tipoBeca (opcional): Enum - Tipo de beca
metrica (opcional): Enum - "postulaciones" | "aprobaciones" | "beneficiarios" | "horas"
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/tendencias?periodosComparar=2023-1,2023-2,2024-1&metrica=postulaciones
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Tendencias obtenidas exitosamente",
  "data": {
    "metrica": "postulaciones",
    "tipoBeca": "Todas",
    "tendencias": [
      {
        "periodo": "2023-1",
        "valor": 120,
        "metrica": "postulaciones"
      },
      {
        "periodo": "2023-2",
        "valor": 135,
        "metrica": "postulaciones",
        "variacion": "12.50"
      },
      {
        "periodo": "2024-1",
        "valor": 150,
        "metrica": "postulaciones",
        "variacion": "11.11"
      }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. Itera sobre cada período en `periodosComparar`
2. Por cada período, ejecuta consulta según `metrica`:
   - **postulaciones**: COUNT en `postulaciones`
   - **aprobaciones**: COUNT en `postulaciones` con `estado = 'Aprobada'`
   - **beneficiarios**: COUNT en `estudiantes_becarios` con `periodoInicio = periodo`
   - **horas**: SUM de `horasTrabajadas` en `reportes_actividades` con `periodoAcademico = periodo`
3. Calcula variación porcentual entre períodos consecutivos

---

### 7. GET `/api/v1/reportes/estadisticas/alertas`

**Descripción:** Obtener alertas y notificaciones del sistema

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
tipoAlerta (opcional): Enum - "incumplimiento-horas" | "reportes-pendientes" | "sin-supervisor"
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/alertas?tipoAlerta=incumplimiento-horas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Alertas obtenidas exitosamente",
  "data": {
    "totalAlertas": 15,
    "alertas": [
      {
        "tipo": "incumplimiento-horas",
        "prioridad": "alta",
        "mensaje": "Juan Pérez está en riesgo de no cumplir las horas requeridas",
        "detalles": {
          "estudiante": "Juan Pérez",
          "horasCompletadas": 45,
          "horasRequeridas": 120,
          "porcentajeCompletado": "37.50"
        }
      },
      {
        "tipo": "reportes-pendientes",
        "prioridad": "media",
        "mensaje": "Reporte de María González pendiente hace 10 días",
        "detalles": {
          "reporteId": "uuid",
          "estudiante": "María González",
          "semana": 7,
          "diasPendiente": 10
        }
      },
      {
        "tipo": "sin-supervisor",
        "prioridad": "alta",
        "mensaje": "Carlos Rodríguez no tiene supervisor asignado",
        "detalles": {
          "estudianteBecarioId": "uuid",
          "estudiante": "Carlos Rodríguez",
          "tipoBeca": "Ayudantía"
        }
      }
    ]
  }
}
```

**Flujo en la Base de Datos:**
1. **Incumplimiento de horas:**
   - Consulta `estudiantes_becarios` con `tipoBeca = 'Ayudantía'` y `estado = 'Activa'`
   - Calcula porcentaje esperado vs real
   - Filtra estudiantes con porcentaje < 80% del esperado

2. **Reportes pendientes:**
   - Consulta `reportes_actividades` con `estado IN ('Pendiente', 'En Revisión')`
   - Filtra `createdAt < (fecha actual - 7 días)`
   - Une con `usuarios` para datos del estudiante

3. **Sin supervisor:**
   - Consulta `estudiantes_becarios` con `supervisorId IS NULL` y `estado = 'Activa'`
   - Une con `usuarios`

---

### 8. GET `/api/v1/reportes/estadisticas/cumplimiento`

**Descripción:** Reporte de cumplimiento de estudiantes clasificado por nivel

**Parámetros de Query:**
```
periodoAcademico (opcional): String - Período académico
tipoBeca (opcional): Enum - Tipo de beca
supervisorId (opcional): UUID - ID del supervisor
umbralRiesgo (opcional): Number - Umbral de riesgo (0-1, default: 0.7)
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/cumplimiento?umbralRiesgo=0.75&tipoBeca=Ayudantía
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Estadísticas de cumplimiento obtenidas exitosamente",
  "data": {
    "resumen": {
      "totalEstudiantes": 50,
      "cumpliendo": 30,
      "enRiesgo": 12,
      "incumpliendo": 8,
      "umbralRiesgo": "75%"
    },
    "estudiantes": {
      "cumpliendo": [
        {
          "id": "uuid",
          "nombre": "Ana García",
          "email": "agarcia@unimet.edu.ve",
          "cedula": "V-12345678",
          "supervisor": "Dr. Juan Pérez",
          "horasCompletadas": 95,
          "horasRequeridas": 120,
          "porcentajeCompletado": "79.17",
          "tipoBeca": "Ayudantía"
        }
      ],
      "enRiesgo": [
        {
          "id": "uuid",
          "nombre": "Pedro López",
          "porcentajeCompletado": "60.00"
        }
      ],
      "incumpliendo": [
        {
          "id": "uuid",
          "nombre": "María Rodríguez",
          "porcentajeCompletado": "35.00"
        }
      ]
    },
    "metricas": {
      "tasaCumplimiento": "60.00",
      "tasaRiesgo": "24.00",
      "tasaIncumplimiento": "16.00"
    }
  }
}
```

**Flujo en la Base de Datos:**
1. Consulta `estudiantes_becarios` con filtros y `estado = 'Activa'`
2. Une con `usuarios` (estudiante y supervisor)
3. Calcula `porcentajeCompletado = horasCompletadas / horasRequeridas`
4. Clasifica según umbral:
   - **Cumpliendo**: porcentaje >= umbralRiesgo (75%)
   - **En Riesgo**: porcentaje >= umbralRiesgo * 0.7 (52.5%)
   - **Incumpliendo**: porcentaje < umbralRiesgo * 0.7

---

## Exportación de Datos

### 9. GET `/api/v1/reportes/estadisticas/export/excel`

**Descripción:** Exportar estadísticas a formato Excel (.xlsx)

**Parámetros de Query:**
```
tipoReporte (requerido): Enum - "solicitudes" | "beneficiarios" | "productividad" | "horas" | "resumen-general"
periodoAcademico (opcional): String
tipoBeca (opcional): Enum
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/export/excel?tipoReporte=beneficiarios&periodoAcademico=2024-1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="reporte_beneficiarios_1234567890.xlsx"`
- **Body**: Archivo binario Excel

**Flujo:**
1. Llama al método correspondiente del servicio según `tipoReporte`
2. Crea workbook usando librería `ExcelJS`
3. Agrega hojas con datos formateados, títulos, headers
4. Aplica estilos (negrita, colores, anchos de columna)
5. Genera buffer y lo envía como descarga

---

### 10. GET `/api/v1/reportes/estadisticas/export/csv`

**Descripción:** Exportar estadísticas a formato CSV

**Parámetros de Query:**
```
tipoReporte (requerido): Enum - "solicitudes" | "beneficiarios" | "productividad" | "horas"
periodoAcademico (opcional): String
tipoBeca (opcional): Enum
```

**Ejemplo de Request:**
```bash
GET /api/v1/reportes/estadisticas/export/csv?tipoReporte=horas&semana=8
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta:**
- **Content-Type**: `text/csv; charset=utf-8`
- **Content-Disposition**: `attachment; filename="reporte_horas_1234567890.csv"`
- **Body**: Archivo CSV con BOM UTF-8

**Restricciones:**
- Supervisores solo pueden exportar reportes de `productividad` y `horas`

**Flujo:**
1. Llama al método del servicio según `tipoReporte`
2. Extrae datos específicos para CSV
3. Define campos a exportar
4. Usa librería `json2csv` para convertir JSON a CSV
5. Agrega BOM (Byte Order Mark) para UTF-8
6. Envía como descarga

---

## Flujo en la Base de Datos

### Tablas Principales Utilizadas

```
postulaciones
├── id (UUID)
├── usuarioId (UUID) → usuarios.id
├── estado (ENUM)
├── tipoBeca (STRING)
├── tipoPostulante (ENUM)
├── iaa (DECIMAL)
├── fechaPostulacion (DATE)
├── fechaEvaluacion (DATE)
├── evaluadoPor (UUID) → usuarios.id
└── motiveRechazo (STRING)

estudiantes_becarios
├── id (UUID)
├── usuarioId (UUID) → usuarios.id
├── postulacionId (UUID) → postulaciones.id
├── supervisorId (UUID) → usuarios.id
├── plazaAsignada (UUID) → plazas.id
├── tipoBeca (STRING)
├── estado (ENUM)
├── periodoInicio (STRING)
├── horasRequeridas (INTEGER)
├── horasCompletadas (DECIMAL)
└── evaluacionSatisfactoria (BOOLEAN)

reportes_actividades
├── id (UUID)
├── estudianteId (UUID) → usuarios.id
├── estudianteBecarioId (UUID) → estudiantes_becarios.id
├── supervisorId (UUID) → usuarios.id
├── tipoBeca (STRING)
├── semana (INTEGER)
├── periodoAcademico (STRING)
├── horasTrabajadas (DECIMAL)
├── estado (ENUM)
├── fechaAprobacion (DATE)
├── motivoRechazo (STRING)
└── createdAt (TIMESTAMP)

usuarios
├── id (UUID)
├── nombre (STRING)
├── apellido (STRING)
├── email (STRING)
├── cedula (STRING)
├── carrera (STRING)
└── role (ENUM)

plazas
├── id (UUID)
├── codigo (STRING)
├── materia (STRING)
├── departamento (STRING)
└── capacidad (INTEGER)
```

### Operaciones Comunes

**Agregaciones:**
- `COUNT(*)` - Contar registros
- `SUM(horasTrabajadas)` - Sumar horas
- `AVG(iaa)` - Promedios
- `GROUP BY` - Agrupar por campos

**Joins:**
- `Postulacion → Usuario` (evaluador)
- `EstudianteBecario → Usuario` (estudiante, supervisor)
- `EstudianteBecario → Plaza`
- `ReporteActividad → Usuario` (estudiante, supervisor)

**Filtros Frecuentes:**
- `WHERE estado = 'Activa'`
- `WHERE tipoBeca = 'Ayudantía'`
- `WHERE periodoAcademico = '2024-1'`
- `WHERE fechaPostulacion BETWEEN fecha1 AND fecha2`

**Cálculos:**
- Porcentaje: `(valor / total) * 100`
- Tiempo: `DATEDIFF(fechaFin, fechaInicio)`
- Progreso: `horasCompletadas / horasRequeridas * 100`

---

## Validaciones y Errores

### Validaciones de Entrada

- Períodos académicos: longitud 5-10 caracteres
- Tipos de beca: valores del enum
- UUIDs: formato válido
- Fechas: formato ISO8601
- Semanas: entero entre 1-12
- Umbral de riesgo: float entre 0-1

### Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Parámetros inválidos |
| 401 | No autenticado |
| 403 | Sin permisos suficientes |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

---

## Notas Adicionales

1. **Rendimiento:** Todas las consultas pesadas usan `Promise.all` para paralelización
2. **Límites:** Algunos endpoints limitan resultados (ej: beneficiarios a 100)
3. **Cache:** No implementado actualmente
4. **Supervisores:** Solo pueden ver sus propios datos en endpoints de productividad/cumplimiento
5. **Histórico:** Algunos datos históricos aún no están implementados (dependen de tabla de auditoría)

---

**Última actualización:** 2024
**Versión API:** v1
