---
description: Review uncommitted changes for issues
---

Review all uncommitted changes (git diff) and check for:
1. TypeScript errors (run tsc --noEmit on both projects)
2. Security issues (hardcoded secrets, SQL injection, XSS)
3. Missing DTOs or validation on new endpoints
4. Naming consistency (camelCase functions, PascalCase components, snake_case DB columns)
5. Proper shadcn/ui usage (no custom CSS for existing primitives)
6. i18n usage (no hardcoded user-facing strings)
7. Missing imports or unused exports

Provide a summary with suggestions grouped by severity (error, warning, info).
