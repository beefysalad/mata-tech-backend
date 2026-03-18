import type { Customer } from "../generated/prisma/browser.js";
import { prisma } from "../lib/prisma.js";
import type {
  CreateCustomerType,
  UpdateCustomerBody,
} from "../schemas/customer.schema.js";

export const createCustomerRepository = async (
  data: CreateCustomerType,
): Promise<Customer> => {
  return await prisma.customer.create({
    data,
  });
};

export const getAllCustomerRepository = async (
  limit: number,
  offset: number,
): Promise<Customer[] | []> => {
  return await prisma.customer.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteCustomerByIdRepository = async (
  id: string,
): Promise<Customer | null> => {
  return await prisma.customer.delete({
    where: {
      id,
    },
  });
};

export const updateCustomerByIdRepository = async (
  id: string,
  data: UpdateCustomerBody,
) => {
  return await prisma.customer.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
    },
  });
};

export const findCustomerByEmailRepository = async (
  email: string,
): Promise<Customer | null> => {
  return await prisma.customer.findUnique({
    where: {
      email,
    },
  });
};
