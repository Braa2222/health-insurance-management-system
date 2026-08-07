import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, ListChecks, UserPlus, UsersRound } from "lucide-react";

type ProcessStep = { number: string; title: string; description: string; icon: LucideIcon };

const processSteps: ProcessStep[] = [
  { number: "01", title: "Choose Your Account Type", description: "Choose whether you are registering as a subscriber or a medical service provider.", icon: UsersRound },
  { number: "02", title: "Create Your Account", description: "Provide the required personal or facility account information.", icon: UserPlus },
  { number: "03", title: "Complete Your Profile", description: "Complete the information required for your selected role.", icon: ListChecks },
  { number: "04", title: "Access Role-Based Services", description: "Use the services and dashboard features available to your account role.", icon: LayoutDashboard },
];

export function ServicesProcessSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">Simple onboarding</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How to Access the Services</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Start using the platform through a simple and role-specific process.</p>
        </div>
        <div className="relative mt-12">
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-gradient-to-r from-teal-100 via-teal-300 to-sky-200 lg:block" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return <article key={step.number} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"><div className="relative flex items-center justify-between gap-4"><span className="text-3xl font-bold text-teal-600">{step.number}</span><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100"><Icon className="h-5 w-5" aria-hidden="true" /></div></div><h3 className="mt-6 text-lg font-semibold text-slate-900">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p></article>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
