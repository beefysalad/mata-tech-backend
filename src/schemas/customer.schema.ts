import { z } from "zod";

const customerIdSchema = z.string().min(1);
const dateTimeSchema = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString();
  return value;
}, z.string().datetime());

export const customerSchema = z.object({
  id: customerIdSchema,
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

export const createCustomerBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable(),
});

export const updateCustomerBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
});

export const customerByIdParamsSchema = z.object({
  id: customerIdSchema,
});

export const getCustomersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export type CreateCustomerType = z.infer<typeof createCustomerBodySchema>;
export type UpdateCustomerBody = z.infer<typeof updateCustomerBodySchema>;
export type CustomerByIdParams = z.infer<typeof customerByIdParamsSchema>;
export type GetCustomersQuery = z.infer<typeof getCustomersQuerySchema>;

const customerResponseSchema = z.object({ customer: customerSchema });
const customersResponseSchema = z.object({
  customers: z.array(customerSchema),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
});

export const createCustomerRouteSchema = {
  tags: ["Customers"],
  body: createCustomerBodySchema,
  response: {
    201: customerResponseSchema,
  },
};

export const getAllCustomerRouteSchema = {
  tags: ["Customers"],
  querystring: getCustomersQuerySchema,
  response: {
    200: customersResponseSchema,
  },
};

export const deleteCustomerByIdRouteSchema = {
  tags: ["Customers"],
  params: customerByIdParamsSchema,
  response: {
    200: customerResponseSchema,
  },
};

export const updateCustomerByIdRouteSchema = {
  tags: ["Customers"],
  params: customerByIdParamsSchema,
  body: updateCustomerBodySchema,
  response: {
    200: customerResponseSchema,
  },
};
