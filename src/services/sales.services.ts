import { Prisma } from "../generated/prisma/client.js";
import {
  createSaleRepository,
  getSalesByMonthRepository,
} from "../repositories/sales.repository.js";
import type {
  CreateSaleType,
  GetSalesByMonthQuery,
} from "../schemas/sales.schema.js";

export const createSaleService = async (data: CreateSaleType) => {
  try {
    return await createSaleRepository(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("Invalid customer or product");
    }
    throw error;
  }
};

export const getSalesByMonthService = async (
  query: GetSalesByMonthQuery,
) => {
  const [yearStr, monthStr] = query.month.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const to = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const limit = query.limit ?? 50;
  const offset = query.offset ?? 0;

  const sales = await getSalesByMonthRepository(from, to, limit, offset);

  return {
    sales,
    limit,
    offset,
  };
};
