"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { CoveredServicesStep } from "@/components/planAddForm/CoveredServicesStep2";
import { CreateInsurancePlanLayout } from "@/components/planAddForm/CreateInsurancePlanLayout";
import {
  EmptyMedicalServicesAlert,
  FormErrorAlert,
  SuccessCard,
} from "@/components/planAddForm/CreatePlanShared";
import { PlanInformationStep } from "@/components/planAddForm/PlanInformationStep1";
import { ReviewAndCreateStep } from "@/components/planAddForm/ReviewAndCreateStep3";
import { createInsurancePlanAction } from "@/lib/action/create-insurance-plan.action";
import {
  initialState,
  PLAN_FIELDS,
  PlanInformationStepSchema,
} from "@/lib/planAddForm/create-insurance-plan.constants";
import type {
  ActionErrorField,
  ClientFieldErrors,
  CoverageEditableField,
  CoverageErrorsByService,
  CoverageFormValue,
  CreateInsurancePlanFormProps,
  PlanReviewValue,
  Step,
} from "@/lib/planAddForm/create-insurance-plan.types";
import {
  serializeCoverages,
  validatePlanImage,
} from "@/lib/planAddForm/create-insurance-plan.utils";
import { PlanCoverageInputSchema } from "@/lib/validators/insurance-plan.validator";

