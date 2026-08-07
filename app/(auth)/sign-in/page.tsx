import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Health Insurance System",
  description: "Sign in securely to access your health insurance account.",
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignInForm />;
}
