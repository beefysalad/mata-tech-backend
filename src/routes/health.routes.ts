import type { FastifyInstance } from "fastify";
import { healthController } from "../controllers/health.controller.js";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", healthController);
}
