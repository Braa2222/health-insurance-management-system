import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    title: "Insurance Coverage",
    description:
      "View insurance status, coverage details, and policy information.",
    icon: ShieldCheck,
    accent: "Coverage visibility",
  },
  {
    title: "Claims Management",
    description: "Submit insurance claims and follow their progress easily.",
    icon: ClipboardCheck,
    accent: "Guided claim flow",
  },
  {
    title: "Medical Providers",
    description: "Access hospitals, clinics, laboratories, and pharmacies.",
    icon: Building2,
    accent: "Provider network",
  },
  {
    title: "Secure Account Management",
    description: "Access information safely according to your account role.",
    icon: FileText,
    accent: "Role-aware access",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-white blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">
            Core services
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need in One Platform
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Access and manage essential health insurance services through one
            secure and user-friendly system.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/70 motion-reduce:transform-none"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-sky-500 opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-teal-50 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="mt-5 inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                    {service.accent}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-teal-700">
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
