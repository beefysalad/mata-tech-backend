import { hashPassword } from "../../src/lib/password.js";

export async function createAdminAndLogin(
  app: Awaited<ReturnType<typeof import("../../src/app.js").buildServer>>,
  prisma: typeof import("../../src/lib/prisma.js").prisma,
) {
  const adminEmail = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const adminPassword = "admin123";

  const passwordHash = await hashPassword(adminPassword);
  const admin = await prisma.admin.create({
    data: { email: adminEmail, passwordHash },
  });

  const loginResponse = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: adminEmail, password: adminPassword },
  });

  const token = loginResponse.json().token as string;

  return { token, adminId: admin.id, adminEmail };
}
