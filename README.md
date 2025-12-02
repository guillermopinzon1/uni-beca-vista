# Sistema de Gestión de Becas - UNIMET

Sistema web para la gestión integral de programas de becas universitarias, incluyendo ayudantías, excelencia académica, impacto social y exoneración de matrícula.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js (v18 o superior) - [Instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm o yarn
- Backend API corriendo (ver sección de configuración)

### Instalación

```sh
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>

# 2. Navegar al directorio del proyecto
cd uni-beca-vista

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno (ver sección de configuración)
# Crear archivo .env.local con VITE_API_BASE

# 5. Iniciar el servidor de desarrollo
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`

## ⚙️ Configuración del Backend

### 📍 Dónde se configura la URL del backend

La URL del backend se configura en **un solo lugar**:

**Archivo:** `src/lib/api/config.ts`

```typescript
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://srodriguez.intelcondev.org/api';
```

### 🔧 Configuración mediante Variables de Entorno

Para cambiar la URL del backend, crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Para desarrollo local (backend en localhost:3001)
VITE_API_BASE=http://localhost:3001/api

# Para producción
# VITE_API_BASE=https://srodriguez.intelcondev.org/api
```

**Nota:** El archivo `.env.local` está en `.gitignore` y no se sube al repositorio.

### 📝 Valores por Defecto

- **Sin variable de entorno:** Usa `https://srodriguez.intelcondev.org/api` (producción)
- **Con `VITE_API_BASE` definida:** Usa el valor de la variable de entorno

### 🔄 Reiniciar después de cambios

Después de crear o modificar `.env.local`, **reinicia el servidor de desarrollo**:

```sh
# Detener el servidor (Ctrl+C) y volver a iniciar
npm run dev
```

## 🛠️ Tecnologías Utilizadas

- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **React** - Framework UI
- **shadcn-ui** - Componentes UI
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **React Hook Form + Zod** - Validación de formularios

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes del panel de administración
│   ├── supervisor/     # Componentes del supervisor
│   ├── shared/         # Componentes compartidos
│   └── ui/             # Componentes UI base (shadcn)
├── contexts/           # Contextos de React (Auth, etc.)
├── lib/
│   └── api/           # Clientes API y configuración
│       └── config.ts  # ⚠️ CONFIGURACIÓN DEL BACKEND AQUÍ
├── pages/             # Páginas principales
└── hooks/             # Custom hooks
```

## 🔐 Autenticación

El sistema maneja diferentes roles:
- **Estudiante/Becario** - Acceso a módulos de becas
- **Supervisor Laboral** - Gestión de ayudantes
- **Administrador** - Panel completo de administración
- **Aspirante** - Postulación a becas

## 📚 Documentación Adicional

- Ver `CLAUDE.md` para detalles técnicos de la arquitectura
- Ver `DOCUMENTACION_ESTADISTICAS_API.md` para documentación de APIs de estadísticas

## 🚢 Despliegue

Para producción, asegúrate de:

1. Configurar `VITE_API_BASE` en el archivo de entorno de producción
2. Ejecutar `npm run build` para generar los archivos estáticos
3. Servir los archivos desde `dist/` con un servidor web (nginx, Apache, etc.)

## 📝 Notas Importantes

- **Variable única de configuración:** Toda la aplicación usa `API_BASE` desde `src/lib/api/config.ts`
- **Puerto del frontend:** 3000 (configurado en `vite.config.ts`)
- **Puerto del backend local:** 3001 (configurar en `.env.local`)
- Los cambios en `.env.local` requieren reiniciar el servidor de desarrollo
