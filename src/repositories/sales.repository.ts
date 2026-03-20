import { AppError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import type { CreateSaleType } from "../schemas/sales.schema.js";

export const createSaleRepository = async (data: CreateSaleType) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
      select: { stock: true },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stock < data.quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    await tx.product.update({
      where: { id: data.productId },
      data: {
        stock: { decrement: data.quantity },
      },
    });

    return await tx.sale.create({
      data: {
        customerId: data.customerId,
        productId: data.productId,
        quantity: data.quantity,
        saleDate: new Date(data.saleDate),
      },
    });
  });
};

export const getSalesByMonthRepository = async (
  from: Date,
  to: Date,
  limit: number,
  offset: number,
) => {
  return await prisma.sale.findMany({
    where: {
      saleDate: {
        gte: from,
        lt: to,
      },
    },
    take: limit,
    skip: offset,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
        },
      },
    },
    orderBy: {
      saleDate: "asc",
    },
  });
};

export const getSalesByMonthSummaryRepository = async (
  from: Date,
  to: Date,
) => {
  // Summary query intentionally fetches all sales for the month (no pagination).
  return await prisma.sale.findMany({
    where: {
      saleDate: {
        gte: from,
        lt: to,
      },
    },
    select: {
      id: true,
      quantity: true,
      saleDate: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
