# Plan de Desarrollo - Sistema de Gestión de Restaurantes

## 1. Resumen del Proyecto

Sistema full-stack para la gestión integral de un restaurante con roles diferenciados (Admin, Cajero, Mozo, Chef, Mesa/Cliente). Comunicación en tiempo real via WebSockets para pedidos, notificaciones y estados.

---

## 2. Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.x | Frontend SPA |
| Vite | 7.3.x | Build tool + Dev server |
| NestJS | 11.x | Backend API + WebSocket Gateway |
| Socket.io | 4.x | Comunicación en tiempo real |
| PostgreSQL | 16 | Base de datos relacional |
| TypeORM | 0.3.x | ORM para PostgreSQL |
| Docker / Compose | latest | Containerización |
| Storybook | 8.x | Documentación de componentes |
| react-i18next | latest | Internacionalización |
| Zustand | 5.x | Estado global (ligero, simple) |
| React Router | 7.x | Enrutamiento |
| TailwindCSS | 4.x | Estilos utilitarios |
| shadcn/ui | latest | Componentes UI (sobre Radix + Tailwind) |

---

## 3. Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                    Docker Compose                    │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Frontend    │  │   Backend    │  │ PostgreSQL│  │
│  │  React+Vite  │  │   NestJS     │  │   :5432   │  │
│  │   :5173      │  │   :3000      │  │           │  │
│  │             │──▶│  REST API   │──▶│           │  │
│  │             │◀─▶│  WebSocket  │  │           │  │
│  └─────────────┘  └──────────────┘  └───────────┘  │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐                  │
│  │  Storybook   │  │   pgAdmin    │                  │
│  │   :6006      │  │   :5050      │                  │
│  └─────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Estructura de Carpetas

### 4.1 Monorepo Root

```
restorant-admin/
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.json           # Config compartida base
├── package.json             # Scripts del workspace
├── turbo.json               # (opcional futuro)
│
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .storybook/
│   │   ├── main.ts
│   │   └── preview.ts
│   ├── public/
│   │   └── locales/
│   │       ├── es/
│   │       │   └── translation.json
│   │       └── en/
│   │           └── translation.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── router.tsx
│       ├── i18n.ts
│       ├── assets/
│       ├── components/        # Componentes reutilizables
│       │   ├── ui/            # shadcn/ui components (auto-generados por CLI)
│       │   ├── layout/        # Header, Sidebar, MainLayout, BottomNav
│       │   └── shared/        # Componentes de negocio compartidos entre roles
│       ├── pages/             # Páginas por rol
│       │   ├── auth/
│       │   │   └── LoginPage.tsx
│       │   ├── admin/
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── InventoryPage.tsx
│       │   │   ├── UsersPage.tsx
│       │   │   └── ReportsPage.tsx
│       │   ├── cashier/
│       │   │   ├── DashboardPage.tsx
│       │   │   └── SalesPage.tsx
│       │   ├── waiter/
│       │   │   ├── DashboardPage.tsx
│       │   │   ├── TablesPage.tsx
│       │   │   └── OrdersPage.tsx
│       │   ├── chef/
│       │   │   ├── DashboardPage.tsx
│       │   │   └── KitchenPage.tsx
│       │   └── table/
│       │       ├── MenuPage.tsx
│       │       └── OrderPage.tsx
│       ├── hooks/             # Custom hooks
│       │   ├── useAuth.ts
│       │   ├── useSocket.ts
│       │   └── useOrders.ts
│       ├── stores/            # Zustand stores
│       │   ├── authStore.ts
│       │   ├── orderStore.ts
│       │   └── notificationStore.ts
│       ├── services/          # API calls
│       │   ├── api.ts         # Axios instance
│       │   ├── authService.ts
│       │   ├── orderService.ts
│       │   ├── menuService.ts
│       │   └── inventoryService.ts
│       ├── socket/            # Socket.io client
│       │   ├── socket.ts
│       │   └── events.ts
│       ├── guards/            # Route guards
│       │   └── RoleGuard.tsx
│       └── types/             # TypeScript types
│           ├── user.ts
│           ├── order.ts
│           ├── menu.ts
│           └── table.ts
│
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/
│       │   ├── database.config.ts
│       │   └── jwt.config.ts
│       ├── common/
│       │   ├── decorators/
│       │   │   └── roles.decorator.ts
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts
│       │   │   └── roles.guard.ts
│       │   ├── filters/
│       │   │   └── http-exception.filter.ts
│       │   └── interceptors/
│       │       └── transform.interceptor.ts
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.module.ts
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── strategies/
│       │   │   │   └── jwt.strategy.ts
│       │   │   └── dto/
│       │   │       ├── login.dto.ts
│       │   │       └── register.dto.ts
│       │   ├── users/
│       │   │   ├── users.module.ts
│       │   │   ├── users.controller.ts
│       │   │   ├── users.service.ts
│       │   │   ├── entities/
│       │   │   │   └── user.entity.ts
│       │   │   └── dto/
│       │   │       └── create-user.dto.ts
│       │   ├── menu/
│       │   │   ├── menu.module.ts
│       │   │   ├── menu.controller.ts
│       │   │   ├── menu.service.ts
│       │   │   ├── entities/
│       │   │   │   ├── category.entity.ts
│       │   │   │   └── menu-item.entity.ts
│       │   │   └── dto/
│       │   ├── orders/
│       │   │   ├── orders.module.ts
│       │   │   ├── orders.controller.ts
│       │   │   ├── orders.service.ts
│       │   │   ├── entities/
│       │   │   │   ├── order.entity.ts
│       │   │   │   └── order-item.entity.ts
│       │   │   └── dto/
│       │   ├── tables/
│       │   │   ├── tables.module.ts
│       │   │   ├── tables.controller.ts
│       │   │   ├── tables.service.ts
│       │   │   └── entities/
│       │   │       └── table.entity.ts
│       │   ├── inventory/
│       │   │   ├── inventory.module.ts
│       │   │   ├── inventory.controller.ts
│       │   │   ├── inventory.service.ts
│       │   │   └── entities/
│       │   │       └── inventory-item.entity.ts
│       │   ├── sales/
│       │   │   ├── sales.module.ts
│       │   │   ├── sales.controller.ts
│       │   │   ├── sales.service.ts
│       │   │   └── entities/
│       │   │       └── sale.entity.ts
│       │   └── notifications/
│       │       ├── notifications.module.ts
│       │       ├── notifications.gateway.ts  # Socket.io Gateway
│       │       └── notifications.service.ts
│       └── database/
│           ├── migrations/
│           └── seeds/
│               └── initial-seed.ts
│
└── .claude/
    ├── settings.json
    └── commands/
        ├── dev.md
        ├── test.md
        └── lint.md
```

