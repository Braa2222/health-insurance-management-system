"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { SignInSchema } from "@/lib/validators/Sign-in";

export type SignInActionState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};
// function to handle the sign-in action, validating the form data and attempting to sign in the user using the provided credentials. It returns a state object indicating success or failure, along with any relevant messages or errors.
export async function signInAction(
  _previousState: SignInActionState,
  formData: FormData,
): Promise<SignInActionState> {
  const validatedFields = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
// // If the data is valid, extract the email and password from the validated result.
  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          success: false,
          message:
            "Unable to sign in. Check your email and password, or contact system support.",
        };
      }

      return {
        success: false,
        message: "Unable to sign in right now. Please try again later.",
      };
    }

    // Auth.js uses Next.js redirect control flow after a successful sign in.
    throw error;
  }

  return {
    success: true,
  };
}
