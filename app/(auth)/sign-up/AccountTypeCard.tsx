import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type AccountTypeCardProps = {
  title: string;
  description: string;
  actionText: string;
  href: string;
  icon: LucideIcon;
};

export function AccountTypeCard({
  title,
  description,
  actionText,
  href,
  icon: Icon,
}: AccountTypeCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {description}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
            {actionText}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
