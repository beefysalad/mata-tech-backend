import { mapPrismaError } from "../errors/prisma-error.js";
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
    const mapped = mapPrismaError(error, {
      P2002: { statusCode: 409, message: "Product already exists" },
    });
    if (mapped) throw mapped;
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
    const mapped = mapPrismaError(error, {
      P2025: { statusCode: 404, message: "Product not found" },
    });
    if (mapped) throw mapped;
    throw error;
  }
};

export const deleteProductByIdService = async (id: string) => {
  try {
    return await deleteProductByIdRepository(id);
  } catch (error) {
    const mapped = mapPrismaError(error, {
      P2025: { statusCode: 404, message: "Product not found" },
    });
    if (mapped) throw mapped;
    throw error;
  }
};
