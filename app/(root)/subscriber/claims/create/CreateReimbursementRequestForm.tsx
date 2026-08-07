"use client";

import {
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  FileCheck2,
  FileText,
  HeartPulse,
  Info,
  LoaderCircle,
  LockKeyhole,
  ReceiptText,
  Send,
  ShieldCheck,
  Upload,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateReimbursementRequestActionState } from "@/lib/action/create-reimbursement-request.action";
import type { SubscriberClaimFormData } from "@/lib/data/get-subscriber-claim-form-data";

type CreateReimbursementRequestFormProps = {
  data: SubscriberClaimFormData;
  action: (
    state: CreateReimbursementRequestActionState,
    formData: FormData,
  ) => Promise<CreateReimbursementRequestActionState>;
};

type ActionErrorField = keyof NonNullable<
  CreateReimbursementRequestActionState["errors"]
>;

const initialState: CreateReimbursementRequestActionState = {
  success: false,
};

const MAX_INVOICE_SIZE = 5 * 1024 * 1024;
const supportedInvoiceTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

export function CreateReimbursementRequestForm({
  data,
  action,
}: CreateReimbursementRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [planCoverageId, setPlanCoverageId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [description, setDescription] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceFileError, setInvoiceFileError] = useState<string>();
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [editedFields, setEditedFields] = useState<Set<ActionErrorField>>(
    new Set(),
  );

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateReimbursementRequestActionState,
      formData: FormData,
    ) => {
      const nextState = await action(previousState, formData);

      if (nextState.success) {
        formRef.current?.reset();
        setPlanCoverageId("");
        setServiceDate("");
        setRequestedAmount("");
        setDescription("");
        setInvoiceFile(null);
        setInvoiceFileError(undefined);
        setEditedFields(new Set());

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      return nextState;
    },
    initialState,
  );

  const selectedCoverage = useMemo(
    () =>
      data.coverages.find((coverage) => coverage.id === planCoverageId) ?? null,
    [data.coverages, planCoverageId],
  );

  const workflowSteps = [
    {
      label: "Covered service",
      description: "Choose an eligible service",
      complete: Boolean(planCoverageId),
      icon: HeartPulse,
    },
    {
      label: "Visit details",
      description: "Add the date and amount",
      complete: Boolean(serviceDate && requestedAmount.trim()),
      icon: CalendarDays,
    },
    {
      label: "Invoice",
      description: "Attach the supporting file",
      complete: Boolean(invoiceFile),
      icon: FileCheck2,
    },
  ] as const;

  const completedSteps = workflowSteps.filter((step) => step.complete).length;
  const completionPercentage = Math.round(
    (completedSteps / workflowSteps.length) * 100,
  );

  const missingRequirements = [
    !planCoverageId ? "a covered service" : null,
    !serviceDate ? "the service date" : null,
    !requestedAmount.trim() ? "the requested amount" : null,
    !invoiceFile ? "an invoice file" : null,
  ].filter((item): item is string => Boolean(item));

  const isSubmitDisabled = isPending || missingRequirements.length > 0;
  const visibleInvoiceErrors = invoiceFileError
    ? [invoiceFileError]
    : getFieldErrors("invoiceFile");

  function markEdited(field: ActionErrorField) {
    setEditedFields((current) => {
      const next = new Set(current);
      next.add(field);
      return next;
    });
  }

  function getFieldErrors(field: ActionErrorField) {
    return editedFields.has(field) ? undefined : state.errors?.[field];
  }

  function selectInvoiceFile(file: File, synchronizeInput = false) {
    markEdited("invoiceFile");

    const validationError = validateInvoiceFile(file);

    if (validationError) {
      setInvoiceFile(null);
      setInvoiceFileError(validationError);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (synchronizeInput && fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;
    }

    setInvoiceFile(file);
    setInvoiceFileError(undefined);
  }

  function removeInvoiceFile() {
    if (isPending) {
      return;
    }

    markEdited("invoiceFile");
    setInvoiceFile(null);
    setInvoiceFileError(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFile(false);

    if (isPending) {
      return;
    }

    const file = event.dataTransfer.files[0];

    if (file) {
      selectInvoiceFile(file, true);
    }
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form
        ref={formRef}
        action={formAction}
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.4)]"
      >
        <div className="border-b border-slate-200 bg-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/15">
                <ReceiptText aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  Reimbursement form
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Request Details
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  Complete the three sections, then review and submit.
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <span
                    aria-hidden="true"
                    className="text-base font-bold leading-none text-teal-600"
                  >
                    *
                  </span>
                  Fields marked with an asterisk are required.
                </p>
              </div>
            </div>

            <div className="min-w-40 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="text-slate-600">Form progress</span>
                <span className="text-teal-700">
                  {completedSteps}/{workflowSteps.length}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Request form completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-[width] duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <ol className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={step.label}
                index={index + 1}
                label={step.label}
                description={step.description}
                complete={step.complete}
                icon={step.icon}
              />
            ))}
          </ol>
        </div>

        <div className="space-y-5 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
          {state.message ? (
            <SubmissionMessage state={state} />
          ) : null}

          <FormSection
            number="01"
            icon={HeartPulse}
            title="Medical Service"
            description="Select the service received under your active plan."
          >
            <div className="space-y-2.5">
              <FieldLabel htmlFor="covered-service">
                Covered Medical Service
              </FieldLabel>
              <input
                type="hidden"
                name="planCoverageId"
                value={planCoverageId}
              />
              <Select
                value={planCoverageId || null}
                onValueChange={(value) => {
                  setPlanCoverageId(value ?? "");
                  markEdited("planCoverageId");
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  id="covered-service"
                  className="h-12 w-full rounded-xl border-slate-300 bg-white px-3.5 text-sm shadow-xs transition-colors hover:border-teal-300"
                  aria-required="true"
                  aria-invalid={Boolean(
                    getFieldErrors("planCoverageId")?.length,
                  )}
                  aria-describedby={
                    getFieldErrors("planCoverageId")?.length
                      ? "planCoverageId-error"
                      : "planCoverageId-help"
                  }
                >
                  <SelectValue placeholder="Select a covered medical service">
                    {selectedCoverage ? (
                      <span className="flex min-w-0 items-center gap-2">
                        <HeartPulse
                          aria-hidden="true"
                          className="size-4 shrink-0 text-teal-600"
                        />
                        <span className="truncate font-medium text-slate-900">
                          {selectedCoverage.service.name}
                        </span>
                        <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                          {selectedCoverage.coveragePercentage}% covered
                        </span>
                      </span>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start" className="min-w-80 p-1.5">
                  {data.coverages.map((coverage) => (
                    <SelectItem
                      key={coverage.id}
                      value={coverage.id}
                      className="min-h-12 px-2.5 py-2"
                    >
                      <span className="flex min-w-0 flex-1 items-center justify-between gap-4">
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-900">
                            {coverage.service.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            {formatCategory(coverage.service.category)}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          {coverage.coveragePercentage}%
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="planCoverageId-help" className="text-xs leading-5 text-slate-500">
                Only services included in your active plan are available.
              </p>
              <FieldError
                id="planCoverageId-error"
                errors={getFieldErrors("planCoverageId")}
              />

              {selectedCoverage ? (
                <CompactCoverageSummary coverage={selectedCoverage} />
              ) : null}
            </div>
          </FormSection>

          <FormSection
            number="02"
            icon={CalendarDays}
            title="Visit & Amount"
            description="Use the same date and amount shown on your invoice."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2.5">
                <FieldLabel htmlFor="serviceDate">Service Date</FieldLabel>
                <div className="relative">
                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="serviceDate"
                    name="serviceDate"
                    type="date"
                    required
                    max={getLocalDateInputValue()}
                    value={serviceDate}
                    onChange={(event) => {
                      setServiceDate(event.target.value);
                      markEdited("serviceDate");
                    }}
                    disabled={isPending}
                    aria-invalid={Boolean(
                      getFieldErrors("serviceDate")?.length,
                    )}
                    aria-describedby={
                      getFieldErrors("serviceDate")?.length
                        ? "serviceDate-error"
                        : "serviceDate-help"
                    }
                    className="h-12 rounded-xl border-slate-300 bg-white pl-10 shadow-xs"
                  />
                </div>
                <p id="serviceDate-help" className="text-xs text-slate-500">
                  Future dates cannot be submitted.
                </p>
                <FieldError
                  id="serviceDate-error"
                  errors={getFieldErrors("serviceDate")}
                />
              </div>

              <div className="space-y-2.5">
                <FieldLabel htmlFor="requestedAmount">
                  Requested Amount
                </FieldLabel>
                <div className="relative">
                  <WalletCards
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    id="requestedAmount"
                    name="requestedAmount"
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={requestedAmount}
                    onChange={(event) => {
                      setRequestedAmount(event.target.value);
                      markEdited("requestedAmount");
                    }}
                    disabled={isPending}
                    aria-invalid={Boolean(
                      getFieldErrors("requestedAmount")?.length,
                    )}
                    aria-describedby={
                      getFieldErrors("requestedAmount")?.length
                        ? "requestedAmount-error"
                        : "requestedAmount-help"
                    }
                    className="h-12 rounded-xl border-slate-300 bg-white pl-10 shadow-xs"
                  />
                </div>
                <p id="requestedAmount-help" className="text-xs text-slate-500">
                  Enter the total exactly as it appears on the invoice.
                </p>
                <FieldError
                  id="requestedAmount-error"
                  errors={getFieldErrors("requestedAmount")}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-6">
              <FieldLabel htmlFor="description" optional>
                Additional Details
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                maxLength={1000}
                rows={5}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  markEdited("description");
                }}
                placeholder="Add a short note about the treatment, provider, or invoice."
                disabled={isPending}
                aria-invalid={Boolean(
                  getFieldErrors("description")?.length,
                )}
                aria-describedby={
                  getFieldErrors("description")?.length
                    ? "description-error"
                    : "description-help"
                }
                className="min-h-28 resize-y rounded-xl border-slate-300 bg-white p-3 shadow-xs"
              />
              <div className="flex items-center justify-between gap-3">
                <p id="description-help" className="text-xs text-slate-500">
                  Helpful context can make review easier.
                </p>
                <p className="text-xs tabular-nums text-slate-500">
                  {description.length}/1,000
                </p>
              </div>
              <FieldError
                id="description-error"
                errors={getFieldErrors("description")}
              />
            </div>
          </FormSection>

          <FormSection
            number="03"
            icon={FileCheck2}
            title="Supporting Invoice"
            description="Attach a clear copy that matches the request details."
          >
            <FieldLabel htmlFor="invoiceFile">Invoice File</FieldLabel>

            <label
              htmlFor="invoiceFile"
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={`mt-3 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-7 text-center outline-none transition-all focus-within:ring-4 focus-within:ring-teal-500/15 ${
                visibleInvoiceErrors?.length
                  ? "border-red-300 bg-red-50/60"
                  : isDraggingFile
                    ? "scale-[1.01] border-teal-500 bg-teal-50"
                    : invoiceFile
                      ? "border-teal-300 bg-teal-50/60"
                      : "border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50"
              } ${isPending ? "pointer-events-none opacity-60" : ""}`}
            >
              <Input
                ref={fileInputRef}
                id="invoiceFile"
                name="invoiceFile"
                type="file"
                required
                accept="application/pdf,image/png,image/jpeg"
                disabled={isPending}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    selectInvoiceFile(file);
                  } else {
                    setInvoiceFile(null);
                  }
                }}
                aria-invalid={Boolean(visibleInvoiceErrors?.length)}
                aria-describedby={
                  visibleInvoiceErrors?.length
                    ? "invoiceFile-error"
                    : "invoiceFile-help"
                }
                className="sr-only"
              />
              <span
                className={`flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ${
                  invoiceFile
                    ? "text-teal-700 ring-teal-200"
                    : "text-slate-600 ring-slate-200"
                }`}
              >
                {invoiceFile ? (
                  <FileCheck2 aria-hidden="true" className="size-7" />
                ) : (
                  <Upload aria-hidden="true" className="size-7" />
                )}
              </span>
              <span className="mt-4 text-sm font-bold text-slate-900">
                {invoiceFile
                  ? "Invoice ready to attach"
                  : "Drop your invoice here or browse"}
              </span>
              <span
                id="invoiceFile-help"
                className="mt-1.5 text-xs leading-5 text-slate-500"
              >
                PDF, PNG, or JPG · maximum 5 MB
              </span>
              <span className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
                {invoiceFile ? "Choose a different file" : "Browse files"}
              </span>
            </label>

            {invoiceFile ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-teal-200 bg-white p-3.5 shadow-xs">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <FileText aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {invoiceFile.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatInvoiceType(invoiceFile.type)} · {formatFileSize(invoiceFile.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={removeInvoiceFile}
                  aria-label="Remove selected invoice"
                  className="rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
            ) : null}

            <FieldError id="invoiceFile-error" errors={visibleInvoiceErrors} />

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs leading-5 text-slate-600">
              <LockKeyhole
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-teal-700"
              />
              Your invoice is stored privately and is never exposed as a public
              file.
            </div>
          </FormSection>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    missingRequirements.length === 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {missingRequirements.length === 0 ? (
                    <CircleCheck aria-hidden="true" className="size-5" />
                  ) : (
                    <Info aria-hidden="true" className="size-5" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {missingRequirements.length === 0
                      ? "Your request is ready"
                      : "Complete the required details"}
                  </p>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                    {missingRequirements.length === 0
                      ? "Review your entries once more before submitting for review."
                      : `Still needed: ${formatList(missingRequirements)}.`}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-12 w-full rounded-xl bg-teal-600 px-6 text-white shadow-lg shadow-teal-600/15 hover:bg-teal-700 focus-visible:ring-teal-500 sm:w-auto"
              >
                {isPending ? (
                  <LoaderCircle aria-hidden="true" className="animate-spin" />
                ) : (
                  <Send aria-hidden="true" />
                )}
                {isPending ? "Submitting Request..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <aside className="space-y-5 xl:sticky xl:top-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-teal-50/80 p-5 shadow-[0_18px_45px_-32px_rgba(15,118,110,0.35)] sm:p-6">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-16 size-40 rounded-full bg-teal-100/70 blur-2xl"
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">
                  Active Plan
                </p>
                <h2 className="mt-1 font-semibold text-slate-950">
                  {data.plan.name}
                </h2>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-3 shadow-sm backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Plan code
              </p>
              <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-800">
                {data.plan.code}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <HeartPulse aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Selected Coverage
                </p>
                <h2 className="mt-1 truncate font-semibold text-slate-950">
                  {selectedCoverage?.service.name ?? "Choose a service"}
                </h2>
              </div>
            </div>
          </div>

          {selectedCoverage ? (
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-600 text-lg font-bold text-white shadow-sm">
                  {selectedCoverage.coveragePercentage}%
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-950">
                    Plan coverage
                  </p>
                  <p className="mt-1 text-xs leading-5 text-teal-800">
                    Applied according to your plan terms and review outcome.
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-4">
                <CoverageDetail
                  icon={FileText}
                  label="Service Code"
                  value={selectedCoverage.service.code}
                  mono
                />
                <CoverageDetail
                  icon={WalletCards}
                  label="Annual Limit"
                  value={selectedCoverage.annualLimit ?? "Not specified"}
                />
                <CoverageDetail
                  icon={HeartPulse}
                  label="Category"
                  value={formatCategory(selectedCoverage.service.category)}
                />
              </dl>

              {selectedCoverage.service.description ? (
                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-600">
                  {selectedCoverage.service.description}
                </p>
              ) : null}

              {selectedCoverage.notes ? (
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 ring-1 ring-amber-200">
                  <span className="font-semibold">Coverage note: </span>
                  {selectedCoverage.notes}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-6 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <HeartPulse aria-hidden="true" className="size-6" />
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Select a covered service to see its details here.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Before you submit
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "The service is included in your active plan.",
              "The date and amount match the invoice.",
              "The attached invoice is clear and readable.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <Check aria-hidden="true" className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function SubmissionMessage({
  state,
}: {
  state: CreateReimbursementRequestActionState;
}) {
  if (!state.message) {
    return null;
  }

  if (state.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 text-emerald-950 shadow-sm"
      >
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-16 size-32 rounded-full bg-emerald-200/40 blur-2xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <CircleCheck aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="font-semibold">{state.message}</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Your request is pending review. This form is ready if you need
                to submit another one.
              </p>
            </div>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/subscriber/claims" />}
            variant="outline"
            className="h-10 border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
          >
            View My Claims
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">Unable to submit the request</p>
        <p className="mt-1 text-sm leading-6 text-red-700">{state.message}</p>
      </div>
    </div>
  );
}

function WorkflowStep({
  index,
  label,
  description,
  complete,
  icon: Icon,
}: {
  index: number;
  label: string;
  description: string;
  complete: boolean;
  icon: LucideIcon;
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-colors ${
        complete
          ? "border-teal-200 bg-teal-50"
          : "border-slate-200 bg-slate-50/80"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
          complete
            ? "bg-teal-600 text-white"
            : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-200"
        }`}
      >
        {complete ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Icon aria-hidden="true" className="size-4" />
        )}
      </span>
      <div className="min-w-0">
        <p
          className={`text-xs font-semibold ${
            complete ? "text-teal-900" : "text-slate-700"
          }`}
        >
          <span className="mr-1.5 text-[10px] opacity-60">0{index}</span>
          {label}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {complete ? "Complete" : description}
        </p>
      </div>
    </li>
  );
}

function FormSection({
  number,
  icon: Icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_10px_32px_-28px_rgba(15,23,42,0.45)] sm:p-6">
      <div className="mb-6 flex items-start gap-3.5 border-b border-slate-100 pb-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-700 ring-1 ring-teal-100">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
              Step {number}
            </p>
            <span aria-hidden="true" className="h-px w-7 bg-teal-200" />
          </div>
          <h3 className="mt-0.5 text-base font-bold text-slate-950 sm:text-lg">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function CompactCoverageSummary({
  coverage,
}: {
  coverage: SubscriberClaimFormData["coverages"][number];
}) {
  return (
    <div className="mt-4 grid gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 p-3.5 sm:grid-cols-3 xl:hidden">
      <CompactCoverageDetail
        label="Coverage"
        value={`${coverage.coveragePercentage}%`}
      />
      <CompactCoverageDetail
        label="Category"
        value={formatCategory(coverage.service.category)}
      />
      <CompactCoverageDetail
        label="Annual limit"
        value={coverage.annualLimit ?? "Not specified"}
      />
    </div>
  );
}

function CompactCoverageDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white px-3 py-2.5 shadow-xs ring-1 ring-teal-100">
      <p className="text-[10px] font-bold uppercase tracking-wide text-teal-700">
        {label}
      </p>
      <p className="mt-1 break-words text-xs font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function FieldLabel({
  htmlFor,
  optional = false,
  children,
}: {
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-6 items-center justify-between gap-3">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-slate-800"
      >
        {children}
        {!optional ? (
          <span
            aria-hidden="true"
            className="ml-1 text-base font-bold leading-none text-teal-600"
          >
            *
          </span>
        ) : null}
      </Label>
      {optional ? (
        <span className="text-xs font-medium text-slate-400">Optional</span>
      ) : null}
    </div>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
      <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
      {errors[0]}
    </p>
  );
}

function CoverageDetail({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd
          className={`mt-0.5 break-words text-sm font-semibold text-slate-900 ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function validateInvoiceFile(file: File) {
  if (!supportedInvoiceTypes.has(file.type)) {
    return "Select a PDF, PNG, or JPG invoice file.";
  }

  if (file.size === 0) {
    return "The selected invoice file is empty.";
  }

  if (file.size > MAX_INVOICE_SIZE) {
    return "The invoice file must not exceed 5 MB.";
  }

  return undefined;
}

function formatInvoiceType(mimeType: string) {
  const labels: Record<string, string> = {
    "application/pdf": "PDF document",
    "image/png": "PNG image",
    "image/jpeg": "JPG image",
  };

  return labels[mimeType] ?? "Invoice file";
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "the required information";
  }

  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function formatCategory(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLocalDateInputValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}
