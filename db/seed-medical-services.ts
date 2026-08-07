import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  MedicalServiceCategory,
  PrismaClient,
} from "../app/generated/prisma/client";

const medicalServices = [
  {
    name: "Complete Blood Count",
    code: "COMPLETE_BLOOD_COUNT",
    category: MedicalServiceCategory.LABORATORY,
    description:
      "A laboratory blood test used to evaluate general health and detect several medical conditions.",
    isActive: true,
  },
  {
    name: "Blood Sugar Test",
    code: "BLOOD_SUGAR_TEST",
    category: MedicalServiceCategory.LABORATORY,
    description:
      "A laboratory test used to measure the level of glucose in the blood.",
    isActive: true,
  },
  {
    name: "Urine Analysis",
    code: "URINE_ANALYSIS",
    category: MedicalServiceCategory.LABORATORY,
    description:
      "A laboratory examination used to detect urinary tract and general health conditions.",
    isActive: true,
  },
  {
    name: "Liver Function Test",
    code: "LIVER_FUNCTION_TEST",
    category: MedicalServiceCategory.LABORATORY,
    description:
      "A group of blood tests used to evaluate liver health and function.",
    isActive: true,
  },
  {
    name: "Prescription Medicines",
    code: "PRESCRIPTION_MEDICINES",
    category: MedicalServiceCategory.PHARMACY,
    description:
      "Medicines prescribed by an authorized healthcare professional.",
    isActive: true,
  },
  {
    name: "Chronic Disease Medicines",
    code: "CHRONIC_DISEASE_MEDICINES",
    category: MedicalServiceCategory.PHARMACY,
    description:
      "Medicines used for the ongoing treatment of chronic medical conditions.",
    isActive: true,
  },
  {
    name: "Antibiotic Medicines",
    code: "ANTIBIOTIC_MEDICINES",
    category: MedicalServiceCategory.PHARMACY,
    description:
      "Antibiotic medicines prescribed for the treatment of bacterial infections.",
    isActive: true,
  },
  {
    name: "Emergency Care",
    code: "EMERGENCY_CARE",
    category: MedicalServiceCategory.EMERGENCY,
    description:
      "Immediate medical care provided for urgent and life-threatening conditions.",
    isActive: true,
  },
  {
    name: "Ambulance Service",
    code: "AMBULANCE_SERVICE",
    category: MedicalServiceCategory.EMERGENCY,
    description:
      "Emergency medical transportation provided by an ambulance service.",
    isActive: true,
  },
  {
    name: "Emergency Room Treatment",
    code: "EMERGENCY_ROOM_TREATMENT",
    category: MedicalServiceCategory.EMERGENCY,
    description:
      "Medical assessment and treatment provided in an emergency department.",
    isActive: true,
  },
  {
    name: "Minor Surgery",
    code: "MINOR_SURGERY",
    category: MedicalServiceCategory.SURGERY,
    description:
      "A minor surgical procedure that normally does not require extended hospitalization.",
    isActive: true,
  },
  {
    name: "Major Surgery",
    code: "MAJOR_SURGERY",
    category: MedicalServiceCategory.SURGERY,
    description:
      "A major surgical procedure that may require hospitalization and postoperative care.",
    isActive: true,
  },
  {
    name: "Day Surgery",
    code: "DAY_SURGERY",
    category: MedicalServiceCategory.SURGERY,
    description:
      "A surgical procedure where the patient is discharged on the same day.",
    isActive: true,
  },
  {
    name: "Dental Examination",
    code: "DENTAL_EXAMINATION",
    category: MedicalServiceCategory.DENTAL,
    description:
      "A general examination used to evaluate dental and oral health.",
    isActive: true,
  },
  {
    name: "Dental Filling",
    code: "DENTAL_FILLING",
    category: MedicalServiceCategory.DENTAL,
    description:
      "A dental procedure used to repair a damaged or decayed tooth.",
    isActive: true,
  },
  {
    name: "Tooth Extraction",
    code: "TOOTH_EXTRACTION",
    category: MedicalServiceCategory.DENTAL,
    description:
      "A dental procedure used to remove a damaged or problematic tooth.",
    isActive: true,
  },
  {
    name: "Teeth Cleaning",
    code: "TEETH_CLEANING",
    category: MedicalServiceCategory.DENTAL,
    description:
      "A preventive dental service used to remove plaque and tartar.",
    isActive: true,
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg(connectionString),
  });

  try {
    for (const service of medicalServices) {
      await prisma.medicalService.upsert({
        where: {
          code: service.code,
        },
        update: {
          name: service.name,
          description: service.description,
          category: service.category,
          isActive: service.isActive,
        },
        create: service,
      });
    }

    const verifiedCount = await prisma.medicalService.count({
      where: {
        code: {
          in: medicalServices.map((service) => service.code),
        },
      },
    });

    if (verifiedCount !== medicalServices.length) {
      throw new Error("Medical service verification failed.");
    }

    console.log(
      `Medical services seed completed: ${verifiedCount} services processed and verified.`,
    );
  } catch {
    console.error("Failed to seed the medical services.");
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
