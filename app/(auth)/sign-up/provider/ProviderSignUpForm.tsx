"use client";

import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  providerSignUpAction,
  type ProviderSignUpActionState,
} from "@/lib/action/Provider-Sign-Up-action";
import {
  MEDICAL_PROVIDER_TYPES,
  MEDICAL_PROVIDER_TYPE_LABELS,
  ProviderAccountStepSchema,
  ProviderFacilityStepSchema,
  type MedicalProviderTypeValue,
} from "@/lib/validators/Provider-sign-up";

type Step = 1 | 2 | 3;
type ProviderField =
  keyof NonNullable<ProviderSignUpActionState["errors"]>;

type ReviewValues = {
  name: string;
  email: string;
  phone: string;
  facilityName: string;
  providerType: string;
  licenseNumber: string;
  address: string;
  city: string;
};

const initialState: ProviderSignUpActionState = { success: false };
const inputClassName =
  "h-12 rounded-xl border-slate-200 bg-slate-50/80 shadow-inner shadow-slate-200/30 transition-colors hover:border-slate-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";
const steps = [
  { number: 1, label: "Account" },
  { number: 2, label: "Facility" },
  { number: 3, label: "Review" },
] as const;

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function ProviderSignUpForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [providerType, setProviderType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [clientErrors, setClientErrors] = useState<
    NonNullable<ProviderSignUpActionState["errors"]>
  >({});
  const [editedFields, setEditedFields] = useState<Set<ProviderField>>(
    new Set(),
  );
  const [reviewValues, setReviewValues] = useState<ReviewValues | null>(null);
  const [state, formAction, isPending] = useActionState(
    providerSignUpAction,
    initialState,
  );

  function markEdited(field: ProviderField) {
    setEditedFields((current) => new Set(current).add(field));
  }

  function getError(field: ProviderField) {
    if (editedFields.has(field)) return undefined;
    return clientErrors[field]?.[0] ?? state.errors?.[field]?.[0];
  }

  function moveToStep(nextStep: Step) {
    setStep(nextStep);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function validateAccountStep() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const result = ProviderAccountStepSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    setEditedFields(new Set());
    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }

    setClientErrors({});
    moveToStep(2);
  }

  function validateFacilityStep() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const result = ProviderFacilityStepSchema.safeParse({
      facilityName: formData.get("facilityName"),
      providerType: formData.get("providerType"),
      licenseNumber: formData.get("licenseNumber"),
      address: formData.get("address"),
      city: formData.get("city"),
    });

    setEditedFields(new Set());
    if (!result.success) {
      setClientErrors(result.error.flatten().fieldErrors);
      return;
    }

    setClientErrors({});
    setReviewValues({
      name: readString(formData, "name"),
      email: readString(formData, "email"),
      phone: readString(formData, "phone"),
      facilityName: readString(formData, "facilityName"),
      providerType: readString(formData, "providerType"),
      licenseNumber: readString(formData, "licenseNumber"),
      address: readString(formData, "address"),
      city: readString(formData, "city"),
    });
    moveToStep(3);
  }

  const generalError = editedFields.size === 0 ? state.message : undefined;

  return (
    <div className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-9">
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-teal-700">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
        Provider registration
      </div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        Register Medical Service Provider
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create an account for your healthcare facility.
      </p>

      <ol aria-label="Registration progress" className="mt-8 grid grid-cols-3 gap-2">
        {steps.map((item) => {
          const active = step === item.number;
          const complete = step > item.number;

          return (
            <li
              key={item.number}
              aria-current={active ? "step" : undefined}
              className="min-w-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    active || complete
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.number}
                </span>
                <span
                  className={`truncate text-xs font-medium sm:text-sm ${
                    active || complete ? "text-teal-700" : "text-slate-500"
                  }`}
                >
                  {item.label}
                  {complete ? <span className="sr-only"> completed</span> : null}
                </span>
              </div>
              <div
                aria-hidden="true"
                className={`mt-2 h-1 rounded-full ${
                  active || complete ? "bg-teal-500" : "bg-slate-200"
                }`}
              />
            </li>
          );
        })}
      </ol>

      <form
        ref={formRef}
        action={formAction}
        noValidate
        onSubmit={() => {
          setEditedFields(new Set());
          setClientErrors({});
        }}
        className="mt-8"
      >
        <section hidden={step !== 1} aria-labelledby="account-step-title">
          <StepHeading
            id="account-step-title"
            title="Account Information"
            description="Enter the information used to access your provider account."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField
              className="sm:col-span-2"
              id="provider-name"
              name="name"
              label="Full Name"
              autoComplete="name"
              placeholder="Enter your full name"
              disabled={isPending}
              error={getError("name")}
              onChange={() => markEdited("name")}
            />
            <TextField
              className="sm:col-span-2"
              id="provider-email"
              name="email"
              type="email"
              label="Email Address"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Enter your email address"
              disabled={isPending}
              error={getError("email")}
              onChange={() => markEdited("email")}
            />
            <TextField
              className="sm:col-span-2"
              id="provider-phone"
              name="phone"
              type="tel"
              label="Phone Number"
              optional
              autoComplete="tel"
              placeholder="Enter your phone number"
              disabled={isPending}
              error={getError("phone")}
              onChange={() => markEdited("phone")}
            />
            <PasswordField
              id="provider-password"
              name="password"
              label="Password"
              placeholder="Create a password"
              visible={showPassword}
              disabled={isPending}
              error={getError("password")}
              onChange={() => markEdited("password")}
              onToggle={() => setShowPassword((value) => !value)}
            />
            <PasswordField
              id="provider-confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              visible={showConfirmation}
              disabled={isPending}
              error={getError("confirmPassword")}
              onChange={() => markEdited("confirmPassword")}
              onToggle={() => setShowConfirmation((value) => !value)}
            />
          </div>
          <Button
            type="button"
            onClick={validateAccountStep}
            className="mt-7 h-11 w-full bg-teal-600 text-white hover:bg-teal-700"
          >
            Next
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </section>

        <section hidden={step !== 2} aria-labelledby="facility-step-title">
          <StepHeading
            id="facility-step-title"
            title="Facility Information"
            description="Tell us about the healthcare facility you represent."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField
              className="sm:col-span-2"
              id="facility-name"
              name="facilityName"
              label="Facility Name"
              placeholder="Enter the facility name"
              disabled={isPending}
              error={getError("facilityName")}
              onChange={() => markEdited("facilityName")}
            />

            <div className="space-y-2">
              <Label htmlFor="provider-type">Provider Type</Label>
              <Select
                id="provider-type"
                name="providerType"
                value={providerType || null}
                disabled={isPending}
                onValueChange={(value) => {
                  setProviderType(value ?? "");
                  markEdited("providerType");
                }}
              >
                <SelectTrigger
                  aria-invalid={Boolean(getError("providerType"))}
                  aria-describedby={
                    getError("providerType") ? "provider-type-error" : undefined
                  }
                  className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/80"
                >
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICAL_PROVIDER_TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {MEDICAL_PROVIDER_TYPE_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("providerType") ? (
                <p id="provider-type-error" className="text-sm text-red-600">
                  {getError("providerType")}
                </p>
              ) : null}
            </div>

            <TextField
              id="license-number"
              name="licenseNumber"
              label="License Number"
              placeholder="Example: XXX-XXX-XXX or XX-XX-XX"
              disabled={isPending}
              error={getError("licenseNumber")}
              onChange={() => markEdited("licenseNumber")}
            />
            <TextField
              className="sm:col-span-2"
              id="provider-address"
              name="address"
              label="Address"
              optional
              placeholder="Enter the facility address"
              disabled={isPending}
              error={getError("address")}
              onChange={() => markEdited("address")}
            />
            <TextField
              className="sm:col-span-2"
              id="provider-city"
              name="city"
              label="City"
              optional
              placeholder="Enter the city"
              disabled={isPending}
              error={getError("city")}
              onChange={() => markEdited("city")}
            />
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => moveToStep(1)}
              className="h-11 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              onClick={validateFacilityStep}
              className="h-11 bg-teal-600 text-white hover:bg-teal-700"
            >
              Next
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section hidden={step !== 3} aria-labelledby="review-step-title">
          <StepHeading
            id="review-step-title"
            title="Review and Submit"
            description="Review your registration details before submitting."
          />
          {reviewValues ? <ReviewSummary values={reviewValues} /> : null}
          {generalError ? (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              {generalError}
            </div>
          ) : null}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => moveToStep(2)}
              className="h-11 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                  Submitting Registration...
                </>
              ) : (
                <>
                  Submit Registration
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </section>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

function StepHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <h2 id={id} className="text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </>
  );
}

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  optional?: boolean;
};

