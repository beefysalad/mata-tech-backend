import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CreateCustomerType,
  CustomerByIdParams,
  UpdateCustomerBody,
} from "../schemas/customer.schema.js";
import {
  createCustomerService,
  deleteCustomerByIdService,
  getAllCustomerService,
  updateCustomerByIdService,
} from "../services/customer.services.js";

//CREATE
export async function createCustomerController(
  _request: FastifyRequest<{ Body: CreateCustomerType }>,
  _reply: FastifyReply,
) {
  const { email, name } = _request.body;
  const customer = await createCustomerService({ email, name });
  return _reply.code(201).send({ customer });
}

//READ
export async function getAllCustomerController(
  _request: FastifyRequest,
  _reply: FastifyReply,
) {
  const customers = await getAllCustomerService();
  return _reply.code(200).send({ customers });
}

//UPDATE
export async function updateCustomerByIdController(
  _request: FastifyRequest<{
    Params: CustomerByIdParams;
    Body: UpdateCustomerBody;
  }>,
  _reply: FastifyReply,
) {
  const { id } = _request.params;
  const customer = await updateCustomerByIdService(id, _request.body);
  return _reply.code(200).send({ customer });
}

//DELETE
export async function deleteCustomerByIdController(
  _request: FastifyRequest<{ Params: CustomerByIdParams }>,
  _reply: FastifyReply,
) {
  const { id } = _request.params;
  const customer = await deleteCustomerByIdService(id);
  return _reply.code(200).send({ customer });
}
