# 📋 Actualización del Módulo de Plazas - Guía para Frontend

**Fecha**: 31 de Octubre 2025
**Versión**: 2.23.2
**Estado**: ✅ Cambios aplicados en producción

---

## 🎯 Resumen Ejecutivo

Se simplificó el modelo de **Plazas** eliminando 3 campos redundantes y agregando un único campo descriptivo.

### Cambios Principales:
- ❌ **Eliminados**: `materia`, `codigo`, `departamento`
- ✅ **Agregado**: `nombre` (campo único descriptivo)

---

## 📝 Qué Cambió

### ANTES (❌ Ya no funciona):
```json
{
  "materia": "Cálculo I",
  "codigo": "MAT-101-A",
  "departamento": "Matemáticas",
  "ubicacion": "Edificio A",
  "capacidad": 10,
  ...
}
```

### AHORA (✅ Usar desde hoy):
```json
{
  "nombre": "Ayudantía de Cálculo I - Sección A",
  "ubicacion": "Edificio A",
  "capacidad": 10,
  ...
}
```

---

## 🔧 Cambios Requeridos en Frontend

### 1️⃣ **Formulario de Crear Plaza**

**Eliminar estos campos del formulario:**
- ❌ Input de "Materia"
- ❌ Input de "Código"
- ❌ Input de "Departamento"

**Agregar este campo:**
- ✅ Input de "Nombre de la Plaza" (texto largo, 3-200 caracteres)

**Ejemplo de UI sugerida:**
```
┌─────────────────────────────────────────────────┐
│ Nombre de la Plaza *                            │
│ ┌─────────────────────────────────────────────┐ │
│ │ Ayudantía de Cálculo I - Sección A         │ │
│ └─────────────────────────────────────────────┘ │
│ Ejemplo: "Ayudantía de Lab. Física - Grupo B"  │
└─────────────────────────────────────────────────┘
```

### 2️⃣ **Request para Crear Plaza** (`POST /api/v1/plazas`)

**ANTES (❌ Ya no válido):**
```javascript
const data = {
  materia: "Cálculo I",
  codigo: "MAT-101-A",
  departamento: "Matemáticas",
  ubicacion: "Oficina 201",
  capacidad: 10,
  // ... otros campos
};
```

**AHORA (✅ Usar este formato):**
```javascript
const data = {
  nombre: "Ayudantía de Cálculo I - Sección A",  // ← NUEVO campo
  ubicacion: "Oficina 201 en la Universidad Metropolitana",
  capacidad: 10,
  tipoAyudantia: "academica",
  descripcionActividades: "Brindar apoyo al departamento de Ing sistemas",
  horario: [
    { dia: "Lunes", horaInicio: "08:00", horaFin: "10:00" },
    { dia: "Martes", horaInicio: "08:00", horaFin: "10:00" }
  ],
  horasSemana: 10,
  periodoAcademico: "2025-1",
  supervisorResponsable: "uuid-del-supervisor",
  requisitosEspeciales: ["Saber programar", "Habilidades de comunicación"],
  observaciones: "Ing sistemas"
};
```

### 3️⃣ **Response de la API** (GET /api/v1/plazas)

**ANTES (❌):**
```json
{
  "id": "uuid",
  "materia": "Cálculo I",
  "codigo": "MAT-101-A",
  "departamento": "Matemáticas",
  ...
}
```

**AHORA (✅):**
```json
{
  "id": "uuid",
  "nombre": "Ayudantía de Cálculo I - Sección A",
  "ubicacion": "Oficina 201",
  "capacidad": 10,
  "ocupadas": 0,
  ...
}
```

### 4️⃣ **Tabla/Lista de Plazas**

**Actualizar columnas:**

| ANTES ❌ | AHORA ✅ |
|---------|---------|
| Código | - |
| Materia | Nombre |
| Departamento | - |
| Ubicación | Ubicación |
| Capacidad | Capacidad |

**Ejemplo de tabla actualizada:**
```
┌────────────────────────────────────┬──────────────┬──────────┬──────────┐
│ Nombre                              │ Ubicación    │ Capacidad│ Estado   │
├────────────────────────────────────┼──────────────┼──────────┼──────────┤
│ Ayudantía de Cálculo I - Sección A │ Oficina 201  │ 10       │ Activa   │
│ Lab. Física - Grupo B               │ Edificio C   │ 5        │ Activa   │
└────────────────────────────────────┴──────────────┴──────────┴──────────┘
```

---

## 🔍 Validaciones del Campo "Nombre"

### Reglas:
- ✅ **Requerido**: No puede estar vacío
- ✅ **Longitud mínima**: 3 caracteres
- ✅ **Longitud máxima**: 200 caracteres
- ✅ **Tipo**: String (texto)

### Mensajes de Error:
```javascript
// Si está vacío
"Nombre es requerido"

// Si es muy corto
"Nombre debe tener al menos 3 caracteres"

// Si es muy largo
"Nombre no puede exceder 200 caracteres"
```

---

## 🚀 Endpoints Afectados

Todos los endpoints de plazas ahora usan el campo `nombre`:

### ✅ Sin cambios en URLs:
- `POST /api/v1/plazas` - Crear plaza
- `GET /api/v1/plazas` - Listar plazas
- `GET /api/v1/plazas/:id` - Ver detalle
- `PUT /api/v1/plazas/:id` - Actualizar plaza
- `DELETE /api/v1/plazas/:id` - Eliminar plaza
- `GET /api/v1/plazas/disponibles` - Plazas disponibles
- `GET /api/v1/plazas/estadisticas` - Estadísticas

