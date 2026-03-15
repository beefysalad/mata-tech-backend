import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const server = fastify({
  logger: true,
});

await server.register(swagger, {
  openapi: {
    info: {
      title: "Fastify - Mata Sales API",
      version: "1.0.0",
      description: "Sales data API for the 1-week backend challenge",
    },
  },
});

await server.register(swaggerUI, {
  routePrefix: "/docs",
});

server.get("/", async (request, reply) => {
  return {
    message: "HELLO WORLD!",
  };
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
