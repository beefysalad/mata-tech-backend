import { AppError } from "../errors/app-error.js";
import { mapPrismaError } from "../errors/prisma-error.js";
import {
  createCustomerRepository,
  deleteCustomerByIdRepository,
  getAllCustomerRepository,
  updateCustomerByIdRepository,
} from "../repositories/customer.repository.js";
import type {
  CreateCustomerType,
  GetCustomersQuery,
  UpdateCustomerBody,
} from "../schemas/customer.schema.js";

export const createCustomerService = async (data: CreateCustomerType) => {
  try {
    return await createCustomerRepository(data);
  } catch (error) {
    const mapped = mapPrismaError(error, {
      P2002: { statusCode: 409, message: "Customer already exists" },
    });
    if (mapped) throw mapped;
    throw error;
  }
};

export const getAllCustomerService = async (query: GetCustomersQuery) => {
  try {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;
    const customers = await getAllCustomerRepository(limit, offset);
    return { customers, limit, offset };
  } catch (error) {
    throw error;
  }
};

export const updateCustomerByIdService = async (
  id: string,
  data: UpdateCustomerBody,
) => {
  try {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.phone) {
      updateData.phone = data.phone;
    }

    return await updateCustomerByIdRepository(id, updateData);
  } catch (error) {
    const mapped = mapPrismaError(error, {
      P2025: { statusCode: 404, message: "Customer not found" },
    });
    if (mapped) throw mapped;
    throw error;
  }
};

export const deleteCustomerByIdService = async (id: string) => {
  try {
    return await deleteCustomerByIdRepository(id);
  } catch (error) {
    const mapped = mapPrismaError(error, {
      P2025: { statusCode: 404, message: "Customer not found" },
    });
    if (mapped) throw mapped;
    throw error;
  }
};
