import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../src/app.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIf = hasDatabaseUrl ? describe : describe.skip;

describeIf("customers API", () => {
  const app = buildServer();
  const testEmail = `test-${Date.now()}@example.com`;
  let createdCustomerId: string | undefined;
  let prisma:
    | typeof import("../src/lib/prisma.js").prisma
    | undefined = undefined;

  beforeAll(async () => {
    await app.ready();
    prisma = (await import("../src/lib/prisma.js")).prisma;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.customer.deleteMany({
        where: { email: testEmail },
      });
    }
    await app.close();
  });

  it("creates a customer", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/customers/",
      payload: {
        name: "Test Customer",
        email: testEmail,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.customer).toBeDefined();
    expect(body.customer.email).toBe(testEmail);
    createdCustomerId = body.customer.id;
  });

  it("lists customers", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/customers/",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body.customers)).toBe(true);
    if (createdCustomerId) {
      const match = body.customers.find(
        (customer: { id: string }) => customer.id === createdCustomerId,
      );
      expect(match).toBeDefined();
    }
  });

  it("updates a customer", async () => {
    if (!createdCustomerId) {
      throw new Error("Missing customer id from create test");
    }

    const response = await app.inject({
      method: "PUT",
      url: `/api/customers/${createdCustomerId}`,
      payload: {
        name: "Updated Customer",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.customer).toBeDefined();
    expect(body.customer.id).toBe(createdCustomerId);
    expect(body.customer.name).toBe("Updated Customer");
  });

  it("deletes a customer", async () => {
    if (!createdCustomerId) {
      throw new Error("Missing customer id from create test");
    }

    const response = await app.inject({
      method: "DELETE",
      url: `/api/customers/${createdCustomerId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.customer).toBeDefined();
    expect(body.customer.id).toBe(createdCustomerId);

    createdCustomerId = undefined;
  });
});
