import {
  CalendarDays,
  CircleAlert,
  CircleMinus,
  HeartPulse,
  ListChecks,
  ListX,
  NotebookText,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import type { SubscriberCoverage } from "@/lib/data/get-subscriber-coverage";

type SubscriberCoverageViewProps = {
  subscription: SubscriberCoverage | null;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SubscriberCoverageView({
  subscription,
}: SubscriberCoverageViewProps) {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <CoverageHeader hasActiveSubscription={Boolean(subscription)} />

        {subscription ? (
          <CoverageDetails subscription={subscription} />
        ) : (
          <NoActiveSubscriptionState />
        )}
      </div>
    </div>
  );
}

function CoverageHeader({
  hasActiveSubscription,
}: {
  hasActiveSubscription?: boolean;
}) {
  const HeaderIcon =
    hasActiveSubscription === false ? ShieldOff : ShieldCheck;

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

      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Subscriber Coverage
        </div>

        <div className="mt-5 flex items-start gap-4">
          <span
            className={`hidden size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg sm:flex ${
              hasActiveSubscription === false
                ? "bg-red-600 shadow-red-600/15"
                : "bg-teal-600 shadow-teal-600/15"
            }`}
          >
            <HeaderIcon aria-hidden="true" className="size-7" />
          </span>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              My Coverage
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              View your active insurance plan and the medical services included
              in your coverage.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function CoverageDetails({
  subscription,
}: {
  subscription: SubscriberCoverage;
}) {
  return (
    <>
      <PlanOverview subscription={subscription} />
      <CoverageSummary subscription={subscription} />
      <CoveredMedicalServices coverages={subscription.plan.coverages} />
    </>
  );
}

function PlanOverview({
  subscription,
}: {
  subscription: SubscriberCoverage;
}) {
  const { plan } = subscription;

  return (
    <section className="mt-8" aria-labelledby="active-plan-title">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.4fr)]">
          <div className="relative min-h-64 overflow-hidden bg-slate-100 sm:min-h-80 lg:min-h-full">
            {plan.imageUrl ? (
              <Image
                src={plan.imageUrl}
                alt={`${plan.name} insurance plan`}
                fill
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-100 text-teal-700 sm:min-h-80">
                <div className="text-center">
                  <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-teal-200 bg-white/80 shadow-sm">
                    <ShieldCheck aria-hidden="true" className="size-10" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Insurance plan image unavailable
                  </p>
                </div>
              </div>
            )}

            <Badge className="absolute right-4 top-4 h-7 border border-white/50 bg-teal-600 px-3 text-white shadow-sm hover:bg-teal-600">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-teal-100"
              />
              Active Coverage
            </Badge>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              {plan.code}
            </p>

            <h2
              id="active-plan-title"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
            >
              {plan.name}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              {plan.description || "No plan description is available."}
            </p>

            <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
                  <ShieldCheck aria-hidden="true" className="size-5" />
                </span>

                <div>
                  <p className="font-semibold text-slate-900">
                    Your subscription is active
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The plan and service information shown here belongs to your
                    authenticated subscriber account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function CoverageSummary({
  subscription,
}: {
  subscription: SubscriberCoverage;
}) {
  const { plan } = subscription;

  return (
    <section className="mt-8" aria-labelledby="coverage-summary-title">
      <div className="mb-5">
        <h2
          id="coverage-summary-title"
          className="text-xl font-semibold text-slate-950"
        >
          Coverage Summary
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The key details of your assigned insurance plan.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryItem
          icon={WalletCards}
          label="Monthly Price"
          value={formatCurrency(plan.monthlyPrice)}
          secondary="per month"
        />
        <SummaryItem
          icon={CalendarDays}
          label="Plan Duration"
          value={formatDuration(plan.durationMonths)}
        />
        <SummaryItem
          icon={ShieldCheck}
          label="Maximum Annual Coverage"
          value={
            plan.maximumAnnualCoverage !== null ? (
              formatCurrency(plan.maximumAnnualCoverage)
            ) : (
              <NotSpecifiedValue />
            )
          }
        />
        <SummaryItem
          icon={ListChecks}
          label="Covered Medical Services"
          value={`${plan.coverages.length} ${
            plan.coverages.length === 1 ? "service" : "services"
          }`}
        />
      </dl>
    </section>
  );
}

type SummaryItemProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  secondary?: string;
};

function SummaryItem({
  icon: Icon,
  label,
  value,
  secondary,
}: SummaryItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <dt className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-xl font-bold text-slate-950">
        {value}
      </dd>

      {secondary ? (
        <p className="mt-1 text-xs text-slate-500">{secondary}</p>
      ) : null}
    </div>
  );
}

