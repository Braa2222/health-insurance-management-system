import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/planAddForm/CreatePlanShared";
import type { ActiveMedicalService } from "@/lib/data/get-medical-services";
import { inputClassName } from "@/lib/planAddForm/create-insurance-plan.constants";
import type {
  CoverageEditableField,
  CoverageFieldErrors,
  CoverageFormValue,
} from "@/lib/planAddForm/create-insurance-plan.types";
import { getCategoryLabel } from "@/lib/planAddForm/create-insurance-plan.utils";

type MedicalServiceCardProps = {
  service: ActiveMedicalService;
  value?: CoverageFormValue;
  errors?: CoverageFieldErrors;
  disabled: boolean;
  onToggle: (selected: boolean) => void;
  onChange: (field: CoverageEditableField, value: string) => void;
};

export function MedicalServiceCard({
  service,
  value,
  errors,
  disabled,
  onToggle,
  onChange,
}: MedicalServiceCardProps) {
  const selected = Boolean(value);
  const idPrefix = `service-${service.id}`;

  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-sm transition-all ${
        selected
          ? "border-teal-300 bg-teal-50/50 ring-2 ring-teal-100"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        <Checkbox
          checked={selected}
          disabled={disabled}
          aria-label={`${selected ? "Remove" : "Select"} ${service.name}`}
          onCheckedChange={(checked) => onToggle(checked)}
          className="mt-1 data-checked:border-teal-600 data-checked:bg-teal-600"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onToggle(!selected)}
          className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30 disabled:cursor-not-allowed"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-950">{service.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                {service.code}
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-teal-200 bg-teal-50 text-teal-700"
            >
              {getCategoryLabel(service.category)}
            </Badge>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {service.description || "No service description is available."}
          </p>
        </button>
      </div>

      {selected && value ? (
        <div className="border-t border-teal-200 bg-white/90 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-percentage`}>
                Coverage Percentage
                <span aria-hidden="true" className="text-red-600">
                  *
                </span>
              </Label>
              <div className="relative">
                <Input
                  id={`${idPrefix}-percentage`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  value={value.coveragePercentage}
                  disabled={disabled}
                  aria-invalid={Boolean(errors?.coveragePercentage)}
                  aria-describedby={
                    errors?.coveragePercentage
                      ? `${idPrefix}-percentage-error`
                      : undefined
                  }
                  onChange={(event) =>
                    onChange("coveragePercentage", event.target.value)
                  }
                  className={`${inputClassName} pr-9`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  %
                </span>
              </div>
              <FieldError
                id={`${idPrefix}-percentage-error`}
                error={errors?.coveragePercentage}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-annual-limit`}>
                Annual Limit
                <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Input
                id={`${idPrefix}-annual-limit`}
                inputMode="decimal"
                placeholder="2000.00"
                value={value.annualLimit}
                disabled={disabled}
                aria-invalid={Boolean(errors?.annualLimit)}
                aria-describedby={
                  errors?.annualLimit
                    ? `${idPrefix}-annual-limit-error`
                    : undefined
                }
                onChange={(event) => onChange("annualLimit", event.target.value)}
                className={inputClassName}
              />
              <FieldError
                id={`${idPrefix}-annual-limit-error`}
                error={errors?.annualLimit}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`${idPrefix}-notes`}>
                Notes
                <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <Textarea
                id={`${idPrefix}-notes`}
                maxLength={500}
                value={value.notes}
                disabled={disabled}
                placeholder="Add coverage conditions or notes."
                aria-invalid={Boolean(errors?.notes)}
                aria-describedby={
                  errors?.notes ? `${idPrefix}-notes-error` : undefined
                }
                onChange={(event) => onChange("notes", event.target.value)}
                className="min-h-24 resize-y rounded-xl border-slate-200 bg-white px-3.5 py-3 focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-500/15"
              />
              <div className="flex items-start justify-between gap-3">
                <FieldError
                  id={`${idPrefix}-notes-error`}
                  error={errors?.notes}
                />
                <span className="ml-auto text-xs text-slate-400">
                  {value.notes.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
