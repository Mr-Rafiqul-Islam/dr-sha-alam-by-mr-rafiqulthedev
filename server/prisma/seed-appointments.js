import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AppointmentPaymentStatus,
  AppointmentStatus,
  PrismaClient,
  ScheduleStatus,
  SiteRef,
} from "@prisma/client";
import pg from "pg";

const BUSINESS_TIMEZONE = "Asia/Dhaka";
const SEED_MARKER = "seed-analytics";
const SEED_NOTE = "[Analytics seed — safe to delete in dev]";

const SLOT_DEFAULTS = [
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

const PATIENTS = [
  {
    name: "Rahim Uddin",
    phone: "01711001001",
    email: "rahim.seed@example.com",
    homeAddress: "House 12, Road 5, Uttara, Dhaka",
    gender: "Male",
    age: "34",
  },
  {
    name: "Fatima Begum",
    phone: "01711001002",
    email: null,
    homeAddress: "Flat 3B, Mirpur DOHS, Dhaka",
    gender: "Female",
    age: "28",
  },
  {
    name: "Karim Hassan",
    phone: "01711001003",
    email: "karim.seed@example.com",
    homeAddress: "Sector 7, House 22, Uttara, Dhaka",
    gender: "Male",
    age: "45",
  },
  {
    name: "Nusrat Jahan",
    phone: "01711001004",
    email: null,
    homeAddress: "Banani, Block C, Road 11, Dhaka",
    gender: "Female",
    age: "52",
  },
  {
    name: "Abdul Malek",
    phone: "01711001005",
    email: "malek.seed@example.com",
    homeAddress: "Mohammadpur, Tajmahal Road, Dhaka",
    gender: "Male",
    age: "61",
  },
  {
    name: "Shamima Akter",
    phone: "01711001006",
    email: null,
    homeAddress: "Khilgaon, Taltola, Dhaka",
    gender: "Female",
    age: "39",
  },
  {
    name: "Imran Hossain",
    phone: "01711001007",
    email: "imran.seed@example.com",
    homeAddress: "Bashundhara R/A, Block L, Dhaka",
    gender: "Male",
    age: "22",
  },
  {
    name: "Rokeya Sultana",
    phone: "01711001008",
    email: null,
    homeAddress: "Farmgate, Green Road, Dhaka",
    gender: "Female",
    age: "47",
  },
  {
    name: "Jamal Ahmed",
    phone: "01711001009",
    email: "jamal.seed@example.com",
    homeAddress: "Dhanmondi, Road 27, Dhaka",
    gender: "Male",
    age: "55",
  },
  {
    name: "Salma Khatun",
    phone: "01711001010",
    email: null,
    homeAddress: "Jatrabari, Kadamtala, Dhaka",
    gender: "Female",
    age: "31",
  },
  {
    name: "Hasan Mahmud",
    phone: "01711001011",
    email: "hasan.seed@example.com",
    homeAddress: "Motijheel, Purana Paltan, Dhaka",
    gender: "Male",
    age: "38",
  },
  {
    name: "Ayesha Rahman",
    phone: "01711001012",
    email: null,
    homeAddress: "Gulshan 2, Road 103, Dhaka",
    gender: "Female",
    age: "26",
  },
];

function isValidDateYmd(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getTodayYmdInTimeZone(timeZone) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

function addDaysToYmd(dateYmd, deltaDays) {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTimezoneOffsetMinutes(timeZone, probe) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(probe);
  const offsetLabel =
    parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = offsetLabel.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return 0;
  }
  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes);
}

function zonedMidnightToUtc(dateYmd, timeZone) {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMinutes = getTimezoneOffsetMinutes(timeZone, probe);
  return new Date(
    Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMinutes * 60 * 1000,
  );
}

function appointmentDateForBusinessDay(dateYmd, startTime = "10:00") {
  const midnightUtc = zonedMidnightToUtc(dateYmd, BUSINESS_TIMEZONE);
  const [hours, minutes] = startTime.split(":").map(Number);
  return new Date(midnightUtc.getTime() + (hours * 60 + minutes) * 60 * 1000);
}

