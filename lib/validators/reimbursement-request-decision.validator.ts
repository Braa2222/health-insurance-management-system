import { z } from "zod";

export const ReimbursementRequestDecisionSchema = z.object({
  requestId: z.string().uuid("Invalid reimbursement request ID."),
});

export const ReimbursementRequestRejectionSchema =
  ReimbursementRequestDecisionSchema.extend({
    rejectionReason: z.preprocess(
      (value) => (typeof value === "string" ? value : ""),
      z
        .string()
        .trim()
        .min(1, "Please provide a rejection reason.")
        .max(500, "The rejection reason must not exceed 500 characters."),
    ),
  });

export type ReimbursementRequestDecisionInput = z.infer<
  typeof ReimbursementRequestDecisionSchema
>;

export type ReimbursementRequestDecisionActionState = {
  success: boolean;
  message?: string;
  errors?: {
    rejectionReason?: string[];
  };
};

export type ReimbursementRequestDecisionAction = (
  previousState: ReimbursementRequestDecisionActionState,
  formData: FormData,
) => Promise<ReimbursementRequestDecisionActionState>;
