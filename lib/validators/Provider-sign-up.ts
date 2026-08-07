import { z } from "zod";

import { SubscriberSignUpSchema } from "@/lib/validators/Subscriber-sign-up";

export const MEDICAL_PROVIDER_TYPES = [
  "HOSPITAL",
  "CLINIC",
  "LABORATORY",
  "PHARMACY",
] as const;

export type MedicalProviderTypeValue =
  (typeof MEDICAL_PROVIDER_TYPES)[number];

export const MEDICAL_PROVIDER_TYPE_LABELS: Record<
  MedicalProviderTypeValue,
  string
> = {
  HOSPITAL: "Hospital",
  CLINIC: "Clinic",
  LABORATORY: "Laboratory",
  PHARMACY: "Pharmacy",
};

const optionalAddressSchema = z
  .string()
  .trim()
  .max(255, "Address must be at most 255 characters.")
  .transform((value) => value || undefined);

const optionalCitySchema = z
  .string()
  .trim()
  .max(100, "City must be at most 100 characters.")
  .transform((value) => value || undefined);

const providerFacilityShape = {
  facilityName: z
    .string()
    .trim()
    .min(1, "Facility name is required.")
    .min(2, "Facility name must be at least 2 characters.")
    .max(150, "Facility name must be at most 150 characters."),

  providerType: z.enum(MEDICAL_PROVIDER_TYPES, {
    message: "Select a valid provider type.",
  }),

  licenseNumber: z
    .string()
    .trim()
    .min(1, "License number is required.")
    .min(2, "License number must be at least 2 characters.")
    .max(100, "License number must be at most 100 characters."),

  address: optionalAddressSchema,
  city: optionalCitySchema,
};

export const ProviderAccountStepSchema = SubscriberSignUpSchema;
export const ProviderFacilityStepSchema = z.object(providerFacilityShape);
export const ProviderSignUpSchema =
  SubscriberSignUpSchema.safeExtend(providerFacilityShape);

export type ProviderSignUpInput = z.infer<typeof ProviderSignUpSchema>;