function createdAtForDaysAgo(daysAgo, hour = 14) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 30, 0, 0);
  return date;
}

function pickPatient(index) {
  const normalized = ((index % PATIENTS.length) + PATIENTS.length) % PATIENTS.length;
  return PATIENTS[normalized];
}

function slotByCode(schedule, code) {
  const slot = schedule.slots.find((entry) => entry.code === code);
  if (!slot) {
    throw new Error(`Missing slot ${code} on schedule ${schedule.date}`);
  }
  return slot;
}

async function ensureSchedule(prisma, siteRef, dateYmd) {
  const existing = await prisma.appointmentSchedule.findUnique({
    where: { siteRef_date: { siteRef, date: dateYmd } },
    include: { slots: { orderBy: { startTime: "asc" } } },
  });
  if (existing) {
    return existing;
  }

  return prisma.appointmentSchedule.create({
    data: {
      siteRef,
      date: dateYmd,
      status: ScheduleStatus.ACTIVE,
      title: `Seed schedule ${dateYmd}`,
      slots: {
        create: SLOT_DEFAULTS.map((slot) => ({ ...slot })),
      },
    },
    include: { slots: { orderBy: { startTime: "asc" } } },
  });
}

function buildTodayAppointments(todayYmd, schedule, staffUserId) {
  const p9 = slotByCode(schedule, "P-9");
  const op4 = slotByCode(schedule, "OP-4");
  const g5 = slotByCode(schedule, "G-5");

  let globalIndex = 0;
  const serial = { "P-9": 0, "OP-4": 0, "G-5": 0, OTHER: 0 };

  const base = (slotCode, status, overrides = {}) => {
    serial[slotCode] += 1;
    globalIndex += 1;
    const serialNum = serial[slotCode];

    const slot = slotCode === "OTHER" ? null : slotByCode(schedule, slotCode);
    const patient = pickPatient(globalIndex);
    const preferredTime = slot?.code ?? overrides.preferredTime ?? slotCode;

    return {
      transactionId: `${SEED_MARKER}-${todayYmd}-${slotCode}-${serialNum}`,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      homeAddress: patient.homeAddress,
      gender: patient.gender,
      age: patient.age,
      problem: overrides.problem ?? "Back pain and stiffness",
      preferredTime,
      appointmentDate: appointmentDateForBusinessDay(
        todayYmd,
        slot?.startTime ?? "10:00",
      ),
      serialNumber: serialNum,
      status,
      siteRef: SiteRef.DOCTOR_SHA_ALAM,
      scheduleId: schedule.id,
      slotId: overrides.linkSlot === false ? null : slot?.id ?? null,
      createdById: overrides.clientBooking ? null : staffUserId,
      paymentStatus: overrides.paymentStatus ?? null,
      modifiedSerialNumber: overrides.modifiedSerialNumber ?? null,
      note: overrides.note ?? SEED_NOTE,
      createdAt: overrides.createdAt ?? createdAtForDaysAgo(0, 9),
    };
  };

  return [
    base("P-9", AppointmentStatus.ATTEND, { paymentStatus: AppointmentPaymentStatus.SUCCESS }),
    base("P-9", AppointmentStatus.ATTEND),
    base("P-9", AppointmentStatus.CONFIRMED, { paymentStatus: AppointmentPaymentStatus.PENDING }),
    base("P-9", AppointmentStatus.PENDING, { clientBooking: true }),
    base("P-9", AppointmentStatus.CANCEL, { paymentStatus: AppointmentPaymentStatus.CANCEL }),
    base("OP-4", AppointmentStatus.ATTEND),
    base("OP-4", AppointmentStatus.RESCHEDULED, {
      modifiedSerialNumber: 99,
      note: `${SEED_NOTE} Rescheduled to another day.`,
    }),
    base("G-5", AppointmentStatus.ATTEND),
    base("G-5", AppointmentStatus.ATTEND),
    base("G-5", AppointmentStatus.ATTEND),
    base("OTHER", AppointmentStatus.ATTEND, {
      preferredTime: "Walk-in (legacy label)",
      linkSlot: false,
      problem: "Legacy preferredTime only — maps to OTHER category",
    }),
  ];
}

