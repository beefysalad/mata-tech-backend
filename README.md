# Fastify Sales API

Enterprise‑style Fastify + TypeScript backend for the 1‑week learning challenge. The goal is to learn Fastify quickly, apply modern Node.js practices, and deliver a clean, documented REST API for sales data (customers, products, sales).

## Challenge Overview

This project implements the **1 Week JavaScript Backend Challenge** with a focus on:

- Rapid learning and application of a new backend framework
- Clean architecture and code organization
- Practical REST API design and documentation
- Modern TypeScript usage and tooling

## Status

- Current: Customer + Product CRUD, Sales CRUD, monthly sales query, Swagger docs, seeding, and API tests

## Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL
- Prisma
- Zod
- Vitest

## Quick Start

### 1) Start PostgreSQL (Docker)

```bash
docker compose up -d
```

If your Windows shell doesn't recognize `docker compose`:

```bash
docker-compose up -d
```

### 2) Install deps + run server

```bash
npm install
npm run dev
```

Server starts on:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`

## Environment

Create a `.env` file (see `.env.example`):

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (default: `postgresql://postgres:postgres@localhost:5433/sales_db`)

## Data Model

- `Customer` (id, name, email, phone, createdAt, updatedAt)
- `Product` (id, name, description, sku, price, createdAt, updatedAt)
- `Sale` (id, customerId, productId, quantity, saleDate, createdAt, updatedAt)

## API Endpoints

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

Seed customers and products:

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
