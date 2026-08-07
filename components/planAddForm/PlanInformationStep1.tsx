import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  FieldError,
  FormActionBar,
  SectionLabel,
  StepHeading,
  TextField,
} from "@/components/planAddForm/CreatePlanShared";
import { PlanImageField } from "@/components/planAddForm/PlanImageField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionErrorField } from "@/lib/planAddForm/create-insurance-plan.types";

type PlanInformationStepProps = {
  hidden: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedImage: File | null;
  previewUrl: string | null;
  isActive: boolean;
  isPending: boolean;
  canContinue: boolean;
  getFieldError: (field: ActionErrorField) => string | undefined;
  markEdited: (field: ActionErrorField) => void;
  onFileSelected: (file: File, synchronizeFileInput?: boolean) => void;
  onRemoveImage: () => void;
  onStatusChange: (active: boolean) => void;
  onContinue: () => void;
};

export function PlanInformationStep({
  hidden,
  fileInputRef,
  selectedImage,
  previewUrl,
  isActive,
  isPending,
  canContinue,
  getFieldError,
  markEdited,
  onFileSelected,
  onRemoveImage,
  onStatusChange,
  onContinue,
}: PlanInformationStepProps) {
  const descriptionError = getFieldError("description");

  return (
    <section hidden={hidden} aria-labelledby="plan-information-title">
      <StepHeading
        id="plan-information-title"
        eyebrow="Step 1 of 3"
        title="Plan Information"
        description="Enter the general information and pricing details for this insurance plan."
      />

      <div className="mt-8">
        <SectionLabel label="Plan Cover Image" />
        <PlanImageField
          fileInputRef={fileInputRef}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          disabled={isPending}
          error={getFieldError("planImage")}
          onFileSelected={onFileSelected}
          onRemove={onRemoveImage}
        />
      </div>

      <div className="mt-10">
        <SectionLabel label="Basic Details" withSeparator />
        <div className="mt-5 grid gap-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:grid-cols-2 sm:p-6">
          <TextField
            id="plan-name"
            name="name"
            label="Plan Name"
            placeholder="Example: Essential Care Plan"
            required
            disabled={isPending}
            error={getFieldError("name")}
            onChange={() => markEdited("name")}
          />
          <TextField
            id="plan-code"
            name="code"
            label="Plan Code"
            placeholder="Example: ESSENTIAL_2026"
            required
            autoCapitalize="characters"
            spellCheck={false}
            disabled={isPending}
            error={getFieldError("code")}
            onChange={() => markEdited("code")}
          />
          <TextField
            id="monthly-price"
            name="monthlyPrice"
            label="Monthly Price"
            placeholder="150.00"
            inputMode="decimal"
            required
            disabled={isPending}
            error={getFieldError("monthlyPrice")}
            onChange={() => markEdited("monthlyPrice")}
          />
          <TextField
            id="duration-months"
            name="durationMonths"
            type="number"
            label="Duration in Months"
            placeholder="12"
            min={1}
            max={120}
            step={1}
            required
            disabled={isPending}
            error={getFieldError("durationMonths")}
            onChange={() => markEdited("durationMonths")}
          />
          <TextField
            id="maximum-annual-coverage"
            name="maximumAnnualCoverage"
            label="Maximum Annual Coverage"
            placeholder="50000.00"
            inputMode="decimal"
            optional
            disabled={isPending}
            error={getFieldError("maximumAnnualCoverage")}
            onChange={() => markEdited("maximumAnnualCoverage")}
            className="sm:col-span-2"
          />

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="plan-description">
              Description
              <span className="font-normal text-slate-400">(optional)</span>
            </Label>
            <Textarea
              id="plan-description"
              name="description"
              placeholder="Describe the benefits and intended coverage of this plan."
              maxLength={1000}
              disabled={isPending}
              aria-invalid={Boolean(descriptionError)}
              aria-describedby={
                descriptionError ? "plan-description-error" : undefined
              }
              onChange={() => markEdited("description")}
              className="min-h-32 resize-y rounded-xl border-slate-200 bg-white px-3.5 py-3.5 shadow-sm focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-500/15"
            />
            <FieldError id="plan-description-error" error={descriptionError} />
          </div>

          <PlanStatusField
            active={isActive}
            disabled={isPending}
            error={getFieldError("isActive")}
            onChange={onStatusChange}
          />
        </div>
      </div>

      <FormActionBar>
        <Button
          nativeButton={false}
          render={<Link href="/" />}
          variant="outline"
          className="h-12 rounded-xl border-slate-300 bg-white px-6 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={isPending || !canContinue}
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

function PlanStatusField({
  active,
  disabled,
  error,
  onChange,
}: {
  active: boolean;
  disabled: boolean;
  error?: string;
  onChange: (active: boolean) => void;
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <Label id="plan-status-label">Plan Status</Label>
      <div
        className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 shadow-sm transition-colors ${
          active
            ? "border-teal-200 bg-teal-50/60"
            : "border-slate-200 bg-white"
        }`}
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {active ? "Active" : "Inactive"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {active
              ? "This plan will be available for administrative use."
              : "This plan will be created as inactive."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="Plan status"
          aria-checked={active}
          aria-invalid={Boolean(error)}
          disabled={disabled}
          onClick={() => onChange(!active)}
          className={`inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 shadow-inner transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            active
              ? "bg-teal-600 hover:bg-teal-700"
              : "bg-slate-300 hover:bg-slate-400"
          }`}
        >
          <span
            aria-hidden="true"
            className={`block size-6 rounded-full border border-slate-200/80 bg-white shadow-md transition-transform duration-200 ease-out ${
              active ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      <FieldError id="plan-status-error" error={error} />
    </div>
  );
}
