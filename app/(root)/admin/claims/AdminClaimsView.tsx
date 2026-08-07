import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  HeartPulse,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { ReimbursementRequestStatus } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  ReimbursementRequestForReview,
  ReimbursementRequestsForReview,
} from "@/lib/data/get-reimbursement-requests-for-review";
import type { ReimbursementRequestDecisionAction } from "@/lib/validators/reimbursement-request-decision.validator";

import { ClaimDecisionActions } from "./ClaimDecisionActions";

type AdminClaimsViewProps = {
  requests: ReimbursementRequestsForReview;
  approveAction: ReimbursementRequestDecisionAction;
  rejectAction: ReimbursementRequestDecisionAction;
};

type StatusPresentation = {
  label: string;
  icon: LucideIcon;
  badgeClassName: string;
};

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    icon: Clock3,
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    badgeClassName: "border-red-200 bg-red-50 text-red-700",
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

export function AdminClaimsView({
  requests,
  approveAction,
  rejectAction,
}: AdminClaimsViewProps) {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ClaimsHeader requestCount={requests.length} />

        {requests.length === 0 ? (
          <EmptyClaimsState />
        ) : (
          <section
            className="mt-8 space-y-5"
            aria-labelledby="claims-list-title"
          >
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

            {requests.map((request) => (
              <ClaimReviewCard
                key={request.id}
                request={request}
                approveAction={approveAction}
                rejectAction={rejectAction}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export function AdminClaimsErrorState() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ClaimsHeader requestCount={null} />

        <div
          role="alert"
          className="mt-8 flex items-start gap-4 rounded-2xl border border-red-200 bg-white p-6 text-red-800 shadow-sm"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <CircleAlert aria-hidden="true" className="size-5" />
          </span>

          <div>
            <h2 className="font-semibold">Unable to Load Claims</h2>
            <p className="mt-1 text-sm leading-6 text-red-700">
              Unable to load reimbursement requests right now. Please try again
              later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimsHeader({ requestCount }: { requestCount: number | null }) {
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

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Claims Administration
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Claims
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Review medical reimbursement requests submitted by subscribers and
            approve or reject pending requests.
          </p>
        </div>

        {requestCount !== null ? (
          <Badge
            variant="outline"
            className="h-9 self-start border-slate-200 bg-white px-4 text-slate-700 shadow-sm lg:self-auto"
          >
            {requestCount} {requestCount === 1 ? "request" : "requests"}
          </Badge>
        ) : null}
      </div>
    </header>
  );
}

function ClaimReviewCard({
  request,
  approveAction,
  rejectAction,
}: {
  request: ReimbursementRequestForReview;
  approveAction: ReimbursementRequestDecisionAction;
  rejectAction: ReimbursementRequestDecisionAction;
}) {
  const { subscriber, plan } = request.subscription;
  const { service } = request.planCoverage;

  return (
    <Card className="gap-0 overflow-hidden rounded-[22px] bg-white py-0 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.65)] ring-1 ring-slate-200">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white via-white to-teal-50/70 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <HeartPulse aria-hidden="true" className="size-5" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                Medical Service
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">
                {service.name}
              </h3>
              <p className="mt-1 font-mono text-xs font-semibold uppercase tracking-wide text-slate-500">
                {service.code}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-slate-200 bg-white text-slate-600"
            >
              {formatCategory(service.category)}
            </Badge>
            <ClaimStatusBadge status={request.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-5 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <InformationPanel icon={UserRound} title="Subscriber">
            <DetailRow label="Name" value={subscriber.name} />
            <DetailRow label="Email" value={subscriber.email} icon={Mail} />
          </InformationPanel>

          <InformationPanel icon={ShieldCheck} title="Insurance Plan">
            <DetailRow label="Plan name" value={plan.name} />
            <DetailRow label="Plan code" value={plan.code} />
          </InformationPanel>

          <InformationPanel icon={HeartPulse} title="Medical Service">
            <DetailRow label="Service name" value={service.name} />
            <DetailRow label="Service code" value={service.code} />
            <DetailRow
              label="Category"
              value={formatCategory(service.category)}
            />
            {service.description ? (
              <DetailRow label="Description" value={service.description} />
            ) : null}
          </InformationPanel>

          <InformationPanel icon={WalletCards} title="Coverage">
            <DetailRow
              label="Coverage percentage"
              value={`${request.planCoverage.coveragePercentage}%`}
            />
            <DetailRow
              label="Annual limit"
              value={
                request.planCoverage.annualLimit === null
                  ? "Not specified"
                  : formatAmount(request.planCoverage.annualLimit)
              }
            />
          </InformationPanel>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryItem
            icon={WalletCards}
            label="Requested Amount"
            value={formatAmount(request.requestedAmount)}
          />
          <SummaryItem
            icon={CalendarDays}
            label="Service Date"
            value={formatDate(request.serviceDate)}
          />
          <SummaryItem
            icon={ReceiptText}
            label="Submitted"
            value={formatDate(request.createdAt)}
          />
          <SummaryItem
            icon={Clock3}
            label="Last Updated"
            value={formatDate(request.updatedAt)}
          />
        </dl>

        {request.description ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Subscriber Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {request.description}
            </p>
          </div>
        ) : null}

        {request.status === ReimbursementRequestStatus.REJECTED ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm ring-1 ring-red-200">
                <XCircle aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-700">
                  Rejection Reason
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-900">
                  {request.rejectionReason ??
                    "No rejection reason was recorded for this older request."}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-slate-200">
              <FileText aria-hidden="true" className="size-4" />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Invoice Metadata
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {request.invoiceOriginalName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {request.invoiceMimeType} · {formatFileSize(request.invoiceSize)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {request.status === ReimbursementRequestStatus.PENDING ? (
        <ClaimDecisionActions
          requestId={request.id}
          approveAction={approveAction}
          rejectAction={rejectAction}
        />
      ) : null}
    </Card>
  );
}

function InformationPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 text-teal-700" />
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[130px_minmax(0,1fr)]">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="flex min-w-0 items-start gap-1.5 break-words text-sm font-medium text-slate-900">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-slate-400"
          />
        ) : null}
        {value}
      </dd>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="flex items-center gap-2 text-xs text-slate-500">
        <Icon aria-hidden="true" className="size-4 text-teal-700" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-bold tabular-nums text-slate-950">
        {value}
      </dd>
    </div>
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
    <Badge variant="outline" className={config.badgeClassName}>
      <Icon aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

function EmptyClaimsState() {
  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-16">
      <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
        <ReceiptText aria-hidden="true" className="size-10" />
      </span>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        No Reimbursement Requests
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
        No medical reimbursement requests have been submitted yet.
      </p>
    </section>
  );
}

function formatDate(value: Date) {
  return dateFormatter.format(value);
}

function formatAmount(value: string) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amountFormatter.format(amount) : value;
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

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(size / 1024)} KB`;
  }

  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(size / (1024 * 1024))} MB`;
}
