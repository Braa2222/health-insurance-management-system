import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SubscriberSignUpForm } from "./SubscriberSignUpForm";

export const metadata: Metadata = {
  title: "Create Subscriber Account | Health Insurance System",
  description:
    "Create your subscriber account to access health insurance services.",
};

export default function SubscriberSignUpPage() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Link
        href="/sign-up"
        className="mb-4 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back to account types
      </Link>
      <SubscriberSignUpForm />
    </div>
  );
}
