"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  ReimbursementRequestStatus,
  UserRole,
} from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import {
  deleteReimbursementInvoice,
  type ReimbursementInvoiceMimeType,
  saveReimbursementInvoice,
} from "@/lib/storage/reimbursement-invoice-storage";
import { CreateReimbursementRequestSchema } from "@/lib/validators/reimbursement-request.validator";

export type CreateReimbursementRequestActionState = {
  success: boolean;
  message?: string;
  errors?: {
    planCoverageId?: string[];
    serviceDate?: string[];
    requestedAmount?: string[];
    description?: string[];
    invoiceFile?: string[];
  };
};

const MAX_INVOICE_SIZE = 5 * 1024 * 1024;

const invoiceSignatures: Record<
  ReimbursementInvoiceMimeType,
  readonly number[]
> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46, 0x2d],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "image/jpeg": [0xff, 0xd8, 0xff],
};

const generalCreationError =
  "Unable to submit the medical reimbursement request right now. Please try again later.";

function isSupportedInvoiceType(
  value: string,
): value is ReimbursementInvoiceMimeType {
  return Object.prototype.hasOwnProperty.call(invoiceSignatures, value);
}

async function hasExpectedFileSignature(
  file: File,
  mimeType: ReimbursementInvoiceMimeType,
) {
  const signature = invoiceSignatures[mimeType];
  const header = new Uint8Array(
    await file.slice(0, signature.length).arrayBuffer(),
  );

  return signature.every((byte, index) => header[index] === byte);
}

export async function createReimbursementRequestAction(
  _previousState: CreateReimbursementRequestActionState,
  formData: FormData,
): Promise<CreateReimbursementRequestActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to submit a reimbursement request.",
    };
  }

  if (session.user.role !== UserRole.SUBSCRIBER) {
    return {
      success: false,
      message: "You are not authorized to submit reimbursement requests.",
    };
  }

  const validation = CreateReimbursementRequestSchema.safeParse({
    planCoverageId: formData.get("planCoverageId"),
    serviceDate: formData.get("serviceDate"),
    requestedAmount: formData.get("requestedAmount"),
    description: formData.get("description"),
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: {
        planCoverageId: fieldErrors.planCoverageId,
        serviceDate: fieldErrors.serviceDate,
        requestedAmount: fieldErrors.requestedAmount,
        description: fieldErrors.description,
      },
    };
  }

  const invoiceFile = formData.get("invoiceFile");

  if (!(invoiceFile instanceof File) || invoiceFile.size === 0) {
    return {
      success: false,
      message: "Select a valid invoice file.",
      errors: { invoiceFile: ["An invoice file is required."] },
    };
  }

  if (invoiceFile.size > MAX_INVOICE_SIZE) {
    return {
      success: false,
      message: "Select a valid invoice file.",
      errors: { invoiceFile: ["The invoice file must not exceed 5 MB."] },
    };
  }

  if (!isSupportedInvoiceType(invoiceFile.type)) {
    return {
      success: false,
      message: "Select a valid invoice file.",
      errors: { invoiceFile: ["Select a PDF, PNG, or JPG invoice file."] },
    };
  }

  let hasValidSignature: boolean;

  try {
    hasValidSignature = await hasExpectedFileSignature(
      invoiceFile,
      invoiceFile.type,
    );
  } catch {
    return {
      success: false,
      message: "Select a valid invoice file.",
      errors: { invoiceFile: ["The selected invoice file could not be read."] },
    };
  }

  if (!hasValidSignature) {
    return {
      success: false,
      message: "Select a valid invoice file.",
      errors: {
        invoiceFile: [
          "The invoice contents do not match the selected file type.",
        ],
      },
    };
  }

  const { planCoverageId, serviceDate, requestedAmount, description } =
    validation.data;

  let subscription: { id: string; planId: string } | null;

  try {
    subscription = await prisma.insuranceSubscription.findFirst({
      where: {
        subscriberId: session.user.id,
        isActive: true,
      },
      select: {
        id: true,
        planId: true,
      },
    });
  } catch {
    return { success: false, message: generalCreationError };
  }

  if (!subscription) {
    return {
      success: false,
      message: "An active insurance subscription is required.",
    };
  }

  let selectedCoverage: { id: string } | null;

  try {
    selectedCoverage = await prisma.planCoverage.findFirst({
      where: {
        id: planCoverageId,
        planId: subscription.planId,
        coveragePercentage: {
          gt: 0,
          lt: 100,
        },
      },
      select: { id: true },
    });
  } catch {
    return { success: false, message: generalCreationError };
  }

  if (!selectedCoverage) {
    return {
      success: false,
      message: "Select a service eligible for medical reimbursement.",
      errors: {
        planCoverageId: [
          "Fully covered or uncovered services are not eligible for reimbursement.",
        ],
      },
    };
  }

  let savedInvoice: Awaited<ReturnType<typeof saveReimbursementInvoice>>;

  try {
    savedInvoice = await saveReimbursementInvoice(
      invoiceFile,
      invoiceFile.type,
    );
  } catch {
    return {
      success: false,
      message: "Unable to save the invoice. Please select the file again.",
      errors: { invoiceFile: ["Unable to save the selected invoice file."] },
    };
  }

  try {
    await prisma.reimbursementRequest.create({
      data: {
        subscriptionId: subscription.id,
        planCoverageId: selectedCoverage.id,
        requestedAmount,
        serviceDate,
        description,
        invoiceStorageKey: savedInvoice.storageKey,
        invoiceOriginalName: savedInvoice.originalName,
        invoiceMimeType: savedInvoice.mimeType,
        invoiceSize: savedInvoice.size,
        status: ReimbursementRequestStatus.PENDING,
      },
    });
  } catch {
    try {
      await deleteReimbursementInvoice(savedInvoice.storageKey);
    } catch {
      console.error("Unable to clean up an unreferenced reimbursement invoice.");
    }

    return { success: false, message: generalCreationError };
  }

  revalidatePath("/subscriber/claims");
  redirect("/subscriber/claims?submitted=1");
}
