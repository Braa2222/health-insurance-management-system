import { z } from "zod";

export const userRoleSchema = z.enum(
  ["SUBSCRIBER", "SYSTEM_ADMIN", "MEDICAL_SERVICE_PROVIDER"],
  {
    message: "Invalid user role.",
  },
);

export const medicalProviderTypeSchema = z.enum(
  ["HOSPITAL", "CLINIC", "LABORATORY", "RADIOLOGY_CENTER", "PHARMACY", "OTHER"],
  {
    message: "Invalid medical provider type.",
  },
);

export const userBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters."),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number must be at most 30 characters.")
    .optional(),
});

export const medicalProviderProfileBaseSchema = z.object({
  facilityName: z
    .string()
    .trim()
    .min(2, "Facility name must be at least 2 characters.")
    .max(150, "Facility name must be at most 150 characters."),

  providerType: medicalProviderTypeSchema,

  licenseNumber: z
    .string()
    .trim()
    .min(2, "License number must be at least 2 characters.")
    .max(100, "License number must be at most 100 characters."),

  address: z
    .string()
    .trim()
    .max(255, "Address must be at most 255 characters.")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City must be at most 100 characters.")
    .optional(),
});

export type UserRoleInput = z.infer<typeof userRoleSchema>;
export type MedicalProviderTypeInput = z.infer<
  typeof medicalProviderTypeSchema
>;
export type UserBaseInput = z.infer<typeof userBaseSchema>;
export type MedicalProviderProfileBaseInput = z.infer<
  typeof medicalProviderProfileBaseSchema
>;
export const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
export type SignInInput = z.infer<typeof SignInSchema>;