import {
  BellDot,
  CheckCircle2,
  Hospital,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const benefits = [
  {
    title: "Secure Personal Data",
    description:
      "Sensitive member and provider information is handled with care.",
    icon: LockKeyhole,
  },
  {
    title: "Role-Based Access",
    description:
      "Users access only the tools and information relevant to their role.",
    icon: ShieldCheck,
  },
  {
    title: "Simple Claims Tracking",
    description:
      "Claims can be submitted and followed through clear status updates.",
    icon: CheckCircle2,
  },
  {
    title: "Medical Provider Management",
    description:
      "Healthcare facilities can manage essential provider information.",
    icon: Hospital,
  },
  {
    title: "Clear Status Updates",
    description:
      "Important insurance-related activity is easier to review and follow.",
    icon: BellDot,
  },
  {
    title: "Responsive Across Devices",
    description:
      "The interface is designed to work across phones, tablets, and desktops.",
    icon: Smartphone,
  },
];

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-teal-50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-sky-50 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
            Platform Benefits
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for Security, Clarity, and Reliability
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            A modern platform designed to make health insurance services easier,
            safer, and more accessible.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-sky-50 shadow-sm">
            <div className="border-b border-teal-100 px-6 py-4">
              <p className="text-sm font-semibold text-teal-900">
                Public, clear, and role-aware
              </p>
            </div>
            <p className="px-6 py-5 text-sm leading-6 text-teal-800">
              The homepage stays public and simple while guiding subscribers and
              medical service providers toward the correct account path.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/70 motion-reduce:transform-none"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
