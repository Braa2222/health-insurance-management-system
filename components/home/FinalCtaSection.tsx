import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 px-6 py-12 text-center shadow-xl shadow-teal-900/10 sm:px-10 lg:px-16">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Manage Your Health Insurance More Easily?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-teal-50 sm:text-lg">
          Create your account and access the services designed for your role.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-teal-700"
          >
            Create Account
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/70 bg-transparent px-6 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-teal-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
