# 📋 Guía de Migración Frontend: "ayudante" → "estudiante"

**Fecha**: 17 de Octubre 2025
**Versión Backend**: 2.11.0+
**Autor**: Sistema de Gestión de Becas - Backend Team
**Prioridad**: 🔴 CRÍTICO - Cambio Breaking en API

---

## 🎯 Resumen Ejecutivo

### ¿Qué cambió?
El rol de usuario **"ayudante"** ha sido renombrado a **"estudiante"** para reflejar correctamente la arquitectura del sistema.

### ¿Por qué?
**Separación de conceptos:**
- **ROL** → Define qué es el usuario en el sistema: `estudiante`, `supervisor`, `admin`, etc.
- **TIPO DE BECA** → Define el beneficio específico: `Ayudantía`, `Impacto`, `Excelencia`, `Exoneración de Pago`

**Antes** ❌:
```javascript
// Mezcla conceptos
usuario.role = "ayudante"  // ¿Es un rol o un tipo de beca?
```

**Ahora** ✅:
```javascript
// Separación clara
usuario.role = "estudiante"           // ROL del usuario
estudianteBecario.tipoBeca = "Ayudantía"  // TIPO de beneficio
```

### ¿Impacto?
- ⚠️ **BREAKING CHANGE**: Todos los requests/responses que usan `role` deben actualizarse
- ✅ **Sin cambios**: La lógica de tipos de beca (`Ayudantía`, `Impacto`, etc.) permanece igual
- ✅ **Compatibilidad**: La base de datos y backend ya están completamente migrados

---

## 📊 Cambios en la API

### 1. Valores del Campo `role`

#### ❌ VALOR ANTIGUO (Ya NO válido)
```javascript
"ayudante"  // ⚠️ Este valor ya NO existe en el sistema
```

#### ✅ VALOR NUEVO (Usar a partir de ahora)
```javascript
"estudiante"  // ✅ Nuevo valor para estudiantes becarios
```

#### Lista Completa de Roles Válidos
```javascript
const ROLES_VALIDOS = [
  "estudiante",          // ✅ NUEVO - Estudiantes becarios
  "supervisor",          // Sin cambios
  "mentor",              // Sin cambios
  "admin",               // Sin cambios
  "director-area",       // Sin cambios
  "capital-humano",      // Sin cambios
  "supervisor-laboral"   // Sin cambios
];
```

---

## 🔄 Endpoints Afectados

### 📍 **1. POST /api/v1/auth/register** (Registro de usuarios)

#### Request Body - ANTES ❌
```javascript
{
  "email": "estudiante@unimet.edu.ve",
  "password": "Password123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "V-12345678",
  "telefono": "+58 424 1234567",
  "role": "ayudante"  // ❌ Ya NO funciona
}
```

#### Request Body - AHORA ✅
```javascript
{
  "email": "estudiante@unimet.edu.ve",
  "password": "Password123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "V-12345678",
  "telefono": "+58 424 1234567",
  "role": "estudiante"  // ✅ Usar este valor
}
```

#### Response - AHORA ✅
```javascript
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "46c39f37-950b-41b2-9177-4d4649e61cc4",
      "email": "estudiante@unimet.edu.ve",
      "nombre": "Juan",
      "apellido": "Pérez",
      "role": "estudiante",  // ✅ Respuesta con nuevo valor
      "activo": true,
      "emailVerified": false
    }
  }
}
```

**🎯 Acción Frontend:**
- Cambiar todos los hardcoded `"ayudante"` a `"estudiante"` en formularios de registro
- Actualizar validaciones de rol
- Si hay un dropdown de roles, cambiar "Ayudante" → "Estudiante"

---

### 📍 **2. POST /api/v1/auth/login** (Inicio de sesión)

#### Response - AHORA ✅
```javascript
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "46c39f37-950b-41b2-9177-4d4649e61cc4",
      "email": "juan.perez@unimet.edu.ve",
      "nombre": "Juan Carlos",
      "apellido": "Pérez García",
      "role": "estudiante",  // ✅ Ahora devuelve "estudiante"
      "activo": true,
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "24h"
    }
  }
}
```

**🎯 Acción Frontend:**
- Actualizar guards/middlewares que verifican `user.role === "ayudante"` → `user.role === "estudiante"`
- Actualizar Redux/Zustand stores que almacenan el rol del usuario
- Actualizar lógica de permisos basada en roles

