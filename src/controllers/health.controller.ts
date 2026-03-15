import type { FastifyRequest, FastifyReply } from "fastify";

export async function healthController(
  _request: FastifyRequest,
  _reply: FastifyReply,
) {
  return { ok: true };
}

type TestParams = {
  name: string;
};

export async function testController(
  request: FastifyRequest<{ Params: TestParams }>,
  _reply: FastifyReply,
) {
  const { name } = request.params;
  return { message: `Hello ${name}` };
}
