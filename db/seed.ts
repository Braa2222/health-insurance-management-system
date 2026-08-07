import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
});
//medical service Provider
//omar.provider01@gmail.com// email 
//Provider123/// Password 
///
/// subsucriber  
// adel124@gmail.com // email 
// 12345Adel // Password
/// ahmadreb123@gmail.com //
//ahmad12345///


// admin System Info 
const adminUser = {
  name: "Braa",
  email: "agdhlde1209@gmail.com",
  password: "0940273696Braa",
  phone: "09960845934",
  role: "SYSTEM_ADMIN" as const,
};

async function main() {
  const hashedPassword = await hash(adminUser.password, 12);

  const user = await prisma.user.upsert({
    where: {
      email: adminUser.email,
    },
    update: {
      name: adminUser.name,
      password: hashedPassword,
      phone: adminUser.phone,
      role: adminUser.role,
      isActive: true,
    },
    create: {
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      phone: adminUser.phone,
      role: adminUser.role,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log("System administrator seed completed:", user);
}

main()
  .catch((error: unknown) => {
    console.error("Failed to seed the system administrator.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
