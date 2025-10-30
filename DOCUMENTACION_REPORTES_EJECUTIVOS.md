# Documentación API - Reportes Ejecutivos

## Información General

**Base URL:** `/api/v1/reportes-ejecutivos`

**Autenticación:** Todos los endpoints requieren autenticación mediante JWT Token

**Header requerido:**
```
Authorization: Bearer {access_token}
```

**Roles autorizados:**
- `admin`
- `gestor-becas`
- `capital-humano`
- `director-area`

---

## 1. Informe Ejecutivo de Período Académico

### Endpoint
```
GET /api/v1/reportes-ejecutivos/informe-ejecutivo
```

### Descripción
Genera un informe ejecutivo completo del período académico con KPIs, postulaciones, becarios, ayudantías, análisis financiero y proyecciones.

### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Valores Permitidos | Descripción |
|-----------|------|-----------|---------|-------------------|-------------|
| `periodo` | string | No | Período actual | Formato: "YYYY-S" (ej: "2025-1") | Período académico a consultar |
| `formato` | string | No | `pdf` | `pdf`, `excel`, `json` | Formato de salida del reporte |
| `incluirGraficos` | boolean | No | `true` | `true`, `false` | Incluir gráficos en el reporte |
| `incluirProyecciones` | boolean | No | `true` | `true`, `false` | Incluir proyecciones en el reporte |

### Ejemplos de Uso

#### JavaScript/TypeScript (Fetch)
```javascript
// Descargar PDF
async function descargarInformeEjecutivo(periodo) {
  const response = await fetch(
    `/api/v1/reportes-ejecutivos/informe-ejecutivo?periodo=${periodo}&formato=pdf`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `informe-ejecutivo-${periodo}.pdf`;
  a.click();
}

// Obtener datos en JSON
async function obtenerInformeJSON(periodo) {
  const response = await fetch(
    `/api/v1/reportes-ejecutivos/informe-ejecutivo?periodo=${periodo}&formato=json&incluirGraficos=true`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  return await response.json();
}
```

#### Axios
```javascript
// Descargar Excel
axios({
  method: 'GET',
  url: '/api/v1/reportes-ejecutivos/informe-ejecutivo',
  params: {
    periodo: '2025-1',
    formato: 'excel',
    incluirGraficos: true,
    incluirProyecciones: true
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  responseType: 'blob'
}).then(response => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'informe-ejecutivo-2025-1.xlsx';
  link.click();
});
```

