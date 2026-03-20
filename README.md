# Fastify Sales API

Enterprise‑style Fastify + TypeScript backend for the 1‑week JavaScript backend challenge. The goal is to learn Fastify quickly, apply modern Node.js practices, and deliver a clean, documented REST API for sales data.

## Challenge Summary (Condensed)

- Learn Fastify (or Koa) and build a REST API for sales data.
- Use a data model with **customers**, **products**, and **sales**.
- Core use case: query sales by month to see which customer bought which products.
- Bonus (optional): validation, authentication, error handling.

## Status

- Current: Customer + Product CRUD, Sales CRUD, monthly sales query, Swagger docs, seeding, API tests, JWT auth.
- Demo: A simple Next.js frontend was created for walkthroughs. Clone it here: `[GITHUB_LINK_HERE]` (replace later).

## Tech Stack

- Node.js + TypeScript
- Fastify
- PostgreSQL
- Prisma
- Zod
- Vitest

## Data Model

- `Admin` (id, email, passwordHash, createdAt, updatedAt)
- `Customer` (id, name, email, phone, createdAt, updatedAt)
- `Product` (id, name, description, sku, price, stock, createdAt, updatedAt)
- `Sale` (id, customerId, productId, quantity, saleDate, createdAt, updatedAt)

## Quick Start

### 1) Environment

Create a `.env` file (see `.env.example` if present):

Required:

- `DATABASE_URL`
- `JWT_SECRET`

Optional:

- `NODE_ENV`
- `PORT`
- `ADMIN_EMAIL` (used by seed)
- `ADMIN_PASSWORD` (used by seed)

Default Docker connection string:
`postgresql://postgres:postgres@localhost:5433/sales_db`

### 2) Install + Migrate

```bash
npm install
npm run migrate
```

### 3) (Optional) Seed

```bash
npm run seed
```

To seed an admin for login:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=admin123 npm run seed
```

### 4) Run the Server

```bash
npm run dev
```

Server:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`

### Docker (DB + App)

You can also run via docker with a one build command that starts up a postgresql instance, runs migration, and runs the application.

```bash
docker compose up --build
```

If your Windows shell doesn't recognize `docker compose`:

```bash
docker-compose up --build
```

## API Endpoints

### Required (Challenge)

**Customers**

- `POST /api/customers`
- `GET /api/customers?limit=50&offset=0`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

**Products**

- `POST /api/products`
- `GET /api/products?limit=50&offset=0`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

**Sales**

- `POST /api/sales`
- `GET /api/sales?month=YYYY-MM`

### Bonus / Extra (Added)

- `POST /api/auth/signup` (create admin + JWT)
- `POST /api/auth/login` (JWT login for admin)
- `GET /api/products/summary` (aggregates total stock, low stock, and average price)

Swagger is the source of truth for request/response contracts:
`http://localhost:3000/api/docs`

## Authentication

All `/api/*` routes are protected by JWT except:

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/health`
- `GET /api/test/:name`
- `GET /api/docs`

Use the token as:

`Authorization: Bearer <token>`

## Example Requests

Create a sale:

```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "customerId": "cust_123",
    "productId": "prod_456",
    "quantity": 2,
    "saleDate": "2024-06-15T10:00:00.000Z"
  }'
```

Get sales for a month (with pagination):

```bash
curl "http://localhost:3000/api/sales?month=2024-06&limit=50&offset=0" \
  -H "Authorization: Bearer <token>"
```

## Postman

Postman collections and environments are stored in `postman/` and synced via Postman’s Git integration.

- Collection: `postman/collections/Fastify Sales API.postman_collection.json`
- Environment: `postman/environments/New_Environment.postman_environment.json`

## Testing

API tests run via Vitest + Fastify `inject`:

```bash
npm test
```

## Architecture

This repo follows an enterprise‑style layout:

- `src/routes/` — HTTP routing
- `src/controllers/` — request/response handling
- `src/services/` — business logic
- `src/repositories/` — data access
- `src/schemas/` — validation + Swagger schema
- `src/plugins/` — Fastify plugins (Swagger, auth, etc.)

## Docs

- `docs/TIMELINE.md` — progress timeline
- `docs/LEARNING.md` — learning notes

## Contributing

See `CONTRIBUTING.md` for workflow and style.
