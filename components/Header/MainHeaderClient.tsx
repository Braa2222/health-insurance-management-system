"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type MainHeaderClientProps = {
  desktopAuthAction: ReactNode;
  mobileAuthAction: ReactNode;
};

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
];

function isNavigationLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavigationLinkClassName(isActive: boolean, isMobile = false) {
  return cn(
    "relative text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
    isMobile
      ? "rounded-lg px-3 py-2 focus-visible:ring-offset-2"
      : "rounded-sm focus-visible:ring-offset-4",
    isActive
      ? cn(
          "text-teal-700 after:absolute after:h-0.5 after:rounded-full after:bg-teal-600",
          isMobile
            ? "bg-teal-50 after:bottom-1 after:left-3 after:w-5"
            : "after:-bottom-2 after:left-1/2 after:w-5 after:-translate-x-1/2",
        )
      : cn(
          "text-slate-600 hover:text-teal-700",
          isMobile && "hover:bg-teal-50",
        ),
  );
}

export function MainHeaderClient({
  desktopAuthAction,
  mobileAuthAction,
}: MainHeaderClientProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-slate-900 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
        >
          <Image
            src="/images/Icon.png"
            alt="Health Insurance System logo"
            width={40}
            height={40}
            className="h-9 w-9 object-contain md:h-10 md:w-10"
            preload
          />
          <span className="max-w-[11.5rem] overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold tracking-tight text-slate-900 sm:max-w-none md:text-lg">
            Health Insurance System
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
        >
          {navigationLinks.map((link) => {
            const isActive = isNavigationLinkActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={getNavigationLinkClassName(isActive)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {desktopAuthAction}
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label="Open main menu"
                className="h-10 w-10 rounded-lg border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 md:hidden"
              />
            }
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(20rem,calc(100vw-2rem))] border-slate-200 bg-white"
          >
            <SheetHeader className="border-b border-slate-200 px-5 py-4">
              <SheetTitle className="flex min-w-0 items-center gap-3 text-slate-900">
                <Image
                  src="/images/Icon.png"
                  alt="Health Insurance System logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
                <span className="max-w-[13rem] overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold tracking-tight text-slate-900 md:text-lg">
                  Health Insurance System
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 px-5 py-2 text-sm font-medium text-slate-600"
            >
              {navigationLinks.map((link) => {
                const isActive = isNavigationLinkActive(pathname, link.href);

                return (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={getNavigationLinkClassName(isActive, true)}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 p-5">
              <div className="[&_[data-slot=button]]:w-full">
                {mobileAuthAction}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