---

## 5. Modelo de Datos (PostgreSQL)

### 5.1 Diagrama Entidad-Relación

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    users      │     │    tables         │     │   categories     │
├──────────────┤     ├──────────────────┤     ├─────────────────┤
│ id (PK)      │     │ id (PK)          │     │ id (PK)         │
│ email        │     │ number           │     │ name            │
│ password     │     │ capacity         │     │ description     │
│ name         │     │ status           │     │ is_active       │
│ role (enum)  │     │ qr_code          │     │ display_order   │
│ is_active    │     │ created_at       │     │ created_at      │
│ created_at   │     │ updated_at       │     └─────────────────┘
│ updated_at   │     └──────────────────┘             │
└──────────────┘              │                        │
       │                      │                        │
       │              ┌───────┴──────┐         ┌───────┴──────────┐
       │              │   orders      │         │   menu_items      │
       │              ├──────────────┤         ├──────────────────┤
       └──────────────│ id (PK)      │         │ id (PK)          │
        waiter_id(FK) │ table_id(FK) │         │ category_id(FK)  │
                      │ waiter_id(FK)│         │ name             │
                      │ status(enum) │         │ description      │
                      │ notes        │         │ price            │
                      │ total        │         │ image_url        │
                      │ created_at   │         │ is_available     │
                      │ updated_at   │         │ prep_time_min    │
                      └──────┬───────┘         │ created_at       │
                             │                 └────────┬─────────┘
                             │                          │
                      ┌──────┴───────────┐              │
                      │   order_items     │              │
                      ├──────────────────┤              │
                      │ id (PK)          │──────────────┘
                      │ order_id (FK)    │  menu_item_id(FK)
                      │ menu_item_id(FK) │
                      │ quantity         │
                      │ unit_price       │
                      │ notes            │
                      │ status (enum)    │
                      └──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│ inventory_items   │     │     sales         │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ name             │     │ order_id (FK)    │
