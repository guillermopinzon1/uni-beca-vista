# Documentación Frontend - Nuevo Flujo de Primer Login

**Fecha**: 18 de Octubre 2025
**Versión Backend**: 2.13.0
**Autor**: Backend Team - Sistema de Becas UNIMET

---

## 📋 Resumen Ejecutivo

El sistema ahora crea y aprueba usuarios automáticamente cuando se aprueba una postulación, eliminando el paso manual de "activar usuario". Los usuarios reciben credenciales temporales por email y deben cambiar su contraseña en el primer login.

---

## 🔄 Cambios en el Flujo de Usuario

### Flujo Anterior (DEPRECADO)
1. Gestor aprueba postulación
2. Backend crea usuario con `emailVerified: false`
3. Usuario recibe email con enlace "Olvidé mi contraseña"
4. Usuario activa cuenta estableciendo contraseña
5. Admin aprueba manualmente el usuario
6. Usuario puede hacer login

### Flujo Nuevo (ACTUAL)
1. Gestor aprueba postulación
2. Backend crea usuario con `emailVerified: true` y `firstLogin: true`
3. Usuario recibe email con credenciales temporales (email + contraseña)
4. Usuario hace login con credenciales temporales
5. **Sistema detecta `firstLogin: true` y fuerza cambio de contraseña**
6. Usuario cambia contraseña (`firstLogin` se marca como `false`)
7. Usuario puede usar el sistema normalmente

---

## 🆕 Cambio en Modelo de Usuario

### Nuevo Campo: `firstLogin`

```
firstLogin: boolean
- Default: false
- Indica si el usuario debe cambiar su contraseña en el primer login
- Se marca como true cuando se crea un usuario automáticamente
- Se marca como false cuando el usuario cambia su contraseña
```

---

## 📡 Cambios en Endpoints

### 1. `POST /api/v1/auth/login`

**Respuesta Modificada**:

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "usuario": {
      "id": "uuid",
      "email": "usuario@unimet.edu.ve",
      "nombre": "Juan",
      "apellido": "Pérez",
      "role": "estudiante",
      "activo": true,
      "emailVerified": true,
      "firstLogin": true,  // ⬅️ NUEVO CAMPO
      "cedula": "V-12345678",
      "telefono": "+58 416 1234567",
      "carrera": "Ingeniería en Sistemas",
      "trimestre": 5
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Lógica Frontend Requerida**:
```
SI usuario.firstLogin === true ENTONCES
    Redirigir INMEDIATAMENTE a pantalla "Cambiar Contraseña Obligatorio"
    NO permitir acceso a ninguna otra funcionalidad
    Mostrar mensaje: "Por seguridad, debes cambiar tu contraseña temporal"
FIN SI
```

---

### 2. `POST /api/v1/auth/change-password`

**Request** (Sin cambios):
```json
{
  "passwordActual": "Xy7$aB9!mK2z",  // Contraseña temporal
  "nuevaPassword": "MiNuevaPassword123!"
}
```

**Cambio Interno**:
- ✅ Al cambiar contraseña exitosamente, el backend marca `firstLogin: false`
- ✅ Esto permite al usuario acceder normalmente en futuros logins

**Respuesta**:
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "data": {
    "message": "Contraseña actualizada exitosamente"
  }
}
```

**Acción Frontend Después del Cambio**:
```
1. Mostrar mensaje de éxito
2. Redirigir al dashboard o pantalla principal
3. El usuario ya puede usar el sistema normalmente
```

---

### 3. `POST /api/v1/auth/reset-password`

**Cambio Importante**: ⛔ Este endpoint ahora está **BLOQUEADO** si `firstLogin: true`

**Escenario Bloqueado**:
```json
// Request
{
  "token": "abc123def456",
  "nuevaPassword": "NuevaPassword123!"
}

// Response SI firstLogin === true
{
  "success": false,
  "error": {
    "status": 403,
    "message": "Debes usar la contraseña temporal enviada por email para tu primer inicio de sesión. No puedes restablecer tu contraseña hasta que hayas iniciado sesión y cambiado tu contraseña temporal."
  }
}
```

**Lógica Frontend**:
```
SI el usuario tiene firstLogin === true ENTONCES
    NO mostrar opción "Olvidé mi contraseña" en login
    Mostrar mensaje: "Usa la contraseña temporal enviada a tu email"
