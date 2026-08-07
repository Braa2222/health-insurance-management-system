import { CheckCircle2, CircleAlert, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inputClassName } from "@/lib/planAddForm/create-insurance-plan.constants";

export function StepHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-100 pb-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export function SectionLabel({
  label,
  withSeparator = false,
}: {
  label: string;
  withSeparator?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
        {label}
      </h3>
      {withSeparator ? (
        <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
      ) : null}
    </div>
  );
}

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  optional?: boolean;
};

export function TextField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label}
        {props.required ? (
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        ) : null}
        {optional ? (
          <span className="font-normal text-slate-400">(optional)</span>
        ) : null}
      </Label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
        {...props}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}

export function FormErrorAlert({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
    >
      <CircleAlert
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-red-600"
      />
      <p>{message}</p>
    </div>
  );
}

export function EmptyMedicalServicesAlert() {
  return (
    <div
      role="alert"
      className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900"
    >
      <CircleAlert
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-amber-700"
      />
      <div>
        <h3 className="font-semibold">No Active Medical Services</h3>
        <p className="mt-1 text-sm leading-6 text-amber-800">
          Add or activate medical services before creating an insurance plan.
        </p>
      </div>
    </div>
  );
}

export function FormActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 -mb-5 mt-10 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:-mb-8 sm:px-8 lg:static lg:mx-0 lg:mb-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-6 lg:backdrop-blur-none">
      {children}
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) {
    return null;
  }

  return (
    <p id={id} className="text-sm text-red-600">
      {error}
    </p>
  );
}

export function SuccessCard({ message }: { message?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] sm:px-10">
      <span className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
        <CheckCircle2 aria-hidden="true" className="size-10" />
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
        Insurance Plan Created
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        {message || "Insurance plan created successfully."}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        The insurance plan and its covered medical services were saved
        successfully.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          variant="outline"
          className="h-12 rounded-xl border-slate-300 bg-white px-6 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          Back to Home
        </Button>
        <Button
          type="button"
          onClick={() => window.location.reload()}
          className="h-12 rounded-xl bg-teal-600 px-6 text-white shadow-md shadow-teal-600/15 hover:bg-teal-700"
        >
          <RefreshCw aria-hidden="true" />
          Create Another Plan
        </Button>
      </div>
    </div>
  );
}
