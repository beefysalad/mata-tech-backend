import { AppError } from "../errors/app-error.js";
import {
  createAdminRepository,
  findAdminByEmailRepository,
} from "../repositories/admin.repository.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import type { LoginBody, SignupBody } from "../schemas/auth.schema.js";

export const loginAdminService = async (payload: LoginBody) => {
  const admin = await findAdminByEmailRepository(payload.email);
  if (!admin) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await verifyPassword(payload.password, admin.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  return admin;
};

export const signupAdminService = async (payload: SignupBody) => {
  const existing = await findAdminByEmailRepository(payload.email);
  if (existing) {
    throw new AppError("Admin already exists", 409);
  }

  const passwordHash = await hashPassword(payload.password);
  return await createAdminRepository(payload.email, passwordHash);
};
