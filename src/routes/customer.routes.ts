import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createCustomerController,
  deleteCustomerByIdController,
  getAllCustomerController,
  updateCustomerByIdController,
} from "../controllers/customer.controller.js";
import {
  createCustomerRouteSchema,
  deleteCustomerByIdRouteSchema,
  getAllCustomerRouteSchema,
  updateCustomerByIdRouteSchema,
} from "../schemas/customer.schema.js";

export async function customerRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post(
    "/",
    { schema: createCustomerRouteSchema },
    createCustomerController,
  );

  app.get("/", { schema: getAllCustomerRouteSchema }, getAllCustomerController);

  app.delete(
    "/:id",
    { schema: deleteCustomerByIdRouteSchema },
    deleteCustomerByIdController,
  );

  app.put(
    "/:id",
    { schema: updateCustomerByIdRouteSchema },
    updateCustomerByIdController,
  );
}
