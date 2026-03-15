import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  healthController,
  testController,
} from "../controllers/health.controller.js";
import { healthRouteSchema, testRouteSchema } from "../schemas/health.schema.js";

export async function healthRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.get("/health", { schema: healthRouteSchema }, healthController);

  app.get("/test/:name", { schema: testRouteSchema }, testController);
}
