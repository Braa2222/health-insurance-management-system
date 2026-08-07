import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Enter a valid email address.")
    .toLowerCase(),

  password: z.string().min(1, "Password is required."),
});

export type SignInInput = z.infer<typeof SignInSchema>;
