# 🚀 TaskFlow - Frontend Angular

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistema de gestión de tareas con arquitectura moderna y escalable**

[🌐 Demo en Vivo](https://taskflow.netlify.app) | [📚 Documentación](./INTEGRATION-GUIDE.md) | [🐛 Reportar Bug](https://github.com/usuario/taskflow/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Scripts Disponibles](#-scripts-disponibles)
- [Integración con Backend](#-integración-con-backend)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📖 Descripción

**TaskFlow** es una aplicación web moderna de gestión de tareas y proyectos, construida con Angular 21 y completamente integrada con un backend .NET 8 siguiendo Clean Architecture.

### ✨ Características Principales

#### 🔐 Autenticación y Seguridad
- ✅ Login y registro de usuarios
- ✅ JWT con refresh tokens automáticos
- ✅ Sistema de roles (Admin, Analyst, Member, Client)
- ✅ Guards de rutas por autenticación y roles
- ✅ Sesión persistente entre recargas

#### 📊 Gestión de Boards
- ✅ CRUD completo de boards personales
- ✅ Asociación de boards a proyectos
- ✅ Paginación de resultados
- ✅ Soft-delete (recuperación posible)

#### ✅ Gestión de Tareas
- ✅ Crear, editar, eliminar tareas
- ✅ Estados: Todo, In Progress, Done, Cancelled
- ✅ Prioridades: Low, Medium, High, Critical
- ✅ Asignación de tareas a usuarios
- ✅ Fechas de vencimiento
- ✅ Sistema de etiquetas (tags)
- ✅ Comentarios en tareas

#### 👥 Gestión de Usuarios
- ✅ Ver perfil propio y actualizarlo
- ✅ Listado de usuarios (Admin)
- ✅ Cambio de roles (Admin)
- ✅ Eliminación de usuarios (Admin)

#### 🏢 Gestión de Clientes y Proyectos
- ✅ CRUD de clientes (Admin/Analyst)
- ✅ CRUD de proyectos (Admin/Analyst)
- ✅ Asociación de proyectos a clientes y analistas
- ✅ Estados de proyectos: Planning, Active, OnHold, Completed, Cancelled

#### 🏷️ Sistema de Tags
- ✅ Creación de tags globales (Admin)
- ✅ Colores personalizables en formato hex
- ✅ Asociación N:M con tareas
- ✅ Filtrado por tags (próximamente)

---

## ⚙️ Tecnologías

### Core
- **Angular 21** - Framework principal
- **TypeScript 5.7** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Angular Signals** - Gestión de estado reactivo

### UI/UX
- **Tailwind CSS 4.0** - Framework de estilos
- **Angular CDK** - Componentes de bajo nivel
- **ngx-toastr** - Notificaciones toast

### Build & Dev
- **Vite** - Build tool ultra-rápido
- **ESBuild** - Compilador de TypeScript
- **PostCSS** - Procesamiento de CSS

### Integración
- **HttpClient** - Cliente HTTP de Angular
- **JWT** - Autenticación con tokens
- **.NET 8 API** - Backend RESTful

---

## 🏗️ Arquitectura

El proyecto sigue **principios de Clean Architecture** con una estructura modular y escalable:

```
📦 ng-taskflow
│
├── 🔧 core/                # Configuración global y servicios core
│   ├── auth/               # AuthService, login/logout
│   ├── guards/             # authGuard, adminGuard, roleGuard
│   └── interceptors/       # authInterceptor (JWT automático)
│
├── 📡 data-access/         # Servicios de API (capa de datos)
│   ├── boards.service.ts
│   ├── tasks.service.ts
│   ├── users.service.ts
│   ├── projects.service.ts
│   ├── clients.service.ts
│   └── tags.service.ts
│
├── 📊 models/              # Interfaces TypeScript (DTOs del backend)
│   ├── auth.models.ts
│   ├── board.models.ts
│   ├── task.models.ts
│   ├── user.models.ts
│   ├── project.models.ts
│   ├── client.models.ts
│   ├── tag.models.ts
│   └── comment.models.ts
│
├── 🎨 features/            # Componentes de funcionalidades
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── boards/
│   │   ├── boards-list/
│   │   ├── board-detail/
│   │   └── create-board-modal/
│   ├── tasks/
│   │   ├── create-task-modal/
│   │   ├── edit-task-modal/
│   │   └── task-state.service.ts
│   ├── dashboard/
│   └── admin/
│
├── 🧩 shared/              # Componentes, pipes y utils compartidos
│   ├── components/
│   │   ├── board-card/
│   │   └── role-badge/
│   ├── pipes/
│   │   ├── task-status.pipe.ts
│   │   ├── task-priority.pipe.ts
│   │   ├── project-status.pipe.ts
│   │   └── user-role.pipe.ts
│   └── utils/
│       ├── constants.ts
│       ├── validators.ts
│       ├── api-helpers.ts
│       └── http-error-handler.ts
│
└── 🌍 environments/        # Configuración de entornos
    ├── environment.ts      # Desarrollo (localhost:8080)
    └── environment.production.ts  # Producción (Render)
```

### 🔄 Flujo de Datos

```
Component → Service (data-access) → HTTP Interceptor → Backend API
                ↓
            RxJS Observable
                ↓
            Component (Signals/State)
                ↓
            Template (View)
```

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Angular CLI** 21.x (se instala con el proyecto)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/usuario/ng-taskflow.git
cd ng-taskflow
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

El archivo `src/environments/environment.ts` ya está configurado para desarrollo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Si el backend está en otra URL, modifícala aquí.

4. **Iniciar el servidor de desarrollo**

```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

---

## 📖 Uso

### Credenciales de Prueba

Si el backend tiene datos de seed:

- **Admin:** `admin@taskflow.com` / `Admin123!`
- **Analyst:** `analyst@taskflow.com` / `Analyst123!`
- **Member:** `member@taskflow.com` / `Member123!`

### Flujo de Usuario

1. **Registro/Login**
   - Navega a `/login` o `/register`
   - El sistema guarda el token JWT automáticamente

2. **Dashboard**
   - Vista principal con resumen de boards y tareas
   - Acceso rápido a crear boards/tareas

3. **Boards**
   - Crea boards personales o asociados a proyectos
   - Gestiona tareas dentro de cada board
   - Arrastra y suelta tareas (próximamente)

4. **Administración** (Solo Admin)
   - Gestión de usuarios y roles
   - Creación de clientes y proyectos
   - Administración de tags globales

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm start                 # Inicia servidor de desarrollo (localhost:4200)
npm run dev              # Alias de npm start

# Build
npm run build            # Build de producción
npm run build:dev        # Build de desarrollo
npm run preview          # Preview del build de producción

# Testing
npm test                 # Ejecuta tests unitarios (Vitest)
npm run test:ui          # Ejecuta tests con UI interactiva
npm run test:coverage    # Genera reporte de cobertura

# Linting & Formatting
npm run lint             # Ejecuta ESLint
npm run format           # Formatea código con Prettier

# Otros
npm run analyze          # Analiza el tamaño del bundle
```

---

## 🔗 Integración con Backend

### Configuración de la API

El frontend se comunica con el backend TaskFlow (.NET 8) mediante HTTP:

- **Desarrollo:** `http://localhost:8080/api`
- **Producción:** `https://taskflow-apis.onrender.com/api`

### Autenticación JWT

El flujo de autenticación es completamente automático:

1. **Login/Register:** El usuario ingresa credenciales
2. **Backend responde** con `accessToken` (15 min) y `refreshToken` (7 días)
3. **Frontend guarda** ambos tokens en `localStorage`
4. **Interceptor agrega** `Authorization: Bearer {token}` a cada petición
5. **Si el token expira** (401), el interceptor **refresca automáticamente** usando el refresh token
6. **Si el refresh falla**, redirige a `/login`

**No necesitas preocuparte por tokens manualmente** ✨

### Endpoints Disponibles

Consulta [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) para documentación completa de todos los endpoints y ejemplos de uso.

| Recurso | Endpoints | Roles |
|---------|-----------|-------|
| Auth | `/Auth/register`, `/Auth/login`, `/Auth/refresh`, `/Auth/logout` | Público/Auth |
| Users | `/Users`, `/Users/me`, `/Users/{id}/role` | Auth/Admin |
| Boards | `/Boards`, `/Boards/{id}` | Auth (owner) |
| Tasks | `/Tasks`, `/Tasks/cursor`, `/Tasks/{id}`, `/Tasks/{id}/comments` | Auth |
| Tags | `/Tags`, `/Tasks/{taskId}/tags/{tagId}` | Auth/Admin |
| Projects | `/Projects`, `/Projects/{id}` | Auth/Admin/Analyst |
| Clients | `/Clients`, `/Clients/{id}` | Auth/Admin/Analyst |

---

## 📂 Estructura del Proyecto

```
ng-taskflow/
│
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios y configuración global
│   │   │   ├── auth/
│   │   │   │   └── auth.service.ts  # Login, logout, refresh token
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts    # Protege rutas autenticadas
│   │   │   │   ├── admin.guard.ts   # Solo Admin
│   │   │   │   ├── guest.guard.ts   # Solo no autenticados
│   │   │   │   └── role.guard.ts    # Por roles específicos
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts  # Agrega JWT automáticamente
│   │   │   └── services/
│   │   │
│   │   ├── data-access/             # Servicios de API (capa de datos)
│   │   │   ├── boards.service.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── clients.service.ts
│   │   │   └── tags.service.ts
│   │   │
│   │   ├── models/                  # Tipos TypeScript (DTOs)
│   │   │   ├── auth.models.ts       # AuthResponse, LoginRequest, etc.
│   │   │   ├── board.models.ts      # Board, PaginatedList, ApiResponse
│   │   │   ├── task.models.ts       # TaskItem, TaskItemStatus, TaskPriority
│   │   │   ├── user.models.ts       # User, UserRole
│   │   │   ├── project.models.ts    # Project, ProjectStatus
│   │   │   ├── client.models.ts     # Client
│   │   │   ├── tag.models.ts        # Tag
│   │   │   └── comment.models.ts    # Comment
│   │   │
│   │   ├── features/                # Componentes de funcionalidades
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── boards/
│   │   │   │   ├── boards-list/
│   │   │   │   ├── board-detail/
│   │   │   │   ├── create-board-modal/
│   │   │   │   ├── update-board-modal/
│   │   │   │   ├── create-task-modal/
│   │   │   │   └── edit-task-modal/
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.component.ts
│   │   │   │   └── task-state.service.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── admin/
│   │   │   │   └── admin.component.ts
│   │   │   └── forbidden/
│   │   │       └── forbidden.component.ts
│   │   │
│   │   ├── shared/                  # Componentes y utils compartidos
│   │   │   ├── components/
│   │   │   │   ├── board-card/
│   │   │   │   └── role-badge/
│   │   │   ├── pipes/
│   │   │   │   ├── task-status.pipe.ts
│   │   │   │   ├── task-priority.pipe.ts
│   │   │   │   ├── project-status.pipe.ts
│   │   │   │   └── user-role.pipe.ts
│   │   │   └── utils/
│   │   │       ├── constants.ts           # Enums, colores, validaciones
│   │   │       ├── validators.ts          # Validadores custom de formularios
│   │   │       ├── api-helpers.ts         # extractData, formatDate, etc.
│   │   │       └── http-error-handler.ts  # Manejo centralizado de errores
│   │   │
│   │   ├── layout/
│   │   │   └── main-layout/
│   │   │       └── main-layout.component.ts
│   │   │
│   │   ├── app.config.ts            # Configuración de providers
│   │   ├── app.routes.ts            # Definición de rutas
│   │   └── app.ts                   # Componente raíz
│   │
│   ├── environments/
│   │   ├── environment.ts           # Desarrollo
│   │   └── environment.production.ts  # Producción
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css                   # Estilos globales + Tailwind
│
├── public/                          # Assets estáticos
│
├── INTEGRATION-GUIDE.md             # 📘 Guía completa de integración
├── README.md                        # Este archivo
├── angular.json                     # Configuración de Angular
├── tailwind.config.js               # Configuración de Tailwind
├── tsconfig.json                    # Configuración de TypeScript
├── package.json
└── netlify.toml                     # Configuración de deploy en Netlify
```

---

## 🧪 Testing

El proyecto usa **Vitest** para pruebas unitarias:

```bash
# Ejecutar tests
npm test

# Modo watch
npm run test:watch

# Con UI
npm run test:ui

# Cobertura
npm run test:coverage
```

### Ejemplo de Test

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
  });
});
```

---

## 🌐 Deployment

### Netlify (Recomendado)

El proyecto ya está configurado con `netlify.toml`:

```bash
# Build
npm run build