#### cURL
```bash
# Descargar PDF
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/informe-ejecutivo?periodo=2025-1&formato=pdf" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output informe-ejecutivo.pdf

# Obtener JSON
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/informe-ejecutivo?formato=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Respuesta

#### Formato: PDF
- **Content-Type:** `application/pdf`
- **Nombre archivo:** `informe-ejecutivo-{periodo}.pdf`
- Documento PDF descargable

#### Formato: Excel
- **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Nombre archivo:** `informe-ejecutivo-{periodo}.xlsx`
- Archivo Excel descargable

#### Formato: JSON
```json
{
  "success": true,
  "data": {
    "periodo": "2025-1",
    "resumenEjecutivo": {
      "kpis": {
        "totalPostulaciones": 150,
        "totalBecarios": 120,
        "tasaAceptacion": 80,
        "presupuestoTotal": 1500000,
        "presupuestoEjecutado": 1200000,
        "tasaEjecucion": 80
      },
      "insights": [
        "Incremento del 15% en postulaciones respecto al período anterior",
        "Alta tasa de cumplimiento en ayudantías (92%)"
      ]
    },
    "postulaciones": {
      "porEstado": { "aprobada": 80, "rechazada": 20, "pendiente": 50 },
      "porTipoBeca": { "merito": 60, "vulnerabilidad": 40, "deportiva": 30 },
      "tendencias": []
    },
    "becarios": {
      "activos": 120,
      "porCarrera": {},
      "rendimientoAcademico": {
        "promedioGeneral": 85.5,
        "distribucion": {}
      }
    },
    "ayudantias": {
      "total": 45,
      "porDepartamento": {},
      "cumplimiento": {
        "reportesAlDia": 92,
        "evaluacionesPendientes": 8
      }
    },
    "analisisFinanciero": {
      "distribucionPresupuesto": {},
      "gastosDetallados": {},
      "proyeccionProximoPeriodo": {}
    },
    "recomendaciones": [
      "Ampliar cupos para becas de mérito",
      "Reforzar seguimiento en departamentos X e Y"
    ]
  },
  "metadata": {
    "generadoEn": "2025-10-25T10:30:00Z",
    "usuario": "admin@example.com"
  }
}
```

---

## 2. Reporte Operativo de Supervisión

### Endpoint
```
GET /api/v1/reportes-ejecutivos/operativo-supervision
```

### Descripción
Genera un reporte operativo detallado sobre la supervisión de ayudantías, carga de trabajo de supervisores, estudiantes en riesgo y análisis de plazas.

### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Valores Permitidos | Descripción |
|-----------|------|-----------|---------|-------------------|-------------|
| `periodo` | string | No | Período actual | Formato: "YYYY-S" | Período académico a consultar |
| `formato` | string | No | `pdf` | `pdf`, `excel`, `json` | Formato de salida del reporte |
| `supervisorId` | string | No | - | ID del supervisor | Filtrar por supervisor específico |
| `departamento` | string | No | - | Nombre del departamento | Filtrar por departamento |

### Ejemplos de Uso

#### JavaScript/TypeScript
```javascript
// Obtener reporte completo
async function obtenerReporteOperativo(params = {}) {
  const queryParams = new URLSearchParams({
    periodo: params.periodo || '2025-1',
    formato: params.formato || 'json',
    ...(params.supervisorId && { supervisorId: params.supervisorId }),
    ...(params.departamento && { departamento: params.departamento })
  });

  const response = await fetch(
    `/api/v1/reportes-ejecutivos/operativo-supervision?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (params.formato === 'json') {
    return await response.json();
  } else {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-operativo-${params.periodo}.${params.formato === 'excel' ? 'xlsx' : 'pdf'}`;
    a.click();
  }
}

