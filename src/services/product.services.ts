import { Prisma } from "../generated/prisma/client.js";
import {
  createProductRepository,
  deleteProductByIdRepository,
  getAllProductRepository,
  updateProductByIdRepository,
} from "../repositories/product.repository.js";
import type {
  CreateProductType,
  UpdateProductBody,
} from "../schemas/product.schema.js";

export const createProductService = async (data: CreateProductType) => {
  try {
    return await createProductRepository(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Product already exists");
    }
    throw error;
  }
};

export const getAllProductService = async () => {
  try {
    return await getAllProductRepository();
  } catch (error) {
    throw error;
  }
};

export const updateProductByIdService = async (
  id: string,
  data: UpdateProductBody,
) => {
  try {
    return await updateProductByIdRepository(id, data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Product not found");
    }
    throw error;
  }
};

export const deleteProductByIdService = async (id: string) => {
  try {
    return await deleteProductByIdRepository(id);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("Product not found");
    }
    throw error;
  }
};
