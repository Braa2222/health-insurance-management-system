import type { LucideIcon } from "lucide-react";
import { ArrowRight, Building2, CheckCircle2, Hospital, Microscope, Pill, Stethoscope } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ProviderType = { name: string; icon: LucideIcon };

const providerTypes: ProviderType[] = [
  { name: "Hospital", icon: Hospital },
  { name: "Clinic", icon: Stethoscope },
  { name: "Laboratory", icon: Microscope },
  { name: "Pharmacy", icon: Pill },
];

const providerServices = [
  "Create and manage a medical facility profile",
  "Define the medical provider type",
  "Maintain license and contact information",
  "Manage facility address and city",
  "Access provider-specific insurance services",
  "Work within a dedicated role-based account",
];

const facilityFields = ["Facility name", "Provider type", "License number", "Address", "City"];

export function ProviderServicesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50 shadow-sm">
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm"><Building2 className="h-7 w-7" aria-hidden="true" /></div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-sky-700">Medical service provider account</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Services for Medical Service Providers</h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">Medical service providers can create a dedicated facility profile and access services designed for healthcare organizations.</p>
              <div className="mt-7 rounded-2xl border border-sky-100 bg-white/80 p-5">
                <h3 className="font-semibold text-slate-900">Facility profile information</h3>
                <ul className="mt-4 flex flex-wrap gap-2">{facilityFields.map((field) => <li key={field} className="rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-800 ring-1 ring-sky-100">{field}</li>)}</ul>
              </div>
              <div className="mt-8 flex flex-col items-start gap-4">
                <Button nativeButton={false} render={<Link href="/sign-up/provider" />} className="h-11 w-full rounded-lg bg-sky-500 px-6 font-medium text-white hover:bg-sky-600 focus-visible:ring-sky-400 focus-visible:ring-offset-2 sm:w-fit">Register as a Medical Provider <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
                <Link href="/sign-in" className="rounded-sm text-sm font-medium text-sky-700 underline-offset-4 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4">Already registered? Sign In</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Supported provider types</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {providerTypes.map((provider) => {
                  const Icon = provider.icon;
                  return <div key={provider.name} className="rounded-2xl border border-sky-100 bg-white p-4 text-center shadow-sm"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Icon className="h-5 w-5" aria-hidden="true" /></div><p className="mt-3 text-sm font-medium text-slate-800">{provider.name}</p></div>;
                })}
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="font-semibold text-slate-900">Provider account services</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">{providerServices.map((service) => <li key={service} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" aria-hidden="true" /><span>{service}</span></li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
