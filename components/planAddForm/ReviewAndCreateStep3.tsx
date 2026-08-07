import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

import {
  FormActionBar,
  StepHeading,
} from "@/components/planAddForm/CreatePlanShared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ActiveMedicalService } from "@/lib/data/get-medical-services";
import type {
  PlanReviewValue,
  SerializedCoverage,
} from "@/lib/planAddForm/create-insurance-plan.types";
import {
  formatAmount,
  getCategoryLabel,
} from "@/lib/planAddForm/create-insurance-plan.utils";

type ReviewAndCreateStepProps = {
  hidden: boolean;
  plan: PlanReviewValue | null;
  previewUrl: string | null;
  selectedImage: File | null;
  coverages: SerializedCoverage[];
  serviceById: Map<string, ActiveMedicalService>;
  isPending: boolean;
  onBack: () => void;
};

export function ReviewAndCreateStep({
  hidden,
  plan,
  previewUrl,
  selectedImage,
  coverages,
  serviceById,
  isPending,
  onBack,
}: ReviewAndCreateStepProps) {
  return (
    <section hidden={hidden} aria-labelledby="review-create-title">
      <StepHeading
        id="review-create-title"
        eyebrow="Step 3 of 3"
        title="Review & Create"
        description="Review all plan information and covered services before creating the plan."
      />

      {plan ? (
        <ReviewContent
          plan={plan}
          previewUrl={previewUrl}
          selectedImage={selectedImage}
          coverages={coverages}
          serviceById={serviceById}
        />
      ) : null}

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
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-teal-600 px-6 text-white shadow-md shadow-teal-600/15 hover:bg-teal-700"
        >
          {isPending ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              Creating Insurance Plan...
            </>
          ) : (
            <>
              Create Insurance Plan
              <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
      </FormActionBar>
    </section>
  );
}

type ReviewContentProps = {
  plan: PlanReviewValue;
  previewUrl: string | null;
  selectedImage: File | null;
  coverages: SerializedCoverage[];
  serviceById: Map<string, ActiveMedicalService>;
};

function ReviewContent({
  plan,
  previewUrl,
  selectedImage,
  coverages,
  serviceById,
}: ReviewContentProps) {
  return (
    <div className="mt-7 space-y-6">
      <div className="grid gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 sm:grid-cols-4">
        <SummaryItem label="Selected Services" value={String(coverages.length)} />
        <SummaryItem label="Monthly Price" value={formatAmount(plan.monthlyPrice)} />
        <SummaryItem
          label="Duration"
          value={`${plan.durationMonths} ${
            plan.durationMonths === 1 ? "month" : "months"
          }`}
        />
        <SummaryItem label="Status" value={plan.isActive ? "Active" : "Inactive"} />
      </div>

      <ReviewSection title="Plan Information">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div>
            {previewUrl ? (
              <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Insurance plan cover preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            {selectedImage ? (
              <p className="mt-2 truncate text-xs text-slate-500">
                {selectedImage.name}
              </p>
            ) : null}
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <ReviewValue label="Plan Name" value={plan.name} />
            <ReviewValue label="Plan Code" value={plan.code} />
            <ReviewValue
              label="Monthly Price"
              value={formatAmount(plan.monthlyPrice)}
            />
            <ReviewValue
              label="Duration"
              value={`${plan.durationMonths} ${
                plan.durationMonths === 1 ? "month" : "months"
              }`}
            />
            <ReviewValue
              label="Maximum Annual Coverage"
              value={
                plan.maximumAnnualCoverage
                  ? formatAmount(plan.maximumAnnualCoverage)
                  : "Not specified"
              }
            />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </dt>
              <dd className="mt-2">
                <Badge
                  className={
                    plan.isActive
                      ? "bg-teal-100 text-teal-800 hover:bg-teal-100"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-200"
                  }
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </dd>
            </div>
            <ReviewValue
              label="Description"
              value={plan.description || "Not provided"}
              className="sm:col-span-2"
            />
          </dl>
        </div>
      </ReviewSection>

      <ReviewSection title="Covered Services">
        <div className="space-y-3">
          {coverages.map((coverage) => {
            const service = serviceById.get(coverage.serviceId);

            if (!service) {
              return null;
            }

            return (
              <article
                key={coverage.serviceId}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-950">
                      {service.name}
                    </h4>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {service.code}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-teal-200 bg-white text-teal-700"
                  >
                    {getCategoryLabel(service.category)}
                  </Badge>
                </div>
                <dl className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-3">
                  <ReviewValue
                    label="Coverage"
                    value={`${coverage.coveragePercentage}%`}
                  />
                  <ReviewValue
                    label="Annual Limit"
                    value={
                      coverage.annualLimit
                        ? formatAmount(coverage.annualLimit)
                        : "Not specified"
                    }
                  />
                  <ReviewValue
                    label="Notes"
                    value={coverage.notes || "Not provided"}
                  />
                </dl>
              </article>
            );
          })}
        </div>
      </ReviewSection>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ReviewValue({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words whitespace-pre-wrap text-sm font-medium text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
