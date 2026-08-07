"use server";

import { revalidatePath } from "next/cache";

import {
  ReimbursementRequestStatus,
  UserRole,
} from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import {
  ReimbursementRequestDecisionSchema,
  type ReimbursementRequestDecisionActionState,
} from "@/lib/validators/reimbursement-request-decision.validator";

export async function approveReimbursementRequestAction(
  _previousState: ReimbursementRequestDecisionActionState,
  formData: FormData,
): Promise<ReimbursementRequestDecisionActionState> {
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
      message: "You are not authorized to review reimbursement requests.",
    };
  }

  const validationResult = ReimbursementRequestDecisionSchema.safeParse({
    requestId: formData.get("requestId"),
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Select a valid reimbursement request.",
    };
  }

  const { requestId } = validationResult.data;

  try {
    const updateResult = await prisma.reimbursementRequest.updateMany({
      where: {
        id: requestId,
        status: ReimbursementRequestStatus.PENDING,
      },
      data: {
        status: ReimbursementRequestStatus.APPROVED,
      },
    });

    if (updateResult.count === 0) {
      return {
        success: false,
        message:
          "This reimbursement request was not found or has already been reviewed.",
      };
    }
  } catch {
    console.error("Unable to approve a reimbursement request.");

    return {
      success: false,
      message:
        "Unable to update the reimbursement request. Please try again.",
    };
  }

  try {
    revalidatePath("/admin/claims");
  } catch {
    console.error("Unable to revalidate the administrator Claims page.");
  }

  try {
    revalidatePath("/subscriber/claims");
  } catch {
    console.error("Unable to revalidate the subscriber Claims page.");
  }

  return {
    success: true,
    message: "The reimbursement request was approved successfully.",
  };
}
