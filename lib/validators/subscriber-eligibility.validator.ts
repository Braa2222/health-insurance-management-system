import { z } from "zod";

export const SubscriberEligibilitySchema = z.object({
  subscriberEmail: z
    .string()
    .trim()
    .min(1, "Subscriber email is required.")
    .email("Enter a valid subscriber email address.")
    .transform((email) => email.toLowerCase()),
});

export type SubscriberEligibilityInput = z.infer<
  typeof SubscriberEligibilitySchema
>;
