-- CreateEnum
CREATE TYPE "ReimbursementRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "ReimbursementRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "subscriptionId" UUID NOT NULL,
    "planCoverageId" UUID NOT NULL,
    "requestedAmount" DECIMAL(12,2) NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "invoiceStorageKey" TEXT NOT NULL,
    "invoiceOriginalName" TEXT NOT NULL,
    "invoiceMimeType" TEXT NOT NULL,
    "invoiceSize" INTEGER NOT NULL,
    "status" "ReimbursementRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReimbursementRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReimbursementRequest_invoiceStorageKey_key" ON "ReimbursementRequest"("invoiceStorageKey");

-- CreateIndex
CREATE INDEX "ReimbursementRequest_subscriptionId_idx" ON "ReimbursementRequest"("subscriptionId");

-- CreateIndex
CREATE INDEX "ReimbursementRequest_planCoverageId_idx" ON "ReimbursementRequest"("planCoverageId");

-- CreateIndex
CREATE INDEX "ReimbursementRequest_status_idx" ON "ReimbursementRequest"("status");

-- CreateIndex
CREATE INDEX "ReimbursementRequest_createdAt_idx" ON "ReimbursementRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "ReimbursementRequest" ADD CONSTRAINT "ReimbursementRequest_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "InsuranceSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReimbursementRequest" ADD CONSTRAINT "ReimbursementRequest_planCoverageId_fkey" FOREIGN KEY ("planCoverageId") REFERENCES "PlanCoverage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