---

### 📍 **3. GET /api/v1/users** (Listar usuarios con filtros)

#### Query Parameters - AHORA ✅
```javascript
// ❌ ANTES (Ya NO funciona)
GET /api/v1/users?role=ayudante

// ✅ AHORA (Usar este)
GET /api/v1/users?role=estudiante
```

#### Ejemplo de Request
```javascript
const params = {
  role: "estudiante",  // ✅ Filtrar por estudiantes
  activo: true,
  limit: 20,
  offset: 0
};

const response = await axios.get('/api/v1/users', { params });
```

#### Response - AHORA ✅
```javascript
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "usuarios": [
      {
        "id": "46c39f37-950b-41b2-9177-4d4649e61cc4",
        "email": "juan.perez@unimet.edu.ve",
        "nombre": "Juan Carlos",
        "apellido": "Pérez García",
        "role": "estudiante",  // ✅ Nuevo valor
        "activo": true,
        "carrera": "Ingeniería de Sistemas",
        "trimestre": 5,
        "iaa": 15.75
      }
      // ... más usuarios
    ],
    "total": 150,
    "limit": 20,
    "offset": 0,
    "totalPages": 8
  }
}
```

**🎯 Acción Frontend:**
- Actualizar filtros de búsqueda/tabla de usuarios
- Si hay dropdown de roles para filtrar, cambiar "Ayudante" → "Estudiante"
- Actualizar badges/chips que muestran el rol

---

### 📍 **4. GET /api/v1/users/:id** (Obtener usuario por ID)

#### Response - AHORA ✅
```javascript
{
  "success": true,
  "data": {
    "id": "46c39f37-950b-41b2-9177-4d4649e61cc4",
    "email": "juan.perez@unimet.edu.ve",
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "role": "estudiante",  // ✅ Nuevo valor
    "cedula": "V-12345678",
    "telefono": "+58 416 1234567",
    "activo": true,
    "emailVerified": true,
    // Campos específicos de estudiantes
    "carrera": "Ingeniería de Sistemas",
    "trimestre": 5,
    "iaa": 15.75,
    "asignaturasAprobadas": 45,
    // IDs de documentos
    "fotocopiaCedulaId": "uuid-...",
    "flujogramaCarreraId": "uuid-...",
    "historicoNotasId": "uuid-...",
    // ... otros campos
  }
}
```

**🎯 Acción Frontend:**
- Actualizar componentes de detalle de usuario
- Actualizar perfiles de usuario

---

### 📍 **5. PUT /api/v1/users/:id/role** (Cambiar rol - Solo Admin)

#### Request Body - AHORA ✅
```javascript
{
  "role": "estudiante"  // ✅ Nuevo valor válido
}

// Valores válidos:
// "estudiante", "supervisor", "mentor", "admin",
// "director-area", "capital-humano", "supervisor-laboral"
```

**🎯 Acción Frontend:**
- Actualizar formularios de administración de usuarios
- Actualizar dropdowns de selección de rol

---

### 📍 **6. GET /api/v1/disponibilidad** (Disponibilidad horaria)

**NOTA**: Este endpoint es específico para **estudiantes** (antes "ayudantes")

#### Request - Sin cambios en query params
```javascript
GET /api/v1/disponibilidad/:usuarioId
```

#### Response - AHORA ✅
```javascript
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "usuarioId": "uuid-...",
    "usuario": {
      "id": "uuid-...",
      "email": "juan.perez@unimet.edu.ve",
      "nombre": "Juan Carlos",
      "apellido": "Pérez García",
      "role": "estudiante",  // ✅ Nuevo valor
      "carrera": "Ingeniería de Sistemas"
    },
    "disponibilidad": {
      "lunes": ["07:00", "07:30", "08:00"],
      "martes": ["12:30", "13:00"],
      // ... resto de la semana
    }
  }
}
```

**🎯 Acción Frontend:**
- Actualizar validación: Solo usuarios con `role === "estudiante"` pueden tener disponibilidad
- Actualizar mensajes de error relacionados

---

## 🔍 Validaciones del Backend

### Reglas de Validación por Rol

