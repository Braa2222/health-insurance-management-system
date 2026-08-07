import type { Metadata } from "next";

import { CoreServicesSection } from "@/components/services/CoreServicesSection";
import { ProviderServicesSection } from "@/components/services/ProviderServicesSection";
import { ServicesCtaSection } from "@/components/services/ServicesCtaSection";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesProcessSection } from "@/components/services/ServicesProcessSection";
import { ServicesSecuritySection } from "@/components/services/ServicesSecuritySection";
import { SubscriberServicesSection } from "@/components/services/SubscriberServicesSection";

export const metadata: Metadata = {
  title: "Health Insurance Services | Health Insurance System",
  description:
    "Explore health insurance services for subscribers and medical service providers, including coverage information, claims, provider access, and secure role-based account management.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <CoreServicesSection />
      <SubscriberServicesSection />
      <ProviderServicesSection />
      <ServicesProcessSection />
      <ServicesSecuritySection />
      <ServicesCtaSection />
    </>
  );
}
