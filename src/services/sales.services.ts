import { AppError } from "../errors/app-error.js";
import { mapPrismaError } from "../errors/prisma-error.js";
import {
  createSaleRepository,
  getSalesByMonthRepository,
  getSalesByMonthSummaryRepository,
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
  const summaryRows = await getSalesByMonthSummaryRepository(from, to);
  const buildSummary = (rows: typeof summaryRows) => {
    let totalQuantity = 0;
    let totalRevenue = 0;
    const customerMap = new Map<
      string,
      {
        customerId: string;
        customerName: string;
        totalQuantity: number;
        totalRevenue: number;
        totalSales: number;
      }
    >();
    const productMap = new Map<
      string,
      {
        productId: string;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
        totalSales: number;
      }
    >();
    const dayRevenueMap = new Map<string, number>();

    for (const row of rows) {
      const price = Number(
        (row.product?.price as unknown as { toString: () => string })?.toString?.() ??
          row.product?.price ??
          0,
      );
      const revenue = row.quantity * price;
      totalQuantity += row.quantity;
      totalRevenue += revenue;

      const dayKey = row.saleDate.toISOString().slice(0, 10);
      dayRevenueMap.set(dayKey, (dayRevenueMap.get(dayKey) ?? 0) + revenue);

      if (row.customer) {
        const existingCustomer = customerMap.get(row.customer.id);
        if (existingCustomer) {
          existingCustomer.totalQuantity += row.quantity;
          existingCustomer.totalRevenue += revenue;
          existingCustomer.totalSales += 1;
        } else {
          customerMap.set(row.customer.id, {
            customerId: row.customer.id,
            customerName: row.customer.name,
            totalQuantity: row.quantity,
            totalRevenue: revenue,
            totalSales: 1,
          });
        }
      }

      if (row.product) {
        const existingProduct = productMap.get(row.product.id);
        if (existingProduct) {
          existingProduct.totalQuantity += row.quantity;
          existingProduct.totalRevenue += revenue;
          existingProduct.totalSales += 1;
        } else {
          productMap.set(row.product.id, {
            productId: row.product.id,
            productName: row.product.name,
            totalQuantity: row.quantity,
            totalRevenue: revenue,
            totalSales: 1,
          });
        }
      }
    }

    const customerTotals = Array.from(customerMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue,
    );
    const productTotals = Array.from(productMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue,
    );

    const peakEntry = Array.from(dayRevenueMap.entries()).reduce<
      { day: string; revenue: number } | null
    >((best, [day, revenue]) => {
      if (!best || revenue > best.revenue) return { day, revenue };
      return best;
    }, null);

    return {
      totalSales: rows.length,
      totalQuantity,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      peakDay: peakEntry?.day ?? null,
      peakRevenue: Number((peakEntry?.revenue ?? 0).toFixed(2)),
      topCustomers: customerTotals.slice(0, 5),
      topProducts: productTotals.slice(0, 5),
    };
  };

  const currentSummary = buildSummary(summaryRows);

  return {
    sales,
    limit,
    offset,
    summary: {
      ...currentSummary,
    },
  };
};