function TextField({
  label,
  error,
  optional,
  id,
  className,
  ...props
}: TextFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label}
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
      {error ? (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  visible: boolean;
  disabled: boolean;
  error?: string;
  onChange: () => void;
  onToggle: () => void;
};

function PasswordField({
  id,
  name,
  label,
  placeholder,
  visible,
  disabled,
  error,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${inputClassName} pr-11`}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ReviewSummary({ values }: { values: ReviewValues }) {
  const providerTypeLabel = MEDICAL_PROVIDER_TYPES.includes(
    values.providerType as MedicalProviderTypeValue,
  )
    ? MEDICAL_PROVIDER_TYPE_LABELS[
        values.providerType as MedicalProviderTypeValue
      ]
    : "Not selected";

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      <ReviewCard
        title="Account Information"
        rows={[
          ["Full Name", values.name],
          ["Email Address", values.email],
          ["Phone Number", values.phone || "Not provided"],
        ]}
      />
      <ReviewCard
        title="Facility Information"
        rows={[
          ["Facility Name", values.facilityName],
          ["Provider Type", providerTypeLabel],
          ["License Number", values.licenseNumber],
          ["Address", values.address || "Not provided"],
          ["City", values.city || "Not provided"],
        ]}
      />
    </div>
  );
}

function ReviewCard({
  title,
  rows,
}: {
  title: string;
  rows: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-slate-500">{label}</dt>
            <dd className="break-words font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
