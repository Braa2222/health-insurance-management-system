"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/db/prisma";
import { SubscriberSignUpSchema } from "@/lib/validators/Subscriber-sign-up";

export type SubscriberSignUpActionState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

const duplicateEmailMessage =
  "An account with this email already exists. Sign in or use another email address.";

export async function subscriberSignUpAction(
  _previousState: SubscriberSignUpActionState,
  formData: FormData,
): Promise<SubscriberSignUpActionState> {
  const validatedFields = SubscriberSignUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validatedFields.data;

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

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "SUBSCRIBER",
      },
    });
  } catch (error) {// Handle Prisma unique constraint errors caused by a duplicate email address.
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
        "Unable to create your account right now. Please try again later.",
    };
  }

  redirect("/sign-in");
}
