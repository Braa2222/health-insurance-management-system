import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { steps } from "@/lib/planAddForm/create-insurance-plan.constants";
import type {
  Step,
  StepStatus,
} from "@/lib/planAddForm/create-insurance-plan.types";
import { getStepStatus } from "@/lib/planAddForm/create-insurance-plan.utils";

type CreateInsurancePlanLayoutProps = {
  currentStep: Step;
  complete?: boolean;
  children: React.ReactNode;
};

export function CreateInsurancePlanLayout({
  currentStep,
  complete = false,
  children,
}: CreateInsurancePlanLayoutProps) {
  return (
    <div
      className={`grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] ${
        complete ? "" : "xl:gap-8"
      }`}
    >
      <DesktopProgressStepper currentStep={currentStep} complete={complete} />

      <div className="min-w-0">
        <MobileProgressStepper currentStep={currentStep} complete={complete} />
        {children}
      </div>
    </div>
  );
}

function DesktopProgressStepper({
  currentStep,
  complete,
}: {
  currentStep: Step;
  complete: boolean;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.4)]">
        <div className="mb-7 border-b border-slate-100 pb-6">
          <Badge className="bg-teal-100 px-3 text-teal-800 hover:bg-teal-100">
            Creation Progress
          </Badge>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Build your plan
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Complete each section before creating the insurance plan.
          </p>
        </div>

        <ol aria-label="Insurance plan creation progress">
          {steps.map((item, index) => {
            const status = getStepStatus(item.number, currentStep, complete);

            return (
              <li
                key={item.number}
                className="relative flex gap-4 pb-11 last:pb-0"
                aria-current={status === "active" ? "step" : undefined}
              >
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`absolute left-[19px] top-10 h-[calc(100%-1.25rem)] w-px ${
                      status === "completed" ? "bg-teal-500" : "bg-slate-200"
                    }`}
                  />
                ) : null}

                <StepCircle status={status} number={item.number} />

                <div className="min-w-0 pt-1">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                      status === "upcoming"
                        ? "text-slate-500"
                        : "text-teal-700"
                    }`}
                  >
                    Step {item.number}
                  </p>
                  <p
                    className={`mt-1.5 text-sm ${
                      status === "active"
                        ? "font-bold text-teal-800"
                        : status === "completed"
                          ? "font-semibold text-slate-800"
                          : "font-medium text-slate-500"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {!complete ? (
          <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            <p className="text-xs font-semibold text-teal-800">
              You can return to completed steps before submitting the plan.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Your entered information remains available while moving between
              the form steps.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function MobileProgressStepper({
  currentStep,
  complete,
}: {
  currentStep: Step;
  complete: boolean;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-sm sm:px-5 lg:hidden">
      <ol
        aria-label="Insurance plan creation progress"
        className="grid grid-cols-3"
      >
        {steps.map((item, index) => {
          const status = getStepStatus(item.number, currentStep, complete);

          return (
            <li
              key={item.number}
              className="relative flex min-w-0 flex-col items-center px-1 text-center"
              aria-current={status === "active" ? "step" : undefined}
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`absolute left-[calc(50%+16px)] right-[calc(-50%+16px)] top-4 h-px ${
                    status === "completed" ? "bg-teal-500" : "bg-slate-200"
                  }`}
                />
              ) : null}

              <StepCircle status={status} number={item.number} compact />

              <span
                className={`mt-2 w-full text-[11px] leading-4 sm:text-xs ${
                  status === "active"
                    ? "font-bold text-teal-800"
                    : status === "completed"
                      ? "font-semibold text-slate-800"
                      : "font-medium text-slate-500"
                }`}
              >
                <span className="sm:hidden">{item.mobileTitle}</span>
                <span className="hidden sm:inline">{item.title}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepCircle({
  status,
  number,
  compact = false,
}: {
  status: StepStatus;
  number: number;
  compact?: boolean;
}) {
  const sizeClassName = compact ? "size-8" : "size-10";

  if (status === "completed") {
    return (
      <span
        className={`relative z-10 flex ${sizeClassName} shrink-0 items-center justify-center rounded-full bg-teal-600 text-white`}
      >
        <Check aria-hidden="true" className={compact ? "size-3.5" : "size-4"} />
        <span className="sr-only">Step {number}, completed</span>
      </span>
    );
  }

  if (status === "active") {
    return (
      <span
        className={`relative z-10 flex ${sizeClassName} shrink-0 items-center justify-center rounded-full border-2 border-teal-600 bg-teal-600 text-white shadow-[0_0_0_4px_rgba(20,184,166,0.14)]`}
      >
        <span
          aria-hidden="true"
          className={compact ? "text-xs font-bold" : "text-sm font-bold"}
        >
          {number}
        </span>
        <span className="sr-only">Step {number}, current</span>
      </span>
    );
  }

  return (
    <span
      className={`relative z-10 flex ${sizeClassName} shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-50 text-slate-600`}
    >
      <span
        aria-hidden="true"
        className={
          compact ? "text-xs font-semibold" : "text-sm font-semibold"
        }
      >
        {number}
      </span>
      <span className="sr-only">Step {number}, upcoming</span>
    </span>
  );
}
