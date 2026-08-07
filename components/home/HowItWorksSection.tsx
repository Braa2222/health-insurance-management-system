import {
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Choose whether you are a subscriber or a medical service provider.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Complete Your Profile",
    description:
      "Enter the required personal or healthcare facility information securely.",
    icon: FileCheck2,
  },
  {
    number: "03",
    title: "Access Insurance Services",
    description: "Use the tools and services available for your account role.",
    icon: ClipboardList,
  },
  {
    number: "04",
    title: "Track Your Activity",
    description:
      "Follow insurance-related updates and statuses through your dashboard.",
    icon: LayoutDashboard,
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">
            Simple onboarding
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How the Platform Works
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Get started in a few clear and simple steps.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent lg:block"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/70 motion-reduce:transform-none"
              >
                {index < steps.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="absolute -right-3 top-16 z-10 hidden h-2 w-2 rounded-full bg-teal-300 ring-4 ring-slate-50 lg:block"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-teal-50 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700 ring-1 ring-teal-100">
                    {step.number}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="relative">
                  <h3 className="mt-7 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
