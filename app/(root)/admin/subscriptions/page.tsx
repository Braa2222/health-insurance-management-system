import { ClipboardCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { activateInsuranceSubscriptionAction } from "@/lib/action/activate-insurance-subscription.action";
import { getSubscriptionInsuranceData } from "@/lib/data/get-subscription-insurance";

import { ActivateInsuranceSubscriptionForm } from "./ActivateInsuranceSubscriptionForm";

export const runtime = "nodejs";

export default async function SubscriptionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/");
  }

  const { subscribers, insurancePlans } =
    await getSubscriptionInsuranceData();

  const eligibleSubscribers = subscribers.filter(
    (subscriber) => !subscriber.insuranceSubscription?.isActive,
  );

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-teal-50 px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:px-10">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-24 size-72 rounded-full bg-teal-100/60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 right-1/3 size-64 rounded-full bg-emerald-50 blur-3xl"
          />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Coverage Administration
            </div>

            <div className="mt-5 flex items-start gap-4">
              <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/15 sm:flex">
                <ClipboardCheck aria-hidden="true" className="size-7" />
              </span>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Subscriptions
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Select a registered subscriber and an available insurance
                  plan to activate the subscriber&apos;s insurance coverage.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8" aria-labelledby="activation-form-title">
          <ActivateInsuranceSubscriptionForm
            subscribers={eligibleSubscribers}
            insurancePlans={insurancePlans}
            activateAction={activateInsuranceSubscriptionAction}
          />
        </section>
      </div>
    </div>
  );
}
