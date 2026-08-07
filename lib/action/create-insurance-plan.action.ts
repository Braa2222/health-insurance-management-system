"use server";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { revalidatePath } from "next/cache";

import { Prisma, UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CreateInsurancePlanSchema } from "@/lib/validators/insurance-plan.validator";

export type CreateInsurancePlanActionState = {
  success: boolean;
  message?: string;
  planId?: string;
  errors?: {
    planImage?: string[];
    name?: string[];
    code?: string[];
    description?: string[];
    monthlyPrice?: string[];
    durationMonths?: string[];
    maximumAnnualCoverage?: string[];
    isActive?: string[];
    coverages?: string[];
  };
};

const MAX_PLAN_IMAGE_SIZE = 5 * 1024 * 1024;

const imageExtensions = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;

type SupportedImageType = keyof typeof imageExtensions;

const duplicateCodeMessage =
  "An insurance plan with this code already exists.";

const unavailableServicesMessage =
  "One or more selected medical services are unavailable.";

const generalCreationError =
  "Unable to create the insurance plan right now. Please try again later.";

function isSupportedImageType(type: string): type is SupportedImageType {
  return Object.prototype.hasOwnProperty.call(imageExtensions, type);
}

async function cleanupSavedImage(filePath: string) {
  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(
        "Failed to clean up a newly uploaded insurance-plan image.",
      );
    }
  }
}

export async function createInsurancePlanAction(
  _previousState: CreateInsurancePlanActionState,
  formData: FormData,
): Promise<CreateInsurancePlanActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be signed in to create an insurance plan.",
    };
  }

  if (session.user.role !== UserRole.SYSTEM_ADMIN) {
    return {
      success: false,
      message: "You are not authorized to create insurance plans.",
    };
  }

  const coveragesJson = formData.get("coverages");

  if (typeof coveragesJson !== "string") {
    return {
      success: false,
      message: "The covered medical services data is invalid.",
      errors: {
        coverages: ["The covered medical services data is invalid."],
      },
    };
  }

  let coverages: unknown;

  try {
    coverages = JSON.parse(coveragesJson);
  } catch {
    return {
      success: false,
      message: "The covered medical services data is invalid.",
      errors: {
        coverages: ["The covered medical services data is invalid."],
      },
    };
  }

  const validation = CreateInsurancePlanSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
    imageUrl: undefined,
    monthlyPrice: formData.get("monthlyPrice"),
    durationMonths: formData.get("durationMonths"),
    maximumAnnualCoverage: formData.get("maximumAnnualCoverage"),
    isActive: formData.get("isActive"),
    coverages,
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: {
        name: fieldErrors.name,
        code: fieldErrors.code,
        description: fieldErrors.description,
        monthlyPrice: fieldErrors.monthlyPrice,
        durationMonths: fieldErrors.durationMonths,
        maximumAnnualCoverage: fieldErrors.maximumAnnualCoverage,
        isActive: fieldErrors.isActive,
        coverages: fieldErrors.coverages,
      },
    };
  }

  const planImage = formData.get("planImage");

  if (!(planImage instanceof File) || planImage.size === 0) {
    return {
      success: false,
      message: "Select a valid plan cover image.",
      errors: {
        planImage: ["A plan cover image is required."],
      },
    };
  }

  if (!isSupportedImageType(planImage.type)) {
    return {
      success: false,
      message: "Select a valid plan cover image.",
      errors: {
        planImage: ["Select a PNG, JPG, or WebP image."],
      },
    };
  }

  if (planImage.size > MAX_PLAN_IMAGE_SIZE) {
    return {
      success: false,
      message: "Select a valid plan cover image.",
      errors: {
        planImage: ["The plan image must not exceed 5 MB."],
      },
    };
  }

  const { coverages: validatedCoverages, ...planData } = validation.data;

  try {
    const existingPlan = await prisma.insurancePlan.findUnique({
      where: {
        code: planData.code,
      },
      select: {
        id: true,
      },
    });

    if (existingPlan) {
      return {
        success: false,
        message: duplicateCodeMessage,
        errors: {
          code: [duplicateCodeMessage],
        },
      };
    }

    const serviceIds = validatedCoverages.map(
      (coverage) => coverage.serviceId,
    );

    const activeServices = await prisma.medicalService.findMany({
      where: {
        id: {
          in: serviceIds,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (activeServices.length !== serviceIds.length) {
      return {
        success: false,
        message: unavailableServicesMessage,
        errors: {
          coverages: [unavailableServicesMessage],
        },
      };
    }
  } catch {
    return {
      success: false,
      message: generalCreationError,
    };
  }

  const imageFileName = `${randomUUID()}.${imageExtensions[planImage.type]}`;

  const imageDirectory = join(
    process.cwd(),
    "public",
    "uploads",
    "insurance-plans",
  );

  const candidateImagePath = join(imageDirectory, imageFileName);
  const imageUrl = `/uploads/insurance-plans/${imageFileName}`;

  try {
    await mkdir(imageDirectory, {
      recursive: true,
    });

    const bytes = await planImage.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(candidateImagePath, buffer, {
      flag: "wx",
    });
  } catch (error) {
    const errorCode = (error as NodeJS.ErrnoException).code;

    if (errorCode !== "EEXIST") {
      await cleanupSavedImage(candidateImagePath);
    }

    return {
      success: false,
      message:
        "Unable to save the selected image. Please choose the file again.",
      errors: {
        planImage: ["Unable to save the selected image."],
      },
    };
  }

  let createdPlan: {
    id: string;
  };

  try {
    createdPlan = await prisma.insurancePlan.create({
      data: {
        ...planData,
        imageUrl,
        coverages: {
          create: validatedCoverages.map((coverage) => ({
            coveragePercentage: coverage.coveragePercentage,
            annualLimit: coverage.annualLimit,
            notes: coverage.notes,
            service: {
              connect: {
                id: coverage.serviceId,
              },
            },
          })),
        },
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    await cleanupSavedImage(candidateImagePath);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: duplicateCodeMessage,
        errors: {
          code: [duplicateCodeMessage],
        },
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2025")
    ) {
      return {
        success: false,
        message: unavailableServicesMessage,
        errors: {
          coverages: [unavailableServicesMessage],
        },
      };
    }

    return {
      success: false,
      message: generalCreationError,
    };
  }

  try {
    revalidatePath("/admin/insurance-plans");
  } catch {
    console.error("The insurance-plan cache could not be revalidated.");
  }

  return {
    success: true,
    message: "Insurance plan created successfully.",
    planId: createdPlan.id,
  };
}
