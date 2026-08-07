import { z } from "zod";

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30, "Phone number must be at most 30 characters.")
  .refine(
    (value) =>
      value.length === 0 || /^[+]?[0-9\s().-]{7,30}$/.test(value),
    "Enter a valid phone number.",
  )
  .transform((value) => value || undefined);

export const SubscriberSignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name must be at most 100 characters."),

    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Enter a valid email address.")
      .toLowerCase(),

    phone: optionalPhoneSchema,

    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be at most 100 characters.")
      .regex(/[A-Za-z]/, "Password must contain at least one letter.")
      .regex(/[0-9]/, "Password must contain at least one number."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type SubscriberSignUpInput = z.infer<
  typeof SubscriberSignUpSchema
>;
