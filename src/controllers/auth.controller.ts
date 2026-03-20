import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginBody, SignupBody } from "../schemas/auth.schema.js";
import {
  loginAdminService,
  signupAdminService,
} from "../services/auth.services.js";

export async function loginController(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const admin = await loginAdminService(request.body);
  // Use `sub` for subject to satisfy @fastify/jwt typing.
  const token = request.server.jwt.sign({
    role: "admin",
    sub: admin.id,
  });

  return reply.code(200).send({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  });
}

export async function signupController(
  request: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply,
) {
  const admin = await signupAdminService(request.body);
  // Use `sub` for subject to satisfy @fastify/jwt typing.
  const token = request.server.jwt.sign({
    role: "admin",
    sub: admin.id,
  });
  //test pr
  return reply.code(201).send({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  });
}
