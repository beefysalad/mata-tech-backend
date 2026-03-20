import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { healthRoutes } from "./routes/health.routes.js";
import { customerRoutes } from "./routes/customer.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { salesRoutes } from "./routes/sales.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { swaggerPlugin } from "./plugins/swagger.js";
import { errorHandlerPlugin } from "./plugins/error-handler.js";
import { corsPlugin } from "./plugins/cors.js";
import { authPlugin } from "./plugins/auth.js";

export function buildServer() {
  const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.register(corsPlugin);

  server.register(swaggerPlugin);
  server.register(errorHandlerPlugin);

  server.register(authPlugin);

  server.register(authRoutes, { prefix: "/api/auth" });
  server.register(customerRoutes, { prefix: "/api/customers" });
  server.register(productRoutes, { prefix: "/api/products" });
  server.register(salesRoutes, { prefix: "/api/sales" });

  server.register(healthRoutes, { prefix: "/api" });

  return server;
}
