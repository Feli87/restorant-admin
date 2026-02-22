# Restaurant Admin System

Full-stack monorepo: React 19 + Vite 6 frontend, NestJS 11 backend,
PostgreSQL 16, Socket.io real-time. Docker Compose for dev.

## Project Structure
- `frontend/` - React SPA: TailwindCSS 4 + shadcn/ui + Zustand 5
- `backend/` - NestJS 11: TypeORM 0.3, JWT auth, Socket.io gateway

## Commands
- Start dev: `docker compose -f docker-compose.dev.yml up`
- Frontend dev (local): `cd frontend && npm run dev`
- Backend dev (local): `cd backend && npm run start:dev`
- Frontend tests: `cd frontend && npx vitest run`
- Backend tests: `cd backend && npm run test`
- Lint: `cd frontend && npm run lint` / `cd backend && npm run lint`
- Format: `npx prettier --write "**/*.{ts,tsx}"`
- Migration generate: `cd backend && npx typeorm migration:generate src/database/migrations/Name -d src/config/database.config.ts`
- Migration run: `cd backend && npx typeorm migration:run -d src/config/database.config.ts`
- Seed: `cd backend && npm run seed`
- Storybook: `cd frontend && npm run storybook`

## Code Style
- TypeScript strict mode, ES modules
- Functional React with hooks only (NO class components)
- shadcn/ui components from `frontend/src/components/ui/`
- Zustand for global state (authStore, orderStore, notificationStore)
- NestJS: one service per module, DTOs with class-validator, Repository pattern via TypeORM
- Conventional commits: feat:, fix:, chore:, refactor:, docs:

## Architecture Rules
IMPORTANT: Use Zustand only. NO Redux, NO Context for state management.
IMPORTANT: Functional components only. NO class components.
IMPORTANT: Backend modules follow: module.ts, controller.ts, service.ts, entities/, dto/
IMPORTANT: All API endpoints prefixed with /api/
IMPORTANT: shadcn/ui for ALL UI components. No custom component libraries.
IMPORTANT: i18n via react-i18next for ALL user-facing text. No hardcoded strings.
IMPORTANT: UUID primary keys on all entities (@PrimaryGeneratedColumn('uuid'))

## Roles & Layouts
| Role | Layout | Device |
|------|--------|--------|
| ADMIN | DesktopLayout (sidebar) | Laptop 1024-1440px |
| CASHIER | DesktopLayout (sidebar) | Monitor 1280-1920px |
| WAITER | TabletLayout (bottom nav) | Tablet 768-1024px |
| CHEF | KitchenLayout (dark, XL text) | TV 1920px+ |
| TABLE_USER | MobileLayout (bottom tabs) | Phone 320-428px |

## Verification
After changes run: `cd frontend && npx tsc --noEmit` and `cd backend && npx tsc --noEmit`