│ quantity         │     │ cashier_id (FK)  │
│ unit             │     │ payment_method   │
│ min_stock        │     │ subtotal         │
│ category         │     │ tax              │
│ created_at       │     │ total            │
│ updated_at       │     │ created_at       │
└──────────────────┘     └──────────────────┘
```

### 5.2 Enums

```
UserRole:     ADMIN | CASHIER | WAITER | CHEF | TABLE_USER
TableStatus:  AVAILABLE | OCCUPIED | RESERVED | CLEANING
OrderStatus:  PENDING | CONFIRMED | PREPARING | READY | DELIVERED | CANCELLED
OrderItemStatus: PENDING | PREPARING | READY | CANCELLED
PaymentMethod: CASH | CARD | TRANSFER
```

---

## 6. API REST - Endpoints

### 6.1 Auth
```
POST   /api/auth/login          # Login (retorna JWT + role)
POST   /api/auth/refresh        # Refresh token
POST   /api/auth/table-login    # Login para mesa (via QR/código)
```

### 6.2 Users (Admin)
```
GET    /api/users               # Listar usuarios
POST   /api/users               # Crear usuario
PATCH  /api/users/:id           # Actualizar usuario
DELETE /api/users/:id           # Desactivar usuario
```

### 6.3 Menu
```
GET    /api/menu                # Listar menú completo (público)
GET    /api/menu/categories     # Listar categorías
POST   /api/menu/categories     # Crear categoría (Admin)
POST   /api/menu/items          # Crear item (Admin)
PATCH  /api/menu/items/:id      # Actualizar item (Admin)
DELETE /api/menu/items/:id      # Desactivar item (Admin)
```

### 6.4 Tables
```
GET    /api/tables              # Listar mesas
POST   /api/tables              # Crear mesa (Admin)
PATCH  /api/tables/:id          # Actualizar mesa
PATCH  /api/tables/:id/status   # Cambiar estado mesa
```

### 6.5 Orders
```
GET    /api/orders              # Listar pedidos (filtrado por rol)
GET    /api/orders/:id          # Detalle de pedido
POST   /api/orders              # Crear pedido (Mozo o Mesa)
PATCH  /api/orders/:id/status   # Cambiar estado (Chef/Mozo)
PATCH  /api/orders/:id/items/:itemId/status  # Estado de item individual
POST   /api/orders/:id/cancel   # Cancelar pedido (Chef - con motivo)
```

### 6.6 Sales (Cajero)
```
GET    /api/sales               # Listar ventas
POST   /api/sales               # Registrar venta/cobro
GET    /api/sales/daily-summary # Resumen diario
```

### 6.7 Inventory (Admin)
```
GET    /api/inventory           # Listar inventario
POST   /api/inventory           # Agregar item
PATCH  /api/inventory/:id       # Actualizar stock
GET    /api/inventory/alerts    # Items bajo stock mínimo
```

### 6.8 Dashboard (Admin)
```
GET    /api/dashboard/stats     # Estadísticas generales
GET    /api/dashboard/activity  # Actividad en tiempo real
```

---

## 7. WebSocket Events (Socket.io)

### 7.1 Namespaces y Rooms

```
Namespace: /orders
  Rooms: kitchen, waiters, cashier, table-{id}

Namespace: /notifications
  Rooms: role-{role}, user-{id}
```

### 7.2 Eventos

```
# Cliente → Servidor
order:create          # Mesa/Mozo crea pedido
order:update-status   # Chef/Mozo cambia estado
order:cancel          # Chef cancela pedido
table:call-waiter     # Mesa llama al mozo