FIN SI
```

---

## 📧 Cambios en Emails

### Email de Postulación Aprobada (Con Usuario Nuevo)

**Asunto**: ¡Felicidades! Tu postulación ha sido aprobada - Sistema de Becas UNIMET

**Contenido Clave**:
```
🎉 Postulación Aprobada

Tu postulación para la Beca [TIPO] ha sido APROBADA.

🔐 Tus Credenciales de Acceso
Email: usuario@unimet.edu.ve
Contraseña Temporal: Xy7$aB9!mK2z

⚠️ IMPORTANTE - Seguridad de tu Cuenta
1. Esta contraseña es TEMPORAL y debes cambiarla en tu primer inicio de sesión.
2. NO compartas esta contraseña con nadie.
3. El sistema te pedirá cambiar tu contraseña inmediatamente después de iniciar sesión.

🚀 Próximos Pasos
1. Inicia sesión con las credenciales proporcionadas
2. Cambia tu contraseña cuando el sistema te lo solicite
3. Completa tu perfil y comienza a disfrutar de tu beca
```

### Email de Postulación Aprobada (Usuario Existente)

**Contenido Clave**:
```
🎉 Postulación Aprobada

Tu postulación para la Beca [TIPO] ha sido APROBADA.

✅ Tu Cuenta ya Existe
Ya tienes una cuenta en el Sistema de Becas. Puedes iniciar sesión con tus credenciales habituales.

[Botón: Iniciar Sesión]
```

---

## 🎨 Pantallas Frontend Requeridas

### 1. Pantalla de Login

**Validaciones**:
- Detectar si usuario tiene `firstLogin: true` después de login exitoso
- Si `firstLogin === true`, redirigir a pantalla de cambio de contraseña obligatorio
- NO mostrar "Olvidé mi contraseña" si se detecta que el usuario está en firstLogin

### 2. Pantalla de Cambio de Contraseña Obligatorio (NUEVA)

**Características**:
- Título: "Cambiar Contraseña Temporal"
- Mensaje: "Por seguridad, debes cambiar tu contraseña temporal antes de continuar"
- Campos:
  - Contraseña actual (contraseña temporal)
  - Nueva contraseña
  - Confirmar nueva contraseña
- Validaciones de contraseña nueva:
  - Mínimo 8 caracteres
  - Al menos una letra
  - Al menos un número
  - Al menos un carácter especial (@$!%*?&)
  - No puede contener espacios
- Botón: "Cambiar Contraseña"
- NO permitir cerrar o salir de esta pantalla sin cambiar la contraseña
- NO mostrar navegación a otras secciones

**Flujo**:
```
1. Usuario llega a esta pantalla desde login (si firstLogin === true)
2. Usuario ingresa contraseña temporal en "Contraseña actual"
3. Usuario ingresa nueva contraseña
4. Usuario confirma nueva contraseña
5. Sistema valida contraseñas
6. Call a PUT /api/v1/auth/change-password
7. SI exitoso:
   - Mostrar mensaje de éxito
   - Redirigir al dashboard
8. SI error:
   - Mostrar error específico
