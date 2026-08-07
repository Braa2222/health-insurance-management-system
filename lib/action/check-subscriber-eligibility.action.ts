"use server";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { getSubscriberEligibility } from "@/lib/data/get-subscriber-eligibility";
import { SubscriberEligibilitySchema } from "@/lib/validators/subscriber-eligibility.validator";

export type SubscriberEligibilityActionState = {
  status:
    | "idle"
    | "eligible"
    | "subscriber_not_found"
    | "no_active_subscription"
    | "error";
  message?: string;
  errors?: {
    subscriberEmail?: string[];
  };
  result?: {
    subscriberName: string;
    subscriberEmail: string;
    eligibilityStatus: "ELIGIBLE";
    subscriptionStatus: "ACTIVE";
    planName: string;
    planCode: string;
  };
};

export async function checkSubscriberEligibilityAction(
  _previousState: SubscriberEligibilityActionState,
  formData: FormData,
): Promise<SubscriberEligibilityActionState> {
  
  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "You must be signed in.",
    };
  }

  if (session.user.role !== UserRole.MEDICAL_SERVICE_PROVIDER) {
    return {
      status: "error",
      message: "You are not authorized to verify subscriber eligibility.",
    };
  }

  const validationResult = SubscriberEligibilitySchema.safeParse({
    subscriberEmail: formData.get("subscriberEmail"),
  });

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Enter a valid subscriber email address.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { subscriberEmail } = validationResult.data;

  let subscriber: Awaited<ReturnType<typeof getSubscriberEligibility>>;

  try {
    subscriber = await getSubscriberEligibility(subscriberEmail);
  } catch {
    console.error("Unable to read subscriber eligibility information.");

    return {
      status: "error",
      message: "Unable to verify subscriber eligibility. Please try again.",
    };
  }

  if (!subscriber) {
    return {
      status: "subscriber_not_found",
      message:
        "No subscriber account was found with the provided email address.",
    };
  }

  const subscription = subscriber.insuranceSubscription;

  if (!subscription) {
    return {
      status: "no_active_subscription",
      message:
        "The subscriber has not been assigned an active insurance plan yet.",
    };
  }

  if (!subscription.isActive) {
    return {
      status: "no_active_subscription",
      message: "The subscriber's insurance subscription is not active.",
    };
  }

  return {
    status: "eligible",
    message: "The subscriber has an active insurance subscription.",
    result: {
      subscriberName: subscriber.name,
      subscriberEmail: subscriber.email,
      eligibilityStatus: "ELIGIBLE",
      subscriptionStatus: "ACTIVE",
      planName: subscription.plan.name,
      planCode: subscription.plan.code,
    },
  };
}
