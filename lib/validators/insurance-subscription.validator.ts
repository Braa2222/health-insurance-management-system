import { z } from "zod";

export const ActivateInsuranceSubscriptionSchema = z.object({
  subscriberId: z.string().uuid("Invalid subscriber ID."),
  planId: z.string().uuid("Invalid insurance plan ID."),
});

export type ActivateInsuranceSubscriptionInput = z.infer<
  typeof ActivateInsuranceSubscriptionSchema
>;
