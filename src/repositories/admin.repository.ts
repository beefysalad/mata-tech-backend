import type { Admin } from "../generated/prisma/browser.js";
import { prisma } from "../lib/prisma.js";

export const findAdminByEmailRepository = async (
  email: string,
): Promise<Admin | null> => {
  return await prisma.admin.findUnique({
    where: { email },
  });
};

export const createAdminRepository = async (
  email: string,
  passwordHash: string,
): Promise<Admin> => {
  return await prisma.admin.create({
    data: { email, passwordHash },
  });
};
