import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CircleUserRound, KeyRound, LockKeyhole, ShieldCheck, UserCog } from "lucide-react";

type SecurityPoint = { title: string; description: string; icon: LucideIcon };

const securityPoints: SecurityPoint[] = [
  { title: "Role-Based Access", description: "Users access the tools intended for their assigned account role.", icon: KeyRound },
  { title: "Protected Account Information", description: "Personal and facility information is handled through authenticated account access.", icon: LockKeyhole },
  { title: "Separate User Experiences", description: "Subscribers and medical providers receive different account flows and dashboards.", icon: CircleUserRound },
  { title: "Controlled Administrative Access", description: "System administration features are reserved for authorized system administrators.", icon: UserCog },
  { title: "Active Account Management", description: "Accounts can be managed according to their active status.", icon: BadgeCheck },
  { title: "Clear Service Permissions", description: "Services should remain separated according to user responsibility.", icon: ShieldCheck },
];

export function ServicesSecuritySection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-white blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-700 shadow-sm"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Controlled account access</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Secure Access for Every Role</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">The platform is structured to provide separate and controlled experiences for subscribers, medical service providers, and system administrators.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityPoints.map((point) => {
            const Icon = point.icon;
            return <article key={point.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100"><Icon className="h-5 w-5" aria-hidden="true" /></div><h3 className="mt-5 text-lg font-semibold text-slate-900">{point.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{point.description}</p></article>;
          })}
        </div>
        <aside className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
          <div className="flex gap-4"><UserCog className="mt-0.5 h-6 w-6 shrink-0 text-sky-600" aria-hidden="true" /><div><h3 className="font-semibold text-slate-900">System administrator access</h3><p className="mt-2 text-sm leading-6 text-slate-700">System administrators access protected management tools and are not registered through the public account creation flow.</p></div></div>
        </aside>
      </div>
    </section>
  );
}
