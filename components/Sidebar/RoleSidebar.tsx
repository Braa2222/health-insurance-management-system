"use client";

import {
  BadgeCheck,
  Clock3,
  LoaderCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { UserRole } from "@/app/generated/prisma/enums";
import {
  sidebarLinks,
  userRoleLabels,
} from "@/components/Sidebar/sidebarLinks";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type RoleSidebarProps = {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  onNavigate?: () => void;
};

function isSidebarLinkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getUserInitial(name: string, email: string) {
  const source = name.trim() || email.trim() || "U";

  return source.charAt(0).toUpperCase();
}

export function RoleSidebar({ user, onNavigate }: RoleSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const links = sidebarLinks[user.role];
  const roleLabel = userRoleLabels[user.role];
  const initial = getUserInitial(user.name, user.email);
  const hasPlannedLinks = links.some((link) => !link.isAvailable);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut({
        redirectTo: "/",
      });
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="relative shrink-0 overflow-hidden border-b border-teal-100/80 bg-linear-to-br from-teal-50 via-white to-cyan-50 px-5 pt-5 pr-16 pb-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-teal-200/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-14 size-36 rounded-full bg-cyan-200/20 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white/90 text-teal-700 shadow-sm">
            <ShieldCheck aria-hidden="true" className="size-[1.1rem]" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
              Account Center
            </p>
            <p className="mt-0.5 text-[0.68rem] text-slate-500">
              Secure workspace access
            </p>
          </div>
        </div>

        <div className="relative mt-5 flex min-w-0 items-center gap-3.5 rounded-2xl border border-white/90 bg-white/75 p-3.5 shadow-[0_12px_30px_-20px_rgba(15,118,110,0.65)] backdrop-blur-sm">
          <Avatar className="size-12 border-2 border-white shadow-md ring-1 ring-teal-100">
            <AvatarFallback className="bg-linear-to-br from-teal-100 to-cyan-50 text-base font-bold text-teal-800">
              {initial}
            </AvatarFallback>
            <AvatarBadge className="size-3 bg-emerald-500 ring-2 ring-white" />
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {user.name}
            </p>

            <p
              title={user.email}
              className="mt-0.5 truncate text-xs text-slate-500"
            >
              {user.email}
            </p>

            <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50/90 px-2.5 py-1 text-[0.65rem] font-semibold text-teal-700">
              <BadgeCheck aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{roleLabel}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">
            Navigation
          </p>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[0.62rem] font-medium text-slate-500 shadow-sm">
            Role based
          </span>
        </div>

        <nav aria-label={`${roleLabel} navigation`} className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            if (!link.isAvailable) {
              return (
                <div
                  key={link.href}
                  aria-disabled="true"
                  title={`${link.label} is planned but not available yet`}
                  className="flex min-h-12 cursor-not-allowed items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-50 text-slate-400">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate font-medium">
                    {link.label}
                  </span>

                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[0.6rem] font-semibold tracking-wide text-slate-500">
                    Coming soon
                  </span>
                </div>
              );
            }

            const isActive = isSidebarLinkActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
                  isActive
                    ? "border-teal-200 bg-white font-semibold text-teal-800 shadow-[0_10px_24px_-16px_rgba(13,148,136,0.8)] before:absolute before:inset-y-3 before:left-0 before:w-0.5 before:rounded-r-full before:bg-teal-500"
                    : "border-transparent bg-white/70 font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:-translate-y-px hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-sm",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                    isActive
                      ? "border-teal-100 bg-teal-50 text-teal-700"
                      : "border-slate-200/70 bg-slate-50 text-slate-500 group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-700",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>

                <span className="min-w-0 flex-1 truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {hasPlannedLinks ? (
        <div className="mx-4 mb-4 shrink-0 rounded-2xl border border-teal-100 bg-linear-to-br from-teal-50 to-white p-3.5 shadow-[0_8px_24px_-20px_rgba(13,148,136,0.75)]">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
              <Clock3 aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Workspace updates
              </p>
              <p className="mt-1 text-[0.68rem] leading-4 text-slate-500">
                More tools will appear here as they become available.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="shrink-0 border-t border-slate-200 bg-white/90 p-4 shadow-[0_-8px_24px_-24px_rgba(15,23,42,0.5)] backdrop-blur-sm">
        {/*
          Navigation visibility is only a UI convenience. Protected pages,
          Server Actions, and API routes must validate auth and role server-side.
        */}
        <button
          type="button"
          disabled={isSigningOut}
          onClick={handleSignOut}
          aria-busy={isSigningOut}
          className="group flex min-h-12 w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-red-600 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition-colors group-hover:bg-white">
            {isSigningOut ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <LogOut aria-hidden="true" className="size-4" />
            )}
          </span>

          <span aria-live="polite">
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </span>
        </button>
      </footer>
    </aside>
  );
}
