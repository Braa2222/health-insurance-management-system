import { ShieldCheck } from "lucide-react";
import Image from "next/image";

import "@/app/(root)/globals.css";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <body className="min-h-screen overflow-x-hidden bg-white">
        <main className="grid min-h-screen lg:h-screen lg:grid-cols-[1.15fr_0.85fr]">
          <section
            aria-label="Health Insurance System"
            className="relative hidden overflow-hidden lg:block"
          >
            <Image
              src="/images/screen.png"
              alt="Modern healthcare facility"
              fill
              priority
              sizes="58vw"
              className="object-cover"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 bg-linear-to-t from-slate-950/45 via-slate-950/5 to-slate-950/15"
            />

            <div className="absolute left-10 top-10 z-20 flex items-center gap-3.5 rounded-2xl border border-white/25 bg-slate-950/15 px-3 py-2.5 shadow-lg backdrop-blur-md">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg">
                <Image
                  src="/images/Icon.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>

              <span className="pr-2 text-lg font-semibold tracking-tight text-white [text-shadow:0_1px_3px_rgb(15_23_42_/_0.45)]">
                Health Insurance System
              </span>
            </div>

            <div className="absolute bottom-10 left-10 z-20 max-w-md rounded-3xl border border-white/60 bg-white/92 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                Secure Health Insurance Platform
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                Connected Insurance Services
              </h2>

              <p className="mt-2.5 text-sm leading-6 text-slate-600">
                Manage your coverage, claims, and access to healthcare services
                through one secure platform.
              </p>
            </div>
          </section>

          <section className="relative isolate min-h-screen overflow-x-hidden overflow-y-auto bg-slate-50/70 lg:h-screen">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl"
            />

            <div className="flex min-h-full items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
              <div className="w-full max-w-2xl">
                <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-teal-100 bg-white p-1.5 shadow-sm">
                    <Image
                      src="/images/Icon.png"
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-contain"
                    />
                  </span>

                  <span className="min-w-0 text-lg font-semibold tracking-tight text-slate-900">
                    Health Insurance System
                  </span>
                </div>

                {children}
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
