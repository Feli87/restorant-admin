---
allowed-tools: Write, Edit, Read
argument-hint: <role>/<page-name>
description: Scaffold a new React page
---

Create page at frontend/src/pages/$ARGUMENTS.tsx.
- Use the appropriate layout for the role (Admin=DesktopLayout, Waiter=TabletLayout, Chef=KitchenLayout, Table=MobileLayout)
- Import shadcn/ui components (Card, Button, etc.)
- Use react-i18next for all user-facing text
- Add the route in frontend/src/router.tsx with the appropriate RoleGuard
- Follow patterns from existing pages in the same role directory
