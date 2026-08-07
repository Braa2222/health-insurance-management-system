import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { approveReimbursementRequestAction } from "@/lib/action/approve-reimbursement-request.action";
import { rejectReimbursementRequestAction } from "@/lib/action/reject-reimbursement-request.action";
import {
  getReimbursementRequestsForReview,
  type ReimbursementRequestsForReview,
} from "@/lib/data/get-reimbursement-requests-for-review";

import {
  AdminClaimsErrorState,
  AdminClaimsView,
} from "./AdminClaimsView";

export const runtime = "nodejs";

export default async function AdminClaimsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/");
  }

  let requests: ReimbursementRequestsForReview;

  try {
    requests = await getReimbursementRequestsForReview();
  } catch {
    console.error("Unable to load reimbursement requests for review.");

    return <AdminClaimsErrorState />;
  }

  return (
    <AdminClaimsView
      requests={requests}
      approveAction={approveReimbursementRequestAction}
      rejectAction={rejectReimbursementRequestAction}
    />
  );
}
