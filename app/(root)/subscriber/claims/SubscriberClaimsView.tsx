import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  HeartPulse,
  Plus,
  ReceiptText,
  Sparkles,
  WalletCards,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { ReimbursementRequestStatus } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  SubscriberReimbursementRequest,
  SubscriberReimbursementRequests,
} from "@/lib/data/get-subscriber-reimbursement-requests";

type SubscriberClaimsViewProps = {
  requests: SubscriberReimbursementRequests;
  requestWasSubmitted: boolean;
};

type StatusPresentation = {
  label: string;
  description: string;
  icon: LucideIcon;
  badgeClassName: string;
  panelClassName: string;
  iconClassName: string;
  titleClassName: string;
  descriptionClassName: string;
};

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    description:
      "Your request has been submitted and is waiting for review.",
    icon: Clock3,
    badgeClassName: "border-amber-300 bg-amber-100 text-amber-900",
    panelClassName:
      "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/40",
    iconClassName:
      "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    titleClassName: "text-amber-950",
    descriptionClassName: "text-amber-800",
  },
  APPROVED: {
    label: "Accepted",
    description: "Your medical reimbursement request was accepted.",
    icon: CheckCircle2,
    badgeClassName: "border-emerald-300 bg-emerald-100 text-emerald-900",
    panelClassName:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/40",
    iconClassName:
      "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    titleClassName: "text-emerald-950",
    descriptionClassName: "text-emerald-800",
  },
  REJECTED: {
    label: "Rejected",
    description: "Your medical reimbursement request was rejected.",
    icon: XCircle,
    badgeClassName: "border-red-300 bg-red-100 text-red-900",
    panelClassName:
      "border-red-200 bg-gradient-to-br from-red-50 to-red-50/40",
    iconClassName: "bg-red-100 text-red-700 ring-1 ring-red-200",
    titleClassName: "text-red-950",
    descriptionClassName: "text-red-800",
  },
} satisfies Record<ReimbursementRequestStatus, StatusPresentation>;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SubscriberClaimsView({
  requests,
  requestWasSubmitted,
}: SubscriberClaimsViewProps) {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ClaimsHeader />

        {requestWasSubmitted ? <SubmissionSuccessNotice /> : null}

        {requests.length === 0 ? (
          <EmptyClaimsState />
        ) : (
          <ClaimsList requests={requests} />
        )}
      </div>
    </div>
  );
}

export function SubscriberClaimsErrorState() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ClaimsHeader />

        <div
          role="alert"
          className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-white p-6 text-red-800 shadow-sm"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <CircleAlert aria-hidden="true" className="size-5" />
          </span>

          <div>
            <h2 className="font-semibold">Unable to Load Your Claims</h2>
            <p className="mt-1 text-sm leading-6 text-red-700">
              Unable to load your medical reimbursement requests right now.
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimsHeader() {
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
            Subscriber Reimbursements
          </div>

          <div className="mt-4 flex items-start gap-4">
            <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/15 sm:flex">
              <FileText aria-hidden="true" className="size-7" />
            </span>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                My Claims
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Track the current status of your medical reimbursement
                requests and submit a new claim when needed.
              </p>
            </div>
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/subscriber/claims/create" />}
          className="h-12 w-full rounded-xl bg-teal-600 px-5 text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 lg:w-auto"
        >
          <Plus aria-hidden="true" />
          Submit New Claim
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}

function SubmissionSuccessNotice() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 text-emerald-950 shadow-sm"
    >
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-16 size-36 rounded-full bg-emerald-200/40 blur-2xl"
      />

      <div className="relative flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>

        <div>
          <p className="font-semibold">
            Medical reimbursement request submitted successfully.
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Your request is now pending review and appears below.
          </p>
        </div>
      </div>
    </div>
  );
}

function ClaimsList({
  requests,
}: {
  requests: SubscriberReimbursementRequests;
}) {
  return (
    <section className="mt-8" aria-labelledby="claims-list-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="claims-list-title"
            className="text-xl font-semibold text-slate-950"
          >
            Reimbursement Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Newest requests appear first.
          </p>
        </div>

        <Badge
          variant="outline"
          className="h-7 self-start border-slate-200 bg-white px-3 text-slate-600 sm:self-auto"
        >
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </Badge>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <ClaimCard key={request.id} request={request} />
        ))}
      </div>
    </section>
  );
}

