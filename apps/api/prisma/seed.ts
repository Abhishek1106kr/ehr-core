import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: "confido-general" },
    update: {},
    create: {
      name: "Confido General Hospital",
      slug: "confido-general",
      timezone: "Asia/Kolkata",
      address: "12 MG Road, Bengaluru, India",
      phone: "+91-80-4567-8900",
      languages: ["en", "hi", "ta", "te", "kn", "ml", "bn", "mr", "gu", "pa"],
      workingHours: {
        mon: [{ start: "09:00", end: "18:00" }],
        tue: [{ start: "09:00", end: "18:00" }],
        wed: [{ start: "09:00", end: "18:00" }],
        thu: [{ start: "09:00", end: "18:00" }],
        fri: [{ start: "09:00", end: "18:00" }],
        sat: [{ start: "09:00", end: "13:00" }],
      },
    },
  });

  const cardiology = await prisma.department.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Cardiology",
      organizationId: org.id,
    },
  });

  const generalMed = await prisma.department.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "General Medicine",
      organizationId: org.id,
    },
  });

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@confidohealth.demo" },
    update: {},
    create: {
      email: "admin@confidohealth.demo",
      passwordHash,
      name: "Priya Sharma",
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "reception@confidohealth.demo" },
    update: {},
    create: {
      email: "reception@confidohealth.demo",
      passwordHash,
      name: "Anita Desai",
      role: "RECEPTIONIST",
      organizationId: org.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "auditor@confidohealth.demo" },
    update: {},
    create: {
      email: "auditor@confidohealth.demo",
      passwordHash,
      name: "Ravi Kumar",
      role: "AUDITOR",
      organizationId: org.id,
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: "dr.nair@confidohealth.demo" },
    update: {},
    create: {
      email: "dr.nair@confidohealth.demo",
      passwordHash,
      name: "Dr. Meera Nair",
      role: "DOCTOR",
      organizationId: org.id,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      name: "Dr. Meera Nair",
      specialty: "Cardiology",
      departmentId: cardiology.id,
      organizationId: org.id,
    },
  });

  await prisma.doctor.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000d2" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000d2",
      name: "Dr. Arjun Rao",
      specialty: "General Medicine",
      departmentId: generalMed.id,
      organizationId: org.id,
    },
  });

  const patient = await prisma.patient.upsert({
    where: { mrn: "MRN-2026-000001" },
    update: {},
    create: {
      mrn: "MRN-2026-000001",
      organizationId: org.id,
      name: "Rahul Verma",
      dob: new Date("1988-04-12"),
      gender: "MALE",
      phone: "+91-98765-43210",
      email: "rahul.verma@example.com",
      preferredLanguage: "hi",
      verificationStatus: "VERIFIED",
      verificationScore: 0.97,
      verifiedAt: new Date(),
      aadhaarMasked: "XXXX-XXXX-4321",
    },
  });

  await prisma.insurance.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000e1" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000e1",
      patientId: patient.id,
      provider: "Star Health Insurance",
      policyNumberMasked: "XXXXXXXX7788",
      status: "ACTIVE",
      lastVerifiedAt: new Date(),
      coverageDetails: { copay: 20, deductible: 500, planType: "PPO" },
    },
  });

  await prisma.integration.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000f1" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000f1",
      organizationId: org.id,
      name: "FHIR REST Server (mock)",
      mode: "FHIR_REST",
      config: { baseUrl: "https://fhir.confidohealth.demo/r4" },
      isEnabled: true,
    },
  });

  await prisma.integration.upsert({
    where: { id: "00000000-0000-0000-0000-0000000000f2" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-0000000000f2",
      organizationId: org.id,
      name: "MediTrack Legacy PMS (browser automation)",
      mode: "BROWSER_AUTOMATION",
      config: { portalUrl: "/legacy-portal" },
      isEnabled: true,
    },
  });

  console.log("Seed complete:", { org: org.name, admin: admin.email, patient: patient.mrn });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
