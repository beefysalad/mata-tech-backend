# 1‑Week Progress Timeline

Assumption: “yesterday” refers to 2026-03-14. If that date is off, tell me and I’ll update.

## 2026-03-14 (Day 1)

- Watched Fastify crash courses and official documentation.
- Watched PostgreSQL + Prisma integration resources for Fastify.
- Sketched the API use case and data model direction (customers, products, sales).

## 2026-03-15 (Day 2)

- Initialized Fastify + TypeScript project.
- Added a basic `GET /` route to validate server setup.
- Learned about plugins, schemas and how it works.
- Implement zod validation with schema options for route
- Started dockerization work for a much easier setup and deployment.

## 2026-03-16 (Day 3)

- Added initial Prisma model for customers.
- Updated README status and data model notes.
- Switched Docker usage to database-only; server runs locally with `npm run dev`.
- Added Prisma singleton + adapter setup and ensured `.env` loads before Prisma.
- Refactored customer Zod schemas for readability and reusability.
- Added Swagger tags to group customer routes in swagger.
- Fixed response schemas and explicit 201 status for create.
- Added Postman collection + environment synced via Postman Git integration.

## 2026-03-17 (Day 4)

- Added Vitest API tests (health + customer CRUD).
- Added Faker-based customer seeding with batch inserts.

## Planned (Next 3–4 Days)

- Define DB schema (customers, products, sales) and migrations.
- Implement `GET /sales?month=YYYY-MM` with proper joins.
- Add validation and error handling.
- Add authentication (optional bonus).

## Final Days

- Clean up structure for “enterprise‑style” organization (routes, services, repositories).
- README updates and usage examples.
- Record demo walkthrough video.
