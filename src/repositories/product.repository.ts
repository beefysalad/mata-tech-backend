import type { Product } from "../generated/prisma/browser.js";
import { prisma } from "../lib/prisma.js";
import type {
  CreateProductType,
  UpdateProductBody,
} from "../schemas/product.schema.js";

export const getProductByIdRepository = async (
  id: string,
): Promise<Product | null> => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export const createProductRepository = async (
  data: CreateProductType,
): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      sku: data.sku,
      price: data.price,
      ...(data.stock !== undefined && { stock: data.stock }),
    },
  });
};

export const getAllProductRepository = async (
  limit: number,
  offset: number,
): Promise<Product[] | []> => {
  return await prisma.product.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductSummaryRepository = async () => {
  const [aggregate, lowStock] = await Promise.all([
    prisma.product.aggregate({
      _sum: { stock: true },
      _avg: { price: true },
      _count: { _all: true },
    }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ]);

  return {
    totalProducts: aggregate._count._all ?? 0,
    totalStock: aggregate._sum.stock ?? 0,
    averagePrice: aggregate._avg.price ? aggregate._avg.price.toNumber() : 0,
    lowStock,
  };
};

export const deleteProductByIdRepository = async (
  id: string,
): Promise<Product> => {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
};

export const updateProductByIdRepository = async (
  id: string,
  data: UpdateProductBody,
): Promise<Product> => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
    },
  });
};
