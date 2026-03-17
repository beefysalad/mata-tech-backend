import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CreateSaleType,
  GetSalesByMonthQuery,
} from "../schemas/sales.schema.js";
import {
  createSaleService,
  getSalesByMonthService,
} from "../services/sales.services.js";

// CREATE
export async function createSaleController(
  _request: FastifyRequest<{ Body: CreateSaleType }>,
  _reply: FastifyReply,
) {
  const sale = await createSaleService(_request.body);
  return _reply.code(201).send({ sale });
}

// READ (monthly sales)
export async function getSalesByMonthController(
  _request: FastifyRequest<{ Querystring: GetSalesByMonthQuery }>,
  _reply: FastifyReply,
) {
  const result = await getSalesByMonthService(_request.query);
  return _reply.code(200).send(result);
}
