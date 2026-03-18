import cors from "@fastify/cors";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";

async function corsPluginImpl(app: FastifyInstance) {
  const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) =>
    origin.trim(),
  );

  await app.register(cors, {
    origin: corsOrigins?.length ? corsOrigins : true,
    credentials: true,
  });
}

export const corsPlugin = fp(corsPluginImpl);