function buildHistoricalAppointments(dateYmd, schedule, staffUserId, startPatientIndex) {
  const rows = [];
  let serial = { "P-9": 0, "OP-4": 0, "G-5": 0 };
  let patientIndex = startPatientIndex;

  const push = (slotCode, status, overrides = {}) => {
    serial[slotCode] += 1;
    patientIndex += 1;
    const slot = slotByCode(schedule, slotCode);
    const patient = pickPatient(patientIndex);

    rows.push({
      transactionId: `${SEED_MARKER}-${dateYmd}-${slotCode}-${serial[slotCode]}`,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      homeAddress: patient.homeAddress,
      gender: patient.gender,
      age: patient.age,
      problem: "Follow-up visit",
      preferredTime: slot.code,
      appointmentDate: appointmentDateForBusinessDay(dateYmd, slot.startTime),
      serialNumber: serial[slotCode],
      status,
      siteRef: SiteRef.DOCTOR_SHA_ALAM,
      scheduleId: schedule.id,
      slotId: slot.id,
      createdById: overrides.clientBooking ? null : staffUserId,
      paymentStatus: overrides.paymentStatus ?? null,
      note: SEED_NOTE,
      createdAt: createdAtForDaysAgo(Math.abs(startPatientIndex) % 7, 10 + serial[slotCode]),
    });
  };

  push("P-9", AppointmentStatus.ATTEND);
  push("P-9", AppointmentStatus.CONFIRMED);
  push("P-9", AppointmentStatus.PENDING);
  push("OP-4", AppointmentStatus.ATTEND);
  push("OP-4", AppointmentStatus.CANCEL);
  push("G-5", AppointmentStatus.ATTEND);
  push("G-5", AppointmentStatus.ATTEND);

  if (startPatientIndex % 2 === 0) {
    push("G-5", AppointmentStatus.RESCHEDULED);
  }

  return rows;
}

function buildTrucareAppointments(dateYmd, schedule) {
  const slot = slotByCode(schedule, "G-5");
  const patient = pickPatient(0);

  return [
    {
      transactionId: `${SEED_MARKER}-trucare-${dateYmd}-1`,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      homeAddress: patient.homeAddress,
      gender: patient.gender,
      age: patient.age,
      problem: "Trucare site seed appointment",
      preferredTime: slot.code,
      appointmentDate: appointmentDateForBusinessDay(dateYmd, slot.startTime),
      serialNumber: 1,
      status: AppointmentStatus.ATTEND,
      siteRef: SiteRef.TRUE_CARE_HELLING_CENTER,
      scheduleId: schedule.id,
      slotId: slot.id,
      createdById: null,
      note: SEED_NOTE,
      createdAt: createdAtForDaysAgo(2, 11),
    },
    {
      transactionId: `${SEED_MARKER}-trucare-${dateYmd}-2`,
      name: pickPatient(1).name,
      phone: pickPatient(1).phone,
      email: pickPatient(1).email,
      homeAddress: pickPatient(1).homeAddress,
      gender: pickPatient(1).gender,
      age: pickPatient(1).age,
      problem: "Trucare pending booking",
      preferredTime: slot.code,
      appointmentDate: appointmentDateForBusinessDay(dateYmd, slot.startTime),
      serialNumber: 2,
      status: AppointmentStatus.PENDING,
      siteRef: SiteRef.TRUE_CARE_HELLING_CENTER,
      scheduleId: schedule.id,
      slotId: slot.id,
      createdById: null,
      note: SEED_NOTE,
      createdAt: createdAtForDaysAgo(1, 15),
    },
  ];
}

