import { prisma } from "../lib/prisma.js";
import type { CreateSaleType } from "../schemas/sales.schema.js";

export const createSaleRepository = async (data: CreateSaleType) => {
  return await prisma.sale.create({
    data: {
      customerId: data.customerId,
      productId: data.productId,
      quantity: data.quantity,
      saleDate: new Date(data.saleDate),
    },
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
