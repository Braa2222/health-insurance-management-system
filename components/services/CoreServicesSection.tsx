import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ClipboardCheck, Hospital, ShieldCheck, UserRoundCheck } from "lucide-react";

type CoreService = {
  id: string;
  category: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: LucideIcon;
};

const coreServices: CoreService[] = [
  { id: "insurance-policies", category: "Coverage", title: "Insurance Coverage Management", description: "Review insurance status, coverage information, and policy-related details through a clear and organized account experience.", capabilities: ["View insurance coverage status", "Review policy-related information", "Understand available coverage details", "Follow policy validity information"], icon: ShieldCheck },
  { id: "claims-management", category: "Claims", title: "Claims Management", description: "A structured service designed to help subscribers submit and follow insurance-related claims through clear status updates.", capabilities: ["Submit a claim", "Review claim information", "Follow claim status", "Receive clear status updates"], icon: ClipboardCheck },
  { id: "healthcare-providers", category: "Provider network", title: "Medical Provider Network", description: "Explore medical service providers according to provider type and available facility information.", capabilities: ["Browse providers", "Filter by provider type", "View facility information", "View location details when available"], icon: Hospital },
  { id: "member-support", category: "Account access", title: "Secure Account Management", description: "Provide each user with access to the information and services intended for their assigned role.", capabilities: ["Manage account information", "Update basic profile information", "Access role-specific services", "Maintain clear separation between user roles"], icon: UserRoundCheck },
];

export function CoreServicesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm">Platform overview</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Core Insurance Services</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Understand the main services provided through the platform and how they support subscribers and medical service providers.</p>
        </div>
        <div className="mt-12 space-y-6">
          {coreServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <article id={service.id} key={service.id} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-200 hover:shadow-md sm:p-8">
                <div className={`grid items-center gap-8 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">{service.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{service.title}</h3>
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">{service.description}</p>
                    <p className="mt-5 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">Available through the appropriate account experience</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
                    <p className="font-semibold text-slate-900">Planned account capabilities</p>
                    <ul className="mt-4 space-y-3">
                      {service.capabilities.map((capability) => (
                        <li key={capability} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" /><span>{capability}</span></li>
                      ))}
                    </ul>
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
