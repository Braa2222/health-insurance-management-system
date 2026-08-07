import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Create Account" },
];

const serviceLinks = [
  { href: "/services#insurance-policies", label: "Insurance Policies" },
  { href: "/services#claims-management", label: "Claims Management" },
  { href: "/services#healthcare-providers", label: "Healthcare Providers" },
  { href: "/services#member-support", label: "Member Support" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
];

const linkClassName =
  "text-sm text-slate-600 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4";

const headingClassName =
  "text-sm font-semibold uppercase tracking-wider text-slate-900";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 text-slate-900 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
            >
              <Image
                src="/images/Icon.png"
                alt="Health Insurance System logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Health Insurance System
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              A secure and reliable platform for managing health insurance
              policies, claims, healthcare services, and member information.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h2 className={headingClassName}>Quick Links</h2>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Our services">
            <h2 className={headingClassName}>Our Services</h2>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading">
            <h2 id="footer-contact-heading" className={headingClassName}>
              Contact
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic leading-6 text-slate-600">
              <p>
                Email:{" "}
                <a
                  href="mailto:support@healthinsurance.com"
                  className={linkClassName}
                >
                  support@healthinsurance.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+18001234567" className={linkClassName}>
                  +1 800 123 4567
                </a>
              </p>
              <p>Availability: Monday - Friday, 8:00 AM - 6:00 PM</p>
            </address>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            &copy; {currentYear} Health Insurance System. All rights reserved.
          </p>

          <nav aria-label="Legal links">
            <ul className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
