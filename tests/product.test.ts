import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../src/app.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIf = hasDatabaseUrl ? describe : describe.skip;

describeIf("products API", () => {
  const app = buildServer();
  const testSku = `SKU-TEST-${Date.now()}`;
  let createdProductId: string | undefined;
  let prisma:
    | typeof import("../src/lib/prisma.js").prisma
    | undefined = undefined;

  beforeAll(async () => {
    await app.ready();
    prisma = (await import("../src/lib/prisma.js")).prisma;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.product.deleteMany({
        where: { sku: testSku },
      });
    }
    await app.close();
  });

  it("creates a product", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/products/",
      payload: {
        name: "Test Product",
        description: "Test product description",
        sku: testSku,
        price: 49.99,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.product).toBeDefined();
    expect(body.product.sku).toBe(testSku);
    createdProductId = body.product.id;
  });

  it("lists products", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/products/",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body.products)).toBe(true);
    if (createdProductId) {
      const match = body.products.find(
        (product: { id: string }) => product.id === createdProductId,
      );
      expect(match).toBeDefined();
    }
  });

  it("updates a product", async () => {
    if (!createdProductId) {
      throw new Error("Missing product id from create test");
    }

    const response = await app.inject({
      method: "PUT",
      url: `/api/products/${createdProductId}`,
      payload: {
        name: "Updated Product",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.product).toBeDefined();
    expect(body.product.id).toBe(createdProductId);
    expect(body.product.name).toBe("Updated Product");
  });

  it("deletes a product", async () => {
    if (!createdProductId) {
      throw new Error("Missing product id from create test");
    }

    const response = await app.inject({
      method: "DELETE",
      url: `/api/products/${createdProductId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.product).toBeDefined();
    expect(body.product.id).toBe(createdProductId);

    createdProductId = undefined;
  });
});
