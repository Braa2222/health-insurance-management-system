import { Building2, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AccountTypeCard } from "./AccountTypeCard";

export const metadata: Metadata = {
  title: "Create Account | Health Insurance System",
  description: "Choose the account type that best describes you.",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-9">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        Create Your Account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        Choose the account type that best describes you.
      </p>

      <div className="mt-8 space-y-4">
        <AccountTypeCard
          title="Subscriber"
          description="Access your insurance coverage, claims, and healthcare providers through one secure account."
          actionText="Continue as Subscriber"
          href="/sign-up/subscriber"
          icon={UserRound}
        />
        <AccountTypeCard
          title="Medical Service Provider"
          description="Register your hospital, clinic, laboratory, or pharmacy and access provider services."
          actionText="Continue as Provider"
          href="/sign-up/provider"
          icon={Building2}
        />
      </div>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
