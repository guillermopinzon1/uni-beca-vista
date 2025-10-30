# Solución para el error de validación tipoBeca "Formación Docente"

## El Problema

Cuando se intenta aprobar una postulación con `tipoBeca: "Formación Docente"`, el backend falla con:

```
Validation isIn on tipoBeca failed (value: "Formación Docente")
```

## Causa Raíz

El modelo `EstudianteBecario` en el backend tiene una validación `isIn` que restringe los valores permitidos para el campo `tipoBeca`. Actualmente, "Formación Docente" **NO está incluido** en la lista de valores válidos.

**Ubicación del error**:
- `src/models/EstudianteBecario.js` (modelo Sequelize)
- Validación `isIn` en el campo `tipoBeca`

**Valores probablemente permitidos actualmente**:
```javascript
tipoBeca: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    isIn: [['Ayudantía', 'Excelencia', 'Impacto', 'Exoneración de Pago']]
    // ← "Formación Docente" NO está en esta lista
  }
}
```

## Solución Requerida (Backend)

### Actualizar el modelo EstudianteBecario

**Archivo**: `src/models/EstudianteBecario.js`

**Cambio necesario**:
```javascript
tipoBeca: {
  type: DataTypes.STRING(50),
  allowNull: false,
  validate: {
    isIn: {
      args: [['Ayudantía', 'Excelencia', 'Impacto', 'Exoneración de Pago', 'Formación Docente']],
      msg: 'El tipo de beca debe ser: Ayudantía, Excelencia, Impacto, Exoneración de Pago o Formación Docente'
    }
  }
}
```

**Nota**: Agregar 'Formación Docente' al array de valores permitidos en la validación `isIn`.

## Verificación

Después de aplicar la solución, probar:

```bash
# 1. Crear una postulación de Formación Docente
POST /api/v1/postulaciones
{
  "tipoBeca": "Formación Docente",
  "programaEspecifico": "Formación Docente",
  ...
}

# 2. Aprobar la postulación
PUT /api/v1/postulaciones/:id/aprobar
{
  "observaciones": "Aprobado"
}

# 3. Verificar que el becario se creó correctamente
GET /api/v1/becarios/:id
# Debería tener tipoBeca: "Formación Docente"
```

## Modelos Afectados

Este cambio debe aplicarse en **todos** los modelos que tengan el campo `tipoBeca`:

1. **EstudianteBecario.js** - Modelo principal de becarios
2. **Postulacion.js** - Modelo de postulaciones (si también tiene validación isIn)
3. **Usuario.js** - Si almacena tipoBeca del usuario (verificar)

## Impacto

- ✅ Permite aprobar postulaciones del programa "Formación Docente"
- ✅ Habilita el flujo completo para este tipo de beca
- ✅ Mantiene la integridad de datos con validación
- ✅ No afecta los otros tipos de beca existentes

## Estado Actual en Frontend

El frontend **YA está preparado** para trabajar con "Formación Docente":

- ✅ Login.tsx redirige a `/formacion-docente` para estudiantes con este tipoBeca
- ✅ UnifiedApplicationForm.tsx mapea correctamente a "Formación Docente"
- ✅ FormacionDocenteProgram.tsx está implementado con 4 módulos
- ✅ Ruta `/formacion-docente` registrada en App.tsx

**El único bloqueador es la validación del backend.**

## Tipos de Beca del Sistema

Según el reglamento (infobecas.txt) y la implementación actual:

1. **Ayudantía** ✅ (funcionando)
2. **Excelencia** ✅ (funcionando, con issue de horasRequeridas)
3. **Impacto** ✅ (funcionando)
4. **Exoneración de Pago** ✅ (funcionando)
5. **Formación Docente** ❌ (bloqueado por validación)

## Relación con Otros Issues

Este problema es independiente del issue de `horasRequeridas` documentado en `SOLUCION_BACKEND_HORAS_REQUERIDAS.md`, pero ambos afectan la aprobación de postulaciones de Formación Docente:

1. Primero se debe solucionar **este issue** (agregar "Formación Docente" a validación isIn)
2. Luego solucionar el issue de `horasRequeridas` (permitir valor 0 para becas no-Ayudantía)

Ambos cambios son necesarios para que el flujo completo de Formación Docente funcione correctamente.
