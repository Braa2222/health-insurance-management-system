"use client";

import {
  CalendarDays,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivateInsuranceSubscriptionActionState } from "@/lib/action/activate-insurance-subscription.action";
import type {
  AvailableInsurancePlan,
  SubscriberForInsuranceActivation,
} from "@/lib/data/get-subscription-insurance";

type ActivateInsuranceSubscriptionAction = (
  previousState: ActivateInsuranceSubscriptionActionState,
  formData: FormData,
) => Promise<ActivateInsuranceSubscriptionActionState>;

type ActivateInsuranceSubscriptionFormProps = {
  subscribers: SubscriberForInsuranceActivation[];
  insurancePlans: AvailableInsurancePlan[];
  activateAction: ActivateInsuranceSubscriptionAction;
};

const initialState: ActivateInsuranceSubscriptionActionState = {
  success: false,
};

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

export function ActivateInsuranceSubscriptionForm({
  subscribers,
  insurancePlans,
  activateAction,
}: ActivateInsuranceSubscriptionFormProps) {
  const [subscriberId, setSubscriberId] = useState("");
  const [planId, setPlanId] = useState("");

  const [state, formAction, isPending] = useActionState(
    activateAction,
    initialState,
  );

  const selectedSubscriber = useMemo(
    () => subscribers.find((subscriber) => subscriber.id === subscriberId),
    [subscriberId, subscribers],
  );

  const selectedPlan = useMemo(
    () => insurancePlans.find((plan) => plan.id === planId),
    [insurancePlans, planId],
  );

  const submittedSubscriberId = selectedSubscriber ? subscriberId : "";
  const submittedPlanId = selectedPlan ? planId : "";

  const subscriberError = state.errors?.subscriberId?.[0];
  const planError = state.errors?.planId?.[0];

  const hasEligibleSubscribers = subscribers.length > 0;
  const hasAvailablePlans = insurancePlans.length > 0;

  const isSubmitDisabled =
    isPending ||
    !submittedSubscriberId ||
    !submittedPlanId ||
    !hasEligibleSubscribers ||
    !hasAvailablePlans;

  return (
    <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white py-0 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]">
      <CardHeader className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <ClipboardCheck aria-hidden="true" className="size-5" />
          </span>

          <div>
            <CardTitle
              id="activation-form-title"
              className="text-xl text-slate-950 sm:text-2xl"
            >
              Activate Subscriber Coverage
            </CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Choose an eligible subscriber and one active insurance plan.
              Activation is verified and completed securely on the server.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="space-y-4">
          {!hasEligibleSubscribers ? (
            <AvailabilityNotice
              icon={UserRound}
              title="No Subscribers Awaiting Activation"
              description="All registered subscribers already have active insurance subscriptions, or no subscriber accounts are available."
              tone="neutral"
            />
          ) : null}

          {!hasAvailablePlans ? (
            <AvailabilityNotice
              icon={ShieldCheck}
              title="No Available Insurance Plans"
              description="Create or activate an insurance plan before activating subscriber coverage."
              tone="warning"
            />
          ) : null}

          {state.message ? (
            <div
              role={state.success ? "status" : "alert"}
              aria-live="polite"
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-6 ${
                state.success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {state.success ? (
                <CircleCheck
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0"
                />
              ) : (
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0"
                />
              )}

              <span>{state.message}</span>
            </div>
          ) : null}
        </div>

        <form action={formAction} className="mt-7 space-y-7">
          <input
            type="hidden"
            name="subscriberId"
            value={submittedSubscriberId}
          />
          <input type="hidden" name="planId" value={submittedPlanId} />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2.5">
              <Label
                htmlFor="subscriber-select"
                className="text-sm font-semibold text-slate-800"
              >
                Subscriber
              </Label>

              <Select
                value={selectedSubscriber ? subscriberId : null}
                onValueChange={(value) => setSubscriberId(value ?? "")}
                disabled={isPending || !hasEligibleSubscribers}
              >
                <SelectTrigger
                  id="subscriber-select"
                  aria-invalid={Boolean(subscriberError)}
                  aria-describedby={
                    subscriberError ? "subscriber-error" : undefined
                  }
                  className="min-h-12 w-full rounded-xl border-slate-200 bg-slate-50/80 px-3.5 text-left hover:border-slate-300 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                >
                  <SelectValue placeholder="Select a subscriber">
                    {selectedSubscriber
                      ? `${selectedSubscriber.name || "Unnamed Subscriber"} — ${selectedSubscriber.email}`
                      : "Select a subscriber"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  align="start"
                  className="max-w-[calc(100vw-2rem)]"
                >
                  {subscribers.map((subscriber) => (
                    <SelectItem
                      key={subscriber.id}
                      value={subscriber.id}
                      className="py-2.5"
                    >
                      {subscriber.name || "Unnamed Subscriber"} —{" "}
                      {subscriber.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {subscriberError ? (
                <p
                  id="subscriber-error"
                  className="flex items-start gap-2 text-sm leading-5 text-red-600"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  {subscriberError}
                </p>
              ) : (
                <p className="text-xs leading-5 text-slate-500">
                  Only subscribers without active coverage are available.
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="insurance-plan-select"
                className="text-sm font-semibold text-slate-800"
              >
                Insurance Plan
              </Label>

              <Select
                value={selectedPlan ? planId : null}
                onValueChange={(value) => setPlanId(value ?? "")}
                disabled={isPending || !hasAvailablePlans}
              >
                <SelectTrigger
                  id="insurance-plan-select"
                  aria-invalid={Boolean(planError)}
                  aria-describedby={planError ? "plan-error" : undefined}
                  className="min-h-12 w-full rounded-xl border-slate-200 bg-slate-50/80 px-3.5 text-left hover:border-slate-300 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                >
                  <SelectValue placeholder="Select an insurance plan">
                    {selectedPlan
                      ? `${selectedPlan.name} (${selectedPlan.code})`
                      : "Select an insurance plan"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  align="start"
                  className="max-w-[calc(100vw-2rem)]"
                >
                  {insurancePlans.map((plan) => (
                    <SelectItem
                      key={plan.id}
                      value={plan.id}
                      className="py-2.5"
                    >
                      {plan.name} ({plan.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {planError ? (
                <p
                  id="plan-error"
                  className="flex items-start gap-2 text-sm leading-5 text-red-600"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  {planError}
                </p>
              ) : (
                <p className="text-xs leading-5 text-slate-500">
                  Only currently active insurance plans are shown.
                </p>
              )}
            </div>
          </div>

          {selectedSubscriber && selectedPlan ? (
            <section
              aria-labelledby="selection-summary-title"
              className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
                  <ClipboardCheck aria-hidden="true" className="size-4.5" />
                </span>

                <div>
                  <h3
                    id="selection-summary-title"
                    className="font-semibold text-slate-950"
                  >
                    Activation Summary
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Review the selected subscriber and coverage plan.
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryItem
                  icon={UserRound}
                  label="Subscriber"
                  value={selectedSubscriber.name || "Unnamed Subscriber"}
                />
                <SummaryItem
                  icon={Mail}
                  label="Email"
                  value={selectedSubscriber.email}
                />
                <SummaryItem
                  icon={WalletCards}
                  label="Insurance Plan"
                  value={selectedPlan.name}
                />
                <SummaryItem
                  icon={CalendarDays}
                  label="Price and Duration"
                  value={`$${formatAmount(selectedPlan.monthlyPrice)} / month · ${
                    selectedPlan.durationMonths
                  } ${
                    selectedPlan.durationMonths === 1 ? "month" : "months"
                  }`}
                />
              </dl>
            </section>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-slate-500">
              The server will verify the subscriber, plan availability, and
              administrator authorization before activation.
            </p>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-12 w-full rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 sm:w-auto"
            >
              {isPending ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  Activating Subscription...
                </>
              ) : (
                <>
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                  Activate Subscription
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type NoticeIcon = typeof UserRound;

function AvailabilityNotice({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: NoticeIcon;
  title: string;
  description: string;
  tone: "neutral" | "warning";
}) {
  const isWarning = tone === "warning";

  return (
    <div
      role={isWarning ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
        isWarning
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 opacity-80">{description}</p>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: NoticeIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white bg-white/80 p-3.5 shadow-sm">
      <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon aria-hidden="true" className="size-3.5 text-teal-600" />
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value}
      </dd>
    </div>
  );
}
