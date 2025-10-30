# 🚨 BREAKING CHANGES - Sistema de Gestión de Becas

**Fecha**: 28 de Octubre 2025
**Versión**: 3.0.0
**Tipo**: Cambios arquitectónicos mayores

---

## 📋 Resumen Ejecutivo

Se ha realizado una refactorización arquitectónica completa del sistema de asignación de supervisores. **Los supervisores ahora se asignan a PLAZAS, no directamente a estudiantes becarios**.

### Impacto
- ❌ **3 endpoints eliminados completamente**
- ✅ **1 nuevo endpoint agregado**
- 🔄 **Cambios en estructura de respuestas JSON**
- 🗄️ **Campo `supervisorId` eliminado de base de datos**

---

## 🔴 ENDPOINTS ELIMINADOS (Breaking Changes)

### 1. ❌ `PUT /api/v1/supervisores/ayudantes/:id`
**Antes:** Asignaba/cambiaba supervisor directamente a un becario
**Ahora:** NO EXISTE - Usar asignación de plaza en su lugar

```javascript
// ❌ CÓDIGO ANTIGUO (YA NO FUNCIONA)
await fetch(`/api/v1/supervisores/ayudantes/${becarioId}`, {
  method: 'PUT',
  body: JSON.stringify({ supervisorId: 'uuid-supervisor' })
});
```

**Migración requerida:**
```javascript
// ✅ NUEVO CÓDIGO
await fetch(`/api/v1/becarios/${becarioId}/asignar-plaza`, {
  method: 'PUT',
  body: JSON.stringify({ plazaId: 'uuid-plaza' })
});
// El supervisor viene automáticamente de la plaza
```

---

### 2. ❌ `POST /api/v1/supervisores/:supervisorId/ayudantes/asignar`
**Antes:** Asignaba múltiples becarios a un supervisor (batch)
**Ahora:** NO EXISTE - Los becarios se asignan a plazas, no a supervisores

```javascript
// ❌ CÓDIGO ANTIGUO (YA NO FUNCIONA)
await fetch(`/api/v1/supervisores/${supervisorId}/ayudantes/asignar`, {
  method: 'POST',
  body: JSON.stringify({
    estudiantesBecarios: ['uuid1', 'uuid2'],
    permitirReasignacion: true
  })
});
```

**Migración requerida:**
```javascript
// ✅ NUEVO CÓDIGO - Asignar cada becario a una plaza del supervisor
// Paso 1: Obtener plaza activa del supervisor
const { plaza } = await fetch(
  `/api/v1/supervisores/${supervisorId}/plaza-activa?periodoAcademico=2025-1`
).then(r => r.json());

if (!plaza) {
  throw new Error('El supervisor no tiene plaza activa');
}

// Paso 2: Asignar becarios a la plaza
for (const becarioId of becarios) {
  await fetch(`/api/v1/becarios/${becarioId}/asignar-plaza`, {
    method: 'PUT',
    body: JSON.stringify({ plazaId: plaza.id })
  });
}
```

---

### 3. ❌ `POST /api/v1/supervisores/:supervisorId/ayudantes/desasignar`
**Antes:** Desasignaba múltiples becarios de un supervisor (batch)
**Ahora:** NO EXISTE - Remover plaza del becario en su lugar

```javascript
// ❌ CÓDIGO ANTIGUO (YA NO FUNCIONA)
await fetch(`/api/v1/supervisores/${supervisorId}/ayudantes/desasignar`, {
  method: 'POST',
  body: JSON.stringify({
    estudiantesBecarios: ['uuid1', 'uuid2']
  })
});
```

**Migración requerida:**
```javascript
// ✅ NUEVO CÓDIGO
for (const becarioId of becarios) {
  await fetch(`/api/v1/becarios/${becarioId}/remover-plaza`, {
    method: 'PUT'
  });
}
```

---

## ✅ NUEVOS ENDPOINTS

### 1. `GET /api/v1/supervisores/:supervisorId/plaza-activa`
Obtiene la plaza activa de un supervisor en un período específico.

```javascript
// ✅ NUEVO ENDPOINT
const response = await fetch(
  `/api/v1/supervisores/${supervisorId}/plaza-activa?periodoAcademico=2025-1`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

const { plaza } = await response.json();
// plaza será null si el supervisor no tiene plaza en ese período
```

**Response:**
```json
{
  "success": true,
  "message": "Plaza activa del supervisor obtenida exitosamente",
  "data": {
    "plaza": {
      "id": "uuid-plaza",
      "materia": "Programación I",
      "codigo": "CI-2125",
      "departamento": "Ingeniería",
      "capacidad": 10,
      "ocupadas": 5,
      "supervisorResponsable": "uuid-supervisor",
      "estado": "Activa",
      "estudiantesAsignados": [...]
    }
  }
}
```

### 2. `PUT /api/v1/becarios/:id/asignar-plaza`
Asigna un becario a una plaza específica (el supervisor viene de la plaza).

```javascript
// ✅ NUEVO ENDPOINT
await fetch(`/api/v1/becarios/${becarioId}/asignar-plaza`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ plazaId: 'uuid-plaza' })
});
```

### 3. `PUT /api/v1/becarios/:id/remover-plaza`
Remueve la asignación de plaza de un becario.

