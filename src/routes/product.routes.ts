import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createProductController,
  deleteProductByIdController,
  getAllProductController,
  updateProductByIdController,
} from "../controllers/product.controller.js";
import {
  createProductRouteSchema,
  deleteProductByIdRouteSchema,
  getAllProductRouteSchema,
  updateProductByIdRouteSchema,
} from "../schemas/product.schema.js";

export async function productRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post("/", { schema: createProductRouteSchema }, createProductController);

  app.get("/", { schema: getAllProductRouteSchema }, getAllProductController);

  app.delete(
    "/:id",
    { schema: deleteProductByIdRouteSchema },
    deleteProductByIdController,
  );

  app.put(
    "/:id",
    { schema: updateProductByIdRouteSchema },
    updateProductByIdController,
  );
}
