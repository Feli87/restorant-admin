---
allowed-tools: Bash(cd backend && npx typeorm *)
argument-hint: <migration-name>
description: Generate and run TypeORM migration
---

Generate a TypeORM migration named "$ARGUMENTS":
1. Run: `cd backend && npx typeorm migration:generate src/database/migrations/$ARGUMENTS -d src/config/database.config.ts`
2. Show the generated migration file
3. Ask if it should be run
4. If confirmed: `cd backend && npx typeorm migration:run -d src/config/database.config.ts`
