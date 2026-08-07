import { Building2, LogIn, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ServicesCtaSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-12 text-center text-white shadow-xl shadow-teal-900/10 sm:px-10 lg:px-16">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Choose the Account That Matches Your Role</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-teal-50 sm:text-lg">Create the right account for your needs or sign in to continue using the platform.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button nativeButton={false} render={<Link href="/sign-up/subscriber" />} className="h-11 rounded-lg bg-white px-6 font-medium text-teal-700 hover:bg-teal-50 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700"><UserRound className="h-4 w-4" aria-hidden="true" />Subscriber Account</Button>
          <Button nativeButton={false} render={<Link href="/sign-up/provider" />} className="h-11 rounded-lg bg-white px-6 font-medium text-teal-700 hover:bg-teal-50 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700"><Building2 className="h-4 w-4" aria-hidden="true" />Provider Account</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/sign-in" />} className="h-11 rounded-lg border-white/70 bg-transparent px-6 font-medium text-white hover:bg-white/10 hover:text-white focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-700"><LogIn className="h-4 w-4" aria-hidden="true" />Sign In</Button>
        </div>
      </div>
    </section>
  );
}
