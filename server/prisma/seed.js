import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SiteRef, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/** Local-only default if ADMIN_SEED_PASSWORD is unset — change in any shared or production environment. */
const FALLBACK_DEV_PASSWORD = "ChangeMeLocalDev123!";

const staffUsersToSeed = [
  {
    email: "shah.alam.plid@gmail.com",
    name: "Super Admin",
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: "admin@example.com",
    name: "Admin",
    role: UserRole.ADMIN,
  },
  {
    email: "admin@doctorshahalam.test",
    name: "Default Admin",
    role: UserRole.ADMIN,
  },
  {
    email: "thesakibdev@gmail.com",
    name: "Sakib",
    role: UserRole.ADMIN,
  },
  {
    email: "foysaloff856@gmail.com",
    name: "Foysal",
    role: UserRole.EDITOR,
  },
  {
    email: "workmuhammadirakib@gmail.com",
    name: "Muhammad Irfan",
    role: UserRole.EDITOR,
  },
  {
    email: "workmuhammadirakib@gmail.com",
    name: "Muhammad Irfan",
    role: UserRole.EDITOR,
  },
  {
    email: "saymaoff9570@gmail.com",
    name: "Sayma",
    role: UserRole.EDITOR,
  },
  {
    email: "supremedignity97@gmail.com",
    name: "Abdullah Abir",
    role: UserRole.EDITOR,
  },
  {
    email: "Mediabuyermahir@gmail.com",
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
    seatLimit: 20,
    isActive: true,
  },
  {
    code: "OP-4",
    label: "Old PLID (Present at - 4:00 PM)",
    smsLabel: "বিকাল ৪ টা",
    startTime: "16:00",
    endTime: "17:00",
    seatLimit: 15,
    isActive: true,
  },
  {
    code: "G-5",
    label: "General Patient (Present at - 5:00 PM)",
    smsLabel: "বিকাল ৫ টা",
    startTime: "17:00",
    endTime: "18:00",
    seatLimit: 10,
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
  const passwordPlain = process.env.ADMIN_SEED_PASSWORD || FALLBACK_DEV_PASSWORD;
  const hash = await bcrypt.hash(passwordPlain, 10);

  for (const staffUser of staffUsersToSeed) {
    const existing = await prisma.user.findUnique({
      where: { email: staffUser.email },
    });
    if (existing) {
      console.log(
        `Seed skip (exists): ${staffUser.email} [${existing.role}]`,
      );
      continue;
    }

    await prisma.user.create({
      data: {
        email: staffUser.email,
        name: staffUser.name,
        password: hash,
        role: staffUser.role,
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
