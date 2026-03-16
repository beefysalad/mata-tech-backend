import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { healthRoutes } from "./routes/health.routes.js";
import { customerRoutes } from "./routes/customer.routes.js";
import { swaggerPlugin } from "./plugins/swagger.js";

export function buildServer() {
  const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.register(swaggerPlugin);

  server.register(customerRoutes, { prefix: "/api/customers" });

  server.register(healthRoutes, { prefix: "/api" });

  return server;
}
