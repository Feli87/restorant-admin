---
allowed-tools: Bash(docker compose *)
description: Start the development environment
---

Start full dev environment with `docker compose -f docker-compose.dev.yml up -d`.
Check service health and report status. Expected services:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432
- pgAdmin (if profile tools): http://localhost:5050
