# Fastify Sales API (Challenge)

A small Fastify + TypeScript backend built for a 1‑week learning challenge. The goal is to learn Fastify quickly and ship a clean, well‑structured REST API for sales data (customers, products, sales) with an endpoint to query purchases by month.

## Status
- Current: Basic Fastify server running with a health route.
- In progress: Dockerization and API/data model implementation.

## Tech Stack
- Node.js
- Fastify
- TypeScript
- PostgreSQL (planned)
- Prisma (planned)

## Quick Start
1. Install dependencies

```bash
npm install
```

2. Run in dev mode (watch + TypeScript)

```bash
npm run dev
```

3. Build and run

```bash
npm run start
```

Server starts on `http://localhost:3000`.

## API (Current)
- `GET /` — returns a hello message.
- Swagger UI available at `GET /docs`.

## Planned API (Target)
- `GET /sales?month=YYYY-MM` — list sales with customer and product details for a given month.
- `GET /customers` — list customers.
- `GET /products` — list products.
- `POST /sales` — create a sale.

## Data Model (Planned)
- `customers` (id, name, email, created_at)
- `products` (id, name, price, created_at)
- `sales` (id, customer_id, product_id, quantity, sale_date)

## Docker (In Progress)
Build and run with Docker:

```bash
docker build -t fastify-mata .
docker run --rm -p 3000:3000 fastify-mata
```

Or with Docker Compose:

```bash
docker compose up --build
```

PostgreSQL is included in `docker-compose.yml` with a default database:
- DB name: `sales_db`
- User: `postgres`
- Password: `postgres`
- Host: `db`
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

## Project Structure (Current)
- `src/index.ts` — Fastify server entry.

## Docs
- `docs/TIMELINE.md` — progress timeline
- `docs/LEARNING.md` — learning notes

## Notes
This project is intentionally simple but structured to grow into a small “enterprise‑style” service as the week progresses.