#### Para `role === "estudiante"`
```javascript
// Campos requeridos/opcionales
{
  email: "REQUERIDO - @unimet.edu.ve",
  password: "REQUERIDO - 8+ chars, mayús, minús, número, especial",
  nombre: "REQUERIDO",
  apellido: "REQUERIDO",
  cedula: "REQUERIDO - V-XXXXXXXX o E-XXXXXXXX",
  telefono: "OPCIONAL - 7-20 caracteres",
  role: "estudiante",  // ✅ Por defecto si no se especifica

  // Campos específicos de estudiantes (opcionales)
  carrera: "OPCIONAL - String(100)",
  trimestre: "OPCIONAL - Integer 1-15",
  iaa: "OPCIONAL - Decimal 0-20",
  asignaturasAprobadas: "OPCIONAL - Integer 0-200"
}
```

#### Validación de Email por Rol
```javascript
// Roles que REQUIEREN email @unimet.edu.ve
const rolesConEmailUnimet = [
  "estudiante",  // ✅ REQUIERE @unimet.edu.ve
  "supervisor",  // ✅ REQUIERE @unimet.edu.ve
  "mentor"       // ✅ REQUIERE @unimet.edu.ve
];

// Roles que permiten cualquier email válido
const rolesSinRestriccionEmail = [
  "admin",
  "director-area",
  "capital-humano",
  "supervisor-laboral"
];
```

**🎯 Acción Frontend:**
- Actualizar validaciones de formulario de registro
- Mostrar mensajes apropiados según el rol seleccionado

---

## 🎨 Cambios en la UI (Sugerencias)

### 1. Textos y Labels

#### ❌ ANTES
```jsx
// Textos antiguos
"Ayudante"
"Rol: Ayudante"
"Filtrar por Ayudantes"
"Lista de Ayudantes"
"Disponibilidad de Ayudantes"
```

#### ✅ AHORA
```jsx
// Nuevos textos
"Estudiante"
"Rol: Estudiante"
"Filtrar por Estudiantes"
"Lista de Estudiantes"
"Disponibilidad de Estudiantes"
```

### 2. Dropdowns / Select

#### ❌ ANTES
```jsx
<select name="role">
  <option value="ayudante">Ayudante</option>  {/* ❌ Cambiar */}
  <option value="supervisor">Supervisor</option>
  <option value="admin">Administrador</option>
</select>
```

#### ✅ AHORA
```jsx
<select name="role">
  <option value="estudiante">Estudiante</option>  {/* ✅ Nuevo */}
  <option value="supervisor">Supervisor</option>
  <option value="admin">Administrador</option>
</select>
```

### 3. Badges / Tags

```jsx
// Función helper para mostrar rol con estilo
const getRoleBadge = (role) => {
  const badges = {
    estudiante: { label: 'Estudiante', color: 'blue' },     // ✅ NUEVO
    supervisor: { label: 'Supervisor', color: 'green' },
    mentor: { label: 'Mentor', color: 'purple' },
    admin: { label: 'Administrador', color: 'red' }
  };

  return badges[role] || { label: role, color: 'gray' };
};
```

### 4. Iconos (Sugerencia)

```jsx
const getRoleIcon = (role) => {
  const icons = {
    estudiante: '🎓',     // ✅ Icono de estudiante
    supervisor: '👨‍🏫',    // Icono de profesor/supervisor
    mentor: '🧑‍💼',       // Icono de mentor
    admin: '⚙️'          // Icono de admin
  };

  return icons[role] || '👤';
};
```

---

## 🔒 Permisos y Guards

### Guards/Middlewares de Autorización

#### ❌ ANTES
```javascript
// Guards antiguos (Ya NO funcionan)
const isAyudante = (user) => user.role === 'ayudante';
const canPostular = (user) => user.role === 'ayudante' && user.emailVerified;

// En componentes protegidos
if (user.role !== 'ayudante') {
  navigate('/unauthorized');
}
```

#### ✅ AHORA
```javascript
// Guards actualizados
const isEstudiante = (user) => user.role === 'estudiante';
const canPostular = (user) => user.role === 'estudiante' && user.emailVerified;

// En componentes protegidos
if (user.role !== 'estudiante') {
  navigate('/unauthorized');
}
```

### React Router / Protected Routes

