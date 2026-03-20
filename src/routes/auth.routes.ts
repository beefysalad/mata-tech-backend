import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginController, signupController } from "../controllers/auth.controller.js";
import { loginRouteSchema, signupRouteSchema } from "../schemas/auth.schema.js";

export async function authRoutes(server: FastifyInstance) {
  const app = server.withTypeProvider<ZodTypeProvider>();

  app.post("/login", { schema: loginRouteSchema }, loginController);
  app.post("/signup", { schema: signupRouteSchema }, signupController);
}
