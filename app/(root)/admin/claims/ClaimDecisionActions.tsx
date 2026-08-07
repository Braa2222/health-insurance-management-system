"use client";

import {
  CheckCircle2,
  LoaderCircle,
  ShieldX,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ReimbursementRequestRejectionSchema,
  type ReimbursementRequestDecisionAction,
  type ReimbursementRequestDecisionActionState,
} from "@/lib/validators/reimbursement-request-decision.validator";

type ClaimDecisionActionsProps = {
  requestId: string;
  approveAction: ReimbursementRequestDecisionAction;
  rejectAction: ReimbursementRequestDecisionAction;
};

const approveInitialState = {
  success: false,
} satisfies ReimbursementRequestDecisionActionState;

const rejectInitialState = {
  success: false,
} satisfies ReimbursementRequestDecisionActionState;

export function ClaimDecisionActions({
  requestId,
  approveAction,
  rejectAction,
}: ClaimDecisionActionsProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [approveState, approveFormAction, isApproving] = useActionState(
    approveAction,
    approveInitialState,
  );

  const [rejectState, rejectFormAction, isRejecting] = useActionState(
    rejectAction,
    rejectInitialState,
  );

  const isPending = isApproving || isRejecting;
  const rejectionReasonValidation =
    ReimbursementRequestRejectionSchema.shape.rejectionReason.safeParse(
      rejectionReason,
    );
  const rejectionReasonError = rejectionReasonValidation.success
    ? undefined
    : rejectionReasonValidation.error.issues[0]?.message;
  const feedback = approveState.message
    ? approveState
    : rejectState.message
      ? rejectState
      : null;

  const FeedbackIcon = feedback?.success
    ? CheckCircle2
    : XCircle;

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-amber-400"
          />
          <span>
            Review this request and choose a final decision.
          </span>
        </div>

        <div
          role="group"
          aria-label="Reimbursement request decision"
          className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center"
        >
          <Dialog
            disablePointerDismissal={isRejecting}
            onOpenChange={(open, eventDetails) => {
              if (!open && isRejecting) {
                eventDetails.cancel();
              }
            }}
          >
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
className="h-10 min-w-24 gap-2 rounded-xl border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 hover:border-red-300 hover:bg-red-100 hover:text-red-800"      />
              }
            >
              <XCircle aria-hidden="true" className="size-4" />
              Reject
            </DialogTrigger>

            <DialogContent
              showCloseButton={!isRejecting}
              overlayClassName="bg-slate-950/45 backdrop-blur-sm"
              className="gap-0 overflow-hidden rounded-[28px] bg-white p-0 shadow-[0_32px_90px_-24px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/10 sm:max-w-[560px] [&>[data-slot=dialog-close]]:right-5 [&>[data-slot=dialog-close]]:top-5 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-white/80 [&>[data-slot=dialog-close]]:text-slate-500 [&>[data-slot=dialog-close]]:shadow-sm [&>[data-slot=dialog-close]]:ring-1 [&>[data-slot=dialog-close]]:ring-slate-200 [&>[data-slot=dialog-close]]:backdrop-blur"
            >
              <div className="relative overflow-hidden border-b border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 px-6 py-6 sm:px-7 sm:py-7">
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-16 size-40 rounded-full bg-red-200/35 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-20 left-1/3 size-32 rounded-full bg-rose-100/70 blur-3xl"
                />

                <div className="relative flex items-start gap-4 pr-10">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-600/20 ring-1 ring-white/70">
                    <ShieldX aria-hidden="true" className="size-6" />
                  </span>

                  <DialogHeader className="gap-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600">
                      Final claim decision
                    </p>
                    <DialogTitle className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                      Reject reimbursement request?
                    </DialogTitle>
                    <DialogDescription className="max-w-md text-sm leading-6 text-slate-600">
                      Provide a clear explanation for this decision. The
                      subscriber will see your message in their claim details.
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>

              <form action={rejectFormAction}>
                <input type="hidden" name="requestId" value={requestId} />

                <div className="space-y-5 px-6 py-6 sm:px-7">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <Label
                        htmlFor={`rejection-reason-${requestId}`}
                        className="font-semibold text-slate-900"
                      >
                        Rejection reason
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 ring-1 ring-red-100">
                          Required
                        </span>
                      </Label>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-slate-500">
                        {rejectionReason.length}/500
                      </span>
                    </div>

                    <div className="relative">
                      <Textarea
                        id={`rejection-reason-${requestId}`}
                        name="rejectionReason"
                        required
                        maxLength={500}
                        rows={5}
                        value={rejectionReason}
                        onChange={(event) =>
                          setRejectionReason(event.target.value)
                        }
                        disabled={isPending}
                        aria-invalid={Boolean(rejectionReasonError)}
                        aria-describedby={
                          rejectionReasonError
                            ? undefined
                            : `rejection-reason-help-${requestId}`
                        }
                        aria-errormessage={
                          rejectionReasonError
                            ? `rejection-reason-help-${requestId}`
                            : undefined
                        }
                        placeholder="Explain why this reimbursement request cannot be approved..."
                        className="min-h-36 resize-y rounded-2xl border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-6 text-slate-900 shadow-inner shadow-slate-950/[0.03] placeholder:text-slate-400 focus-visible:border-red-300 focus-visible:bg-white focus-visible:ring-red-100"
                      />
                    </div>

                    <div
                      id={`rejection-reason-help-${requestId}`}
                      role={rejectionReasonError ? "alert" : undefined}
                      className="flex items-start gap-2 text-xs leading-5"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 size-1.5 shrink-0 rounded-full ${
                          rejectionReasonError ? "bg-red-500" : "bg-slate-300"
                        }`}
                      />
                      <p
                        className={
                          rejectionReasonError
                            ? "font-medium text-red-600"
                            : "text-slate-500"
                        }
                      >
                        {rejectionReasonError ??
                          "Use specific, respectful language that helps the subscriber understand the decision."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-amber-950">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm ring-1 ring-amber-200">
                      <TriangleAlert aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold">Final decision</p>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Once confirmed, this decision cannot be changed.
                      </p>
                    </div>
                  </div>

                  {rejectState.message && !rejectionReasonError ? (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
                    >
                      <XCircle
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0"
                      />
                      <p>{rejectState.message}</p>
                    </div>
                  ) : null}
                </div>

                <DialogFooter className="mx-0 mb-0 gap-3 rounded-none border-slate-200 bg-slate-50/80 px-6 py-4 sm:px-7">
                  <DialogClose
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      />
                    }
                  >
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={
                      isPending || !rejectionReasonValidation.success
                    }
                    aria-busy={isRejecting}
                    className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 font-semibold text-white shadow-lg shadow-red-600/20 hover:from-red-700 hover:to-rose-700 focus-visible:ring-red-300"
                  >
                    {isRejecting ? (
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                    ) : (
                      <XCircle aria-hidden="true" className="size-4" />
                    )}
                    {isRejecting ? "Rejecting..." : "Confirm rejection"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <form
            action={approveFormAction}
            className="w-full sm:w-auto"
          >
            <input
              type="hidden"
              name="requestId"
              value={requestId}
            />

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isApproving}
              className="h-11 w-full min-w-32 rounded-xl bg-teal-600 px-5 font-semibold text-white shadow-sm shadow-teal-600/10 hover:bg-teal-700 focus-visible:border-teal-500 focus-visible:ring-teal-300 sm:w-auto"
            >
              {isApproving ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : (
                <CheckCircle2 aria-hidden="true" className="size-4" />
              )}

              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </form>
        </div>
      </div>

      {feedback?.message ? (
        <div
          role={feedback.success ? "status" : "alert"}
          aria-live="polite"
          className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm ${
            feedback.success
              ? "border-teal-200 bg-teal-50 text-teal-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <FeedbackIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      ) : null}
    </div>
  );
}
