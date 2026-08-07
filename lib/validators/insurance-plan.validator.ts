import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

const optionalString = <T extends z.ZodType<string>>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());

const moneySchema = (label: string, maximumIntegerDigits: number) =>
  z
    .string()
    .trim()
    .regex(
      /^\d+(?:\.\d{1,2})?$/,
      `${label} must be a valid monetary amount with at most two decimal places.`,
    )
    .refine(
      (value) => /[1-9]/.test(value),
      `${label} must be greater than zero.`,
    )
    .refine(
      (value) => value.split(".")[0].length <= maximumIntegerDigits,
      `${label} is too large.`,
    );

const isValidImageUrl = (value: string) => {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const PlanCoverageInputSchema = z.object({
  serviceId: z
    .string()
    .trim()
    .uuid("Select a valid medical service.")
    .transform((value) => value.toLowerCase()),

  coveragePercentage: z
    .number({ error: "Coverage percentage must be a number." })
    .int("Coverage percentage must be a whole number.")
    .min(0, "Coverage percentage must be at least 0.")
    .max(100, "Coverage percentage must not exceed 100."),

  annualLimit: optionalString(moneySchema("Annual limit", 10)),

  notes: optionalString(
    z
      .string()
      .trim()
      .max(500, "Coverage notes must be at most 500 characters."),
  ),
});

export const CreateInsurancePlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Plan name must be at least 2 characters.")
    .max(100, "Plan name must be at most 100 characters."),

  code: z
    .string()
    .trim()
    .min(2, "Plan code must be at least 2 characters.")
    .max(50, "Plan code must be at most 50 characters.")
    .toUpperCase()
    .regex(
      /^[A-Z0-9_-]+$/,
      "Plan code may contain only uppercase letters, numbers, hyphens, and underscores.",
    ),

  description: optionalString(
    z
      .string()
      .trim()
      .max(1000, "Description must be at most 1000 characters."),
  ),

  imageUrl: optionalString(
    z
      .string()
      .trim()
      .max(2048, "Image URL must be at most 2048 characters.")
      .refine(
        isValidImageUrl,
        "Image URL must be an HTTP/HTTPS URL or a root-relative application path.",
      ),
  ),

  monthlyPrice: moneySchema("Monthly price", 8),

  durationMonths: z.coerce
    .number()
    .int("Plan duration must be a whole number.")
    .min(1, "Plan duration must be greater than zero.")
    .max(120, "Plan duration must not exceed 120 months."),

  maximumAnnualCoverage: optionalString(
    moneySchema("Maximum annual coverage", 10),
  ),

  isActive: z.preprocess((value) => {
    if (value === null) return true;
    if (value === "true" || value === "on") return true;
    if (value === "false") return false;

    return value;
  }, z.boolean({ error: "Active status is invalid." })),

  coverages: z
    .array(PlanCoverageInputSchema, {
      error: "Covered medical services must be an array.",
    })
    .min(1, "Select at least one covered medical service.")
    .refine(
      (coverages) =>
        new Set(coverages.map((coverage) => coverage.serviceId)).size ===
        coverages.length,
      "The same medical service cannot be added more than once.",
    ),
});

export type PlanCoverageInput = z.infer<typeof PlanCoverageInputSchema>;

export type CreateInsurancePlanInput = z.infer<
  typeof CreateInsurancePlanSchema
>;
