import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { getSubscriberCoverage } from "@/lib/data/get-subscriber-coverage";

import {
  SubscriberCoverageErrorState,
  SubscriberCoverageView,
} from "./SubscriberCoverageView";

export const runtime = "nodejs";

export default async function SubscriberCoveragePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  if (session.user.role !== UserRole.SUBSCRIBER) {
    redirect("/");
  }

  let subscription: Awaited<ReturnType<typeof getSubscriberCoverage>>;

  try {
    subscription = await getSubscriberCoverage(session.user.id);
  } catch {
    console.error("Unable to load subscriber coverage.");

    return <SubscriberCoverageErrorState />;
  }

  return <SubscriberCoverageView subscription={subscription} />;
}
