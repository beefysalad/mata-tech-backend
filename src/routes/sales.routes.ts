import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createSaleController,
  getSalesByMonthController,
} from "../controllers/sales.controller.js";
import {
  createSaleRouteSchema,
  getSalesByMonthRouteSchema,
} from "../schemas/sales.schema.js";

export async function salesRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post("/", { schema: createSaleRouteSchema }, createSaleController);

  app.get("/", { schema: getSalesByMonthRouteSchema }, getSalesByMonthController);
}