type CoveredService = SubscriberCoverage["plan"]["coverages"][number];

function CoveredMedicalServices({
  coverages,
}: {
  coverages: CoveredService[];
}) {
  return (
    <section className="mt-8" aria-labelledby="covered-services-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="covered-services-title"
            className="text-xl font-semibold text-slate-950"
          >
            Covered Medical Services
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review the coverage percentage and annual limit for each service.
          </p>
        </div>

        {coverages.length > 0 ? (
          <Badge
            variant="outline"
            className="h-7 self-start border-slate-200 bg-white px-3 text-slate-600 sm:self-auto"
          >
            {coverages.length} {coverages.length === 1 ? "service" : "services"}
          </Badge>
        ) : null}
      </div>

      {coverages.length === 0 ? (
        <NoCoveredServicesState />
      ) : (
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coverages.map((coverage) => (
            <CoveredServiceCard key={coverage.id} coverage={coverage} />
          ))}
        </div>
      )}
    </section>
  );
}

function CoveredServiceCard({
  coverage,
}: {
  coverage: CoveredService;
}) {
  const { service } = coverage;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white to-teal-50/70 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <HeartPulse aria-hidden="true" className="size-5" />
          </span>

          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
            {formatCategory(service.category)}
          </Badge>
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-950">
          {service.name}
        </h3>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
          {service.code}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <p className="min-h-12 text-sm leading-6 text-slate-600">
          {service.description ||
            "No medical service description is available."}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-medium text-slate-500">Coverage</dt>
            <dd className="mt-1 text-xl font-bold text-teal-700">
              {coverage.coveragePercentage}%
            </dd>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="text-xs font-medium text-slate-500">Annual Limit</dt>
            <dd className="mt-1 break-words text-base font-bold text-slate-950">
              {coverage.annualLimit
                ? formatCurrency(coverage.annualLimit)
                : <NotSpecifiedValue />}
            </dd>
          </div>
        </dl>

        {coverage.notes ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <NotebookText
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-amber-700"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">
                Coverage Notes
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {coverage.notes}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function NoActiveSubscriptionState() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute -left-28 -top-28 size-64 rounded-full bg-teal-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-red-200 bg-red-50 text-red-700 shadow-sm">
          <ShieldOff aria-hidden="true" className="size-10" />
        </span>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          No Active Insurance Subscription
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          You do not currently have an active insurance subscription to
          display.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your plan and covered medical services will appear here when an
          active subscription is available.
        </p>
      </div>
    </section>
  );
}

function NoCoveredServicesState() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        <ListX aria-hidden="true" className="size-8" />
      </span>

      <h3 className="mt-5 text-xl font-semibold text-slate-950">
        No Covered Medical Services
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        This active insurance plan does not currently include any covered
        medical services.
      </p>
    </div>
  );
}

export function SubscriberCoverageErrorState() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <CoverageHeader />

        <div
          role="alert"
          className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-white p-6 text-red-800 shadow-sm"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <CircleAlert aria-hidden="true" className="size-5" />
          </span>

          <div>
            <h2 className="font-semibold">Unable to Load Your Coverage</h2>
            <p className="mt-1 text-sm leading-6 text-red-700">
              Unable to load your insurance coverage right now. Please try
              again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotSpecifiedValue() {
  return (
    <span className="inline-flex items-center gap-1.5 text-base font-semibold text-slate-500">
      <CircleMinus aria-hidden="true" className="size-4 shrink-0" />
      Not specified
    </span>
  );
}

function formatCurrency(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return currencyFormatter.format(amount);
}

function formatDuration(durationMonths: number) {
  return `${durationMonths} ${durationMonths === 1 ? "month" : "months"}`;
}

function formatCategory(category: string) {
  return category
    .split("_")
    .map(
      (word) =>
        `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
}
