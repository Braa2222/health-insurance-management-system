import { AudienceSection } from "@/components/home/AudienceSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesSection } from "@/components/home/ServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AudienceSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FinalCtaSection />
    </>
  );
}
