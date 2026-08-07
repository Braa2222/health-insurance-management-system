"use client";

import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInAction,
  type SignInActionState,
} from "@/lib/action/Sign-In-action";

const initialState: SignInActionState = {
  success: false,
};

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailEditedAfterError, setEmailEditedAfterError] = useState(false);
  const [passwordEditedAfterError, setPasswordEditedAfterError] =
    useState(false);
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  const emailError = emailEditedAfterError
    ? undefined
    : state.errors?.email?.[0];
  const passwordError = passwordEditedAfterError
    ? undefined
    : state.errors?.password?.[0];
  const generalError =
    emailEditedAfterError || passwordEditedAfterError
      ? undefined
      : state.message;

  return (
    <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-9 lg:p-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-teal-700">
        <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
        Secure member access
      </div>

      <div className="mt-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Sign in securely to access your health insurance account.
        </p>
      </div>

      <form
        action={formAction}
        noValidate
        onSubmit={() => {
          setEmailEditedAfterError(false);
          setPasswordEditedAfterError(false);
        }}
        className="mt-8 space-y-5"
      >
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-800"
          >
            Email Address
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-slate-400"
            />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              disabled={isPending}
              onChange={() => setEmailEditedAfterError(true)}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
              className="h-12 rounded-xl border-slate-200 bg-slate-50/80 pl-11 shadow-inner shadow-slate-200/30 transition-colors hover:border-slate-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
            />
          </div>

          {emailError ? (
            <p id="email-error" className="text-sm leading-5 text-red-600">
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-slate-800"
          >
            Password
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-slate-400"
            />

            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isPending}
              onChange={() => setPasswordEditedAfterError(true)}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={
                passwordError ? "password-error" : undefined
              }
              className="h-12 rounded-xl border-slate-200 bg-slate-50/80 pl-11 pr-12 shadow-inner shadow-slate-200/30 transition-colors hover:border-slate-300 focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-teal-500/20"
            />

            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>

          {passwordError ? (
            <p id="password-error" className="text-sm leading-5 text-red-600">
              {passwordError}
            </p>
          ) : null}
        </div>

        {generalError ? (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          >
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />

            <span>{generalError}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-xl bg-teal-600 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/25 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-teal-700 underline-offset-4 transition-colors hover:text-teal-800 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          Create Account
        </Link>
      </p>

      <p className="mt-8 text-center text-xs leading-5 text-slate-400">
        © {new Date().getFullYear()} Health Insurance System. All rights
        reserved.
      </p>
    </div>
  );
}