```jsx
// ❌ ANTES
<ProtectedRoute allowedRoles={['ayudante']}>
  <PostulacionesPage />
</ProtectedRoute>

// ✅ AHORA
<ProtectedRoute allowedRoles={['estudiante']}>
  <PostulacionesPage />
</ProtectedRoute>
```

### Redux/Zustand Selectors

```javascript
// ❌ ANTES
const selectIsAyudante = (state) => state.user?.role === 'ayudante';

// ✅ AHORA
const selectIsEstudiante = (state) => state.user?.role === 'estudiante';
```

---

## 📝 Checklist de Migración Frontend

### 🔍 **Paso 1: Búsqueda Global**
```bash
# Buscar todas las ocurrencias de "ayudante" en el código
grep -r "ayudante" src/
grep -r "'ayudante'" src/
grep -r '"ayudante"' src/
grep -r "AYUDANTE" src/
```

### ✅ **Paso 2: Actualizar Código**

#### 2.1 Constantes y Enums
- [ ] Actualizar archivos de constantes (`constants.js`, `enums.js`, etc.)
- [ ] Cambiar `ROLE_AYUDANTE = 'ayudante'` → `ROLE_ESTUDIANTE = 'estudiante'`

#### 2.2 Componentes
- [ ] Actualizar todos los componentes que verifican `role === 'ayudante'`
- [ ] Actualizar labels, textos y traducciones
- [ ] Actualizar dropdowns/selects de roles
- [ ] Actualizar badges/chips que muestran roles

#### 2.3 Formularios
- [ ] Formulario de registro: Cambiar valor por defecto/hardcoded
- [ ] Formulario de edición de usuario: Actualizar opciones de rol
- [ ] Validaciones de formulario: Actualizar reglas según nuevo rol

#### 2.4 API Calls
- [ ] Actualizar todos los requests que envían `role: 'ayudante'`
- [ ] Actualizar filtros en GET requests (`?role=ayudante`)
- [ ] Verificar POST/PUT requests con campo `role`

#### 2.5 State Management
- [ ] Redux: Actualizar actions, reducers, selectors
- [ ] Zustand/Context: Actualizar stores
- [ ] LocalStorage/SessionStorage: Limpiar datos antiguos si es necesario

#### 2.6 Guards y Permisos
- [ ] Actualizar guards de rutas protegidas
- [ ] Actualizar middlewares de autorización
- [ ] Actualizar condicionales de permisos

#### 2.7 Tests
- [ ] Actualizar tests unitarios que verifican roles
- [ ] Actualizar mocks de usuarios con rol "ayudante"
- [ ] Actualizar tests de integración con API

---

## 🧪 Testing y Validación

### Tests Recomendados

#### 1. Test de Registro
```javascript
test('Debe registrar un estudiante con el nuevo rol', async () => {
  const userData = {
    email: 'test@unimet.edu.ve',
    password: 'Test123!',
    nombre: 'Test',
    apellido: 'User',
    cedula: 'V-99999999',
    role: 'estudiante'  // ✅ Nuevo valor
  };

  const response = await api.post('/auth/register', userData);

  expect(response.data.success).toBe(true);
  expect(response.data.data.user.role).toBe('estudiante');  // ✅ Verificar nuevo valor
});
```

#### 2. Test de Login
```javascript
test('Debe devolver role "estudiante" en login', async () => {
  const response = await api.post('/auth/login', {
    email: 'juan.perez@unimet.edu.ve',
    password: 'Student123!'
  });

  expect(response.data.data.user.role).toBe('estudiante');  // ✅ Verificar
});
```

#### 3. Test de Filtros
```javascript
test('Debe filtrar usuarios por role "estudiante"', async () => {
  const response = await api.get('/users?role=estudiante');  // ✅ Nuevo filtro

  expect(response.data.success).toBe(true);
  expect(response.data.data.usuarios.every(u => u.role === 'estudiante')).toBe(true);
});
```

#### 4. Test de Permisos
```javascript
test('Estudiante puede crear postulación', async () => {
  const estudianteToken = await getTokenForRole('estudiante');  // ✅ Nuevo rol

  const response = await api.post('/postulaciones', postulacionData, {
    headers: { Authorization: `Bearer ${estudianteToken}` }
  });

  expect(response.status).toBe(201);
});
```

