-- CreateTable
CREATE TABLE "InsuranceSubscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscriberId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceSubscription_subscriberId_key" ON "InsuranceSubscription"("subscriberId");

-- CreateIndex
CREATE INDEX "InsuranceSubscription_planId_idx" ON "InsuranceSubscription"("planId");

-- CreateIndex
CREATE INDEX "InsuranceSubscription_isActive_idx" ON "InsuranceSubscription"("isActive");

-- AddForeignKey
ALTER TABLE "InsuranceSubscription" ADD CONSTRAINT "InsuranceSubscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceSubscription" ADD CONSTRAINT "InsuranceSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "InsurancePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
