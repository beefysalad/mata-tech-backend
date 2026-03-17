# Learning Notes

A running log of things I've learned while building this project.

## Fastify
- Routes can be defined in two ways: shorthand methods like `server.get(...)` (HTTP method helpers like express) and the object-based `server.route({...})` API.
- Fastify supports passing a `schema` for routes, which is automatically handled for validation/serialization.
- Route `schema` can also power OpenAPI/Swagger docs when using Swagger plugins.

Example:

```ts
// Shorthand
server.get("/health", async () => ({ ok: true }));

// Object-based route with schema
server.route({
  method: "GET",
  url: "/health",
  schema: {
    response: {
      200: {
        type: "object",
        properties: { ok: { type: "boolean" } },
        required: ["ok"],
      },
    },
  },
  handler: async () => ({ ok: true }),
});
```

## PostgreSQL
- Keep Docker limited to the database for local dev; run the Fastify app via `npm run dev`.

## Prisma
- Prisma Client types are compile-time only; they can't be used as Fastify `schema.response` directly.
- Prisma singleton in dev avoids multiple client instances on reload.
- With the generated client in this repo, Prisma requires a driver adapter (`@prisma/adapter-pg`) and `DATABASE_URL`.
- Seed scripts are easiest via `prisma/seed.ts` with Faker for realistic data.
- Product seeding requires required fields (`sku`, `description`, `price`) to match schema constraints.

## Zod
- Using Zod schemas in Fastify routes enables runtime validation and powers Swagger docs.
- `z.string().email()` is the correct email validator (not `z.email()`).
- Swagger JSON generation will crash if you pass plain objects instead of Zod schemas.

## Docker
- Running only Postgres in Docker keeps dev iteration faster; the API runs locally.

## API Design
- Explicitly set status codes (e.g., `reply.code(201)`) so responses match docs.
- Group Swagger routes using `tags` in route schemas (e.g., "Customers").

## Postman
- Postman can sync collections/environments directly to the repo; store them under `postman/`.

## Testing
- Fastify route tests can use `app.inject` without running a real server.
- Vitest is a lightweight option for API tests in Node.
- Added API tests for products (CRUD) alongside customers.

## Resources
```text
https://www.youtube.com/watch?v=btGtOue1oDA - Fastify Course 🚀 The Performant Node.js Web Framework
https://www.youtube.com/watch?v=ZHLB4StAqPM - Learn Just Enough Fastify to be Productive
https://fastify.dev/docs/latest/
https://www.prisma.io/fastify
https://fastify.dev/docs/latest/Guides/Database/
```