async function removeExistingSeedAppointments(prisma) {
  const deleted = await prisma.appointment.deleteMany({
    where: {
      transactionId: { startsWith: SEED_MARKER },
    },
  });
  if (deleted.count > 0) {
    console.log(`Removed ${deleted.count} existing analytics seed appointments`);
  }
}

export async function seedAnalyticsAppointments(prisma) {
  const existing = await prisma.appointment.findFirst({
    where: { transactionId: { startsWith: SEED_MARKER } },
    select: { id: true },
  });

  if (existing && process.env.SEED_APPOINTMENTS_FORCE !== "true") {
    console.log(
      "Seed skip (exists): analytics appointments — set SEED_APPOINTMENTS_FORCE=true to re-seed",
    );
    return;
  }

  if (existing) {
    await removeExistingSeedAppointments(prisma);
  }

  const staffUser = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
    select: { id: true },
  });

  if (!staffUser) {
    throw new Error(
      "No SUPER_ADMIN user found — run base seed first (npm run prisma:seed)",
    );
  }

  const todayYmd = getTodayYmdInTimeZone(BUSINESS_TIMEZONE);
  const historicalOffsets = [-1, -3, -5, -7, -10, -14];
  const scheduleDates = [todayYmd, ...historicalOffsets.map((offset) => addDaysToYmd(todayYmd, offset))];

  const schedulesByKey = new Map();
  for (const dateYmd of scheduleDates) {
    if (!isValidDateYmd(dateYmd)) {
      throw new Error(`Invalid seed date: ${dateYmd}`);
    }
    const schedule = await ensureSchedule(prisma, SiteRef.DOCTOR_SHA_ALAM, dateYmd);
    schedulesByKey.set(`DOCTOR_SHA_ALAM:${dateYmd}`, schedule);
  }

  const trucareSchedule = await ensureSchedule(
    prisma,
    SiteRef.TRUE_CARE_HELLING_CENTER,
    todayYmd,
  );
  schedulesByKey.set(`TRUE_CARE_HELLING_CENTER:${todayYmd}`, trucareSchedule);

  const appointmentRows = [];

  const todayRows = buildTodayAppointments(
    todayYmd,
    schedulesByKey.get(`DOCTOR_SHA_ALAM:${todayYmd}`),
    staffUser.id,
  );
  appointmentRows.push(...todayRows);

  for (const [index, offset] of historicalOffsets.entries()) {
    const dateYmd = addDaysToYmd(todayYmd, offset);
    appointmentRows.push(
      ...buildHistoricalAppointments(
        dateYmd,
        schedulesByKey.get(`DOCTOR_SHA_ALAM:${dateYmd}`),
        staffUser.id,
        index * 10,
      ),
    );
  }

  appointmentRows.push(...buildTrucareAppointments(todayYmd, trucareSchedule));

  await prisma.appointment.createMany({ data: appointmentRows });

  console.log(`Seeded ${appointmentRows.length} analytics appointments`);
  console.log(`  Today (${todayYmd}, Dhaka): ${todayRows.length} rows`);
  console.log(`  Historical days: ${historicalOffsets.length} (${historicalOffsets.map((o) => addDaysToYmd(todayYmd, o)).join(", ")})`);
  console.log(`  Trucare (today): 2 rows`);
  console.log(
    "  Revenue dashboard (today, DOCTOR_SHA_ALAM): 6 attended across P-9/OP-4/G-5 + 1 OTHER (0 fee)",
  );
  console.log(
    `  Expected revenue = 2×NEW_PLID + 1×OLD_PLID + 3×GENERAL (fees from .env)`,
  );
}

async function runStandalone() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new pg.Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await seedAnalyticsAppointments(prisma);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const isDirectRun = process.argv[1]?.endsWith("seed-appointments.js");
if (isDirectRun) {
  runStandalone().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
