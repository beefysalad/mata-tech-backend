import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CreateProductType,
  GetProductsQuery,
  ProductByIdParams,
  UpdateProductBody,
} from "../schemas/product.schema.js";
import {
  createProductService,
  deleteProductByIdService,
  getAllProductService,
  getProductByIdService,
  updateProductByIdService,
} from "../services/product.services.js";

// CREATE
export async function createProductController(
  _request: FastifyRequest<{ Body: CreateProductType }>,
  _reply: FastifyReply,
) {
  const { name, description, sku, price, stock } = _request.body;
  const product = await createProductService({
    name,
    description,
    sku,
    price,
    ...(stock !== undefined && { stock }),
  });
  return _reply.code(201).send({ product });
}

// READ
export async function getAllProductController(
  _request: FastifyRequest<{ Querystring: GetProductsQuery }>,
  _reply: FastifyReply,
) {
  const result = await getAllProductService(_request.query);
  return _reply.code(200).send(result);
}

export async function getProductByIdController(
  _request: FastifyRequest<{ Params: ProductByIdParams }>,
  _reply: FastifyReply,
) {
  const { id } = _request.params;
  const product = await getProductByIdService(id);
  return _reply.code(200).send({ product });
}

// UPDATE
export async function updateProductByIdController(
  _request: FastifyRequest<{
    Params: ProductByIdParams;
    Body: UpdateProductBody;
  }>,
  _reply: FastifyReply,
) {
  const { id } = _request.params;
  const product = await updateProductByIdService(id, _request.body);
  return _reply.code(200).send({ product });
}

// DELETE
export async function deleteProductByIdController(
  _request: FastifyRequest<{ Params: ProductByIdParams }>,
  _reply: FastifyReply,
) {
  const { id } = _request.params;
  const product = await deleteProductByIdService(id);
  return _reply.code(200).send({ product });
}
