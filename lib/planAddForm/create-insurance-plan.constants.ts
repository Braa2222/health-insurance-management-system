import type { CreateInsurancePlanActionState } from "@/lib/action/create-insurance-plan.action";
import type { ActionErrorField } from "@/lib/planAddForm/create-insurance-plan.types";
import { CreateInsurancePlanSchema } from "@/lib/validators/insurance-plan.validator";

export const initialState: CreateInsurancePlanActionState = {
  success: false,
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const PlanInformationStepSchema = CreateInsurancePlanSchema.omit({
  imageUrl: true,
  coverages: true,
});

export const PLAN_FIELDS: ActionErrorField[] = [
  "planImage",
  "name",
  "code",
  "description",
  "monthlyPrice",
  "durationMonths",
  "maximumAnnualCoverage",
  "isActive",
];

export const categoryLabels: Record<string, string> = {
  LABORATORY: "Laboratory",
  PHARMACY: "Pharmacy",
  EMERGENCY: "Emergency",
  SURGERY: "Surgery",
  DENTAL: "Dental",
};

export const inputClassName =
  "h-12 rounded-xl border-slate-200 bg-slate-50/60 px-3.5 shadow-sm transition-all hover:border-slate-300 hover:bg-white focus-visible:border-teal-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-teal-500/15";

export const steps = [
  { number: 1, title: "Plan Information", mobileTitle: "Plan Info" },
  { number: 2, title: "Covered Services", mobileTitle: "Services" },
  { number: 3, title: "Review & Create", mobileTitle: "Review" },
] as const;
