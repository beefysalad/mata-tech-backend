import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../src/app.js";
import { createAdminAndLogin } from "./helpers/auth.js";

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
  let authToken: string | undefined;
  let adminId: string | undefined;

  beforeAll(async () => {
    await app.ready();
    prisma = (await import("../src/lib/prisma.js")).prisma;
    const auth = await createAdminAndLogin(app, prisma);
    authToken = auth.token;
    adminId = auth.adminId;
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
        stock: 10,
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
      if (adminId) {
        await prisma.admin.delete({ where: { id: adminId } });
      }
    }
    await app.close();
  });

  it("creates a sale", async () => {
    const saleDate = new Date(Date.UTC(2026, 2, 15, 12, 0, 0)).toISOString();
    const response = await app.inject({
      method: "POST",
      url: "/api/sales/",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
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

  it("rejects sale when stock is insufficient", async () => {
    const saleDate = new Date(Date.UTC(2026, 2, 15, 12, 0, 0)).toISOString();
    const response = await app.inject({
      method: "POST",
      url: "/api/sales/",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        customerId,
        productId,
        quantity: 999,
        saleDate,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("lists sales by month with pagination", async () => {
    const month = "2026-03";

    const response = await app.inject({
      method: "GET",
      url: `/api/sales/?month=${month}&limit=50&offset=0`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body.sales)).toBe(true);
    expect(body.limit).toBe(50);
    expect(body.offset).toBe(0);
    if (saleId) {
      const match = body.sales.find(
        (sale: { id: string }) => sale.id === saleId,
      );
      expect(match).toBeDefined();
    }
  });
});