# Servidor → Cliente
order:new             # Nuevo pedido (→ kitchen, waiters)
order:status-changed  # Cambio de estado (→ table, waiters, cashier)
order:cancelled       # Pedido cancelado (→ table, waiters)
order:ready           # Pedido listo (→ waiters, table)
notification:new      # Notificación genérica
table:waiter-called   # Alerta mozo (→ waiters)
inventory:low-stock   # Alerta stock bajo (→ admin)
```

---

## 8. Roles, Dispositivos y Detalle por Pantalla

### 8.0 Dispositivos por Rol

| Rol | Dispositivo | Viewport | Consideraciones UX |
|---|---|---|---|
| **Mesa (Cliente)** | Smartphone | 320-428px | Touch-first, thumb zone, scroll vertical, textos grandes, botones amplios |
| **Mozo** | Tablet | 768-1024px | Touch, orientación landscape/portrait, gestos swipe, acceso rápido |
| **Cajero** | Monitor desktop | 1280-1920px | Mouse + teclado, atajos de teclado, layout wide con paneles |
| **Chef** | TV 32"+ | 1920px+ | Solo visualización a distancia, tipografía XL, alto contraste, colores de estado muy claros, sin interacción compleja (botones grandes) |
| **Admin** | Notebook/Laptop | 1024-1440px | Mouse + teclado, dashboards con gráficos, tablas con datos, sidebar colapsable |

### 8.1 ADMIN (Notebook/Laptop 1024-1440px)
- **Dashboard**: Vista general con KPIs (ventas del día, pedidos activos, mesas ocupadas, alertas stock)
- **Usuarios**: CRUD completo de empleados y asignación de roles
- **Menú**: Gestión completa de categorías e items
- **Mesas**: Configuración de mesas del local
- **Inventario**: Control de stock, alertas de mínimos
- **Reportes**: Ventas por período, productos más vendidos, rendimiento por mozo
- **Vista en vivo**: Puede ver todo lo que ve cada rol en tiempo real
- **Layout**: Sidebar colapsable + contenido principal, tablas con paginación, formularios en modales/sheets

### 8.2 CAJERO (Monitor Desktop 1280-1920px)
- **Dashboard**: Pedidos listos para cobrar, resumen de caja del día
- **Ventas**: Cobrar pedidos, seleccionar método de pago, imprimir ticket
- **Historial**: Ventas realizadas en el turno
- **Layout**: Panel split (lista pedidos a la izquierda, detalle a la derecha), atajos de teclado para cobro rápido

### 8.3 MOZO (Tablet 768-1024px)
- **Dashboard**: Vista de mesas asignadas con estado visual
- **Mesas**: Mapa visual de mesas con colores por estado, grilla adaptativa
- **Notificaciones**: Alertas en tiempo real (mesa llama, pedido listo, etc.) con vibración/sonido
- **Pedidos**: Crear pedido para una mesa, ver menú, agregar items con tap
- **Pedidos activos**: Lista de pedidos en curso con estado
- **Layout**: Bottom navigation (tabs), cards grandes para touch, swipe para acciones rápidas

### 8.4 CHEF (TV 32"+ 1920px+)
- **Dashboard/Cocina**: Cola de pedidos ordenados por tiempo, tipografía extra grande
- **Gestión de pedidos**: Cambiar estado (preparando → listo), cancelar items por faltante
- **Tiempos**: Visualización prominente de tiempo transcurrido por pedido con colores de alerta
- **Alertas**: Notificar faltantes al admin
- **Layout**: Grid de cards de pedidos, sin scroll complejo, colores semáforo (verde/amarillo/rojo por tiempo), botones XL, modo oscuro por defecto para cocina, sonido en nuevos pedidos

### 8.5 MESA/CLIENTE (Smartphone 320-428px)
- **Menú**: Vista del menú como feed vertical con categorías, fotos grandes, precios claros
- **Pedido**: Armar pedido con carrito tipo e-commerce, agregar items con +/-, enviar al mozo
- **Estado**: Ver estado de su pedido en tiempo real con progress steps
- **Llamar mozo**: FAB (floating action button) siempre visible
- **Layout**: Full mobile, navegación por tabs en bottom, sin sidebar, carrito como sheet deslizable desde abajo

---

## 9. Docker Compose

### 9.1 Servicios

```yaml
services:
  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    ports: 5432:5432
    volumes: pgdata:/var/lib/postgresql/data
    healthcheck

  # Backend NestJS (dev con hot-reload)
  backend:
    build: ./backend (Dockerfile.dev)
    ports: 3000:3000
    volumes: ./backend:/app (bind mount)
    depends_on: postgres
    env_file: .env

  # Frontend React+Vite (dev con HMR)
  frontend:
    build: ./frontend (Dockerfile.dev)
    ports: 5173:5173
    volumes: ./frontend:/app (bind mount)
    depends_on: backend

  # Storybook
  storybook:
    build: ./frontend (target storybook)
    ports: 6006:6006
    volumes: ./frontend:/app

  # pgAdmin (opcional, útil para desarrollo)
  pgadmin:
    image: dpage/pgadmin4
    ports: 5050:80
    depends_on: postgres
