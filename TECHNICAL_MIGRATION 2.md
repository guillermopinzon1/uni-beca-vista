# Guía Técnica de Migración: Supervisores → Plazas

**Audiencia**: Desarrolladores Backend y Frontend
**Versión**: 3.0.0
**Fecha**: 28 de Octubre 2025

---

## 📌 Tabla de Contenidos

1. [Resumen de Cambios](#resumen-de-cambios)
2. [Arquitectura Anterior vs Nueva](#arquitectura)
3. [Cambios en Base de Datos](#base-de-datos)
4. [Cambios en Modelos](#modelos)
5. [Cambios en API](#api)
6. [Guía de Migración Frontend](#frontend)
7. [Casos de Uso Actualizados](#casos-de-uso)
8. [Validaciones y Reglas de Negocio](#validaciones)

---

## 🎯 Resumen de Cambios

### Problema Original
- Los estudiantes becarios tenían un campo `supervisorId` que apuntaba directamente a un supervisor
- Esto creaba una relación directa `EstudianteBecario → Supervisor`
- Las plazas existían pero no eran la fuente de verdad para la supervisión

### Solución Implementada
- **Eliminado**: Campo `supervisorId` de `estudiantes_becarios`
- **Nuevo flujo**: `EstudianteBecario → Plaza → Supervisor`
- **Constraint agregado**: Un supervisor solo puede tener una plaza activa por período académico
- **Beneficios**: Mayor consistencia, mejor trazabilidad, alineación con proceso real

---

## 🏗️ Arquitectura

### Arquitectura Anterior

```
┌─────────────────────┐
│ EstudianteBecario   │
├─────────────────────┤
│ id                  │
│ usuarioId           │
│ supervisorId  ◄─────┼──┐ ❌ Relación directa (eliminada)
│ plazaAsignada       │  │
│ ...                 │  │
└─────────────────────┘  │
                         │
                         │
┌─────────────────────┐  │
│ Usuario (Supervisor)│◄─┘
├─────────────────────┤
│ id                  │
│ nombre              │
│ role: 'supervisor'  │
└─────────────────────┘
```

### Nueva Arquitectura

```
┌─────────────────────────┐
│ EstudianteBecario       │
├─────────────────────────┤
│ id                      │
│ usuarioId               │
│ plazaAsignada     ◄─────┼──┐ ✅ Plaza es source of truth
│ ...                     │  │
└─────────────────────────┘  │
                             │
                             │
┌─────────────────────────┐  │
│ Plaza                   │◄─┘
├─────────────────────────┤
│ id                      │
│ materia                 │
│ codigo                  │
│ supervisorResponsable ◄─┼──┐ ✅ Plaza → Supervisor
│ periodoAcademico        │  │
│ estado                  │  │
│ capacidad               │  │
│ ocupadas                │  │
│ ...                     │  │
└─────────────────────────┘  │
                             │
                             │
┌─────────────────────────┐  │
│ Usuario (Supervisor)    │◄─┘
├─────────────────────────┤
│ id                      │
│ nombre                  │
│ role: 'supervisor'      │
└─────────────────────────┘

CONSTRAINT: UNIQUE(supervisorResponsable, periodoAcademico) WHERE estado='Activa'
→ Un supervisor = Una plaza activa por período
```

---

## 🗄️ Base de Datos

### Migración SQL

**Archivo**: `database/migrations/001-remove-supervisorId-from-estudiantes-becarios.sql`

```sql
-- Paso 1: Eliminar FK constraint
ALTER TABLE estudiantes_becarios
  DROP CONSTRAINT IF EXISTS estudiantes_becarios_supervisorId_fkey;

-- Paso 2: Eliminar columna
ALTER TABLE estudiantes_becarios
  DROP COLUMN IF EXISTS "supervisorId";

-- Paso 3: Agregar constraint único
ALTER TABLE plazas
  ADD CONSTRAINT plazas_supervisor_periodo_unico
  UNIQUE ("supervisorResponsable", "periodoAcademico")
  WHERE estado = 'Activa';
```

### Impacto en Datos Existentes

**⚠️ ADVERTENCIA**: Al ejecutar la migración:
- Los 4 becarios con `supervisorId` perderán esa asignación
- Deben reasignarse manualmente a plazas después de la migración
- Los 3 becarios con `plazaAsignada` no se ven afectados

### Cómo Ejecutar la Migración

```bash
# 1. Iniciar PostgreSQL (puerto 5433)

# 2. Ejecutar migración
psql -h localhost -p 5433 -U postgres -d becas_db -f database/migrations/001-remove-supervisorId-from-estudiantes-becarios.sql

# 3. Verificar resultado
psql -h localhost -p 5433 -U postgres -d becas_db -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'estudiantes_becarios' AND column_name = 'supervisorId';"
# Debe retornar 0 filas
```

---

## 📦 Modelos

### EstudianteBecario.js

**Cambios:**

```javascript
// ❌ ELIMINADO
supervisorId: {
  type: DataTypes.UUID,
  allowNull: true,
  references: { model: 'usuarios', key: 'id' }
}

// ❌ ELIMINADO
EstudianteBecario.belongsTo(models.Usuario, {
  foreignKey: 'supervisorId',
  as: 'supervisor'
});

// ❌ ELIMINADO
EstudianteBecario.prototype.asignarSupervisor = function(supervisorId) {
  this.supervisorId = supervisorId;
  return this.save();
};

// ✅ AGREGADO
EstudianteBecario.prototype.getSupervisorActual = async function() {
  if (!this.plazaAsignada) return null;

  if (this.plaza && this.plaza.supervisor) {
    return this.plaza.supervisor;
  }

  const { Plaza, Usuario } = require('./index');
  const plaza = await Plaza.findByPk(this.plazaAsignada, {
    include: [{ model: Usuario, as: 'supervisor' }]
  });

  return plaza ? plaza.supervisor : null;
};
```

### Usuario.js

**Cambios:**

```javascript
// ❌ ELIMINADO
Usuario.hasMany(models.EstudianteBecario, {
  foreignKey: 'supervisorId',
  as: 'estudiantesSupervisionados'
});

// ✅ AGREGADO
Usuario.hasMany(models.Plaza, {
  foreignKey: 'supervisorResponsable',
  as: 'plazasAsignadas'
});

// ✅ AGREGADO
Usuario.prototype.getEstudiantesSupervisionados = async function() {
  if (!this.esSupervisor()) return [];

  const { Plaza, EstudianteBecario } = require('./index');

  const plazas = await Plaza.findAll({
    where: {
      supervisorResponsable: this.id,
      estado: 'Activa'
    }
  });

  const plazaIds = plazas.map(p => p.id);

  return await EstudianteBecario.findAll({
    where: {
      plazaAsignada: plazaIds,
      estado: 'Activa'
    },
    include: [/* ... */]
  });
};
```

### Plaza.js

**Cambios:**

```javascript
// ✅ AGREGADO EN HOOKS
hooks: {
  beforeSave: async (plaza) => {
    if (plaza.supervisorResponsable && plaza.estado === 'Activa') {
      const plazasExistentes = await Plaza.findAll({
        where: {
          supervisorResponsable: plaza.supervisorResponsable,
          periodoAcademico: plaza.periodoAcademico,
          estado: 'Activa',
          id: { [sequelize.Sequelize.Op.ne]: plaza.id }
        }
      });

      if (plazasExistentes.length > 0) {
        throw new Error(
          'El supervisor ya tiene una plaza activa en este período'
        );
      }
    }
  }
}
```

---

## 🔌 API

### Endpoints Eliminados

| Método | Endpoint | Razón |
|--------|----------|-------|
| PUT | `/api/v1/supervisores/ayudantes/:id` | Asignación directa eliminada |
| POST | `/api/v1/supervisores/:supervisorId/ayudantes/asignar` | Asignación batch eliminada |
| POST | `/api/v1/supervisores/:supervisorId/ayudantes/desasignar` | Desasignación batch eliminada |

### Endpoints Agregados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/supervisores/:supervisorId/plaza-activa?periodoAcademico=X` | Obtiene plaza activa del supervisor |
| PUT | `/api/v1/becarios/:id/asignar-plaza` | Asigna becario a plaza |
| PUT | `/api/v1/becarios/:id/remover-plaza` | Remueve plaza del becario |

### Endpoints Modificados (response schema cambió)

| Endpoint | Cambio |
|----------|--------|
| `GET /api/v1/becarios/:id` | `supervisor` ahora anidado en `plaza` |
| `GET /api/v1/becarios` | `supervisor` ahora anidado en `plaza` |
| `GET /api/v1/supervisores/:id` | Estudiantes obtenidos via `plazasAsignadas` |
| `GET /api/v1/supervisores/:id/ayudantes` | Query via plazas |
| `GET /api/v1/supervisores/ayudantes/all` | Query via plazas |

---

## 💻 Frontend

### Actualizar Cliente API

**Archivo**: `src/api/supervisores.js` (ejemplo)

```javascript
// ❌ ELIMINAR
export const asignarSupervisor = async (becarioId, supervisorId) => {
  return api.put(`/supervisores/ayudantes/${becarioId}`, { supervisorId });
};

export const asignarBatch = async (supervisorId, becarios, permitirReasignacion) => {
  return api.post(`/supervisores/${supervisorId}/ayudantes/asignar`, {
    estudiantesBecarios: becarios,
    permitirReasignacion
  });
};

// ✅ AGREGAR
export const getPlazaActivaSupervisor = async (supervisorId, periodoAcademico) => {
  return api.get(`/supervisores/${supervisorId}/plaza-activa`, {
    params: { periodoAcademico }
  });
};

export const asignarBecarioAPlaza = async (becarioId, plazaId) => {
  return api.put(`/becarios/${becarioId}/asignar-plaza`, { plazaId });
};

export const removerPlazaBecario = async (becarioId) => {
  return api.put(`/becarios/${becarioId}/remover-plaza`);
};
```

### Actualizar Componentes React

**Ejemplo 1: Card de Becario**

```jsx
// ❌ ANTES
function BecarioCard({ becario }) {
  const supervisorNombre = becario.supervisor
    ? `${becario.supervisor.nombre} ${becario.supervisor.apellido}`
    : 'Sin supervisor';

  return (
    <div>
      <p>Supervisor: {supervisorNombre}</p>
    </div>
  );
}

// ✅ DESPUÉS
function BecarioCard({ becario }) {
  const supervisor = becario.plaza?.supervisor;
  const supervisorNombre = supervisor
    ? `${supervisor.nombre} ${supervisor.apellido}`
    : 'Sin plaza asignada';

  return (
    <div>
      <p>Plaza: {becario.plaza?.materia || 'Sin asignar'}</p>
      <p>Supervisor: {supervisorNombre}</p>
    </div>
  );
}
```

**Ejemplo 2: Modal de Asignación**

```jsx
// ❌ ANTES
function AsignarSupervisorModal({ becario, onClose }) {
  const [supervisorId, setSupervisorId] = useState('');

  const handleAsignar = async () => {
    await asignarSupervisor(becario.id, supervisorId);
    onClose();
  };

  return (
    <Modal>
      <select onChange={e => setSupervisorId(e.target.value)}>
        {supervisores.map(s => <option value={s.id}>{s.nombre}</option>)}
      </select>
      <button onClick={handleAsignar}>Asignar Supervisor</button>
    </Modal>
  );
}

// ✅ DESPUÉS
function AsignarPlazaModal({ becario, onClose }) {
  const [plazaId, setPlazaId] = useState('');
  const { data: plazas } = usePlazasDisponibles();

  const handleAsignar = async () => {
    await asignarBecarioAPlaza(becario.id, plazaId);
    onClose();
  };

  return (
    <Modal>
      <select onChange={e => setPlazaId(e.target.value)}>
        {plazas.map(p => (
          <option value={p.id}>
            {p.materia} - {p.supervisor?.nombre} ({p.ocupadas}/{p.capacidad})
          </option>
        ))}
      </select>
      <button onClick={handleAsignar}>Asignar a Plaza</button>
    </Modal>
  );
}
```

### Actualizar Stores/Redux

**Ejemplo: Slice de Becarios**

```javascript
// ❌ ELIMINAR ACCIÓN
export const asignarSupervisorBecario = createAsyncThunk(
  'becarios/asignarSupervisor',
  async ({ becarioId, supervisorId }) => {
    return await api.asignarSupervisor(becarioId, supervisorId);
  }
);

// ✅ AGREGAR ACCIÓN
export const asignarPlazaBecario = createAsyncThunk(
  'becarios/asignarPlaza',
  async ({ becarioId, plazaId }) => {
    return await api.asignarBecarioAPlaza(becarioId, plazaId);
  }
);

// ✅ ACTUALIZAR SELECTOR
export const selectSupervisorDeBecario = (state, becarioId) => {
  const becario = state.becarios.entities[becarioId];
  return becario?.plaza?.supervisor || null; // Cambio aquí
};
```

---

## 📋 Casos de Uso

### Caso 1: Asignar Ayudante a Supervisor

**Flujo Anterior:**
1. Gestor selecciona supervisor
2. Gestor selecciona becario
3. Sistema asigna `becario.supervisorId = supervisor.id`

**Flujo Nuevo:**
1. Gestor verifica que supervisor tenga plaza activa
2. Si no tiene, crear plaza primero
3. Gestor selecciona plaza disponible
4. Sistema asigna `becario.plazaAsignada = plaza.id`
5. Supervisor obtenido automáticamente desde `plaza.supervisorResponsable`

**Código:**
```javascript
async function asignarAyudanteASupervisor(becarioId, supervisorId, periodoActual) {
  // Paso 1: Verificar plaza activa del supervisor
  const { plaza } = await getPlazaActivaSupervisor(supervisorId, periodoActual);

  if (!plaza) {
    // Paso 2: Si no tiene plaza, crear una
    const nuevaPlaza = await crearPlaza({
      materia: 'Plaza General',
      codigo: `PG-${Date.now()}`,
      departamento: supervisor.departamento,
      supervisorResponsable: supervisorId,
      periodoAcademico: periodoActual,
      capacidad: 10,
      estado: 'Activa'
    });
    plazaId = nuevaPlaza.id;
  } else {
    plazaId = plaza.id;
  }

  // Paso 3: Asignar becario a la plaza
  await asignarBecarioAPlaza(becarioId, plazaId);
}
```

### Caso 2: Cambiar Supervisor de un Becario

**Flujo Anterior:**
1. Gestor actualiza `becario.supervisorId`

**Flujo Nuevo:**
1. Obtener plaza del nuevo supervisor
2. Cambiar `becario.plazaAsignada` a nueva plaza
3. Supervisor cambia automáticamente

**Código:**
```javascript
async function cambiarSupervisorBecario(becarioId, nuevoSupervisorId, periodo) {
  // Obtener plaza del nuevo supervisor
  const { plaza } = await getPlazaActivaSupervisor(nuevoSupervisorId, periodo);

  if (!plaza) {
    throw new Error('El supervisor no tiene plaza activa');
  }

  // Cambiar plaza del becario
  await asignarBecarioAPlaza(becarioId, plaza.id);
}
```

### Caso 3: Listar Ayudantes de un Supervisor

**Flujo Anterior:**
```javascript
const ayudantes = await fetch(`/api/v1/supervisores/${supervisorId}/ayudantes`);
// Query: SELECT * FROM estudiantes_becarios WHERE supervisorId = ?
```

**Flujo Nuevo:**
```javascript
const ayudantes = await fetch(`/api/v1/supervisores/${supervisorId}/ayudantes`);
// Query:
// 1. SELECT * FROM plazas WHERE supervisorResponsable = ? AND estado = 'Activa'
// 2. SELECT * FROM estudiantes_becarios WHERE plazaAsignada IN (plazaIds)
```

---

## ✅ Validaciones

### Nuevas Validaciones en Backend

1. **Plaza única por supervisor/período**
   ```javascript
   // Al crear o activar plaza
   if (plazaConflicto) {
     throw new Error('El supervisor ya tiene una plaza activa en este período');
   }
   ```

2. **Plaza debe tener supervisor antes de asignar becarios**
   ```javascript
   if (!plaza.supervisorResponsable) {
     throw new Error('La plaza debe tener un supervisor asignado');
   }
   ```

3. **Plaza debe estar activa**
   ```javascript
   if (plaza.estado !== 'Activa') {
     throw new Error('Solo se pueden asignar becarios a plazas activas');
   }
   ```

4. **Plaza debe tener capacidad disponible**
   ```javascript
   if (plaza.ocupadas >= plaza.capacidad) {
     throw new Error('La plaza no tiene capacidad disponible');
   }
   ```

### Validaciones Frontend Recomendadas

1. **Verificar plaza activa antes de asignar**
   ```javascript
   const { plaza } = await getPlazaActivaSupervisor(supervisorId, periodo);
   if (!plaza) {
     alert('El supervisor no tiene plaza activa. Cree una plaza primero.');
     return;
   }
   ```

2. **Mostrar capacidad de plaza**
   ```javascript
   if (plaza.ocupadas >= plaza.capacidad) {
     return <Badge color="red">Plaza llena</Badge>;
   }
   ```

3. **Validar período académico**
   ```javascript
   if (becario.periodoInicio !== plaza.periodoAcademico) {
     alert('El becario y la plaza deben estar en el mismo período');
     return;
   }
   ```

---

## 🧪 Testing

### Pruebas Backend

```javascript
describe('Asignación de Plaza', () => {
  it('debe asignar becario a plaza correctamente', async () => {
    const plaza = await Plaza.create({
      supervisorResponsable: supervisor.id,
      periodoAcademico: '2025-1',
      // ...
    });

    const response = await request(app)
      .put(`/api/v1/becarios/${becario.id}/asignar-plaza`)
      .send({ plazaId: plaza.id })
      .expect(200);

    expect(response.body.data.plazaAsignada).toBe(plaza.id);
  });

  it('debe prevenir supervisor con múltiples plazas activas', async () => {
    await Plaza.create({
      supervisorResponsable: supervisor.id,
      periodoAcademico: '2025-1',
      estado: 'Activa'
    });

    await expect(
      Plaza.create({
        supervisorResponsable: supervisor.id,
        periodoAcademico: '2025-1',
        estado: 'Activa'
      })
    ).rejects.toThrow('ya tiene una plaza activa');
  });
});
```

### Pruebas Frontend

```javascript
describe('AsignarPlazaModal', () => {
  it('debe listar solo plazas con capacidad disponible', async () => {
    render(<AsignarPlazaModal becario={becario} />);

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(3); // 3 plazas disponibles
  });

  it('debe obtener supervisor de plaza automáticamente', async () => {
    const { getByText } = render(<BecarioCard becario={becarioConPlaza} />);

    expect(getByText(/Supervisor: Ana García/)).toBeInTheDocument();
  });
});
```

---

## 📚 Recursos Adicionales

- **Migración SQL**: `database/migrations/001-remove-supervisorId-from-estudiantes-becarios.sql`
- **Breaking Changes**: `BREAKING_CHANGES.md`
- **Swagger**: http://localhost:3000/api-docs
- **Código Modelos**: `src/models/EstudianteBecario.js`, `Plaza.js`, `Usuario.js`

---

**Última actualización**: 28 de Octubre 2025
**Versión**: 1.0.0
**Autor**: Sistema de Gestión de Becas - Backend Team
