import type { FastifyRequest, FastifyReply } from "fastify";

export async function healthController(
  _request: FastifyRequest,
  _reply: FastifyReply
) {
  return { ok: true };
}
