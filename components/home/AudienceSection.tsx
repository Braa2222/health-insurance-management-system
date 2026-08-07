import { ArrowRight, Building2, CheckCircle2, UserRound } from "lucide-react";
import Link from "next/link";

const audiences = [
  {
    title: "For Subscribers",
    description:
      "Manage personal insurance information and access your healthcare services from one secure account.",
    features: [
      "View insurance coverage",
      "Submit and track claims",
      "Find medical service providers",
      "Manage personal account information",
    ],
    href: "/sign-up/subscriber",
    buttonLabel: "Create Subscriber Account",
    icon: UserRound,
    accent: "teal",
    badge: "Members",
  },
  {
    title: "For Medical Service Providers",
    description:
      "Manage your healthcare facility profile and access insurance-related services through a dedicated provider account.",
    features: [
      "Manage facility information",
      "Work with subscriber coverage",
      "Access insurance-related requests",
      "Support hospitals, clinics, laboratories, and pharmacies",
    ],
    href: "/sign-up/provider",
    buttonLabel: "Register as a Provider",
    icon: Building2,
    accent: "sky",
    badge: "Providers",
  },
];

export function AudienceSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute left-0 top-16 h-64 w-64 rounded-full bg-teal-50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-12 right-0 h-72 w-72 rounded-full bg-sky-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
            Role-based access
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Designed for Every Participant
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Access the tools and services designed specifically for your role.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            const isProvider = audience.accent === "sky";

            return (
              <article
                key={audience.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 motion-reduce:transform-none"
              >
                <div
                  aria-hidden="true"
                  className={
                    isProvider
                      ? "h-1.5 bg-sky-500"
                      : "h-1.5 bg-teal-600"
                  }
                />
                <div
                  aria-hidden="true"
                  className={
                    isProvider
                      ? "absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-50 blur-2xl"
                      : "absolute right-0 top-0 h-36 w-36 rounded-full bg-teal-50 blur-2xl"
                  }
                />

                <div className="relative flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={
                        isProvider
                          ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 ring-1 ring-sky-100"
                          : "flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100"
                      }
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <span
                      className={
                        isProvider
                          ? "rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100"
                          : "rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-100"
                      }
                    >
                      {audience.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">
                    {audience.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                    {audience.description}
                  </p>

                  <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <ul className="space-y-3">
                      {audience.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-3 text-sm leading-6 text-slate-700"
                        >
                          <CheckCircle2
                            className={
                              isProvider
                                ? "mt-0.5 h-5 w-5 shrink-0 text-sky-500"
                                : "mt-0.5 h-5 w-5 shrink-0 text-teal-600"
                            }
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={audience.href}
                    className={
                      isProvider
                        ? "mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 font-medium text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4 sm:w-fit"
                        : "mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 font-medium text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4 sm:w-fit"
                    }
                  >
                    {audience.buttonLabel}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="rounded-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