```

### 3. Pantalla de Login - Modificaciones

**Cambios**:
- Eliminar o deshabilitar "Olvidé mi contraseña" si usuario tiene `firstLogin: true`
- Mostrar mensaje informativo: "Si olvidaste tu contraseña temporal, contacta al administrador"

---

## 🔒 Validaciones Frontend

### Login
```javascript
// Pseudo-código
async function handleLogin(email, password) {
  const response = await api.post('/api/v1/auth/login', { email, password });

  if (response.success) {
    const user = response.data.usuario;
    const tokens = response.data.tokens;

    // Guardar tokens
    saveTokens(tokens);

    // Verificar firstLogin
    if (user.firstLogin === true) {
      // FORZAR cambio de contraseña
      router.push('/cambiar-password-obligatorio');
    } else {
      // Login normal
      router.push('/dashboard');
    }
  }
}
```

### Cambio de Contraseña
```javascript
// Pseudo-código
async function handleChangePassword(currentPassword, newPassword) {
  const response = await api.put('/api/v1/auth/change-password', {
    passwordActual: currentPassword,
    nuevaPassword: newPassword
  });

  if (response.success) {
    showSuccessMessage('Contraseña actualizada exitosamente');
    // Redirigir a dashboard
    router.push('/dashboard');
  }
}
```

---

## 🧪 Casos de Prueba

### Caso 1: Usuario Nuevo (Con firstLogin)
```
1. Admin aprueba postulación de usuario nuevo
2. Usuario recibe email con credenciales temporales
3. Usuario navega a login
4. Usuario ingresa email y contraseña temporal
5. Sistema hace login exitoso
6. Sistema detecta firstLogin === true
7. Sistema redirige a pantalla de cambio de contraseña
8. Usuario cambia contraseña
9. Sistema marca firstLogin === false
10. Usuario es redirigido al dashboard
11. En futuros logins, NO se fuerza cambio de contraseña
```

### Caso 2: Usuario Existente (Sin firstLogin)
```
1. Admin aprueba postulación de usuario que ya tiene cuenta
2. Usuario recibe email de aprobación (SIN credenciales)
3. Usuario navega a login
4. Usuario ingresa sus credenciales habituales
5. Sistema hace login exitoso
6. Sistema detecta firstLogin === false
7. Usuario es redirigido directamente al dashboard
```

### Caso 3: Intento de Reset Password con firstLogin
```
1. Usuario nuevo intenta usar "Olvidé mi contraseña"
2. Sistema solicita email
3. Sistema detecta que usuario tiene firstLogin === true
4. Sistema muestra error: "Debes usar la contraseña temporal enviada a tu email"
5. Frontend NO permite reset de contraseña para usuarios con firstLogin
```

---

## 📊 Datos de Prueba (Ambiente Desarrollo)

### Usuarios de Prueba (Seeders)
**Contraseña uniforme para TODOS los usuarios de prueba**: `Unimet123!`

| Email | Contraseña | Role | firstLogin |
|-------|-----------|------|------------|
| juan.perez@unimet.edu.ve | Unimet123! | estudiante | false |
| maria.gonzalez@unimet.edu.ve | Unimet123! | estudiante | false |
| carlos.martinez@unimet.edu.ve | Unimet123! | estudiante | false |
| prof.garcia@unimet.edu.ve | Unimet123! | supervisor | false |
| prof.silva@unimet.edu.ve | Unimet123! | supervisor | false |
| prof.herrera@unimet.edu.ve | Unimet123! | supervisor | false |
| admin.becas@unimet.edu.ve | Unimet123! | admin | false |
| patricia.fernandez@unimet.edu.ve | Unimet123! | admin | false |

**Nota**: Estos usuarios tienen `firstLogin: false` porque son usuarios de prueba preexistentes.

### Para Probar firstLogin
```
1. Crear una nueva postulación SIN usuario vinculado
2. Aprobar la postulación como admin
3. Backend creará usuario con firstLogin: true
4. Verificar email con credenciales temporales
5. Hacer login y verificar flujo de cambio obligatorio de contraseña
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: "Tu cuenta está pendiente de aprobación"
**Causa**: Usuario antiguo con `emailVerified: false`
**Solución**: Admin debe aprobar usuario manualmente o ejecutar limpieza de BD

### Error 2: Usuario no puede cambiar contraseña
**Causa**: Contraseña actual incorrecta
**Solución**: Verificar que usuario está usando la contraseña temporal correcta

### Error 3: Reset password bloqueado
**Causa**: Usuario tiene `firstLogin: true`
**Solución**: Instruir al usuario a usar contraseña temporal del email

---

## 🔧 Compatibilidad con Versiones Anteriores

### Usuarios Creados Antes de este Cambio
- Usuarios con `emailVerified: false` pueden seguir siendo aprobados manualmente por admin
- Backend ejecutará limpieza de datos legacy
- Nuevos usuarios SIEMPRE tendrán el nuevo flujo

---

## 📞 Contacto y Soporte

**Backend Team**: backend@unimet.edu.ve
**Documentación Adicional**: Ver `CLAUDE.md` en repositorio backend

---

## ✅ Checklist de Implementación Frontend

- [ ] Modificar respuesta de login para incluir campo `firstLogin`
- [ ] Crear pantalla "Cambiar Contraseña Obligatorio"
- [ ] Implementar redirección automática si `firstLogin === true`
- [ ] Bloquear navegación cuando usuario está en cambio obligatorio
- [ ] Deshabilitar "Olvidé mi contraseña" para usuarios con `firstLogin`
- [ ] Actualizar validaciones de contraseña según especificaciones backend
- [ ] Implementar manejo de error 403 en reset password
- [ ] Actualizar mensajes de ayuda en login
- [ ] Probar flujo completo con usuario nuevo
- [ ] Probar flujo completo con usuario existente
- [ ] Probar intento de reset password con firstLogin

---

**Fin del Documento**