// Uso
obtenerReporteOperativo({
  periodo: '2025-1',
  formato: 'json',
  departamento: 'Ingeniería'
});
```

#### Axios
```javascript
// Filtrar por supervisor específico y descargar PDF
axios.get('/api/v1/reportes-ejecutivos/operativo-supervision', {
  params: {
    periodo: '2025-1',
    formato: 'pdf',
    supervisorId: '507f1f77bcf86cd799439011'
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  responseType: 'blob'
}).then(response => {
  // Descargar archivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reporte-operativo-2025-1.pdf';
  link.click();
});
```

#### cURL
```bash
# Con filtros
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/operativo-supervision?periodo=2025-1&departamento=Ingeniería&formato=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Respuesta JSON
```json
{
  "success": true,
  "data": {
    "periodo": "2025-1",
    "cargaTrabajo": {
      "supervisores": [
        {
          "supervisor": {
            "id": "507f...",
            "nombre": "Dr. Juan Pérez"
          },
          "departamento": "Ingeniería",
          "ayudantesAsignados": 8,
          "horasSemanales": 24,
          "reportesPendientes": 2,
          "nivelCarga": "alta"
        }
      ],
      "promedioCarga": 6.5,
      "distribucionCarga": {}
    },
    "estudiantesRiesgo": [
      {
        "estudiante": { "id": "...", "nombre": "..." },
        "factoresRiesgo": ["bajo-rendimiento", "reportes-atrasados"],
        "nivelRiesgo": "alto",
        "accionesRecomendadas": []
      }
    ],
    "reportesPendientes": {
      "total": 15,
      "porDepartamento": {},
      "masAtrasados": []
    },
    "analisisPlazas": {
      "ocupadas": 42,
      "disponibles": 8,
      "tasaOcupacion": 84,
      "necesidadPlazas": 5
    },
    "recomendaciones": []
  }
}
```

---

## 3. Dashboard de Cumplimiento y Rendimiento

### Endpoint
```
GET /api/v1/reportes-ejecutivos/dashboard-cumplimiento
```

### Descripción
Genera un dashboard en tiempo real con métricas de cumplimiento, rendimiento, alertas activas y rankings de becarios.

### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Valores Permitidos | Descripción |
|-----------|------|-----------|---------|-------------------|-------------|
| `periodo` | string | No | Período actual | Formato: "YYYY-S" | Período académico a consultar |
| `formato` | string | No | `pdf` | `pdf`, `excel`, `json` | Formato de salida del reporte |
| `tipoBeca` | string | No | - | Tipo de beca | Filtrar por tipo de beca |
| `departamento` | string | No | - | Nombre del departamento | Filtrar por departamento |
| `nivelRiesgo` | string | No | - | `critico`, `alto`, `medio`, `bajo` | Filtrar por nivel de riesgo |

### Ejemplos de Uso

#### React Component
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardCumplimiento() {
  const [data, setData] = useState(null);
  const [filtros, setFiltros] = useState({
    periodo: '2025-1',
    tipoBeca: '',
    departamento: '',
    nivelRiesgo: ''
  });

  const cargarDashboard = async () => {
    try {
      const params = {
        periodo: filtros.periodo,
        formato: 'json',
        ...(filtros.tipoBeca && { tipoBeca: filtros.tipoBeca }),
        ...(filtros.departamento && { departamento: filtros.departamento }),
        ...(filtros.nivelRiesgo && { nivelRiesgo: filtros.nivelRiesgo })
      };

      const response = await axios.get(
        '/api/v1/reportes-ejecutivos/dashboard-cumplimiento',
        {
          params,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      setData(response.data.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await axios.get(
        '/api/v1/reportes-ejecutivos/dashboard-cumplimiento',
        {
          params: { ...filtros, formato: 'pdf' },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-cumplimiento-${filtros.periodo}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, [filtros]);

  return (
    <div>
      {/* Filtros */}
      <select onChange={(e) => setFiltros({...filtros, nivelRiesgo: e.target.value})}>
        <option value="">Todos los niveles</option>
        <option value="critico">Crítico</option>
        <option value="alto">Alto</option>
        <option value="medio">Medio</option>
        <option value="bajo">Bajo</option>
      </select>

      <button onClick={descargarPDF}>Descargar PDF</button>

      {/* Renderizar dashboard */}
      {data && (
        <div>
          <h2>Métricas de Cumplimiento</h2>
          {/* Mostrar data.metricas */}
        </div>
      )}
    </div>
  );
}
```

#### cURL
```bash
# Dashboard completo
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/dashboard-cumplimiento?periodo=2025-1&formato=json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Con filtros
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/dashboard-cumplimiento?periodo=2025-1&nivelRiesgo=critico&formato=json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Respuesta JSON
```json
{
  "success": true,
  "data": {
    "periodo": "2025-1",
    "timestamp": "2025-10-25T10:30:00Z",
    "metricas": {
      "cumplimientoReportes": 85,
      "promedioRendimiento": 87.5,
      "tasaRetencion": 92,
      "cumplimientoHoras": 88
    },
    "alertas": {
      "criticas": 3,
      "altas": 8,
      "medias": 15,
      "lista": [
        {
          "tipo": "critica",
          "titulo": "Reportes atrasados > 2 semanas",
          "afectados": 3,
          "accionRequerida": "Seguimiento inmediato"
        }
      ]
    },
    "rankings": {
      "mejoresDesempenos": [
        {
          "becario": { "id": "...", "nombre": "..." },
          "promedio": 95.5,
          "cumplimiento": 100
        }
      ],
      "necesitanApoyo": [
        {
          "becario": { "id": "...", "nombre": "..." },
          "promedio": 65,
          "factoresRiesgo": ["bajo-rendimiento"]
        }
      ]
    },
    "tendencias": {
      "ultimosSeisMeses": [],
      "proyeccion": {}
    },
    "saludSistema": {
      "procesosActivos": 15,
      "tiempoRespuesta": 120,
      "disponibilidad": 99.9
    }
  }
}
```

---

## 4. Análisis Predictivo y Planificación Estratégica

### Endpoint
```
GET /api/v1/reportes-ejecutivos/analisis-predictivo
```

### Descripción
Genera análisis predictivo con tendencias históricas, proyecciones futuras, simulaciones de escenarios y recomendaciones estratégicas.

### Parámetros de Query

| Parámetro | Tipo | Requerido | Default | Valores Permitidos | Descripción |
|-----------|------|-----------|---------|-------------------|-------------|
| `formato` | string | No | `pdf` | `pdf`, `excel`, `json` | Formato de salida del reporte |
| `periodosHistoricos` | integer | No | `8` | 1-20 | Número de períodos históricos a analizar |
| `incluirSimulacion` | boolean | No | `true` | `true`, `false` | Incluir simulación Monte Carlo |
| `escenarios` | array | No | `['optimista', 'base', 'pesimista']` | Array de strings | Escenarios a evaluar |

### Ejemplos de Uso

#### JavaScript/TypeScript
```javascript
// Análisis completo con todos los parámetros
async function obtenerAnalisisPredictivo(opciones = {}) {
  const params = {
    formato: opciones.formato || 'json',
    periodosHistoricos: opciones.periodosHistoricos || 8,
    incluirSimulacion: opciones.incluirSimulacion !== false,
    escenarios: opciones.escenarios || ['optimista', 'base', 'pesimista']
  };

  // Convertir array a query params
  const queryParams = new URLSearchParams();
  queryParams.append('formato', params.formato);
  queryParams.append('periodosHistoricos', params.periodosHistoricos);
  queryParams.append('incluirSimulacion', params.incluirSimulacion);

  // Agregar cada escenario
  params.escenarios.forEach(escenario => {
    queryParams.append('escenarios[]', escenario);
  });

  const response = await fetch(
    `/api/v1/reportes-ejecutivos/analisis-predictivo?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (params.formato === 'json') {
    return await response.json();
  } else {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fecha = new Date().toISOString().split('T')[0];
    a.download = `analisis-predictivo-${fecha}.${params.formato === 'excel' ? 'xlsx' : 'pdf'}`;
    a.click();
  }
}

// Uso básico
obtenerAnalisisPredictivo({
  formato: 'json',
  periodosHistoricos: 12,
  incluirSimulacion: true,
  escenarios: ['optimista', 'base', 'pesimista']
});

// Análisis simple (solo escenario base)
obtenerAnalisisPredictivo({
  escenarios: ['base'],
  periodosHistoricos: 6
});
```

#### Axios
```javascript
// Con configuración avanzada
axios.get('/api/v1/reportes-ejecutivos/analisis-predictivo', {
  params: {
    formato: 'excel',
    periodosHistoricos: 10,
    incluirSimulacion: true,
    escenarios: ['optimista', 'base', 'pesimista']
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  responseType: 'blob',
  paramsSerializer: params => {
    // Manejar arrays correctamente
    return Object.keys(params)
      .map(key => {
        if (Array.isArray(params[key])) {
          return params[key].map(val => `${key}[]=${encodeURIComponent(val)}`).join('&');
        }
        return `${key}=${encodeURIComponent(params[key])}`;
      })
      .join('&');
  }
}).then(response => {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const fecha = new Date().toISOString().split('T')[0];
  link.download = `analisis-predictivo-${fecha}.xlsx`;
  link.click();
});
```

#### cURL
```bash
# Análisis básico
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/analisis-predictivo?formato=json&periodosHistoricos=8" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Con múltiples escenarios
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/analisis-predictivo?formato=json&periodosHistoricos=12&incluirSimulacion=true&escenarios[]=optimista&escenarios[]=base&escenarios[]=pesimista" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Descargar PDF
curl -X GET "http://localhost:3000/api/v1/reportes-ejecutivos/analisis-predictivo?formato=pdf" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output analisis-predictivo.pdf
```

### Respuesta JSON
```json
{
  "success": true,
  "data": {
    "configuracion": {
      "periodosHistoricos": 8,
      "escenarios": ["optimista", "base", "pesimista"],
      "incluirSimulacion": true
    },
    "tendenciasHistoricas": {
      "postulaciones": {
        "datos": [
          { "periodo": "2023-1", "valor": 100 },
          { "periodo": "2023-2", "valor": 120 },
          { "periodo": "2024-1", "valor": 135 }
        ],
        "tendencia": "creciente",
        "tasaCrecimiento": 15.5
      },
      "becarios": {
        "datos": [],
        "tendencia": "estable",
        "tasaCrecimiento": 2.3
      },
      "presupuesto": {
        "datos": [],
        "tendencia": "creciente",
        "tasaCrecimiento": 8.7
      }
    },
    "proyecciones": {
      "proximoPeriodo": {
        "postulaciones": {
          "optimista": 180,
          "base": 155,
          "pesimista": 135,
          "intervaloConfianza": [145, 165]
        },
        "presupuestoNecesario": {
          "optimista": 1800000,
          "base": 1550000,
          "pesimista": 1350000
        }
      },
      "proximosDosPeriodos": {},
      "tendenciaLargoPlazo": {}
    },
    "analisisPresupuesto": {
      "historialEjecucion": [],
      "eficienciaGasto": 87.5,
      "proyeccionNecesidades": {},
      "recomendacionesOptimizacion": []
    },
    "planificacionCapacidad": {
      "plazasRequeridas": {
        "optimista": 65,
        "base": 55,
        "pesimista": 48
      },
      "supervisoresNecesarios": {
        "optimista": 12,
        "base": 10,
        "pesimista": 9
      },
      "departamentosCriticos": []
    },
    "simulacionMonteCarlo": {
      "iteraciones": 10000,
      "resultados": {
        "postulaciones": {
          "promedio": 156,
          "desviacionEstandar": 12,
          "percentil5": 140,
          "percentil95": 172
        }
      },
      "probabilidades": {
        "superarCapacidad": 15,
        "necesitarMasPresupuesto": 22
      }
    },
    "recomendacionesEstrategicas": [
      {
        "categoria": "capacidad",
        "prioridad": "alta",
        "recomendacion": "Incrementar plazas de ayudantía en 10%",
        "impactoEsperado": "Reducir lista de espera en 30%",
        "accionesConcretas": []
      }
    ],
    "factoresRiesgo": [
      {
        "factor": "Crecimiento acelerado de postulaciones",
        "probabilidad": 65,
        "impacto": "alto",
        "mitigacion": "Plan de contingencia presupuestaria"
      }
    ]
  },
  "metadata": {
    "generadoEn": "2025-10-25T10:30:00Z",
    "modelosUtilizados": ["regresion-lineal", "monte-carlo", "series-temporales"]
  }
}
```

---

## Manejo de Errores

Todos los endpoints pueden retornar los siguientes errores:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No autenticado. Token no proporcionado o inválido"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Solo usuarios administrativos pueden acceder a reportes ejecutivos"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Formato no válido. Use: pdf, excel o json"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error al generar el reporte",
  "error": "Detalles del error..."
}
```

---

## Consideraciones Importantes

### 1. Autenticación
- Todos los endpoints requieren token JWT válido
- El token debe enviarse en el header `Authorization: Bearer {token}`
- El token debe pertenecer a un usuario con rol autorizado

### 2. Formatos de Descarga
- **PDF:** Ideal para reportes ejecutivos impresos
  - Landscape para dashboards
  - Portrait para informes y análisis
- **Excel:** Para análisis de datos y manipulación
  - Incluye múltiples hojas
  - Gráficos embebidos
- **JSON:** Para integración con aplicaciones
  - Datos estructurados
  - Fácil procesamiento

### 3. Performance
- Los reportes con formato PDF/Excel pueden tardar más tiempo
- Recomendado mostrar indicador de carga al usuario
- Considerar implementar polling o websockets para reportes largos

### 4. Caché
- Los datos pueden estar cacheados por breves períodos
- Para datos en tiempo real, usar formato JSON
- Considerar agregar parámetro `timestamp` para forzar refresh

### 5. Límites
- No hay límite explícito de períodos históricos, pero se recomienda max 20
- Reportes muy grandes pueden afectar performance
- Considerar paginación para datasets extensos

---

## Ejemplo Completo: Componente React con Todos los Reportes

```javascript
import React, { useState } from 'react';
import axios from 'axios';

const ReportesEjecutivos = () => {
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('2025-1');

  const API_BASE = '/api/v1/reportes-ejecutivos';
  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });

  const descargarReporte = async (endpoint, params = {}, nombreArchivo) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        params: { ...params, periodo },
        headers: getAuthHeader(),
        responseType: params.formato === 'json' ? 'json' : 'blob'
      });

      if (params.formato === 'json') {
        console.log('Datos:', response.data);
        return response.data;
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reportes-ejecutivos">
      <h1>Reportes Ejecutivos</h1>

      <div className="filtros">
        <label>
          Período:
          <input
            type="text"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="2025-1"
          />
        </label>
      </div>

      <div className="botones">
        <button
          onClick={() => descargarReporte(
            '/informe-ejecutivo',
            { formato: 'pdf', incluirGraficos: true },
            `informe-ejecutivo-${periodo}.pdf`
          )}
          disabled={loading}
        >
          Informe Ejecutivo (PDF)
        </button>

        <button
          onClick={() => descargarReporte(
            '/operativo-supervision',
            { formato: 'excel' },
            `reporte-operativo-${periodo}.xlsx`
          )}
          disabled={loading}
        >
          Reporte Operativo (Excel)
        </button>

        <button
          onClick={() => descargarReporte(
            '/dashboard-cumplimiento',
            { formato: 'json', nivelRiesgo: 'critico' }
          )}
          disabled={loading}
        >
          Dashboard (JSON)
        </button>

        <button
          onClick={() => descargarReporte(
            '/analisis-predictivo',
            {
              formato: 'pdf',
              periodosHistoricos: 12,
              incluirSimulacion: true
            },
            `analisis-predictivo-${new Date().toISOString().split('T')[0]}.pdf`
          )}
          disabled={loading}
        >
          Análisis Predictivo (PDF)
        </button>
      </div>

      {loading && <div className="loader">Generando reporte...</div>}
    </div>
  );
};

export default ReportesEjecutivos;
```

---

## Resumen de Endpoints

| Endpoint | Propósito | Filtros Principales | Formato Output |
|----------|-----------|---------------------|----------------|
| `/informe-ejecutivo` | Informe completo de período | periodo, incluirGraficos | PDF, Excel, JSON |
| `/operativo-supervision` | Supervisión operativa | periodo, supervisorId, departamento | PDF, Excel, JSON |
| `/dashboard-cumplimiento` | Métricas en tiempo real | periodo, tipoBeca, nivelRiesgo | PDF, Excel, JSON |
| `/analisis-predictivo` | Proyecciones futuras | periodosHistoricos, escenarios | PDF, Excel, JSON |

---

## Soporte

Para más información o reportar issues:
- Revisar logs del servidor
- Verificar permisos de usuario
- Contactar al equipo de desarrollo
