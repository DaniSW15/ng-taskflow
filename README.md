# 🏗️ Arquitectura Frontend

La aplicación fue desarrollada utilizando una arquitectura moderna, modular y escalable basada en Angular 21.

El objetivo es mantener:

* separación de responsabilidades
* código mantenible
* componentes reutilizables
* escalabilidad
* rendimiento optimizado

---

# ⚙️ Tecnologías

* Angular 21
* Vite
* TypeScript
* Angular Signals
* RxJS
* Tailwind CSS
* Angular Router
* Standalone Components
* Angular CDK

---

# 🧠 Arquitectura Hexagonal Frontend

El proyecto sigue principios de Arquitectura Hexagonal (Ports & Adapters) para desacoplar la lógica del negocio de frameworks y servicios externos.

Beneficios:

* código desacoplado
* mayor mantenibilidad
* testing más sencillo
* escalabilidad
* independencia de infraestructura

---

# 📁 Estructura del Proyecto

```txt id="jlwmu9"
src/
│
├── app/
│   │
│   ├── core/
│   ├── shared/
│   ├── layout/
│   ├── routes/
│   │
│   ├── domains/
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── boards/
│   │
│   ├── infrastructure/
│   │   ├── api/
│   │   ├── adapters/
│   │   └── repositories/
│   │
│   ├── application/
│   │   ├── services/
│   │   ├── use-cases/
│   │   └── state/
│   │
│   └── presentation/
│       ├── pages/
│       ├── components/
│       └── layouts/
│
├── assets/
├── environments/
└── styles/
```

---

# 🏛️ Capas de la Arquitectura

## Core

Contiene configuración global de la aplicación.

Responsabilidades:

* autenticación
* interceptors
* guards
* servicios globales
* configuración principal

```txt id="jlwm9l"
core/
├── auth/
├── guards/
├── interceptors/
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
