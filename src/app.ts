import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { healthRoutes } from "./routes/health.routes.js";

export function buildServer() {
  const server = fastify({ logger: true });

  server.register(swagger, {
    openapi: {
      info: {
        title: "Fastify Sales API",
        version: "1.0.1",
        description: "Sales data API for the 1-week backend challenge",
      },
    },
  });

  server.register(swaggerUI, { routePrefix: "/docs" });

  server.register(healthRoutes, { prefix: "/api" });

  return server;
}
