/*
  Warnings:

  - The values [CONSULTATION,RADIOLOGY,OTHER] on the enum `MedicalServiceCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MedicalServiceCategory_new" AS ENUM ('LABORATORY', 'PHARMACY', 'EMERGENCY', 'SURGERY', 'DENTAL');
ALTER TABLE "MedicalService" ALTER COLUMN "category" TYPE "MedicalServiceCategory_new" USING ("category"::text::"MedicalServiceCategory_new");
ALTER TYPE "MedicalServiceCategory" RENAME TO "MedicalServiceCategory_old";
ALTER TYPE "MedicalServiceCategory_new" RENAME TO "MedicalServiceCategory";
DROP TYPE "public"."MedicalServiceCategory_old";
COMMIT;
