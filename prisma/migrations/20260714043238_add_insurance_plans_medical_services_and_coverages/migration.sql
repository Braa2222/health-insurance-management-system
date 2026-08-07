-- CreateEnum
CREATE TYPE "MedicalServiceCategory" AS ENUM ('CONSULTATION', 'LABORATORY', 'RADIOLOGY', 'PHARMACY', 'EMERGENCY', 'SURGERY', 'DENTAL', 'OTHER');

-- CreateTable
CREATE TABLE "InsurancePlan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "monthlyPrice" DECIMAL(10,2) NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "maximumAnnualCoverage" DECIMAL(12,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurancePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalService" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "category" "MedicalServiceCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanCoverage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "planId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "coveragePercentage" INTEGER NOT NULL,
    "annualLimit" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePlan_code_key" ON "InsurancePlan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalService_code_key" ON "MedicalService"("code");

-- CreateIndex
CREATE INDEX "PlanCoverage_planId_idx" ON "PlanCoverage"("planId");

-- CreateIndex
CREATE INDEX "PlanCoverage_serviceId_idx" ON "PlanCoverage"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCoverage_planId_serviceId_key" ON "PlanCoverage"("planId", "serviceId");

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InsurancePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCoverage" ADD CONSTRAINT "PlanCoverage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "MedicalService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
