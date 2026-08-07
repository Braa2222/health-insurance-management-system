"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import type { UserRole } from "@/app/generated/prisma/enums";
import { RoleSidebar } from "@/components/Sidebar/RoleSidebar";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AuthenticatedUserMenuProps = {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
};

function getUserInitial(name: string, email: string) {
  const source = name.trim() || email.trim() || "U";

  return source.charAt(0).toUpperCase();
}

export function AuthenticatedUserMenu({
  user,
}: AuthenticatedUserMenuProps) {
  const [open, setOpen] = useState(false);
  const initial = getUserInitial(user.name, user.email);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label={`Open account menu for ${user.name}`}
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1.5 pr-2 text-slate-700 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.22)] transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_8px_20px_-10px_rgba(13,148,136,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
          />
        }
      >
        <Avatar aria-hidden="true" className="size-9 border border-teal-100 shadow-sm">
          <AvatarFallback className="bg-linear-to-br from-teal-50 to-cyan-50 font-semibold text-teal-700">
            {initial}
          </AvatarFallback>
          <AvatarBadge className="size-2.5 bg-emerald-500 ring-2 ring-white" />
        </Avatar>

        <span className="hidden min-w-0 text-left md:block">
          <span className="block max-w-28 truncate text-[0.8rem] font-semibold leading-4 text-slate-800 group-hover:text-teal-800">
            {user.name}
          </span>
          <span className="block text-[0.65rem] leading-3 text-slate-500">
            My account
          </span>
        </span>

        <span className="flex size-8 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-500 transition-colors group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-700">
          <Menu aria-hidden="true" className="size-[1.05rem] -rotate-3" />
        </span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[92vw] max-w-[26rem] gap-0 overflow-x-hidden border-slate-200/80 bg-slate-50 p-0 text-slate-900 shadow-2xl sm:max-w-[26rem] [&_[data-slot=sheet-close]]:top-5 [&_[data-slot=sheet-close]]:right-5 [&_[data-slot=sheet-close]]:size-9 [&_[data-slot=sheet-close]]:rounded-full [&_[data-slot=sheet-close]]:border [&_[data-slot=sheet-close]]:border-white/80 [&_[data-slot=sheet-close]]:bg-white/80 [&_[data-slot=sheet-close]]:text-slate-600 [&_[data-slot=sheet-close]]:shadow-sm [&_[data-slot=sheet-close]]:backdrop-blur-sm [&_[data-slot=sheet-close]]:hover:bg-white [&_[data-slot=sheet-close]]:hover:text-slate-900"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Account navigation</SheetTitle>
        </SheetHeader>

        <RoleSidebar user={user} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
