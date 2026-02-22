---
allowed-tools: Bash(cd frontend && npx vitest *), Bash(cd backend && npm run test *)
argument-hint: [frontend|backend|all]
description: Run project tests
---

Run tests for "$ARGUMENTS" (default: all).
- Frontend: `cd frontend && npx vitest run`
- Backend: `cd backend && npm run test`
Report results with any failures highlighted.
