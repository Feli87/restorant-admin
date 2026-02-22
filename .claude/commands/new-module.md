---
allowed-tools: Bash(mkdir *), Write, Edit, Read
argument-hint: <module-name>
description: Scaffold a new NestJS backend module
---

Create NestJS module "$ARGUMENTS" in backend/src/modules/$ARGUMENTS/ with:
- $ARGUMENTS.module.ts
- $ARGUMENTS.controller.ts
- $ARGUMENTS.service.ts
- entities/ directory
- dto/ directory

Follow patterns from existing modules (e.g., users, menu, orders).
Register the new module in backend/src/app.module.ts imports.
