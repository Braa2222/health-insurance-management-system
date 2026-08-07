/*
  Warnings:

  - A unique constraint covering the columns `[licenseNumber]` on the table `MedicalProviderProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MedicalProviderProfile_licenseNumber_key" ON "MedicalProviderProfile"("licenseNumber");
