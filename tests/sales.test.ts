import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../src/app.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIf = hasDatabaseUrl ? describe : describe.skip;

describeIf("sales API", () => {
  const app = buildServer();
  let prisma:
    | typeof import("../src/lib/prisma.js").prisma
    | undefined = undefined;
  let customerId: string | undefined;
  let productId: string | undefined;
  let saleId: string | undefined;

  beforeAll(async () => {
    await app.ready();
    prisma = (await import("../src/lib/prisma.js")).prisma;
    const customer = await prisma.customer.create({
      data: {
        name: "Sales Test Customer",
        email: `sales-${Date.now()}@example.com`,
      },
    });
    const product = await prisma.product.create({
      data: {
        name: "Sales Test Product",
        description: "Sales test product description",
        sku: `SKU-SALES-${Date.now()}`,
        price: 19.99,
      },
    });
    customerId = customer.id;
    productId = product.id;
  });

  afterAll(async () => {
    if (prisma) {
      if (saleId) {
        await prisma.sale.deleteMany({ where: { id: saleId } });
      }
      if (productId) {
        await prisma.product.deleteMany({ where: { id: productId } });
      }
      if (customerId) {
        await prisma.customer.deleteMany({ where: { id: customerId } });
      }
    }
    await app.close();
  });

  it("creates a sale", async () => {
    const saleDate = new Date().toISOString();
    const response = await app.inject({
      method: "POST",
      url: "/api/sales/",
      payload: {
        customerId,
        productId,
        quantity: 2,
        saleDate,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.sale).toBeDefined();
    expect(body.sale.customerId).toBe(customerId);
    expect(body.sale.productId).toBe(productId);
    saleId = body.sale.id;
  });

  it("lists sales by month with pagination", async () => {
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    const response = await app.inject({
      method: "GET",
      url: `/api/sales/?month=${month}&limit=10&offset=0`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body.sales)).toBe(true);
    expect(body.limit).toBe(10);
    expect(body.offset).toBe(0);
    if (saleId) {
      const match = body.sales.find(
        (sale: { id: string }) => sale.id === saleId,
      );
      expect(match).toBeDefined();
    }
  });
});
