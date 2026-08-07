"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/db/prisma";
import { ProviderSignUpSchema } from "@/lib/validators/Provider-sign-up";

export type ProviderSignUpActionState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
    facilityName?: string[];
    providerType?: string[];
    licenseNumber?: string[];
    address?: string[];
    city?: string[];
  };
};

const duplicateEmailMessage =
  "An account with this email already exists. Sign in or use another email address.";

export async function providerSignUpAction(
  _previousState: ProviderSignUpActionState,
  formData: FormData,
): Promise<ProviderSignUpActionState> {
  const validatedFields = ProviderSignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    facilityName: formData.get("facilityName"),
    providerType: formData.get("providerType"),
    licenseNumber: formData.get("licenseNumber"),
    address: formData.get("address"),
    city: formData.get("city"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    email,
    phone,
    password,
    facilityName,
    providerType,
    licenseNumber,
    address,
    city,
  } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: duplicateEmailMessage,
        errors: { email: [duplicateEmailMessage] },
      };
    }

    const hashedPassword = await hash(password, 12);

    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: "MEDICAL_SERVICE_PROVIDER",
        },
        select: { id: true },
      });

      await transaction.medicalProviderProfile.create({
        data: {
          userId: user.id,
          facilityName,
          providerType,
          licenseNumber,
          address,
          city,
        },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: duplicateEmailMessage,
        errors: { email: [duplicateEmailMessage] },
      };
    }

    return {
      success: false,
      message:
        "Unable to submit your registration right now. Please try again later.",
    };
  }

  redirect("/sign-in");
}
