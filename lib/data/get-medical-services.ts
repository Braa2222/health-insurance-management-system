import "server-only";

import { prisma } from "@/db/prisma";

export async function getActiveMedicalServices() {
  return prisma.medicalService.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        category: "asc",
      },
      {
        name: "asc",
      },
    ],
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      category: true,
    },
  });
}

export type ActiveMedicalService = Awaited<
  ReturnType<typeof getActiveMedicalServices>
>[number];
