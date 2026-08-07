import { ArrowRight, CheckCircle2, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const subscriberServices = [
  "View insurance coverage information",
  "Follow policy status and validity",
  "Submit and track insurance claims",
  "Find hospitals, clinics, laboratories, and pharmacies",
  "Review notifications and status updates",
  "Manage personal account information",
];

export function SubscriberServicesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-white via-white to-teal-50 shadow-sm">
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm"><UserRound className="h-7 w-7" aria-hidden="true" /></div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700">Subscriber account</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Services for Subscribers</h2>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">Subscribers can use a secure personal account to access insurance information and follow the services related to their coverage.</p>
              <div className="mt-8 flex flex-col items-start gap-4">
                <Button nativeButton={false} render={<Link href="/sign-up/subscriber" />} className="h-11 w-full rounded-lg bg-teal-600 px-6 font-medium text-white hover:bg-teal-700 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:w-fit">
                  Create Subscriber Account <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Link href="/sign-in" className="rounded-sm text-sm font-medium text-teal-700 underline-offset-4 hover:text-teal-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-4">Already have an account? Sign In</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-white/90 p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Subscriber account services</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">The platform is designed to support these role-specific account capabilities.</p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {subscriberServices.map((service) => (
                  <li key={service} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" /><span>{service}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
