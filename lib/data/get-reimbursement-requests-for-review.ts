import "server-only";

import { prisma } from "@/db/prisma";

export async function getReimbursementRequestsForReview() {
  const requests = await prisma.reimbursementRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      requestedAmount: true,
      serviceDate: true,
      description: true,
      invoiceOriginalName: true,
      invoiceMimeType: true,
      invoiceSize: true,
      status: true,
      rejectionReason: true,
      createdAt: true,
      updatedAt: true,
      subscription: {
        select: {
          subscriber: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
      planCoverage: {
        select: {
          id: true,
          coveragePercentage: true,
          annualLimit: true,
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

export type ReimbursementRequestsForReview = Awaited<
  ReturnType<typeof getReimbursementRequestsForReview>
>;

export type ReimbursementRequestForReview =
  ReimbursementRequestsForReview[number];
