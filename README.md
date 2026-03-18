# Fastify Sales API

Enterprise‑style Fastify + TypeScript backend for the 1‑week learning challenge. The goal is to learn Fastify quickly, apply modern Node.js practices, and deliver a clean, documented REST API for sales data (customers, products, sales).

## Challenge Overview

This project implements the **1 Week JavaScript Backend Challenge** with a focus on:

- Rapid learning and application of a new backend framework
- Clean architecture and code organization
- Practical REST API design and documentation
- Modern TypeScript usage and tooling

## Challenge Requirements (Condensed)

- Learn Fastify or Koa and build a REST API for sales data.
- Data model must include **customers**, **products**, and **sales**.
- Core use case: query sales by month to see which customer bought which products.
- Bonus (optional): validation, authentication, error handling, and other enterprise features.

## Status

- Current: Customer + Product CRUD, Sales CRUD, monthly sales query, Swagger docs, seeding, and API tests
- Demo: A simple Next.js frontend was created for walkthroughs. If you want to clone it, use this repo: `[GITHUB_LINK_HERE]` (replace later).

## Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL
- Prisma
- Zod
- Vitest

## Quick Start

### Environment (Both)

Create a `.env` file (see `.env.example`):

- `NODE_ENV` (optional)
- `PORT` (optional)
- `DATABASE_URL` (required)

Default Docker connection string:
`postgresql://postgres:postgres@localhost:5433/sales_db`

### Option A: Docker (DB + App)

This starts **both** Postgres and the API, runs Prisma migrations automatically,
and exposes the API at `http://localhost:3000`.

```bash
docker compose up --build
```

If your Windows shell doesn't recognize `docker compose`:

```bash
docker-compose up --build
```

### Option B: Local Dev (Postgres + App)

1) Start Postgres locally and set `DATABASE_URL` to match your instance.

2) Install dependencies (also runs `prisma generate` via `postinstall`):

```bash
npm install
```

3) Run Prisma migrations:

```bash
npm run migrate
```

4) (Optional) Seed data:

```bash
SEED_COUNT=200 SEED_BATCH_SIZE=50 npm run seed
```

If you are running the app via Docker Compose:

```bash
npm run seed:docker
```

5) Start the server:

```bash
npm run dev
```

Server starts on:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`

## Environment

Required:

- `DATABASE_URL`

Optional:

- `NODE_ENV`
- `PORT`

## Data Model

- `Customer` (id, name, email, phone, createdAt, updatedAt)
- `Product` (id, name, description, sku, price, stock, createdAt, updatedAt)
- `Sale` (id, customerId, productId, quantity, saleDate, createdAt, updatedAt)

## API Endpoints

### Required (Challenge)

These satisfy the core requirements of the 1‑week challenge.

### Customers

- `POST /api/customers`
- `GET /api/customers?limit=50&offset=0`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Products

- `POST /api/products`
- `GET /api/products?limit=50&offset=0`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Sales

- `POST /api/sales`
- `GET /api/sales?month=YYYY-MM`

### Bonus / Extra (Added)

These are not required by the challenge, but added to make the API more usable.

- `GET /api/products/summary` (aggregates total stock, low stock, and average price)

Swagger UI is the source of truth for request/response contracts:
`http://localhost:3000/api/docs`

## Example Requests

Create a sale:

```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "productId": "prod_456",
    "quantity": 2,
    "saleDate": "2024-06-15T10:00:00.000Z"
  }'
```

Get sales for a month (with pagination):

```bash
curl "http://localhost:3000/api/sales?month=2024-06&limit=50&offset=0"
```

## Checklist (Challenge)

- [x] Use Fastify (chosen framework)
- [x] Customers, Products, Sales tables (Prisma)
- [x] Monthly sales query (`GET /api/sales?month=YYYY-MM`)
- [x] Modern TypeScript codebase
- [x] RESTful API + Swagger docs

## Database (Prisma)

Prisma schema lives at `prisma/schema.prisma`.

Common commands:

```bash
npm run prisma
npm run migrate
npm run generate
npm run seed
```

## Seeding (Faker)

Seed customers, products, and sales:

```bash
SEED_COUNT=200 SEED_BATCH_SIZE=50 npm run seed
```

## Testing

API tests run via Vitest + Fastify `inject`:

```bash
npm test
```

## Postman

Postman collections and environments are stored in `postman/` and synced via Postman’s Git integration.

- Collection: `postman/collections/Fastify Sales API.postman_collection.json`
- Environment: `postman/environments/New_Environment.postman_environment.json`

## Architecture

This repo follows an enterprise‑style layout:

- `src/routes/` — HTTP routing
- `src/controllers/` — request/response handling
- `src/services/` — business logic
- `src/repositories/` — data access
- `src/schemas/` — validation + Swagger schema
- `src/plugins/` — Fastify plugins (Swagger)

## Docs

- `docs/TIMELINE.md` — progress timeline
- `docs/LEARNING.md` — learning notes

## Contributing

See `CONTRIBUTING.md` for workflow and style.
