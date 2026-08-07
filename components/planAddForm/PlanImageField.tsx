import { Trash2, Upload } from "lucide-react";

import { FieldError } from "@/components/planAddForm/CreatePlanShared";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/planAddForm/create-insurance-plan.utils";

type PlanImageFieldProps = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedImage: File | null;
  previewUrl: string | null;
  disabled: boolean;
  error?: string;
  onFileSelected: (file: File, synchronizeFileInput?: boolean) => void;
  onRemove: () => void;
};

export function PlanImageField({
  fileInputRef,
  selectedImage,
  previewUrl,
  disabled,
  error,
  onFileSelected,
  onRemove,
}: PlanImageFieldProps) {
  return (
    <div className="mt-4 space-y-2">
      <input
        ref={fileInputRef}
        id="plan-image"
        type="file"
        name="planImage"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        className="sr-only"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "plan-image-error" : "plan-image-help"}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];

          if (file) {
            onFileSelected(file);
          }
        }}
      />

      {selectedImage && previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
          <div className="aspect-video overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected insurance plan cover preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {selectedImage.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(selectedImage.size)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="h-9 border-slate-300 bg-white text-slate-700"
              >
                <Upload aria-hidden="true" />
                Replace Image
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={onRemove}
                className="h-9 border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
              >
                <Trash2 aria-hidden="true" />
                Remove Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();

            if (disabled) {
              return;
            }

            const file = event.dataTransfer.files?.[0];

            if (file) {
              onFileSelected(file, true);
            }
          }}
          className="group flex min-h-60 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-200 bg-gradient-to-b from-teal-50/50 to-slate-50 px-5 py-10 text-center transition-all hover:border-teal-400 hover:bg-teal-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-72"
        >
          <span className="flex size-16 items-center justify-center rounded-2xl border border-teal-200 bg-white text-teal-700 shadow-sm transition-transform group-hover:-translate-y-0.5">
            <Upload aria-hidden="true" className="size-7" />
          </span>
          <span className="mt-5 text-lg font-semibold text-slate-950">
            Upload Plan Cover Image
          </span>
          <span className="mt-1.5 text-sm leading-6 text-slate-600">
            Drag and drop an image here, or browse files
          </span>
          <span className="mt-5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/15 transition-colors group-hover:bg-teal-700">
            Browse Files
          </span>
          <span
            id="plan-image-help"
            className="mt-5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs leading-5 text-slate-500"
          >
            Recommended ratio: 16:9 · PNG, JPG, or WebP · Maximum 5 MB
          </span>
        </button>
      )}

      <FieldError id="plan-image-error" error={error} />
    </div>
  );
}