### ❌ Filtros eliminados:
- `?departamento=Matemáticas` ← Ya no existe

### ✅ Filtros que siguen funcionando:
- `?estado=Activa`
- `?tipoAyudantia=academica`
- `?periodoAcademico=2025-1`
- `?disponibles=true`
- `?search=Cálculo` ← Ahora busca en el campo "nombre"

---

## 📊 Ejemplos Completos

### Crear Plaza
```javascript
// Request
POST https://srodriguez.intelcondev.org/api/v1/plazas
Headers: {
  "Authorization": "Bearer tu-token-jwt",
  "Content-Type": "application/json"
}

Body: {
  "nombre": "Ayudantía de Programación II - Lab A",
  "ubicacion": "Edificio de Ingeniería, Piso 2",
  "capacidad": 8,
  "tipoAyudantia": "academica",
  "descripcionActividades": "Apoyo en laboratorio de programación",
  "horario": [
    { "dia": "Lunes", "horaInicio": "14:00", "horaFin": "16:00" },
    { "dia": "Miércoles", "horaInicio": "14:00", "horaFin": "16:00" }
  ],
  "horasSemana": 10,
  "periodoAcademico": "2025-1",
  "requisitosEspeciales": ["Conocimientos de Java", "Python básico"],
  "supervisorResponsable": "df2a1be1-d99f-4d86-bfaa-eb938332b87c"
}

// Response 201 Created
{
  "success": true,
  "message": "Plaza creada exitosamente",
  "data": {
    "id": "uuid-generado",
    "nombre": "Ayudantía de Programación II - Lab A",
    "ubicacion": "Edificio de Ingeniería, Piso 2",
    "capacidad": 8,
    "ocupadas": 0,
    "estado": "Activa",
    "tipoAyudantia": "academica",
    "horasSemana": 10,
    "periodoAcademico": "2025-1",
    "createdAt": "2025-10-31T04:50:00.000Z",
    "updatedAt": "2025-10-31T04:50:00.000Z"
  }
}
```

### Listar Plazas
```javascript
// Request
GET https://srodriguez.intelcondev.org/api/v1/plazas?search=Programación

// Response
{
  "success": true,
  "data": {
    "plazas": [
      {
        "id": "uuid",
        "nombre": "Ayudantía de Programación II - Lab A",
        "ubicacion": "Edificio de Ingeniería, Piso 2",
        "capacidad": 8,
        "ocupadas": 0,
        "estado": "Activa",
        "plazasDisponibles": 8,
        "disponibilidad": "Disponible"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Actualizar Plaza
```javascript
// Request - Solo enviar campos a actualizar
PUT https://srodriguez.intelcondev.org/api/v1/plazas/uuid-de-la-plaza

Body: {
  "nombre": "Ayudantía de Programación II - Lab B",  // ← Actualizado
  "capacidad": 10  // ← Actualizado
}

// Response
{
  "success": true,
  "message": "Plaza actualizada exitosamente",
  "data": {
    "id": "uuid",
    "nombre": "Ayudantía de Programación II - Lab B",
    "capacidad": 10,
    ...
  }
}
```

---

## 🎨 Sugerencias de UX

### Placeholder para el campo "Nombre":
```
Ejemplo: "Ayudantía de Laboratorio de Física - Grupo A"
```

### Tooltip/Ayuda:
```
💡 Ingresa un nombre descriptivo que identifique claramente esta plaza.
   Incluye la materia, área o tipo de ayudantía.
```

### Validación en tiempo real:
```javascript
const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return 'El nombre es requerido';
  }
  if (nombre.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }
  if (nombre.length > 200) {
    return 'El nombre no puede exceder 200 caracteres';
  }
  return null; // Válido
};
```

---

## ✅ Checklist de Implementación

### Componentes a Actualizar:
- [ ] Formulario de crear plaza
- [ ] Formulario de editar plaza
- [ ] Tabla/lista de plazas
- [ ] Card/detalle de plaza individual
- [ ] Filtros de búsqueda (eliminar filtro por departamento)
- [ ] Validaciones del formulario
- [ ] Tipos TypeScript/PropTypes (si aplica)

### Testing:
- [ ] Probar crear plaza con el nuevo formato
- [ ] Probar editar plaza existente
- [ ] Probar búsqueda por nombre
- [ ] Verificar que no haya referencias a campos antiguos
- [ ] Probar validaciones de longitud del nombre

---

## 🆘 Soporte

Si encuentras algún problema o tienes dudas:
1. Revisa la documentación Swagger: https://srodriguez.intelcondev.org/api-docs
2. Contacta al equipo de backend
3. Consulta este documento

---

## 📌 Notas Importantes

- ⚠️ **Los datos antiguos ya no existen**: Las plazas creadas antes de este cambio ya no tienen los campos `materia`, `codigo`, `departamento`
- ✅ **Retrocompatibilidad**: No hay retrocompatibilidad, todos los endpoints esperan el nuevo formato
- 🔄 **Migración automática**: La base de datos ya fue migrada automáticamente
- 📅 **Fecha efectiva**: 31 de Octubre 2025

---

**Última actualización**: 31 de Octubre 2025
**Versión del backend**: 2.23.2
**Servidor**: https://srodriguez.intelcondev.org
