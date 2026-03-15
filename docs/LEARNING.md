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
- 

## Prisma
- 

## Zod
- Using Zod schemas in Fastify routes enables runtime validation and powers Swagger docs.

## Docker
- 

## API Design
- 
