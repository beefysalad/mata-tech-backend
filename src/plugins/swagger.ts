import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

async function swaggerPluginImpl(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Fastify Sales API",
        version: "1.0.1",
        description: "Sales data API for the 1-week backend challenge",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUI, { routePrefix: "/api/docs" });
}

export const swaggerPlugin = fp(swaggerPluginImpl);
