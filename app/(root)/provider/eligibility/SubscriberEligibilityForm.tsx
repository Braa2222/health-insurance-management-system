"use client";

import {
  BadgeCheck,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Mail,
  SearchX,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useActionState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubscriberEligibilityActionState } from "@/lib/action/check-subscriber-eligibility.action";

type CheckSubscriberEligibilityAction = (
  previousState: SubscriberEligibilityActionState,
  formData: FormData,
) => Promise<SubscriberEligibilityActionState>;

type SubscriberEligibilityFormProps = {
  checkAction: CheckSubscriberEligibilityAction;
};

type EligibleResult = NonNullable<
  SubscriberEligibilityActionState["result"]
>;

const initialState: SubscriberEligibilityActionState = {
  status: "idle",
};

export function SubscriberEligibilityForm({
  checkAction,
}: SubscriberEligibilityFormProps) {
  const [state, formAction, isPending] = useActionState(
    checkAction,
    initialState,
  );

  const emailError = isPending
    ? undefined
    : state.errors?.subscriberEmail?.[0];

  return (
    <>
      <Card className="gap-0 overflow-hidden rounded-3xl bg-white py-0 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>

            <div>
              <CardTitle className="text-xl text-slate-950 sm:text-2xl">
                Verify Subscriber
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Enter the subscriber&apos;s account email to verify their active
                insurance subscription.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 py-6 sm:px-8 sm:py-8">
          <form action={formAction} noValidate className="space-y-6">
            <div className="space-y-2.5">
              <Label
                htmlFor="subscriber-email"
                className="text-sm font-semibold text-slate-800"
              >
                Subscriber Email Address
              </Label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-[1.1rem] -translate-y-1/2 text-slate-400"
                />

                <Input
                  id="subscriber-email"
                  name="subscriberEmail"
                  type="email"
                  required
                  placeholder="subscriber@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={isPending}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={
                    emailError
                      ? "subscriber-email-error"
                      : "subscriber-email-help"
                  }
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/80 pl-11 shadow-inner shadow-slate-200/30 transition-colors hover:border-slate-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
                />
              </div>

              {emailError ? (
                <p
                  id="subscriber-email-error"
                  className="flex items-start gap-2 text-sm leading-5 text-red-600"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  {emailError}
                </p>
              ) : (
                <p
                  id="subscriber-email-help"
                  className="text-xs leading-5 text-slate-500"
                >
                  Enter the email address associated with the subscriber
                  account.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-slate-500">
                This check reads subscription information only and does not
                modify the subscriber account.
              </p>

              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 sm:w-auto"
              >
                {isPending ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck aria-hidden="true" className="size-4" />
                    Verify Eligibility
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <EligibilityFeedback state={state} isPending={isPending} />
    </>
  );
}

function EligibilityFeedback({
  state,
  isPending,
}: {
  state: SubscriberEligibilityActionState;
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="mt-6 flex items-start gap-4 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 text-teal-900 shadow-sm sm:p-6"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
          <LoaderCircle
            aria-hidden="true"
            className="size-5 animate-spin"
          />
        </span>

        <div>
          <h2 className="font-semibold">Verifying Eligibility</h2>
          <p className="mt-1 text-sm leading-6 text-teal-800">
            Checking the subscriber&apos;s insurance subscription and assigned
            plan.
          </p>
        </div>
      </section>
    );
  }

  if (state.status === "idle") {
    return null;
  }

  if (state.status === "eligible" && state.result) {
    return (
      <EligibleSubscriberResult
        result={state.result}
        message={state.message}
      />
    );
  }

  if (state.status === "subscriber_not_found") {
    return (
      <ResultNotice
        icon={SearchX}
        title="Subscriber Not Found"
        description={
          state.message ??
          "No subscriber account was found with the provided email address."
        }
        tone="neutral"
      />
    );
  }

  if (state.status === "no_active_subscription") {
    return (
      <ResultNotice
        icon={ShieldAlert}
        title="Not Eligible"
        description={
          state.message ??
          "The subscriber does not have an active insurance subscription."
        }
        tone="warning"
      />
    );
  }

  if (state.status === "error" && state.errors?.subscriberEmail) {
    return null;
  }

  return (
    <section
      role="alert"
      aria-live="polite"
      className="mt-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 shadow-sm sm:p-6"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm ring-1 ring-red-100">
        <CircleAlert aria-hidden="true" className="size-5" />
      </span>

      <div>
        <h2 className="font-semibold">Unable to Verify Eligibility</h2>
        <p className="mt-1 text-sm leading-6 text-red-800">
          {state.message ??
            "Unable to verify subscriber eligibility. Please try again."}
        </p>
      </div>
    </section>
  );
}

function EligibleSubscriberResult({
  result,
  message,
}: {
  result: EligibleResult;
  message?: string;
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="mt-6 overflow-hidden rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50 shadow-sm"
    >
      <div className="flex flex-col gap-4 border-b border-teal-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <CircleCheck aria-hidden="true" className="size-6" />
          </span>

          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Eligible Subscriber
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {message ??
                "The subscriber has an active insurance subscription."}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="h-7 self-start border-teal-200 bg-white px-3 font-semibold text-teal-700 sm:self-auto"
        >
          <BadgeCheck aria-hidden="true" />
          Active Subscription
        </Badge>
      </div>

      <dl className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        <ResultDetail
          icon={UserRound}
          label="Subscriber Name"
          value={result.subscriberName}
        />
        <ResultDetail
          icon={Mail}
          label="Subscriber Email"
          value={result.subscriberEmail}
        />
        <ResultDetail
          icon={BadgeCheck}
          label="Eligibility"
          value={result.eligibilityStatus}
        />
        <ResultDetail
          icon={CircleCheck}
          label="Subscription Status"
          value={result.subscriptionStatus}
        />
        <ResultDetail
          icon={ShieldCheck}
          label="Insurance Plan"
          value={result.planName}
        />
        <ResultDetail
          icon={ShieldCheck}
          label="Plan Code"
          value={result.planCode}
        />
      </dl>
    </section>
  );
}

function ResultDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white bg-white/80 p-4 shadow-sm">
      <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon aria-hidden="true" className="size-4 text-teal-600" />
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-slate-950">
        {value}
      </dd>
    </div>
  );
}

function ResultNotice({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: "neutral" | "warning";
}) {
  const isWarning = tone === "warning";

  return (
    <section
      role="status"
      aria-live="polite"
      className={`mt-6 flex items-start gap-4 rounded-2xl border p-5 shadow-sm sm:p-6 ${
        isWarning
          ? "border-amber-200 bg-amber-50/80 text-amber-950"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ${
          isWarning
            ? "text-amber-700 ring-amber-100"
            : "text-slate-600 ring-slate-200"
        }`}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div>
        <h2 className="font-semibold">{title}</h2>
        <p
          className={`mt-1 text-sm leading-6 ${
            isWarning ? "text-amber-800" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
