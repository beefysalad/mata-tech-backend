import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { healthRoutes } from "./routes/health.routes.js";
import { customerRoutes } from "./routes/customer.routes.js";

export function buildServer() {
  const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.register(swagger, {
    openapi: {
      info: {
        title: "Fastify Sales API",
        version: "1.0.1",
        description: "Sales data API for the 1-week backend challenge",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(swaggerUI, { routePrefix: "/api/docs" });

  server.register(customerRoutes, { prefix: "/api/customers" });

  server.register(healthRoutes, { prefix: "/api" });

  return server;
}
