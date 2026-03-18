import { z } from "zod";

const priceSchema = z.preprocess((value) => {
  if (typeof value === "number") return value;
  if (
    value &&
    typeof (value as { toString: () => string }).toString === "function"
  ) {
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
  stock: z.number().int().min(0),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const createProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional(),
});

export const updateProductBodySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
});

export const productByIdParamsSchema = z.object({
  id: productIdSchema,
});

export const getProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type CreateProductType = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type ProductByIdParams = z.infer<typeof productByIdParamsSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;

const productResponseSchema = z.object({ product: productSchema });
const productsResponseSchema = z.object({
  products: z.array(productSchema),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
});

const productSummarySchema = z.object({
  totalProducts: z.number().int().min(0),
  totalStock: z.number().int().min(0),
  lowStock: z.number().int().min(0),
  averagePrice: z.number().min(0),
});

const productSummaryResponseSchema = z.object({
  summary: productSummarySchema,
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
  querystring: getProductsQuerySchema,
  response: {
    200: productsResponseSchema,
  },
};

export const getProductByIdRouteSchema = {
  tags: ["Products"],
  params: productByIdParamsSchema,
  response: {
    200: productResponseSchema,
  },
};

export const getProductSummaryRouteSchema = {
  tags: ["Products"],
  response: {
    200: productSummaryResponseSchema,
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
