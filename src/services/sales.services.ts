import { AppError } from "../errors/app-error.js";
import { mapPrismaError } from "../errors/prisma-error.js";
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
    const mapped = mapPrismaError(error, {
      P2003: { statusCode: 400, message: "Invalid customer or product" },
    });
    if (mapped) throw mapped;
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