---

## 🚨 Errores Comunes y Soluciones

### Error 1: Validación Fallida

#### Síntoma
```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "details": {
    "validationErrors": [{
      "field": "role",
      "message": "El rol debe ser uno de: estudiante, supervisor, mentor, admin, director-area, capital-humano, supervisor-laboral"
    }]
  }
}
```

#### Causa
Enviar `role: "ayudante"` en el request

#### Solución
```javascript
// ❌ MAL
const userData = { role: 'ayudante' };

// ✅ BIEN
const userData = { role: 'estudiante' };
```

### Error 2: Guard Rechaza Acceso

#### Síntoma
Usuario es redirigido a página de "No autorizado" aunque debería tener acceso

#### Causa
Guard verifica `role === 'ayudante'` pero el usuario tiene `role === 'estudiante'`

#### Solución
```javascript
// ❌ MAL
if (user.role === 'ayudante') {
  // permitir acceso
}

// ✅ BIEN
if (user.role === 'estudiante') {
  // permitir acceso
}
```

### Error 3: Dropdown Sin Opciones

#### Síntoma
Dropdown de roles vacío o sin opción "Estudiante"

#### Causa
Lista de roles aún tiene "ayudante" en lugar de "estudiante"

#### Solución
```javascript
// ❌ MAL
const roles = ['ayudante', 'supervisor', 'admin'];

// ✅ BIEN
const roles = ['estudiante', 'supervisor', 'admin'];
```

---

## 📞 Soporte y Dudas

### Usuarios de Prueba Actualizados

Todos los usuarios de prueba ahora tienen `role: "estudiante"`:

```javascript
// Estudiantes (para testing)
{
  email: "juan.perez@unimet.edu.ve",
  password: "Student123!",
  role: "estudiante",  // ✅ Actualizado
  nombre: "Juan Carlos",
  apellido: "Pérez García"
}

{
  email: "maria.gonzalez@unimet.edu.ve",
  password: "Student123!",
  role: "estudiante",  // ✅ Actualizado
  nombre: "María Alejandra",
  apellido: "González Rodríguez"
}

{
  email: "carlos.martinez@unimet.edu.ve",
  password: "Student123!",
  role: "estudiante",  // ✅ Actualizado
  nombre: "Carlos Eduardo",
  apellido: "Martínez López"
}
```

### Documentación Swagger

Accede a la documentación interactiva en:
- **URL**: http://localhost:3001/api-docs
- **Todos los enums** están actualizados con "estudiante"
- **Ejemplos de requests** usan el nuevo valor

### Contacto
Si tienes dudas sobre la migración:
1. Consulta este documento
2. Revisa Swagger en http://localhost:3001/api-docs
3. Contacta al equipo de backend

---

## 📚 Resumen de Cambios Clave

| Aspecto | Antes ❌ | Ahora ✅ |
|---------|----------|----------|
| **Valor de role** | `"ayudante"` | `"estudiante"` |
| **Constante** | `ROLE_AYUDANTE` | `ROLE_ESTUDIANTE` |
| **Guard** | `isAyudante()` | `isEstudiante()` |
| **Query param** | `?role=ayudante` | `?role=estudiante` |
| **Label UI** | "Ayudante" | "Estudiante" |
| **Dropdown** | `<option value="ayudante">` | `<option value="estudiante">` |
| **Validación** | `role === 'ayudante'` | `role === 'estudiante'` |

---

## ✅ Verificación Final

Antes de considerar la migración completa, verifica:

- [ ] ✅ Todas las ocurrencias de "ayudante" reemplazadas por "estudiante"
- [ ] ✅ Constantes y enums actualizados
- [ ] ✅ API calls usando nuevo valor
- [ ] ✅ Guards y permisos actualizados
- [ ] ✅ UI labels y textos actualizados
- [ ] ✅ Dropdowns y selects actualizados
- [ ] ✅ Tests pasando con nuevo valor
- [ ] ✅ LocalStorage/SessionStorage limpiado si es necesario
- [ ] ✅ Documentación del frontend actualizada
- [ ] ✅ Testing manual en todos los flujos de estudiante

---

**¡Migración exitosa! 🎉**

Si sigues esta guía paso a paso, el frontend estará completamente sincronizado con los cambios del backend.
