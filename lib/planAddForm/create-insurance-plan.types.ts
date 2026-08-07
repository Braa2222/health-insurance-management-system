import type { CreateInsurancePlanActionState } from "@/lib/action/create-insurance-plan.action";
import type { ActiveMedicalService } from "@/lib/data/get-medical-services";

export type Step = 1 | 2 | 3;
export type StepStatus = "completed" | "active" | "upcoming";

export type CoverageFormValue = {
  serviceId: string;
  coveragePercentage: string;
  annualLimit: string;
  notes: string;
};

export type CoverageEditableField = Exclude<
  keyof CoverageFormValue,
  "serviceId"
>;

export type CoverageFieldErrors = Partial<
  Record<CoverageEditableField, string>
>;

export type CoverageErrorsByService = Record<
  string,
  CoverageFieldErrors | undefined
>;

export type ActionErrors = NonNullable<
  CreateInsurancePlanActionState["errors"]
>;

export type ActionErrorField = keyof ActionErrors;
export type ClientFieldErrors = Partial<Record<ActionErrorField, string>>;

export type PlanReviewValue = {
  name: string;
  code: string;
  description: string;
  monthlyPrice: string;
  durationMonths: number;
  maximumAnnualCoverage: string;
  isActive: boolean;
};

export type SerializedCoverage = {
  serviceId: string;
  coveragePercentage: number;
  annualLimit: string;
  notes: string;
};

export type CreateInsurancePlanFormProps = {
  medicalServices: ActiveMedicalService[];
};
