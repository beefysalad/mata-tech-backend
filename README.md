# Fastify Sales API (Challenge)

A small Fastify + TypeScript backend built for a 1‑week learning challenge. The goal is to learn Fastify quickly and ship a clean, well‑structured REST API for sales data (customers, products, sales) with an endpoint to query purchases by month.

## Status

- Current: Fastify server running with schema-based routes and Swagger.
- In progress: Data model and core API endpoints.

## Tech Stack

- Node.js
- Fastify
- TypeScript
- PostgreSQL
- Prisma
- Zod (schema validation)

## Quick Start

### Option A: Docker (Database Only) + Local Server (Recommended)

Start Postgres in Docker:

```bash
docker compose up -d
```

If your Windows shell doesn't recognize `docker compose`, try:

```bash
docker-compose up -d
```

Install deps and run the server locally:

```bash
npm install
npm run dev
```

Server starts on `http://localhost:3000` and Swagger UI at `http://localhost:3000/api/docs`.

## API (Current)

- `GET /api/health` — returns a health response.
- `GET /api/test/:name` — returns a hello message.
- Swagger UI available at `GET /docs`.

## Planned API (Target)

- `GET /sales?month=YYYY-MM` — list sales with customer and product details for a given month.
- `GET /customers` — list customers.
- `GET /products` — list products.
- `POST /sales` — create a sale.

## Data Model

- `customers` (id, name, email, created_at, updated_at) — implemented in Prisma
- `products` (id, name, price, created_at, updated_at)
- `sales` (id, customer_id, product_id, quantity, sale_date)

## Docker

Only PostgreSQL is containerized in `docker-compose.yml`. The Fastify server runs locally with `npm run dev`.

Start the database:

```bash
docker compose up -d
```

Notes:

- Works the same on macOS and Windows with Docker Desktop.
- If Windows shell doesn't recognize `docker compose`, try `docker-compose`.

PostgreSQL defaults:

- DB name: `sales_db`
- User: `postgres`
- Password: `postgres`
- Host: `localhost`
- Port: `5433` (host) -> `5432` (container)

## Environment Variables

Create a `.env` file (see `.env.example`):

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`

## Prisma

Prisma has been initialized. The schema lives in `prisma/schema.prisma`.

Common commands:

```bash
npm run prisma
npm run migrate
npm run generate
```

## Postman

Postman collections and environments are stored in `postman/` and synced via Postman’s Git integration.

- Collection: `postman/collections/Fastify Sales API.postman_collection.json`
- Environment: `postman/environments/New_Environment.postman_environment.json`

## Project Structure (Current)

- `src/index.ts` — server start
- `src/app.ts` — Fastify app builder
- `src/routes/` — route definitions
- `src/controllers/` — request handlers
- `src/services/` — business logic layer
- `src/repositories/` — data access layer
- `src/schemas/` — validation schemas
- `src/plugins/` — Fastify plugins (e.g., Prisma, Swagger)

## Architecture

This project follows an MVC-style structure with service and repository layers:

- Controllers handle HTTP request/response concerns.
- Services contain businesss logic and orchestration.
- Repositories handle database access (via Prisma).
- Routes wire endpoints to controllers.

## Docs

- `docs/TIMELINE.md` — progress timeline
- `docs/LEARNING.md` — learning notes

## Contributing

See `CONTRIBUTING.md` for workflow and style.