```javascript
// ✅ NUEVO ENDPOINT
await fetch(`/api/v1/becarios/${becarioId}/remover-plaza`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🔄 CAMBIOS EN ESTRUCTURAS DE RESPUESTA

### EstudianteBecario (Response JSON)

**❌ ANTES:**
```json
{
  "id": "uuid",
  "usuarioId": "uuid",
  "supervisorId": "uuid-supervisor",  // ⚠️ CAMPO ELIMINADO
  "supervisor": {                     // ⚠️ ELIMINADO
    "id": "uuid",
    "nombre": "Ana",
    "apellido": "García"
  },
  "plazaAsignada": "uuid-plaza",
  "plaza": {
    "materia": "Programación I",
    "codigo": "CI-2125"
  }
}
```

**✅ AHORA:**
```json
{
  "id": "uuid",
  "usuarioId": "uuid",
  "plazaAsignada": "uuid-plaza",
  "plaza": {
    "id": "uuid-plaza",
    "materia": "Programación I",
    "codigo": "CI-2125",
    "supervisorResponsable": "uuid-supervisor",  // ✅ NUEVO
    "supervisor": {                               // ✅ ANIDADO EN PLAZA
      "id": "uuid",
      "nombre": "Ana",
      "apellido": "García",
      "email": "prof.garcia@unimet.edu.ve"
    }
  }
}
```

**Migración de código:**
```javascript
// ❌ CÓDIGO ANTIGUO
const supervisorNombre = becario.supervisor?.nombre;
const supervisorId = becario.supervisorId;

// ✅ NUEVO CÓDIGO
const supervisorNombre = becario.plaza?.supervisor?.nombre;
const supervisorId = becario.plaza?.supervisorResponsable;
```

---

## 🎯 FLUJO DE ASIGNACIÓN ACTUALIZADO

### Antiguo Flujo (Deprecated)
1. Postulación aprobada → Becario creado
2. Admin asigna supervisor directamente al becario
3. (Opcional) Admin asigna plaza al becario

### Nuevo Flujo (Actual)
1. Postulación aprobada → Becario creado (sin plaza)
2. Admin asigna becario a una plaza
3. Supervisor obtenido automáticamente desde `plaza.supervisorResponsable`

---

## 🔍 CAMBIOS EN QUERIES Y FILTROS

### Filtro "sinSupervisor"

**❌ ANTES:**
```javascript
// Ya no funciona correctamente
const { becarios } = await fetch(
  '/api/v1/becarios?sinSupervisor=true'
).then(r => r.json());
```

**✅ AHORA:**
```javascript
// Usar sinPlaza en su lugar
const { becarios } = await fetch(
  '/api/v1/becarios?sinPlaza=true'
).then(r => r.json());
```

### Obtener supervisor de un becario

**❌ ANTES:**
```javascript
const supervisor = becario.supervisor;
```

**✅ AHORA:**
```javascript
const supervisor = becario.plaza?.supervisor || null;
```

---

## 📊 IMPACTO EN COMPONENTES FRONTEND

### Componentes Afectados (estimado)

| Componente | Nivel de Impacto | Acción Requerida |
|-----------|------------------|------------------|
| `AsignarSupervisorModal` | 🔴 CRÍTICO | Reescribir completamente para asignar plaza |
| `SupervisorAssignmentForm` | 🔴 CRÍTICO | Cambiar a selección de plaza |
| `BecarioDetailCard` | 🟡 MEDIO | Actualizar acceso a supervisor via plaza |
| `BecariosList` | 🟡 MEDIO | Actualizar columna supervisor |
| `SupervisorDashboard` | 🟢 BAJO | Ya usa endpoints correctos |
| `ReportesModule` | 🟡 MEDIO | Verificar queries de supervisor |

---

## ✅ CHECKLIST DE MIGRACIÓN

### Backend
- [x] Ejecutar migración SQL (`001-remove-supervisorId-from-estudiantes-becarios.sql`)
- [x] Actualizar modelos Sequelize
- [x] Refactorizar servicios
- [x] Actualizar controllers y routes
- [x] Actualizar documentación Swagger

### Frontend (⚠️ PENDIENTE)
- [ ] Actualizar servicio API para nuevos endpoints
- [ ] Reescribir componente de asignación de supervisor
- [ ] Actualizar queries GraphQL (si aplica)
- [ ] Cambiar acceso a `becario.supervisor` → `becario.plaza.supervisor`
- [ ] Actualizar filtros (`sinSupervisor` → `sinPlaza`)
- [ ] Probar flujo completo de asignación
- [ ] Actualizar pruebas unitarias y e2e
- [ ] Actualizar documentación interna

---

## 🆘 SOPORTE Y PREGUNTAS

### Preguntas Frecuentes

**Q: ¿Puedo mantener el código antiguo temporalmente?**
A: No, los endpoints antiguos han sido eliminados completamente. Debes migrar.

**Q: ¿Cómo asigno supervisor si no hay plazas disponibles?**
A: Debes crear una plaza primero en `/api/v1/plazas` con el supervisor asignado.

**Q: ¿Un supervisor puede tener múltiples plazas?**
A: Sí, pero solo UNA plaza activa por período académico.

**Q: ¿Qué pasa con los becarios que ya tenían supervisorId?**
A: Perdieron la asignación y deben ser reasignados a plazas manualmente.

### Contacto
- **Backend Lead**: [Tu nombre]
- **Documentación**: `TECHNICAL_MIGRATION.md`
- **Issues**: GitHub Issues del proyecto

---

**Última actualización**: 28 de Octubre 2025
**Versión del documento**: 1.0.0
