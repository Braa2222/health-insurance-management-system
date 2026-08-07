import "server-only";

import { prisma } from "@/db/prisma";

export async function getSubscriberClaimFormData(subscriberId: string) {
  const subscription = await prisma.insuranceSubscription.findFirst({
    where: {
      subscriberId,
      isActive: true,
    },
    select: {
      plan: {
        select: {
          name: true,
          code: true,
          coverages: {
            where: {
              coveragePercentage: {
                gt: 0,
                lt: 100,
              },
            },
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
                  category: true,
                  description: true,
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
    plan: {
      name: subscription.plan.name,
      code: subscription.plan.code,
    },
    coverages: subscription.plan.coverages.map((coverage) => ({
      ...coverage,
      annualLimit: coverage.annualLimit?.toString() ?? null,
    })),
  };
}

export type SubscriberClaimFormData = NonNullable<
  Awaited<ReturnType<typeof getSubscriberClaimFormData>>
>;
