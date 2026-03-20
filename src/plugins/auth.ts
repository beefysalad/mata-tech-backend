import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";

const publicPrefixes = [
  "/api/health",
  "/api/test",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/docs",
];

async function authPluginImpl(app: FastifyInstance) {
  const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
  await app.register(jwt, { secret: jwtSecret });

  app.addHook("onRequest", async (request, reply) => {
    if (request.method === "OPTIONS") return;

    if (publicPrefixes.some((path) => request.url.startsWith(path))) {
      return;
    }

    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });
}

export const authPlugin = fp(authPluginImpl);
