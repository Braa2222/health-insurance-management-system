"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { ActivateInsuranceSubscriptionSchema } from "@/lib/validators/insurance-subscription.validator";

export type ActivateInsuranceSubscriptionActionState = {
  success: boolean;
  message?: string;
  errors?: {
    subscriberId?: string[];
    planId?: string[];
  };
};

const generalActivationError =
  "Unable to activate the insurance subscription. Please try again.";

export async function activateInsuranceSubscriptionAction(
  _previousState: ActivateInsuranceSubscriptionActionState,
  formData: FormData,
): Promise<ActivateInsuranceSubscriptionActionState> {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in.",
    };
  }

  if (session.user.role !== UserRole.SYSTEM_ADMIN) {
    return {
      success: false,
      message:
        "You are not authorized to activate insurance subscriptions.",
    };
  }

  const validationResult = ActivateInsuranceSubscriptionSchema.safeParse({
    subscriberId: formData.get("subscriberId"),
    planId: formData.get("planId"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Select a valid subscriber and insurance plan.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { subscriberId, planId } = validationResult.data;

  try {
    const [subscriber, insurancePlan] = await Promise.all([
      prisma.user.findFirst({
        where: {
          id: subscriberId,
          role: UserRole.SUBSCRIBER,
        },
        select: {
          id: true,
        },
      }),

      prisma.insurancePlan.findFirst({
        where: {
          id: planId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found.",
      };
    }

    if (!insurancePlan) {
      return {
        success: false,
        message: "Insurance plan not found or inactive.",
      };
    }

    const existingSubscription =
      await prisma.insuranceSubscription.findUnique({
        where: {
          subscriberId,
        },
        select: {
          id: true,
          isActive: true,
        },
      });

    if (existingSubscription?.isActive) {
      return {
        success: false,
        message:
          "This subscriber already has an active insurance subscription.",
      };
    }

    await prisma.insuranceSubscription.upsert({
      where: {
        subscriberId,
      },
      update: {
        planId,
        isActive: true,
      },
      create: {
        subscriberId,
        planId,
        isActive: true,
      },
    });
  } catch {
    console.error("Failed to activate an insurance subscription.");

    return {
      success: false,
      message: generalActivationError,
    };
  }

  try {
    revalidatePath("/admin/subscriptions");
  } catch {
    console.error("The insurance-subscriptions cache could not be revalidated.");
  }

  redirect("/");
}
