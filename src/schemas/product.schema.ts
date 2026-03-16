import { z } from "zod";

const priceSchema = z.preprocess((value) => {
  if (typeof value === "number") return value;
  if (value && typeof (value as { toString: () => string }).toString === "function") {
    return Number((value as { toString: () => string }).toString());
  }
  return value;
}, z.number());

const dateTimeSchema = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString();
  return value;
}, z.string().datetime());

const productIdSchema = z.string().min(1);

export const productSchema = z.object({
  id: productIdSchema,
  name: z.string(),
  description: z.string(),
  sku: z.string(),
  price: priceSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const createProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
});

export const updateProductBodySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().positive().optional(),
});

export const productByIdParamsSchema = z.object({
  id: productIdSchema,
});

export type CreateProductType = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type ProductByIdParams = z.infer<typeof productByIdParamsSchema>;

const productResponseSchema = z.object({ product: productSchema });
const productsResponseSchema = z.object({
  products: z.array(productSchema),
});

export const createProductRouteSchema = {
  tags: ["Products"],
  body: createProductBodySchema,
  response: {
    201: productResponseSchema,
  },
};

export const getAllProductRouteSchema = {
  tags: ["Products"],
  response: {
    200: productsResponseSchema,
  },
};

export const deleteProductByIdRouteSchema = {
  tags: ["Products"],
  params: productByIdParamsSchema,
  response: {
    200: productResponseSchema,
  },
};

export const updateProductByIdRouteSchema = {
  tags: ["Products"],
  params: productByIdParamsSchema,
  body: updateProductBodySchema,
  response: {
    200: productResponseSchema,
  },
};
