"use client";

import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  subscriberSignUpAction,
  type SubscriberSignUpActionState,
} from "@/lib/action/Subscriber-Sign-Up-action";

type SubscriberField =
  keyof NonNullable<SubscriberSignUpActionState["errors"]>;

const initialState: SubscriberSignUpActionState = { success: false };
const inputClassName =
  "h-12 rounded-xl border-slate-200 bg-slate-50/80 shadow-inner shadow-slate-200/30 transition-colors hover:border-slate-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20";

export function SubscriberSignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editedFields, setEditedFields] = useState<Set<SubscriberField>>(
    new Set(),
  );
  const [state, formAction, isPending] = useActionState(
    subscriberSignUpAction,
    initialState,
  );

  function markEdited(field: SubscriberField) {
    setEditedFields((current) => new Set(current).add(field));
  }

  function getError(field: SubscriberField) {
    return editedFields.has(field) ? undefined : state.errors?.[field]?.[0];
  }

  const generalError = editedFields.size === 0 ? state.message : undefined;

  return (
    <div className="w-full rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-9">
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-teal-700">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
        Subscriber registration
      </div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        Create Subscriber Account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create your account to manage your health insurance services.
      </p>

      <form
        action={formAction}
        noValidate
        onSubmit={() => setEditedFields(new Set())}
        className="mt-8 space-y-5"
      >
        <TextField
          id="subscriber-name"
          name="name"
          label="Full Name"
          autoComplete="name"
          placeholder="Enter your full name"
          disabled={isPending}
          error={getError("name")}
          onChange={() => markEdited("name")}
        />

        <TextField
          id="subscriber-email"
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
          id="subscriber-phone"
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

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            id="subscriber-password"
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
            id="subscriber-confirm-password"
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

        {generalError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            {generalError}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-xl bg-teal-600 font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </Button>
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

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  optional?: boolean;
};

function TextField({ label, error, optional, id, ...props }: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
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
