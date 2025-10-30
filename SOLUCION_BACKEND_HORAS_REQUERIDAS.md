# Solución para el error de horasRequeridas en becas no-Ayudantía

## El Problema

Cuando se aprueba una postulación con `tipoBeca: "Excelencia"` (o cualquier tipo que no sea "Ayudantía"), el backend falla con:

```
Validation min on horasRequeridas failed (value: 0)
```

## Causa Raíz

1. **En `src/services/postulacionesService.js:296`**:
   ```javascript
   const horasRequeridas = postulacion.tipoBeca === 'Ayudantía' ? 120 : 0;
   ```
   → Asigna `0` para becas no-Ayudantía

2. **En `src/models/EstudianteBecario.js:80-94`**:
   ```javascript
   horasRequeridas: {
     type: DataTypes.INTEGER,
     allowNull: false,
     validate: {
       min: 1,  // ← Rechaza 0
       isInt: true
     }
   }
   ```
   → Valida que sea mínimo `1`

## Solución Requerida (Backend)

### Opción 1: Cambiar validación del modelo (RECOMENDADO)

**Archivo**: `src/models/EstudianteBecario.js`

```javascript
horasRequeridas: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0, // ← Agregar default
  validate: {
    min: 0,  // ← Cambiar de 1 a 0
    isInt: true,
    horasSegunTipo(value) {
      // Solo validar horas para Ayudantía
      if (this.tipoBeca === 'Ayudantía') {
        if (value < 1) {
          throw new Error('Las becas de Ayudantía requieren al menos 1 hora');
        }
      }
    }
  }
}
```

### Opción 2: Cambiar lógica del servicio

**Archivo**: `src/services/postulacionesService.js` (línea ~296)

```javascript
// Antes:
const horasRequeridas = postulacion.tipoBeca === 'Ayudantía' ? 120 : 0;

// Después:
const horasRequeridas = postulacion.tipoBeca === 'Ayudantía' ? 120 : 1;
```

**Nota**: Esta es una solución rápida pero menos elegante. Las becas de Excelencia tendrán `horasRequeridas: 1` aunque no necesiten cumplir horas.

## Verificación

Después de aplicar la solución, probar:

```bash
# 1. Crear una postulación de Excelencia
POST /api/v1/postulaciones
{
  "tipoBeca": "Excelencia",
  ...
}

# 2. Aprobar la postulación
PUT /api/v1/postulaciones/:id/aprobar
{
  "observaciones": "Aprobado"
}

# 3. Verificar que el becario se creó correctamente
GET /api/v1/becarios/:id
# Debería tener horasRequeridas: 0 (Opción 1) o 1 (Opción 2)
```

## Impacto

- ✅ Permite aprobar postulaciones de todos los tipos de beca
- ✅ No afecta la funcionalidad de Ayudantías (siguen con 120 horas)
- ✅ Solución permanente y escalable

## Tipos de Beca Afectados

- Excelencia
- Impacto
- Exoneración de Pago
- Formación Docente

Todos estos tipos NO requieren cumplir horas laborales, por lo que `horasRequeridas: 0` es el valor correcto.
