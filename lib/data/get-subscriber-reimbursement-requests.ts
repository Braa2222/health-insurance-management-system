import "server-only";

import { prisma } from "@/db/prisma";

export async function getSubscriberReimbursementRequests(
  subscriberId: string,
) {
  const requests = await prisma.reimbursementRequest.findMany({
    where: {
      subscription: {
        is: {
          subscriberId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      requestedAmount: true,
      serviceDate: true,
      description: true,
      invoiceOriginalName: true,
      status: true,
      rejectionReason: true,
      createdAt: true,
      updatedAt: true,
      planCoverage: {
        select: {
          coveragePercentage: true,
          annualLimit: true,
          service: {
            select: {
              name: true,
              code: true,
              category: true,
            },
          },
        },
      },
    },
  });

  return requests.map((request) => ({
    ...request,
    requestedAmount: request.requestedAmount.toString(),
    planCoverage: {
      ...request.planCoverage,
      annualLimit: request.planCoverage.annualLimit?.toString() ?? null,
    },
  }));
}

export type SubscriberReimbursementRequests = Awaited<
  ReturnType<typeof getSubscriberReimbursementRequests>
>;

export type SubscriberReimbursementRequest =
  SubscriberReimbursementRequests[number];
