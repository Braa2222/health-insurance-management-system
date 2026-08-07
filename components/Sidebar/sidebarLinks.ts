import {
  Bell,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/app/generated/prisma/enums";

export type SidebarLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  isAvailable: boolean;
};

export const userRoleLabels = {
  SUBSCRIBER: "Subscriber",
  MEDICAL_SERVICE_PROVIDER: "Medical Service Provider",
  SYSTEM_ADMIN: "System Administrator",
} satisfies Record<UserRole, string>;

export const sidebarLinks = {
  SUBSCRIBER: [
    {
      label: "My Coverage",
      href: "/subscriber/coverage",
      icon: ShieldCheck,
      isAvailable: true,
    },
      {
      label: "My Claims",
      href: "/subscriber/claims",
      icon: FileText,
      isAvailable: true,
    },
    {
      label: "Dashboard",
      href: "/subscriber/dashboard",
      icon: LayoutDashboard,
      isAvailable: false,
    },
    
  
    {
      label: "Medical Providers",
      href: "/subscriber/providers",
      icon: Building2,
      isAvailable: false,
    },
    {
      label: "Notifications",
      href: "/subscriber/notifications",
      icon: Bell,
      isAvailable: false,
    },
    {
      label: "Profile",
      href: "/subscriber/profile",
      icon: UserRound,
      isAvailable: false,
    },
  ],
  MEDICAL_SERVICE_PROVIDER: [
    {
  label: "Eligibility Check",
  href: "/provider/eligibility",
  icon: ShieldCheck,
  isAvailable: true,
},
    {
      label: "Dashboard",
      href: "/provider/dashboard",
      icon: LayoutDashboard,
      isAvailable: false,
    },
    {
      label: "Facility Profile",
      href: "/provider/profile",
      icon: Building2,
      isAvailable: false,
    },
  
    {
      label: "Service Requests",
      href: "/provider/requests",
      icon: ClipboardList,
      isAvailable: false,
    },
    {
      label: "Claims",
      href: "/provider/claims",
      icon: FileText,
      isAvailable: false,
    },
    {
      label: "Notifications",
      href: "/provider/notifications",
      icon: Bell,
      isAvailable: false,
    },
  ],
  SYSTEM_ADMIN: [
      {
       label: "Insurance Plans",
      href: "/admin/insurance-plans",
      icon:ClipboardList ,
      isAvailable: true,
    },
        {
  label: "Subscriptions",
  href: "/admin/subscriptions",
  icon: ClipboardCheck,
  isAvailable: true,
},
   {
      label: "Claims",
      href: "/admin/claims",
      icon: FileText,
      isAvailable: true,
    },
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      isAvailable: false,
    },
  

    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
      isAvailable: false,
    },
    {
      label: "Medical Providers",
      href: "/admin/providers",
      icon: Building2,
      isAvailable: false,
    },
 
    {
      label: "Reports",
      href: "/admin/reports",
      icon: ChartNoAxesCombined,
      isAvailable: false,
    },
    {
      label: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      isAvailable: false,
    },
  ],
} satisfies Record<UserRole, readonly SidebarLink[]>;
