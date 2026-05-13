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