export function CreateInsurancePlanForm({
  medicalServices,
}: CreateInsurancePlanFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [coverageValues, setCoverageValues] = useState<
    Record<string, CoverageFormValue>
  >({});
  const [coverageErrors, setCoverageErrors] =
    useState<CoverageErrorsByService>({});
  const [clientErrors, setClientErrors] = useState<ClientFieldErrors>({});
  const [editedFields, setEditedFields] = useState<Set<ActionErrorField>>(
    new Set(),
  );
  const [planReview, setPlanReview] = useState<PlanReviewValue | null>(null);

  // Connect the insurance plan form to the Server Action responsible for validating and saving the submitted data.
  const [state, formAction, isPending] = useActionState(
    createInsurancePlanAction,
    initialState,
  );

  const serviceById = useMemo(
    () => new Map(medicalServices.map((service) => [service.id, service])),
    [medicalServices],
  );

  const serializedCoverages = useMemo(
    () => serializeCoverages(coverageValues),
    [coverageValues],
  );

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.success || !state.errors) {
      return;
    }

    let targetStep: Step | null = null;

    if (PLAN_FIELDS.some((field) => state.errors?.[field]?.length)) {
      targetStep = 1;
    } else if (state.errors.coverages?.length) {
      targetStep = 2;
    }

    if (!targetStep) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setEditedFields(new Set());
      setStep(targetStep);
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [state]);

  function revokePreviewUrl() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreviewUrl(null);
  }

  function markEdited(field: ActionErrorField) {
    setEditedFields((current) => {
      const next = new Set(current);
      next.add(field);
      return next;
    });

    setClientErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function getFieldError(field: ActionErrorField) {
    if (clientErrors[field]) {
      return clientErrors[field];
    }

    if (editedFields.has(field)) {
      return undefined;
    }

    return state.errors?.[field]?.[0];
  }

  function moveToStep(nextStep: Step) {
    setStep(nextStep);

    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function selectPlanImage(file: File, synchronizeFileInput = false) {
    markEdited("planImage");

    const error = validatePlanImage(file);

    if (error) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      revokePreviewUrl();
      setSelectedImage(null);
      setClientErrors((current) => ({
        ...current,
        planImage: error,
      }));
      return;
    }

    if (synchronizeFileInput && fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;
    }

    revokePreviewUrl();

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setSelectedImage(file);
    setPreviewUrl(objectUrl);
  }

  function removePlanImage() {
    if (isPending) {
      return;
    }

    markEdited("planImage");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    revokePreviewUrl();
    setSelectedImage(null);
  }

  function validatePlanInformationStep() {
    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const imageError = selectedImage
      ? validatePlanImage(selectedImage)
      : "Select a plan cover image.";

    const result = PlanInformationStepSchema.safeParse({
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      monthlyPrice: formData.get("monthlyPrice"),
      durationMonths: formData.get("durationMonths"),
      maximumAnnualCoverage: formData.get("maximumAnnualCoverage"),
      isActive: formData.get("isActive"),
    });

    const nextErrors: ClientFieldErrors = {};

    if (imageError) {
      nextErrors.planImage = imageError;
    }

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      nextErrors.name = fieldErrors.name?.[0];
      nextErrors.code = fieldErrors.code?.[0];
      nextErrors.description = fieldErrors.description?.[0];
      nextErrors.monthlyPrice = fieldErrors.monthlyPrice?.[0];
      nextErrors.durationMonths = fieldErrors.durationMonths?.[0];
      nextErrors.maximumAnnualCoverage =
        fieldErrors.maximumAnnualCoverage?.[0];
      nextErrors.isActive = fieldErrors.isActive?.[0];
    }

    setEditedFields(new Set());
    setClientErrors(nextErrors);

    if (!result.success || imageError) {
      return;
    }

    setPlanReview({
      name: result.data.name,
      code: result.data.code,
      description: result.data.description ?? "",
      monthlyPrice: result.data.monthlyPrice,
      durationMonths: result.data.durationMonths,
      maximumAnnualCoverage: result.data.maximumAnnualCoverage ?? "",
      isActive: result.data.isActive,
    });
    moveToStep(2);
  }

  function toggleService(serviceId: string, selected: boolean) {
    if (isPending) {
      return;
    }

    markEdited("coverages");

    setCoverageValues((current) => {
      const next = { ...current };

      if (selected) {
        next[serviceId] = {
          serviceId,
          coveragePercentage: "100",
          annualLimit: "",
          notes: "",
        };
      } else {
        delete next[serviceId];
      }

      return next;
    });

    setCoverageErrors((current) => {
      if (!current[serviceId]) {
        return current;
      }

      const next = { ...current };
      delete next[serviceId];
      return next;
    });
  }

  function updateCoverage(
    serviceId: string,
    field: CoverageEditableField,
    value: string,
  ) {
    markEdited("coverages");

    setCoverageValues((current) => ({
      ...current,
      [serviceId]: {
        ...current[serviceId],
        [field]: value,
      },
    }));

    setCoverageErrors((current) => {
      const serviceErrors = current[serviceId];

      if (!serviceErrors?.[field]) {
        return current;
      }

      const nextServiceErrors = { ...serviceErrors };
      delete nextServiceErrors[field];

      return {
        ...current,
        [serviceId]: nextServiceErrors,
      };
    });
  }

  function validateCoveredServicesStep() {
    const values = Object.values(coverageValues);
    setEditedFields(new Set());

    if (values.length === 0) {
      setCoverageErrors({});
      setClientErrors((current) => ({
        ...current,
        coverages: "Select at least one covered medical service.",
      }));
      return;
    }

    const nextCoverageErrors: CoverageErrorsByService = {};
    let hasInvalidCoverage = false;

    for (const coverage of values) {
      const result = PlanCoverageInputSchema.safeParse({
        serviceId: coverage.serviceId,
        coveragePercentage:
          coverage.coveragePercentage.trim() === ""
            ? Number.NaN
            : Number(coverage.coveragePercentage),
        annualLimit: coverage.annualLimit,
        notes: coverage.notes,
      });

      if (result.success) {
        continue;
      }

      hasInvalidCoverage = true;
      const fieldErrors = result.error.flatten().fieldErrors;

      nextCoverageErrors[coverage.serviceId] = {
        coveragePercentage: fieldErrors.coveragePercentage?.[0],
        annualLimit: fieldErrors.annualLimit?.[0],
        notes: fieldErrors.notes?.[0],
      };
    }

    setCoverageErrors(nextCoverageErrors);

    if (hasInvalidCoverage) {
      setClientErrors((current) => ({
        ...current,
        coverages:
          "Correct the highlighted coverage details before continuing.",
      }));
      return;
    }

    setClientErrors((current) => {
      const next = { ...current };
      delete next.coverages;
      return next;
    });

    if (!planReview) {
      moveToStep(1);
      return;
    }

    moveToStep(3);
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (step === 3) {
      return;
    }

    event.preventDefault();

    if (step === 1) {
      validatePlanInformationStep();
    } else {
      validateCoveredServicesStep();
    }
  }

  if (state.success) {
    return (
      <CreateInsurancePlanLayout currentStep={3} complete>
        <SuccessCard message={state.message} />
      </CreateInsurancePlanLayout>
    );
  }

  return (
    <CreateInsurancePlanLayout currentStep={step}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleFormSubmit}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10"
      >
        <input
          type="hidden"
          name="isActive"
          value={isActive ? "true" : "false"}
        />
        <input
          type="hidden"
          name="coverages"
          value={JSON.stringify(serializedCoverages)}
        />

        <FormErrorAlert message={state.message} />
        {medicalServices.length === 0 ? (
          <EmptyMedicalServicesAlert />
        ) : null}

        <PlanInformationStep
          hidden={step !== 1}
          fileInputRef={fileInputRef}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          isActive={isActive}
          isPending={isPending}
          canContinue={medicalServices.length > 0}
          getFieldError={getFieldError}
          markEdited={markEdited}
          onFileSelected={selectPlanImage}
          onRemoveImage={removePlanImage}
          onStatusChange={(active) => {
            setIsActive(active);
            markEdited("isActive");
          }}
          onContinue={validatePlanInformationStep}
        />

        <CoveredServicesStep
          hidden={step !== 2}
          medicalServices={medicalServices}
          coverageValues={coverageValues}
          coverageErrors={coverageErrors}
          selectedServicesCount={serializedCoverages.length}
          generalError={getFieldError("coverages")}
          isPending={isPending}
          onToggleService={toggleService}
          onCoverageChange={updateCoverage}
          onBack={() => moveToStep(1)}
          onContinue={validateCoveredServicesStep}
        />

        <ReviewAndCreateStep
          hidden={step !== 3}
          plan={planReview}
          previewUrl={previewUrl}
          selectedImage={selectedImage}
          coverages={serializedCoverages}
          serviceById={serviceById}
          isPending={isPending}
          onBack={() => moveToStep(2)}
        />
      </form>
    </CreateInsurancePlanLayout>
  );
}
