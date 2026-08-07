import "server-only";

import { prisma } from "@/db/prisma";

export async function getInsurancePlans() {
  return prisma.insurancePlan.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      imageUrl: true,
      monthlyPrice: true,
      durationMonths: true,
      maximumAnnualCoverage: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          coverages: true,
        },
      },
    },
  });
}

export type InsurancePlanListItem = Awaited<
  ReturnType<typeof getInsurancePlans>
>[number];
