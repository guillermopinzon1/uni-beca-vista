# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **uni-beca-vista**, a comprehensive scholarship and teaching assistant management system for Universidad Metropolitana (UNIMET). Built with React, TypeScript, Vite, shadcn-ui, and Tailwind CSS, it manages multiple scholarship programs and administrative workflows for students, mentors, administrators, and supervisors.

The system integrates with a remote backend API at `https://srodriguez.intelcondev.org/api`.

## Development Commands

```bash
# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Run linter
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Multi-Program System

The application manages several distinct scholarship/program types, each with dedicated modules:

1. **Excelencia** (Excellence Program) - High-performing students
2. **Impacto** (Impact Program) - Social impact scholarships
3. **Exoneracion** (Tuition Exemption) - Tuition waiver program
4. **Ayudantías** (Teaching Assistantships) - Student teaching positions

### Component Organization

Components are organized by **domain** in `src/components/`:

- `admin/` - Admin dashboard components (scholarships, students, reports, plazas, supervisors)
- `excelencia/` - Excellence program components (applications, dashboard, profile, requirements)
- `impacto/` - Impact program components (applications, dashboard, mentorship, allied institutions)
- `exoneracion/` - Exemption program components (requirements, alignment, financial status, tutorials)
- `ayudantias/` - Teaching assistant components (search assistants, assigned plazas)
- `mentor/` - Mentor dashboard components (calendar, reports, student summaries, communications)
- `shared/` - Cross-program shared components (unified application form, regulation access)
- `ui/` - shadcn-ui component library (buttons, cards, forms, etc.)

Top-level components in `src/components/`:
- `ActivityReportSystem.tsx` - Activity reporting for scholarships
- `AvailabilitySchedule.tsx` - Schedule availability management
- `PostulacionCreateModal.tsx` - Shared application creation modal
- `ErrorBoundary.tsx` - React error boundary wrapper

### Routing & Role-Based Access

The app uses React Router with role-based pages in `src/pages/`:

**Public Pages:**
- `Index.tsx` - Landing page
- `Login.tsx`, `Register.tsx`, `ResetPassword.tsx` - Authentication

**Student Pages:**
- `ScholarshipPrograms.tsx` - View available programs
- `AspiranteScholarshipPrograms.tsx` - Applicant-specific programs
- `PostulacionesBecas.tsx` - Apply to scholarships
- `ExoneracionStudent.tsx` - Student exemption view
- `Profile.tsx` - Student profile

**Program-Specific Pages:**
- `ExcelenciaProgram.tsx` - Excellence program interface
- `ImpactoProgram.tsx` - Impact program interface
- `ExoneracionProgram.tsx` - Exemption program interface
- `ExoneracionCapitalHumano.tsx` - HR view for exemption

**Administrative Pages:**
- `AdminDashboard.tsx` - Main admin panel
- `AyudantiasDashboard.tsx` - Teaching assistant management
- `FormacionDocenteAdmin.tsx` - Teacher training admin
- `MentorDashboard.tsx` - Mentor oversight
- `DirectorAreaDashboard.tsx` - Department director view
- `CapitalHumanoDashboard.tsx` - Human resources dashboard
- `SupervisorLaboralDashboard.tsx` - Work supervisor dashboard

**Shared Functionality:**
- `ModuleSelection.tsx` - Select program modules
- `PasanteModules.tsx`, `PasanteAyudantiasModules.tsx` - Intern modules
- `PostulacionesList.tsx`, `PostulacionDetail.tsx` - Application management
- `EstudianteDetail.tsx` - Student detail view
- `Reportes.tsx` - Reports
- `Requisitos.tsx` - Requirements

### API Integration

All API calls are centralized in `src/lib/api/`:

- `config.ts` - Defines `API_BASE = 'https://srodriguez.intelcondev.org/api'` (always remote)
- `auth.ts` - Authentication endpoints (login, forgot password, reset password)
- `plazas.ts` - Teaching assistant plaza management (fetch, create, update)
- `users.ts` - User management endpoints

API requests use:
- Bearer token authentication from `AuthContext`
- Standard JSON request/response format with typed interfaces
- Error handling with descriptive messages
- Query parameters for filtering and pagination

### State Management

**Authentication:**
- `src/contexts/AuthContext.tsx` provides global auth state
- Stores user info and tokens in `localStorage` (`auth_user`, `auth_tokens`)
- `useAuth()` hook exposes: `isLoggedIn`, `user`, `tokens`, `loginSuccess()`, `logout()`
- Logout attempts multiple backend URLs for robustness, always cleans local state

**Data Fetching:**
- Uses `@tanstack/react-query` (`QueryClient`) for server state
- Query invalidation on mutations for optimistic updates

**Forms:**
- React Hook Form + Zod for form validation
- Centralized form components in `src/components/ui/form.tsx`

### Styling

- **Tailwind CSS** with custom theme configuration
- **shadcn-ui** components for consistent UI
- Custom gradients and colors defined for UNIMET branding:
  - Primary: Orange palette (`#FF6B35` family)
  - Gradients: `bg-gradient-primary`, `bg-gradient-hero`, `bg-gradient-card`
- Path alias: `@/` maps to `src/`

### Key Patterns

1. **API Response Structure**: All responses follow:
   ```typescript
   {
     success: boolean;
     message: string;
     timestamp?: string;
     data: { ... }
   }
   ```

2. **Authentication Flow**: User data/tokens stored in localStorage → AuthContext provides → Pages/components use `useAuth()` hook

3. **Component Composition**: Pages compose domain components from `src/components/{domain}/`

4. **Error Handling**: ErrorBoundary wraps the entire app; API errors throw with descriptive messages

## Important Notes

- **No environment variable for API URL**: The backend is hardcoded to `https://srodriguez.intelcondev.org/api` in `src/lib/api/config.ts`
- **Port 3000**: Dev server runs on port 3000 with IPv6 support (`host: "::"`)
- **Lovable Integration**: Project was initially created with Lovable (see README)
- **TypeScript**: Strict typing throughout; use existing type patterns from `src/lib/api/` files
- **Monorepo Structure**: Frontend only; backend is separate remote service

## Working with this Codebase

**Adding a new scholarship program:**
1. Create domain folder in `src/components/{program-name}/`
2. Add page in `src/pages/{ProgramName}Program.tsx`
3. Register route in `src/App.tsx`
4. Add API endpoints in `src/lib/api/{program-name}.ts`

**Adding new API endpoints:**
1. Create/update file in `src/lib/api/`
2. Import `API_BASE` from `./config`
3. Define TypeScript interfaces for request/response
4. Use standard fetch pattern with error handling
5. Include Authorization header: `Bearer ${accessToken}`

**Adding UI components:**
- Use existing shadcn-ui components from `src/components/ui/`
- Follow naming convention: PascalCase for components
- Use Tailwind for styling, reference theme colors

**Form validation:**
- Use `react-hook-form` + `@hookform/resolvers/zod`
- Define Zod schema, use with Form components from `src/components/ui/form.tsx`
