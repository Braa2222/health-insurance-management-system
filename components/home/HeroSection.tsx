import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustItems = ["Secure data", "Easy access", "Reliable healthcare services"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-sm font-medium text-teal-700 shadow-sm shadow-teal-900/5 backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Secure Digital Health Insurance Platform
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Manage Your{" "}
            <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              Health Insurance
            </span>{" "}
            With Confidence
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            A secure and reliable platform that helps subscribers manage their
            insurance coverage and enables medical service providers to deliver
            services more efficiently.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 font-medium text-white shadow-lg shadow-teal-900/15 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4"
            >
              Create Account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#services"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:flex-wrap">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-100 via-sky-100 to-white blur-2xl"
          />
          <div className="relative rounded-[2rem] border border-white bg-white/80 p-2 shadow-2xl shadow-slate-300/50 ring-1 ring-slate-200/80 backdrop-blur">
            <div className="absolute -left-5 top-8 hidden rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-lg shadow-slate-200/70 lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Protected access
                  </p>
                  <p className="text-xs text-slate-500">Role-based portal</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-8 hidden rounded-2xl border border-sky-100 bg-white px-4 py-3 shadow-lg shadow-slate-200/70 lg:block">
              <div className="flex items-center gap-2 text-xs font-medium text-sky-700">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Healthcare workflow ready
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
              <Image
                src="/images/home/hero-dashboard.png"
                alt="Health insurance management dashboard preview"
                width={1200}
                height={800}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