# El resultado estará en dist/ng-taskflow/browser/
```

Configuración automática:
- Redirects para SPA (todas las rutas → index.html)
- Cache de assets estáticos
- Environment variables configurables en Netlify UI

### Vercel

```bash
vercel --prod
```

### Firebase Hosting

```bash
ng build --configuration=production
firebase deploy --only hosting
```

---

## 🎨 Personalización

### Cambiar Tema de Tailwind

Edita `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',  // Indigo
        secondary: '#8B5CF6' // Purple
      }
    }
  }
}
```

### Agregar Nuevas Rutas

Edita `app.routes.ts`:

```typescript
export const routes: Routes = [
  {
    path: 'mi-ruta',
    component: MiComponente,
    canActivate: [authGuard]
  }
];
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- **Componentes:** PascalCase, standalone, con template y estilos inline cuando sea posible
- **Servicios:** PascalCase + `Service` suffix, `providedIn: 'root'`
- **Signals:** camelCase, prefijo `_` para private signals
- **Observables:** camelCase, sufijo `$` (ej: `users$`)
- **Constantes:** UPPER_SNAKE_CASE
- **Tipos:** PascalCase, interfaces con prefijo `I` solo cuando sea necesario

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Dani** - [GitHub](https://github.com/danisw)

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la [Guía de Integración](./INTEGRATION-GUIDE.md)
2. Busca en [Issues](https://github.com/usuario/ng-taskflow/issues)
3. Crea un nuevo issue si no encuentras solución

---

## 🙏 Agradecimientos

- Equipo de Angular por el increíble framework
- Tailwind CSS por el sistema de diseño
- Comunidad de desarrolladores por las contribuciones

---

<div align="center">

**⭐ Si este proyecto te fue útil, dale una estrella ⭐**

[⬆ Volver arriba](#-taskflow---frontend-angular)

</div>
└── services/
```

---

# Shared

Componentes y utilidades reutilizables.

Ejemplo:

* botones
* modales
* tablas
* pipes
* directivas
* helpers

```txt id="jlwmu1"
shared/
├── components/
├── directives/
├── pipes/
└── utils/
```

---

# Domains

Representa el dominio del negocio.

Cada dominio contiene:

* entidades
* interfaces
* modelos
* lógica específica

Ejemplo:

```txt id="jlwm6z"
domains/
├── auth/
├── tasks/
└── boards/
```

---

# Application

Contiene casos de uso y lógica de aplicación.

Responsabilidades:

* servicios
* manejo de estado
* signals
* use cases
* coordinación de flujos

Ejemplo:

```txt id="jlwmc4"
application/
├── services/
├── state/
└── use-cases/
```

---

# Infrastructure

Conecta servicios externos.

Responsabilidades:

* APIs REST
* adapters
* repositories
* integración backend

Ejemplo:

```txt id="jlwm9x"
infrastructure/
├── api/
├── adapters/
└── repositories/
```

---

# Presentation

Responsable de la interfaz de usuario.

Contiene:

* páginas
* componentes
* layouts
* vistas

Ejemplo:

```txt id="jlwm1a"
presentation/
├── pages/
├── layouts/
└── components/
```

---

# 🔐 Route Guards

La aplicación utiliza Route Guards para proteger rutas privadas y controlar acceso de usuarios.

Objetivos:

* proteger páginas autenticadas
* validar permisos
* evitar acceso no autorizado
* mejorar seguridad frontend

Ejemplo:

```txt id="jlwmd7"
core/guards/
├── auth.guard.ts
├── guest.guard.ts
└── role.guard.ts
```

---

# Auth Guard

Protege rutas privadas.

Ejemplo:

```ts id="jlwmp8"
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated();
};
```

---

# Guest Guard

Evita que usuarios autenticados accedan a login o registro.

---

# Role Guard

Controla acceso según roles y permisos.

Ejemplo:

* admin
* manager
* user

---

# ⚡ Manejo de Estado

El proyecto utiliza Angular Signals para manejo reactivo moderno.

Beneficios:

* mejor rendimiento
* menos boilerplate
* reactividad eficiente
* integración moderna con Angular

RxJS se utiliza para:

* streams asíncronos
* peticiones HTTP
* eventos reactivos

---

# 🎨 UI/UX

La interfaz fue diseñada con enfoque en:

* experiencia de usuario moderna
* navegación intuitiva
* accesibilidad
* diseño responsive
* dark mode
* feedback visual

Inspiraciones:

* Trello
* Notion
* Linear
* Jira

---

# 🔐 Autenticación

Sistema de autenticación basado en JWT.

Incluye:

* login
* registro
* refresh token
* guards
* interceptors
* manejo de sesiones

---

# 🚀 Objetivos Técnicos

Este proyecto demuestra:

* Angular moderno
* arquitectura hexagonal
* clean code
* modularidad
* escalabilidad
* UI/UX moderna
* frontend enterprise
* integración fullstack
* buenas prácticas de seguridad

---

# 🏆 Características Técnicas

* standalone architecture
* lazy loading
* route guards
* Angular Signals
* arquitectura hexagonal
* reusable components
* responsive layouts
* API integration
* performance optimization

---

# 👨‍💻 Autor

Desarrollado por Daniel Calderón.

Frontend Developer especializado en Angular, arquitectura moderna y experiencias UI/UX.
