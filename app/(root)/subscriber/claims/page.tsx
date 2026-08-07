import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { getSubscriberReimbursementRequests } from "@/lib/data/get-subscriber-reimbursement-requests";

import {
  SubscriberClaimsErrorState,
  SubscriberClaimsView,
} from "./SubscriberClaimsView";

export const runtime = "nodejs";

export default async function SubscriberClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string | string[] }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SUBSCRIBER) {
    redirect("/");
  }
// Read the submitted query parameter to determine whether a reimbursement request was successfully submitted.
  const { submitted } = await searchParams;
  const requestWasSubmitted = submitted === "1";

  let requests: Awaited<
    ReturnType<typeof getSubscriberReimbursementRequests>
  >;

  try {
    requests = await getSubscriberReimbursementRequests(
      session.user.id,
    );
  } catch {
    console.error("Unable to load subscriber reimbursement requests.");

    return <SubscriberClaimsErrorState />;
  }

  return (
    <SubscriberClaimsView
      requests={requests}
      requestWasSubmitted={requestWasSubmitted}
    />
  );
}
