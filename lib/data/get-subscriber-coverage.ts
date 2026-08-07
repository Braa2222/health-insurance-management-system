import "server-only";

import { prisma } from "@/db/prisma";
// Fetch the subscriber's active insurance subscription, including plan details, covered services, and coverage limits.
export async function getSubscriberCoverage(subscriberId: string) {
  const subscription = await prisma.insuranceSubscription.findFirst({
    where: {
      subscriberId,
      isActive: true,
    },
    select: {
      id: true,
      isActive: true,
      plan: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          imageUrl: true,
          monthlyPrice: true,
          durationMonths: true,
          maximumAnnualCoverage: true,
          coverages: {
            select: {
              id: true,
              coveragePercentage: true,
              annualLimit: true,
              notes: true,
              service: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  description: true,
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!subscription) {
    return null;
  }

  return {
    ...subscription,
    plan: {
      ...subscription.plan,
      monthlyPrice: subscription.plan.monthlyPrice.toString(),
      maximumAnnualCoverage:
        subscription.plan.maximumAnnualCoverage?.toString() ?? null,
      coverages: subscription.plan.coverages.map((coverage) => ({
        ...coverage,
        annualLimit: coverage.annualLimit?.toString() ?? null,
      })),
    },
  };
}

export type SubscriberCoverage = NonNullable<
  Awaited<ReturnType<typeof getSubscriberCoverage>>
>;
