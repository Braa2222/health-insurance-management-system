import { CheckCircle2, HeartPulse, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const trustItems = [
  "Secure access",
  "Role-based services",
  "Clear account experience",
];

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Health Insurance Services
          </span>
          <div aria-hidden="true" className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 text-teal-600 ring-1 ring-teal-100">
            <HeartPulse className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Services Designed for{" "}
            <span className="bg-gradient-to-r from-teal-600 to-sky-500 bg-clip-text text-transparent">Every Healthcare Role</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Explore the services available to subscribers and medical service providers through one secure and easy-to-use platform.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button nativeButton={false} render={<Link href="/sign-up" />} className="h-11 rounded-lg bg-teal-600 px-6 font-medium text-white shadow-sm hover:bg-teal-700 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
              Create Account
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/sign-in" />} className="h-11 rounded-lg border-slate-300 bg-white px-6 font-medium text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:ring-teal-500 focus-visible:ring-offset-2">
              <LogIn className="h-4 w-4" aria-hidden="true" /> Sign In
            </Button>
          </div>
          <ul className="mt-7 flex flex-col items-center justify-center gap-3 text-sm text-slate-500 sm:flex-row sm:flex-wrap">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden="true" />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
