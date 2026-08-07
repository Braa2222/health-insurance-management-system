import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const emptyToUndefined = (value: unknown) =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "")
    ? undefined
    : value;

function parseCalendarDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

function isNotFutureDate(value: string) {
  const parsedDate = parseCalendarDate(value);

  if (!parsedDate) {
    return false;
  }

  const now = new Date();
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  return parsedDate.getTime() <= today;
}

const requestedAmountSchema = z
  .string()
  .trim()
  .min(1, "Requested amount is required.")
  .regex(
    /^\d+(?:\.\d{1,2})?$/,
    "Requested amount must have at most two decimal places.",
  )
  .refine(
    (value) => /[1-9]/.test(value),
    "Requested amount must be greater than zero.",
  )
  .refine((value) => {
    const [integerPart] = value.split(".");
    const normalizedIntegerPart = integerPart.replace(/^0+(?=\d)/, "");

    return normalizedIntegerPart.length <= 10;
  }, "Requested amount is too large.");

export const CreateReimbursementRequestSchema = z.object({
  planCoverageId: z
    .string()
    .trim()
    .min(1, "Select a covered medical service.")
    .uuid("Select a valid covered medical service.")
    .transform((value) => value.toLowerCase()),
  serviceDate: z
    .string()
    .trim()
    .min(1, "Service date is required.")
    .regex(datePattern, "Service date must use the YYYY-MM-DD format.")
    .refine(
      (value) => parseCalendarDate(value) !== null,
      "Enter a valid service date.",
    )
    .refine(isNotFutureDate, "Service date must not be in the future.")
    .transform((value) => parseCalendarDate(value)!),
  requestedAmount: requestedAmountSchema,
  description: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(1000, "Description must be at most 1000 characters.")
      .optional(),
  ),
});

export type CreateReimbursementRequestInput = z.infer<
  typeof CreateReimbursementRequestSchema
>;