function ClaimCard({
  request,
}: {
  request: SubscriberReimbursementRequest;
}) {
  const { planCoverage } = request;
  const { service } = planCoverage;

  return (
    <article className="relative overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.65)] transition-shadow duration-300 hover:shadow-[0_22px_55px_-38px_rgba(13,148,136,0.45)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"
      />

      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-teal-50/70 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-md shadow-teal-700/15 ring-1 ring-white/70">
              <HeartPulse aria-hidden="true" className="size-4" />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
                Medical Service
              </p>
              <h3 className="mt-0.5 truncate text-base font-bold tracking-tight text-slate-950 sm:text-lg">
                {service.name}
              </h3>
              <p className="mt-0.5 truncate font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[11px]">
                {service.code}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:shrink-0 sm:justify-end">
            <Badge
              variant="outline"
              className="h-6 rounded-full border-slate-200 bg-white/90 px-2.5 text-[10px] font-medium text-slate-600 shadow-sm"
            >
              {formatCategory(service.category)}
            </Badge>
            <ClaimStatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
        <dl className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <ClaimDetail
            icon={WalletCards}
            label="Requested Amount"
            value={formatAmount(request.requestedAmount)}
            emphasized
          />
          <ClaimDetail
            icon={CalendarDays}
            label="Service Date"
            value={formatDate(request.serviceDate)}
          />
          <ClaimDetail
            icon={ReceiptText}
            label="Submitted"
            value={formatDate(request.createdAt)}
          />
          <ClaimDetail
            icon={Clock3}
            label="Last Updated"
            value={formatDate(request.updatedAt)}
          />
        </dl>

        <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 lg:grid-cols-2">
          <StatusExplanation
            status={request.status}
            rejectionReason={request.rejectionReason}
          />

          <div className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-white px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Coverage Information
              </p>
              <span className="h-px flex-1 bg-slate-200/80" />
            </div>

            <dl className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[10px] text-slate-500">Coverage</dt>
                <dd className="mt-0.5 text-base font-bold tabular-nums text-teal-700">
                  {planCoverage.coveragePercentage}%
                </dd>
              </div>

              <div>
                <dt className="text-[10px] text-slate-500">Annual Limit</dt>
                <dd className="mt-0.5 break-words text-xs font-semibold text-slate-900 sm:text-sm">
                  {planCoverage.annualLimit
                    ? formatAmount(planCoverage.annualLimit)
                    : "Not specified"}
                </dd>
              </div>
            </dl>

            <p className="mt-2 border-t border-slate-200/70 pt-2 text-[10px] leading-4 text-slate-500">
              Coverage details are informational and do not represent the final
              reimbursement decision.
            </p>
          </div>
        </div>

        {request.description ? (
          <div className="mt-3 rounded-xl border border-slate-200/90 bg-slate-50/50 px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Description
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-700 sm:text-sm">
              {request.description}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5 border-t border-slate-100 bg-slate-50/65 px-4 py-2.5 sm:px-5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
          <FileText aria-hidden="true" className="size-3.5" />
        </span>

        <p className="min-w-0 text-[11px] text-slate-500">
          <span className="mr-2 font-medium">Original invoice</span>
          <span className="break-all font-semibold text-slate-800">
            {request.invoiceOriginalName}
          </span>
        </p>
      </div>
    </article>
  );
}

function ClaimStatusBadge({
  status,
}: {
  status: ReimbursementRequestStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`h-8 rounded-full px-3 text-xs font-bold shadow-sm ${config.badgeClassName}`}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {config.label}
    </Badge>
  );
}

function StatusExplanation({
  status,
  rejectionReason,
}: {
  status: ReimbursementRequestStatus;
  rejectionReason: string | null;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const storedRejectionReason = rejectionReason?.trim() || null;

  return (
    <div
      className={`flex h-full items-start gap-3 rounded-xl border px-4 py-4 shadow-sm ${config.panelClassName}`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.iconClassName}`}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0">
        <p className={`text-sm font-bold ${config.titleClassName}`}>
          {config.label}
        </p>
        <p
          className={`mt-1 text-xs leading-5 ${config.descriptionClassName}`}
        >
          {config.description}
        </p>

        {status === ReimbursementRequestStatus.REJECTED &&
        storedRejectionReason ? (
          <div className="mt-3 border-t border-red-200 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-700">
              Rejection Reason
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-red-900 sm:text-sm">
              {storedRejectionReason}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ClaimDetail({
  icon: Icon,
  label,
  value,
  emphasized = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50/65 px-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/90">
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-medium text-slate-500">{label}</dt>
        <dd
          className={`mt-0.5 truncate font-bold text-slate-950 ${
            emphasized ? "text-base tabular-nums" : "text-xs sm:text-sm"
          }`}
          title={value}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function EmptyClaimsState() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute -left-28 -top-28 size-64 rounded-full bg-teal-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
          <ReceiptText aria-hidden="true" className="size-10" />
        </span>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          No Reimbursement Requests Yet
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          You have not submitted any medical reimbursement requests.
        </p>

        <Button
          nativeButton={false}
          render={<Link href="/subscriber/claims/create" />}
          className="mt-7 h-11 w-full rounded-xl bg-teal-600 px-5 text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 sm:w-auto"
        >
          <Plus aria-hidden="true" />
          Submit New Claim
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

function formatDate(value: Date) {
  return dateFormatter.format(value);
}

function formatAmount(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  return amountFormatter.format(amount);
}

function formatCategory(value: string) {
  return value
    .split("_")
    .map(
      (word) =>
        `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
}
