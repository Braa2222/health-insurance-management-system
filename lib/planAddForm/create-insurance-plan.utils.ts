import {
  ACCEPTED_IMAGE_TYPES,
  categoryLabels,
  MAX_IMAGE_SIZE,
} from "@/lib/planAddForm/create-insurance-plan.constants";
import type {
  CoverageFormValue,
  SerializedCoverage,
  Step,
  StepStatus,
} from "@/lib/planAddForm/create-insurance-plan.types";

export function serializeCoverages(
  coverageValues: Record<string, CoverageFormValue>,
): SerializedCoverage[] {
  return Object.values(coverageValues).map((coverage) => ({
    serviceId: coverage.serviceId,
    coveragePercentage:
      coverage.coveragePercentage.trim() === ""
        ? Number.NaN
        : Number(coverage.coveragePercentage),
    annualLimit: coverage.annualLimit.trim(),
    notes: coverage.notes.trim(),
  }));
}

export function validatePlanImage(file: File) {
  if (file.size === 0) {
    return "The selected image file is empty.";
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return "Select a PNG, JPG, or WebP image.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The plan image must not exceed 5 MB.";
  }

  return undefined;
}

export function getCategoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

export function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatAmount(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function getStepStatus(
  stepNumber: number,
  currentStep: Step,
  complete: boolean,
): StepStatus {
  if (complete || stepNumber < currentStep) {
    return "completed";
  }

  if (stepNumber === currentStep) {
    return "active";
  }

  return "upcoming";
}
