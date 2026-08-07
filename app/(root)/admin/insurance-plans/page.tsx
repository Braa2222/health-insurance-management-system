import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  ImageIcon,
  Plus,
  ShieldCheck,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getInsurancePlans,
  type InsurancePlanListItem,
} from "@/lib/data/get-insurance-plans";

export const runtime = "nodejs";

export default async function InsurancePlansPage() {

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
        <InsurancePlansHeader />

        <Suspense fallback={<InsurancePlansLoadingState />}>
          <InsurancePlansContent />
        </Suspense>
      </div>
    </div>
  );
}

function InsurancePlansHeader() {
  return (
    <header className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-teal-50 px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:px-10">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-24 size-72 rounded-full bg-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 right-1/3 size-64 rounded-full bg-emerald-50 blur-3xl"
      />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Plan Management
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Insurance Plans
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Build, review, and monitor insurance plans from one organized
            workspace. Track pricing, availability, and covered medical
            services at a glance.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/admin/insurance-plans/create" />}
          className="h-12 w-full rounded-xl bg-teal-600 px-5 text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 lg:w-auto"
        >
          <Plus aria-hidden="true" />
          Create Insurance Plan
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

async function InsurancePlansContent() {
  let plans;
//read all insurance plans from the database
  try {
    plans = await getInsurancePlans();
  } catch {
    console.error("Unable to load insurance plans.");
    return <InsurancePlansErrorState />;
  }

  return plans.length === 0 ? (
    <EmptyInsurancePlansState />
  ) : (
    <InsurancePlansGrid plans={plans} />
  );
}

function InsurancePlansGrid({
  plans,
}: {
  plans: InsurancePlanListItem[];
}) {
  return (
    <section className="mt-8" aria-labelledby="all-plans-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="all-plans-title" className="text-xl font-semibold text-slate-950">
            All Insurance Plans
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The most recently created plans appear first.
          </p>
        </div>

        <Badge
          variant="outline"
          className="h-7 self-start border-slate-200 bg-white px-3 text-slate-600 sm:self-auto"
        >
          {plans.length} {plans.length === 1 ? "plan" : "plans"}
        </Badge>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <InsurancePlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}

function InsurancePlanCard({
  plan,
}: {
  plan: InsurancePlanListItem;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {plan.imageUrl ? (
          <Image
            src={plan.imageUrl}
            alt={`${plan.name} cover`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 text-teal-700">
            <ImageIcon aria-hidden="true" className="size-11" />
            <span className="sr-only">No plan cover image</span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/25 to-transparent"
        />

        <Badge
          className={`absolute right-3 top-3 border border-white/40 shadow-sm ${
            plan.isActive
              ? "bg-teal-600 text-white hover:bg-teal-600"
              : "bg-slate-700 text-white hover:bg-slate-700"
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${
              plan.isActive ? "bg-teal-100" : "bg-slate-300"
            }`}
          />
          {plan.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              {plan.code}
            </p>
            <h3 className="mt-1.5 truncate text-xl font-semibold text-slate-950">
              {plan.name}
            </h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xl font-bold text-slate-950">
              {`$${formatAmount(plan.monthlyPrice.toString())}`}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">per month</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
          {plan.description || "No plan description is available."}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <PlanDetail
            icon={CalendarDays}
            label="Duration"
            value={`${plan.durationMonths} ${
              plan.durationMonths === 1 ? "month" : "months"
            }`}
          />
          <PlanDetail
            icon={ShieldCheck}
            label="Services"
            value={`${plan._count.coverages} covered`}
          />
          <PlanDetail
            icon={WalletCards}
            label="Annual Maximum"
          value={
          plan.maximumAnnualCoverage
             ? `$${formatAmount(plan.maximumAnnualCoverage.toString())}`
                      :"Not specified"
}
            className="col-span-2"
          />
        </dl>

        <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Created {formatDate(plan.createdAt)}
        </p>
      </div>
    </article>
  );
}

type PlanDetailProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

function PlanDetail({
  icon: Icon,
  label,
  value,
  className,
}: PlanDetailProps) {
  return (
    <div className={`flex items-start gap-2.5 ${className ?? ""}`}>
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-slate-900">
          {value}
        </dd>
      </div>
    </div>
  );
}

function formatAmount(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

const preparationSteps = [
  {
    title: "Add plan information",
    description: "Set the name, code, price, duration, and availability.",
  },
  {
    title: "Configure medical coverage",
    description: "Select active services and define their coverage limits.",
  },
  {
    title: "Review and create",
    description: "Confirm the details before saving the insurance plan.",
  },
] as const;

function EmptyInsurancePlansState() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="absolute -left-28 -top-28 size-64 rounded-full bg-teal-50 blur-3xl"
      />
      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:px-10 sm:py-16 lg:py-20">
          <span className="flex size-20 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
            <ShieldCheck aria-hidden="true" className="size-10" />
          </span>
          <Badge className="mt-6 bg-teal-100 px-3 text-teal-800 hover:bg-teal-100">
            Your workspace is ready
          </Badge>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Create your first insurance plan
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            There are no insurance plans yet. Start by defining the plan&apos;s
            pricing and duration, then select the medical services it covers.
          </p>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50/80 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            What happens next
          </p>
          <ol className="mt-6 space-y-6">
            {preparationSteps.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white shadow-sm">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function InsurancePlansErrorState() {
  return (
    <div
      role="alert"
      className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-white p-6 text-red-800 shadow-sm"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <CircleAlert aria-hidden="true" className="size-5" />
      </span>
      <div>
        <h2 className="font-semibold">Unable to Load Insurance Plans</h2>
        <p className="mt-1 text-sm leading-6 text-red-700">
          Insurance plans could not be loaded right now. Please refresh the
          page and try again.
        </p>
      </div>
    </div>
  );
}

function InsurancePlansLoadingState() {
  return (
    <section className="mt-8" aria-label="Loading insurance plans">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <Skeleton className="aspect-video w-full" />
            <div className="p-5">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/3" />
              <Skeleton className="mt-5 h-12 w-full" />
              <Skeleton className="mt-5 h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
