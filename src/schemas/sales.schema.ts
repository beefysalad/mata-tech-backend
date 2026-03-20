import { z } from "zod";

const dateTimeSchema = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString();
  return value;
}, z.string().datetime());

const saleIdSchema = z.string().min(1);

export const saleSchema = z.object({
  id: saleIdSchema,
  customerId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  saleDate: dateTimeSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const saleWithDetailsSchema = z.object({
  id: saleIdSchema,
  quantity: z.number().int().positive(),
  saleDate: dateTimeSchema,
  customer: z.object({
    id: z.string().min(1),
    name: z.string(),
    email: z.string().email(),
  }),
  product: z.object({
    id: z.string().min(1),
    name: z.string(),
    sku: z.string(),
    // Prisma Decimal -> number for consistent JSON output
    price: z.preprocess((value) => {
      if (typeof value === "number") return value;
      if (
        value &&
        typeof (value as { toString: () => string }).toString === "function"
      ) {
        return Number((value as { toString: () => string }).toString());
      }
      return value;
    }, z.number()),
  }),
});

const salesSummaryBaseSchema = z.object({
  totalSales: z.number().int().min(0),
  totalQuantity: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  // Derived from full-month totals (not paginated rows)
  peakDay: z.string().nullable(),
  peakRevenue: z.number().min(0),
});

const customerTotalsSchema = z.object({
  customerId: z.string().min(1),
  customerName: z.string(),
  totalQuantity: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  totalSales: z.number().int().min(0),
});

const productTotalsSchema = z.object({
  productId: z.string().min(1),
  productName: z.string(),
  totalQuantity: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  totalSales: z.number().int().min(0),
});

export const createSaleBodySchema = z.object({
  customerId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  saleDate: z.string().datetime(),
});

export const getSalesByMonthQuerySchema = z.object({
  // Month format required by the API (YYYY-MM)
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type CreateSaleType = z.infer<typeof createSaleBodySchema>;
export type GetSalesByMonthQuery = z.infer<typeof getSalesByMonthQuerySchema>;

export const createSaleRouteSchema = {
  tags: ["Sales"],
  body: createSaleBodySchema,
  response: {
    201: z.object({ sale: saleSchema }),
  },
};

export const getSalesByMonthRouteSchema = {
  tags: ["Sales"],
  querystring: getSalesByMonthQuerySchema,
  response: {
    200: z.object({
      sales: z.array(saleWithDetailsSchema),
      limit: z.number().int().min(1),
      offset: z.number().int().min(0),
      summary: salesSummaryBaseSchema.extend({
        topCustomers: z.array(customerTotalsSchema),
        topProducts: z.array(productTotalsSchema),
      }),
    }),
  },
};
