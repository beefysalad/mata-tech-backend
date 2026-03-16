import { Prisma } from "../generated/prisma/client.js";
import {
  createCustomerRepository,
  deleteCustomerByIdRepository,
  getAllCustomerRepository,
  updateCustomerByIdRepository,
} from "../repositories/customer.repository.js";
import type {
  CreateCustomerType,
  UpdateCustomerBody,
} from "../schemas/customer.schema.js";

export const createCustomerService = async (data: CreateCustomerType) => {
  try {
    return await createCustomerRepository(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Customer already exists");
    }
    throw error;
  }
};

export const getAllCustomerService = async () => {
  try {
    return await getAllCustomerRepository();
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Customer not found");
    }
    throw error;
  }
};

export const deleteCustomerByIdService = async (id: string) => {
  try {
    return await deleteCustomerByIdRepository(id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Customer not found");
    }
    throw error;
  }
};
