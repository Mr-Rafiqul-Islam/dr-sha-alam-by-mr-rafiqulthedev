import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
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

const adminsToSeed = [
  { email: "admin@doctorshahalam.test", name: "Default Admin" },
  { email: "superadmin@doctorshahalam.test", name: "Super Admin" },
];

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

  for (const admin of adminsToSeed) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    });
    if (existing) {
      console.log(`Seed skip (exists): ${admin.email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: admin.email,
        name: admin.name,
        password: hash,
        role: UserRole.ADMIN,
      },
    });
    console.log(`Seeded admin: ${admin.email}`);
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
