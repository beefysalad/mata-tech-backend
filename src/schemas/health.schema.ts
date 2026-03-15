import { z } from "zod";

export const healthResponseSchema = z.object({ ok: z.boolean() });

export const testParamsSchema = z.object({ name: z.string() });
export const testResponseSchema = z.object({ message: z.string() });

export const healthRouteSchema = {
  response: {
    200: healthResponseSchema,
  },
};

export const testRouteSchema = {
  params: testParamsSchema,
  response: {
    200: testResponseSchema,
  },
};