```

### 9.2 Dockerfiles

**Backend Dockerfile.dev**: Node 22 alpine, npm install, nest start --watch
**Frontend Dockerfile.dev**: Node 22 alpine, npm install, vite dev --host
**Production**: Multi-stage builds con nginx para frontend

---

## 10. Fases de Implementación

### FASE 1: Infraestructura y Setup (actual)
1. Inicializar monorepo con estructura de carpetas
2. Configurar Docker Compose completo (dev)
3. Setup frontend: Vite + React 19 + TypeScript + TailwindCSS
4. Instalar y configurar shadcn/ui (theme, componentes base)
5. Setup backend: NestJS 11 + TypeORM + PostgreSQL
6. Configurar ESLint + Prettier (ambos proyectos)
7. Configurar Storybook (integrado con shadcn/ui)
8. Configurar i18n (español/inglés)
9. Crear layouts por dispositivo/rol (Mobile, Tablet, Desktop, Kitchen)
10. Configurar Claude Code (.claude/, CLAUDE.md, hooks)
11. Seed inicial de base de datos

### FASE 2: Autenticación y Base
1. Módulo Auth backend (JWT, refresh tokens)
2. Módulo Users backend (CRUD + roles)
3. Login page frontend
4. Guards de rutas por rol
5. Layout base por rol (sidebar, header, navegación)
6. Socket.io: conexión base con autenticación

### FASE 3: Gestión de Menú y Mesas
1. CRUD de categorías y items del menú
2. CRUD de mesas
3. Vista de menú para mesa/cliente
4. Vista de mesas para mozo (mapa visual)

### FASE 4: Sistema de Pedidos
1. Crear pedido (mozo y mesa)
2. Cola de cocina (chef)
3. Flujo de estados de pedido completo
4. Notificaciones en tiempo real (Socket.io)
5. Llamar al mozo desde mesa

### FASE 5: Ventas y Caja
1. Flujo de cobro (cajero)
2. Métodos de pago
3. Historial de ventas
4. Resumen de caja diario

### FASE 6: Admin y Reportes
1. Dashboard admin con KPIs
2. Gestión de inventario
3. Alertas de stock bajo
4. Reportes básicos

### FASE 7: Pulido
1. Testing responsive en todos los dispositivos/viewports
2. Tests E2E de flujos principales
3. Optimización de rendimiento
4. Dockerfiles de producción

---

## 11. Configuración Claude Code

### 11.1 CLAUDE.md (root)

Archivo de contexto principal con:
- Descripción del proyecto y arquitectura
- Comandos para levantar el entorno (docker compose)
- Convenciones de código
- Estructura de módulos
- Patrones a seguir (ej: cómo crear un nuevo módulo NestJS, cómo crear una nueva página React)

### 11.2 .claude/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run format)",
      "Bash(npm run test)",
      "Bash(docker compose *)",
      "Bash(npx typeorm *)"
    ]
  }
}
```

### 11.3 .claude/commands/

Comandos personalizados:
- **dev.md**: Instrucciones para levantar el entorno de desarrollo
- **test.md**: Cómo ejecutar tests (frontend y backend)
- **lint.md**: Ejecutar linting y formateo
- **new-module.md**: Template para crear un nuevo módulo NestJS
- **new-page.md**: Template para crear una nueva página React

### 11.4 Hooks sugeridos

```json
{
  "hooks": {
    "pre-commit": "npm run lint:fix && npm run format",
    "pre-push": "npm run test"
  }
}
```

### 11.5 ESLint Config

- **Backend**: `@typescript-eslint` con reglas de NestJS
- **Frontend**: `@typescript-eslint` + `eslint-plugin-react` + `eslint-plugin-react-hooks`
- Reglas compartidas: no-unused-vars (error), no-console (warn), prefer-const, etc.

### 11.6 Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

---

## 12. Patrones de Diseño

### 12.1 Backend (NestJS) - Sin complejidad innecesaria

