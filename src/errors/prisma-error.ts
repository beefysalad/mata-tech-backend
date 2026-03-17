import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./app-error.js";

type PrismaErrorMap = Record<string, { statusCode: number; message: string }>;

const DEFAULT_MAP: PrismaErrorMap = {
  P2002: { statusCode: 409, message: "Unique constraint failed" },
  P2025: { statusCode: 404, message: "Record not found" },
  P2003: { statusCode: 400, message: "Invalid foreign key" },
};

export function mapPrismaError(
  error: unknown,
  overrides: PrismaErrorMap = {},
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const map = { ...DEFAULT_MAP, ...overrides };
    const mapped = map[error.code];
    if (mapped) {
      return new AppError(mapped.message, mapped.statusCode);
    }
  }
  return null;
}
