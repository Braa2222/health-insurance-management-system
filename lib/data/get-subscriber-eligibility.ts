import "server-only";

import { UserRole } from "@/app/generated/prisma/client";
import { prisma } from "@/db/prisma";

export async function getSubscriberEligibility(
  subscriberEmail: string,
) {
  return prisma.user.findFirst({
    where: {
      email: subscriberEmail,
      role: UserRole.SUBSCRIBER,
    },
    select: {
      id: true,
      name: true,
      email: true,
      insuranceSubscription: {
        select: {
          id: true,
          isActive: true,
          plan: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
}

export type SubscriberEligibilityRecord = Awaited<
  ReturnType<typeof getSubscriberEligibility>
>;
