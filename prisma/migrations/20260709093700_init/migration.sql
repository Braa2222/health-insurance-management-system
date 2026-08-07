-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUBSCRIBER', 'SYSTEM_ADMIN', 'MEDICAL_SERVICE_PROVIDER');

-- CreateEnum
CREATE TYPE "MedicalProviderType" AS ENUM ('HOSPITAL', 'CLINIC', 'LABORATORY', 'PHARMACY');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalProviderProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "facilityName" TEXT NOT NULL,
    "providerType" "MedicalProviderType" NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalProviderProfile_userId_key" ON "MedicalProviderProfile"("userId");

-- AddForeignKey
ALTER TABLE "MedicalProviderProfile" ADD CONSTRAINT "MedicalProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
