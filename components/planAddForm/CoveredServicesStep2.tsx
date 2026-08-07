import { ArrowLeft, ArrowRight, CircleAlert } from "lucide-react";

import {
  EmptyMedicalServicesAlert,
  FormActionBar,
  StepHeading,
} from "@/components/planAddForm/CreatePlanShared";
import { MedicalServiceCard } from "@/components/planAddForm/MedicalServiceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActiveMedicalService } from "@/lib/data/get-medical-services";
import type {
  CoverageEditableField,
  CoverageErrorsByService,
  CoverageFormValue,
} from "@/lib/planAddForm/create-insurance-plan.types";

type CoveredServicesStepProps = {
  hidden: boolean;
  medicalServices: ActiveMedicalService[];
  coverageValues: Record<string, CoverageFormValue>;
  coverageErrors: CoverageErrorsByService;
  selectedServicesCount: number;
  generalError?: string;
  isPending: boolean;
  onToggleService: (serviceId: string, selected: boolean) => void;
  onCoverageChange: (
    serviceId: string,
    field: CoverageEditableField,
    value: string,
  ) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function CoveredServicesStep({
  hidden,
  medicalServices,
  coverageValues,
  coverageErrors,
  selectedServicesCount,
  generalError,
  isPending,
  onToggleService,
  onCoverageChange,
  onBack,
  onContinue,
}: CoveredServicesStepProps) {
  return (
    <section hidden={hidden} aria-labelledby="covered-services-title">
      <StepHeading
        id="covered-services-title"
        eyebrow="Step 2 of 3"
        title="Covered Medical Services"
        description="Select the medical services included in the plan and define the coverage conditions for each service."
      />

      {generalError ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{generalError}</p>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Available Medical Services
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Select the services included in this insurance plan.
          </p>
        </div>
        <Badge className="h-8 self-start bg-teal-100 px-3 text-teal-800 hover:bg-teal-100 sm:self-auto">
          {selectedServicesCount}{" "}
          {selectedServicesCount === 1 ? "Service" : "Services"} Selected
        </Badge>
      </div>

      {medicalServices.length === 0 ? (
        <div className="mt-6">
          <EmptyMedicalServicesAlert />
        </div>
      ) : (
        <div className="mt-6 grid items-start gap-5 xl:grid-cols-2">
          {medicalServices.map((service) => (
            <MedicalServiceCard
              key={service.id}
              service={service}
              value={coverageValues[service.id]}
              errors={coverageErrors[service.id]}
              disabled={isPending}
              onToggle={(selected) => onToggleService(service.id, selected)}
              onChange={(field, value) =>
                onCoverageChange(service.id, field, value)
              }
            />
          ))}
        </div>
      )}

      <FormActionBar>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onBack}
          className="h-12 rounded-xl border-slate-300 bg-white px-6 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          disabled={isPending || medicalServices.length === 0}
          onClick={onContinue}
          className="h-12 rounded-xl bg-teal-600 px-6 text-white shadow-md shadow-teal-600/15 hover:bg-teal-700"
        >
          Continue
          <ArrowRight aria-hidden="true" />
        </Button>
      </FormActionBar>
    </section>
  );
}
