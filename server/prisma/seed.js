import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SiteRef, UserRole, AppointmentRevenueCategory } from "@prisma/client";
import bcrypt from "bcryptjs";
import pg from "pg";
import { seedAnalyticsAppointments } from "./seed-appointments.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/** Local-only defaults per role — override via env vars in any shared or production environment. */
const ROLE_SEED_PASSWORDS = {
  [UserRole.SUPER_ADMIN]: process.env.SUPER_ADMIN_SEED_PASSWORD || "SuperAdmin@Dev123!",
  [UserRole.EDITOR]: process.env.EDITOR_SEED_PASSWORD || "Editor@Dev123!",
  [UserRole.SUPPORT]: process.env.SUPPORT_SEED_PASSWORD || "Support@Dev123!",
};

const SEED_STAFF_ROLES = [UserRole.SUPER_ADMIN, UserRole.EDITOR, UserRole.SUPPORT];

function seedPasswordPlainForRole(role) {
  const plain = ROLE_SEED_PASSWORDS[role];
  if (!plain) {
    throw new Error(`No seed password configured for role: ${role}`);
  }
  return plain;
}

const staffUsersToSeed = [
  {
    email:"shah.alam26@gmail.com",
    name: "Doctor Sha Alam",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "joinabuhurayra@gmail.com",
    name: "Abu Hurayra",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "chamber.trucare@gmail.com",
    name: "Chamber",
    role: UserRole.SUPPORT,
  },
  {
    email: "thesakibdev@gmail.com",
    name: "Sakib",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "foysaloff856@gmail.com",
    name: "Foysal",
    role: UserRole.SUPPORT,
  },
  {
    email: "saymaoff9570@gmail.com",
    name: "Sayma",
    role: UserRole.SUPPORT,
  },
  {
    email: "mssadiakhatun1130@gmail.com",
    name: "Sadia Khatun",
    role: UserRole.SUPPORT,
  },
  {
    email: "supremedignity97@gmail.com",
    name: "Abdullah Abir",
    role: UserRole.EDITOR,
  },
  {
    email: "workmuhammadirakib@gmail.com",
    name: "Muhammad Irfan",
    role: UserRole.EDITOR,
  },
  {
    email: "mediabuyermahir@gmail.com",
    name: "Mahir Sahariar",
    role: UserRole.EDITOR,
  },
  {
    email: "officialmdhasibmahmud@gmail.com",
    name: "Hasib Mahmud",
    role: UserRole.EDITOR,
  },
];

const BOOTSTRAP_DEFAULT_SEAT_LIMIT = 50;

const BOOTSTRAP_SLOT_DEFAULTS = [
  {
    code: "P-9",
    label: "PLID (Present at - 9:00 AM)",
    smsLabel: "সকাল ৯ টা",
    startTime: "09:00",
    endTime: "10:00",
    seatLimit: 80,
    isActive: true,
  },
  {
    code: "OP-4",
    label: "Old PLID (Present at - 4:00 PM)",
    smsLabel: "বিকাল ৪ টা",
    startTime: "16:00",
    endTime: "17:00",
    seatLimit: 85,
    isActive: true,
  },
  {
    code: "G-5",
    label: "General Patient (Present at - 5:00 PM)",
    smsLabel: "বিকাল ৫ টা",
    startTime: "17:00",
    endTime: "18:00",
    seatLimit: 80,
    isActive: true,
  },
];

async function seedSlotDefaults(siteRef) {
  const existing = await prisma.appointmentSlotDefaultConfig.findUnique({
    where: { siteRef },
  });
  if (existing) {
    console.log(`Seed skip (exists): slot defaults ${siteRef}`);
    return;
  }

  await prisma.appointmentSlotDefaultConfig.create({
    data: {
      siteRef,
      defaultSeatLimit: BOOTSTRAP_DEFAULT_SEAT_LIMIT,
      slots: {
        create: BOOTSTRAP_SLOT_DEFAULTS.map((slot, sortOrder) => ({
          ...slot,
          sortOrder,
        })),
      },
    },
  });
  console.log(`Seeded slot defaults: ${siteRef}`);
}

