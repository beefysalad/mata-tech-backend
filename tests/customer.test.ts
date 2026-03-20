import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildServer } from "../src/app.js";
import { createAdminAndLogin } from "./helpers/auth.js";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIf = hasDatabaseUrl ? describe : describe.skip;

describeIf("customers API", () => {
  const app = buildServer();
  const testEmail = `test-${Date.now()}@example.com`;
  let createdCustomerId: string | undefined;
  let authToken: string | undefined;
  let adminId: string | undefined;
  let prisma:
    | typeof import("../src/lib/prisma.js").prisma
    | undefined = undefined;

  beforeAll(async () => {
    await app.ready();
    prisma = (await import("../src/lib/prisma.js")).prisma;
    const auth = await createAdminAndLogin(app, prisma);
    authToken = auth.token;
    adminId = auth.adminId;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.customer.deleteMany({
        where: { email: testEmail },
      });
      if (adminId) {
        await prisma.admin.delete({ where: { id: adminId } });
      }
    }
    await app.close();
  });

  it("creates a customer", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/customers/",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
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

  it("rejects invalid customer payload", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/customers/",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: "",
        email: "not-an-email",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects duplicate customer email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/customers/",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: "Dup Customer",
        email: testEmail,
      },
    });

    expect(response.statusCode).toBe(409);
  });

  it("lists customers", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/customers/?limit=1&offset=0",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body.customers)).toBe(true);
    expect(body.limit).toBe(1);
    expect(body.offset).toBe(0);
    // Created customer may not be on the first page if the dataset is large.
  });

  it("updates a customer", async () => {
    if (!createdCustomerId) {
      throw new Error("Missing customer id from create test");
    }

    const response = await app.inject({
      method: "PUT",
      url: `/api/customers/${createdCustomerId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
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

  it("returns 404 when updating missing customer", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/api/customers/nonexistent",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        name: "Should Fail",
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it("deletes a customer", async () => {
    if (!createdCustomerId) {
      throw new Error("Missing customer id from create test");
    }

    const response = await app.inject({
      method: "DELETE",
      url: `/api/customers/${createdCustomerId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.customer).toBeDefined();
    expect(body.customer.id).toBe(createdCustomerId);

    createdCustomerId = undefined;
  });

  it("returns 404 when deleting missing customer", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/api/customers/nonexistent",
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
