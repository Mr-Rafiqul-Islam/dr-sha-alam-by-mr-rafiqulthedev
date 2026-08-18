## Why

The admin dashboard already exposes Configure Fees and the server already has GET/PATCH appointment-revenue fee APIs, but invoices, discounts, and SSLCommerz still use other prices (`CONSULTATION_FEE_BDT = 500` or `Doctor.consultationFee`). Staff also need a fourth price, Old General (400 BDT), on the same G-5 time as General, and a way to set that category on any appointment—including existing ones—without adding a fourth public slot.

## What Changes

- Treat `AppointmentRevenueFee` as the **global clinic price list** for Dr. Shah Alam (one doctor, not per-doctor pricing).
- Add category **OLD_GENERAL** at **400 BDT**, sharing the existing General slot time **G-5**. Public booking stays three slots (P-9, OP-4, G-5).
- Seed / first-run defaults: NEW_PLID **1500**, OLD_PLID **1000**, GENERAL **600**, OLD_GENERAL **400**.
- Store a fee category on each appointment. Default from slot (P-9 → NEW_PLID, OP-4 → OLD_PLID, G-5 → GENERAL). Staff can switch any appointment (new or old) to any of the four categories from admin.
- Dashboard Configure Fees, daily revenue, printed invoices, discount math, and paid booking amounts all use the selected category’s global fee.
- **BREAKING:** SSLCommerz consultation amount is no longer `Doctor.consultationFee` / `CONSULTATION_FEE_FALLBACK`.
- **BREAKING:** printed invoices and discount percentages no longer use hardcoded `CONSULTATION_FEE_BDT` (500).
- **BREAKING:** fee GET/PATCH payloads and `AppointmentRevenueCategory` gain `OLD_GENERAL`.
- No bulk rewrite of existing appointment rows. Until staff set a category, infer from slot as above (G-5 infers GENERAL, not OLD_GENERAL).
- Stop multi-doctor fee/payment plumbing. Do not add a doctor picker. `TRUE_CARE_HELLING_CENTER` site support is unchanged.

## Capabilities

### New Capabilities

- `appointment-fees`: Global four-category fee list (configure, seed, dashboard revenue) used as the source of truth for expected collection, invoices, discounts, and payments.
- `appointment-fee-category`: Per-appointment fee category, slot defaults, G-5 shared by GENERAL and OLD_GENERAL, and staff switch on any appointment from admin.

### Modified Capabilities

- (none — `openspec/specs/` has no existing capabilities)

## Impact

- Server: `appointmentRevenue` module (enum, validation, GET/PATCH `/api/v1/admin/appointment-revenue/fees`, summary aggregation); appointment create/update APIs; payment start (`resolveConsultationFee`); Prisma `AppointmentRevenueCategory` / `AppointmentRevenueFee` / appointment category field; seed and `.env.example`.
- Admin: Configure Fees modal (four fields); daily revenue table; appointment status/edit UI (category switch); invoice + discount helpers (drop `CONSULTATION_FEE_BDT`).
- Client: paid booking still posts a slot; amount resolved server-side from category (default GENERAL for G-5). No fourth public time slot.
- Payments/DB: stop using `Doctor.consultationFee` and `DEFAULT_DOCTOR_ID` for price. Doctor branding stays; no mass migration of old payments or appointments.