const REVENUE_FEE_ENV_KEYS = {
  [AppointmentRevenueCategory.NEW_PLID]: "NEW_PLID_APPOINTMENT_FEE",
  [AppointmentRevenueCategory.OLD_PLID]: "OLD_PLID_APPOINTMENT_FEE",
  [AppointmentRevenueCategory.GENERAL]: "GENERAL_APPOINTMENT_FEE",
  [AppointmentRevenueCategory.OLD_GENERAL]: "OLD_GENERAL_APPOINTMENT_FEE",
};

const REVENUE_FEE_DEFAULTS = {
  [AppointmentRevenueCategory.NEW_PLID]: 1500,
  [AppointmentRevenueCategory.OLD_PLID]: 1000,
  [AppointmentRevenueCategory.GENERAL]: 600,
  [AppointmentRevenueCategory.OLD_GENERAL]: 400,
};

function parseSeedFee(value, fallback) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return Math.round(parsed * 100) / 100;
}

async function seedAppointmentRevenueFees(siteRef) {
  for (const category of Object.values(AppointmentRevenueCategory)) {
    const envKey = REVENUE_FEE_ENV_KEYS[category];
    const fee = parseSeedFee(process.env[envKey], REVENUE_FEE_DEFAULTS[category]);
    await prisma.appointmentRevenueFee.upsert({
      where: {
        siteRef_category: { siteRef, category },
      },
      create: {
        siteRef,
        category,
        fee,
        isActive: true,
      },
      update: {
        fee,
        isActive: true,
      },
    });
  }
  console.log(`Seeded appointment revenue fees: ${siteRef}`);
}

const DEFAULT_DOCTOR = {
  name: "Dr. Md Shah Alam",
  specialization: "Orthopedic & Physiotherapy",
  about: "Consultant orthopedic surgeon and physiotherapy specialist.",
  location: "House 42, Road 7, Sector 3, Uttara Model Town, Dhaka - 1230",
  availableDays: "Sat, Sun, Mon, Tue, Wed, Thu",
  startTime: "09:00 AM",
  endTime: "10:00 PM",
  consultationFee: 1500,
};

async function main() {
  const roleHashes = {};
  for (const role of SEED_STAFF_ROLES) {
    roleHashes[role] = await bcrypt.hash(seedPasswordPlainForRole(role), 10);
  }

  for (const staffUser of staffUsersToSeed) {
    const passwordHash = roleHashes[staffUser.role];
    if (!passwordHash) {
      throw new Error(
        `Missing seed password hash for ${staffUser.email} [${staffUser.role}]`,
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: staffUser.email },
    });

    const userData = {
      name: staffUser.name,
      role: staffUser.role,
      password: passwordHash,
      active: true,
    };

    if (existing) {
      await prisma.user.update({
        where: { email: staffUser.email },
        data: userData,
      });
      console.log(`Seed updated ${staffUser.role}: ${staffUser.email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: staffUser.email,
        ...userData,
      },
    });
    console.log(`Seeded ${staffUser.role}: ${staffUser.email}`);
  }

  const existingDoctor = await prisma.doctor.findFirst({
    where: { name: DEFAULT_DOCTOR.name },
  });

  if (existingDoctor) {
    console.log(`Seed skip (exists): doctor ${existingDoctor.name} (${existingDoctor.id})`);
    console.log(`Set DEFAULT_DOCTOR_ID=${existingDoctor.id} in .env`);
  } else {
    const doctor = await prisma.doctor.create({ data: DEFAULT_DOCTOR });
    console.log(`Seeded doctor: ${doctor.name} (${doctor.id})`);
    console.log(`Set DEFAULT_DOCTOR_ID=${doctor.id} in .env`);
  }

  for (const siteRef of [SiteRef.DOCTOR_SHA_ALAM, SiteRef.TRUE_CARE_HELLING_CENTER]) {
    await seedSlotDefaults(siteRef);
  }

  await seedAppointmentRevenueFees(SiteRef.DOCTOR_SHA_ALAM);

  if (process.env.SEED_APPOINTMENTS === "true") {
    await seedAnalyticsAppointments(prisma);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
