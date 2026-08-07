import { ArrowLeft, CircleAlert, ShieldPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveMedicalServices } from "@/lib/data/get-medical-services";

import { CreateInsurancePlanForm } from "./CreateInsurancePlanForm";

export const runtime = "nodejs";

export default async function CreateInsurancePlanPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/");
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
                href="/admin/insurance-plans"
                className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back to Insurance Plans
              </Link>

              <div className="mt-5 flex items-start gap-4">
                <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/15 sm:flex">
                  <ShieldPlus aria-hidden="true" className="size-7" />
                </span>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
                    <Sparkles aria-hidden="true" className="size-3.5" />
                    Guided Plan Setup
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Create New Insurance Plan
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                    Configure plan details, define service coverage, and review
                    everything before creating the insurance plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden min-w-48 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur xl:block">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                Simple workflow
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">3 Steps</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Information, coverage, and final review.
              </p>
            </div>
          </div>
        </header>

        <Suspense fallback={<CreatePlanLoadingState />}>
          <CreatePlanContent />
        </Suspense>
      </div>
    </div>
  );
}
// read from dataBase Avaliable medical services and pass to the form component
async function CreatePlanContent() {
  const medicalServices = await loadActiveMedicalServices();

  if (!medicalServices) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-red-200 bg-white p-6 text-red-800 shadow-sm"
      >
        <CircleAlert
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-red-600"
        />

        <div>
          <h2 className="font-semibold">Unable to Load Medical Services</h2>

          <p className="mt-1 text-sm leading-6 text-red-700">
            Active medical services could not be loaded right now. Please
            refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  return <CreateInsurancePlanForm medicalServices={medicalServices} />;
}

async function loadActiveMedicalServices() {
  try {
    return await getActiveMedicalServices();
  } catch {
    console.error("Unable to load active medical services.");
    return null;
  }
}

function CreatePlanLoadingState() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:block">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-6 h-12 w-full" />
        <Skeleton className="mt-6 h-12 w-full" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <Skeleton className="mt-8 aspect-video w-full rounded-xl" />
        <Skeleton className="mt-8 h-12 w-full" />
        <Skeleton className="mt-5 h-12 w-full" />
        <Skeleton className="mt-5 h-28 w-full" />
      </div>
    </div>
  );
}
