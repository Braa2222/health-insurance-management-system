import "server-only";

import { UserRole } from "@/app/generated/prisma/client";
import { prisma } from "@/db/prisma";
// Fetch subscribers and active insurance plans from the database for use in the subscription activation interface.
export async function getSubscriptionInsuranceData() {
  const [subscribers, insurancePlans] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: UserRole.SUBSCRIBER,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        insuranceSubscription: {
          select: {
            id: true,
            planId: true,
            isActive: true,
          },
        },
      },
    }),

    prisma.insurancePlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        monthlyPrice: true,
        durationMonths: true,
      },
    }),
  ]);

  return {
    subscribers,
    insurancePlans: insurancePlans.map((plan) => ({
      ...plan,
      monthlyPrice: plan.monthlyPrice.toString(),
    })),
  };
}

export type SubscriptionInsuranceData = Awaited<
  ReturnType<typeof getSubscriptionInsuranceData>
>;

export type SubscriberForInsuranceActivation =
  SubscriptionInsuranceData["subscribers"][number];

export type AvailableInsurancePlan =
  SubscriptionInsuranceData["insurancePlans"][number];
