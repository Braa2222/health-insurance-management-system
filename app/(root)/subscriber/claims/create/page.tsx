import {
  ArrowLeft,
  CircleAlert,
  FileText,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { createReimbursementRequestAction } from "@/lib/action/create-reimbursement-request.action";
import {
  getSubscriberClaimFormData,
  type SubscriberClaimFormData,
} from "@/lib/data/get-subscriber-claim-form-data";

import { CreateReimbursementRequestForm } from "./CreateReimbursementRequestForm";

export const runtime = "nodejs";

export default async function CreateReimbursementRequestPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SUBSCRIBER) {
    redirect("/");
  }

  let claimFormData: SubscriberClaimFormData | null | undefined;

  try {
    claimFormData = await getSubscriberClaimFormData(session.user.id);
  } catch {
    console.error("Unable to load reimbursement request form data.");
    claimFormData = undefined;
  }

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="relative mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-teal-50 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 size-72 rounded-full bg-teal-100/60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 right-1/3 size-56 rounded-full bg-emerald-50 blur-3xl"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link
                href="/subscriber/claims"
                className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back to My Claims
              </Link>

              <div className="mt-5 flex items-start gap-4">
                <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/15 sm:flex">
                  <ReceiptText aria-hidden="true" className="size-7" />
                </span>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
                    <Sparkles aria-hidden="true" className="size-3.5" />
                    Secure Submission
                  </div>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    New Reimbursement Request
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    Enter the medical service details and securely attach the
                    invoice for review.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden min-w-52 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur xl:block">
              <div className="flex items-center gap-2 text-teal-700">
                <ShieldCheck aria-hidden="true" className="size-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                  Protected Invoice
                </p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Invoice files are stored privately and are not publicly
                accessible.
              </p>
            </div>
          </div>
        </header>

        {claimFormData === undefined ? (
          <RequestFormState
            title="Unable to Load Request Details"
            description="Your active coverage details could not be loaded right now. Please refresh the page and try again."
          />
        ) : claimFormData === null ? (
          <RequestFormState
            title="No Active Insurance Subscription"
            description="An active insurance subscription is required before you can submit a medical reimbursement request."
          />
        ) : claimFormData.coverages.length === 0 ? (
          <RequestFormState
            title="No Services Eligible for Reimbursement"
            description="All services in your active plan are either fully covered or not eligible for medical reimbursement."
          />
        ) : (
          <CreateReimbursementRequestForm
            action={createReimbursementRequestAction}
            data={claimFormData}
          />
        )}
      </div>
    </div>
  );
}

function RequestFormState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section
      role="alert"
      className="relative overflow-hidden rounded-3xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16"
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-28 size-64 rounded-full bg-red-50 blur-3xl"
      />
      <div className="relative mx-auto max-w-xl">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
          <CircleAlert aria-hidden="true" className="size-8" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-slate-950 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        <Link
          href="/subscriber/coverage"
          className="mt-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
        >
          <FileText aria-hidden="true" className="size-4" />
          View My Coverage
        </Link>
      </div>
    </section>
  );
}