- **Modular por dominio**: Cada módulo contiene controller, service, entities, DTOs
- **Repository Pattern**: Via TypeORM repositories (inyectados en services)
- **Guards + Decorators**: Para autorización basada en roles
- **DTOs con class-validator**: Validación automática de input
- **Un servicio por módulo**: Sin capas intermedias innecesarias
- **Gateway para WebSocket**: Un gateway centralizado para eventos

### 12.2 Frontend (React) - Simple y directo

- **Pages como entry points**: Cada página es un componente que orquesta
- **shadcn/ui para componentes base**: Button, Input, Dialog, Sheet, Card, Badge, Table, etc. (copiados al proyecto, customizables)
- **Layouts por dispositivo**: Layouts específicos que adaptan la UI al dispositivo del rol
- **Zustand para estado global**: Auth, orders activos, notificaciones
- **Custom hooks para lógica**: useAuth, useSocket, useOrders
- **Services para API**: Funciones simples con axios
- **Sin over-abstraction**: No HOCs innecesarios, no context hell, no Redux

### 12.3 Estrategia Responsive

- **Mobile-first**: Estilos base para smartphone (Mesa), escalando hacia arriba
- **Breakpoints TailwindCSS**: `sm` (640), `md` (768 - tablet/mozo), `lg` (1024 - laptop/admin), `xl` (1280 - desktop/cajero), `2xl` (1536 - TV/chef)
- **Layouts por rol**: Cada rol tiene su propio layout wrapper que optimiza para su dispositivo
  - `MobileLayout`: Bottom tabs, sin sidebar (Mesa)
  - `TabletLayout`: Bottom nav o sidebar colapsable (Mozo)
  - `DesktopLayout`: Sidebar fijo + header (Cajero, Admin)
  - `KitchenLayout`: Fullscreen grid, sin navegación compleja, tipografía XXL (Chef)

---

## 13. Convenciones de Código

### Naming
- **Archivos**: kebab-case para archivos, PascalCase para componentes React
- **Variables/Funciones**: camelCase
- **Tipos/Interfaces**: PascalCase con prefijo descriptivo (CreateOrderDto, UserRole)
- **Constantes**: UPPER_SNAKE_CASE
- **Entidades DB**: snake_case en columnas

### Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- En español o inglés (consistente)

### Estructura de imports
1. Librerías externas
2. Módulos internos
3. Componentes
4. Types/interfaces
5. Estilos

---

## 14. Dependencias Principales

### Frontend
```
react, react-dom
react-router-dom
zustand
axios
socket.io-client
react-i18next, i18next
tailwindcss
shadcn/ui                # Componentes UI (Button, Card, Dialog, Sheet, Table, etc.)
  ├── @radix-ui/*        # Primitivos accesibles (instalados por shadcn)
  ├── lucide-react       # Iconos (instalado por shadcn)
  ├── clsx + tailwind-merge  # Class merging (instalado por shadcn)
  └── sonner             # Toasts (componente shadcn)
```

### Backend
```
@nestjs/core, @nestjs/common, @nestjs/platform-express
@nestjs/typeorm, typeorm, pg
@nestjs/jwt, @nestjs/passport, passport-jwt
@nestjs/websockets, @nestjs/platform-socket.io
@nestjs/config
class-validator, class-transformer
bcrypt
```

### Dev
```
typescript
eslint + plugins
prettier
storybook
vitest                   # Tests frontend
jest                     # Tests backend (incluido en NestJS)
```

---

## 15. Variables de Entorno

```env
# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=restaurant_user
POSTGRES_PASSWORD=restaurant_pass
POSTGRES_DB=restaurant_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# App
BACKEND_PORT=3000
FRONTEND_PORT=5173
NODE_ENV=development

# pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@restaurant.com
PGADMIN_DEFAULT_PASSWORD=admin
```

---

## Próximos pasos

Una vez aprobado este plan, comenzaré con la **Fase 1** completa:
- Crear toda la estructura de carpetas
- Configurar Docker Compose funcional
- Setup de ambos proyectos (frontend + backend)
- Configurar todas las herramientas de desarrollo
- Crear CLAUDE.md y configuraciones de Claude Code
- Seed inicial de base de datos con datos de ejemplo

El resultado será un entorno de desarrollo totalmente funcional donde con `docker compose up` se levanta todo el stack listo para desarrollar.
