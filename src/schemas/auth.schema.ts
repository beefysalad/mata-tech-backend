import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const adminSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
});

export const loginRouteSchema = {
  tags: ["Auth"],
  body: loginBodySchema,
  response: {
    200: z.object({
      token: z.string().min(1),
      admin: adminSchema,
    }),
  },
};

export const signupRouteSchema = {
  tags: ["Auth"],
  body: signupBodySchema,
  response: {
    201: z.object({
      token: z.string().min(1),
      admin: adminSchema,
    }),
  },
};

export type LoginBody = z.infer<typeof loginBodySchema>;
export type SignupBody = z.infer<typeof signupBodySchema>;
