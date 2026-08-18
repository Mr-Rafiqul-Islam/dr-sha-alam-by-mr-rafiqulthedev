## Context

See `proposal.md` for motivation. Today fees already live in `AppointmentRevenueFee` with three enum values and GET/PATCH `/api/v1/admin/appointment-revenue/fees`. Dashboard Configure Fees already calls those endpoints. Revenue summary infers category **only from slot code**. Invoices and discounts use `CONSULTATION_FEE_BDT = 500`. Paid booking uses `Doctor.consultationFee` (seeded 1500) or `CONSULTATION_FEE_FALLBACK`. Slots remain P-9, OP-4, G-5.

Constraints: one Prisma enum (`AppointmentRevenueCategory`) is already shared by fees, dashboard, and appointment list filters. G-5 is a single seat pool. No bulk backfill of old appointment rows.

## Goals / Non-Goals

**Goals:**

- One resolve path: stored category if set, else slot default, then look up the live global fee.
- Extend the existing fees API and dashboard modal; do not add a parallel price API.
- Put category on the appointment update modal staff already use (status / injection / operation / discount).
- Return resolved `feeCategory` and live `consultationFee` on admin appointment payloads so invoices do not hardcode amounts.

**Non-Goals:**

- Dropping the `Doctor` table, `Payment.doctorId`, or `User.doctorId` columns in this change (stop using them for price only).
- Removing `TRUE_CARE_HELLING_CENTER` site support.
- Showing prices on the public booking form.
- Snapshotting a fee amount onto each appointment (category is stored; amount is always live).
- Backfilling `feeCategory` on historical rows.

## Decisions

### 1. Nullable `Appointment.feeCategory` instead of a fee snapshot

Store `feeCategory AppointmentRevenueCategory?` on `Appointment`. Amount is always read from `AppointmentRevenueFee` at use time.

- **Why:** Specs require no bulk row rewrite when prices change, and Old General cannot be inferred from G-5. Category is the override; live amount matches “global price.”
- **Alternative considered:** Snapshot `consultationFee` on the row. Rejected — reprints would freeze old amounts and contradict live global fees.
- **Alternative considered:** Infer only from slot. Rejected — GENERAL and OLD_GENERAL share G-5.

### 2. Resolve order

1. If `feeCategory` is set, use it.
2. Else map slot/preferredTime: P-9 → NEW_PLID, OP-4 → OLD_PLID, G-5 → GENERAL.
3. Else OTHER (dashboard only; invoice/payment MUST NOT charge OTHER — payment still uses step 2 for known slots).

`CATEGORY_SLOT_CODES.OLD_GENERAL` maps to `G-5` for display. Occupancy stays on G-5 regardless of GENERAL vs OLD_GENERAL.

### 3. Extend existing fees API; require `OLD_GENERAL` in PATCH

Keep `/api/v1/admin/appointment-revenue/fees`. Validation already requires every enum value; adding `OLD_GENERAL` to the Prisma enum makes it required in GET/PATCH automatically.

Seed defaults when env is unset or invalid: 1500 / 1000 / 600 / 400 (replace today’s silent `0`). Env keys remain overridable: `NEW_PLID_APPOINTMENT_FEE`, `OLD_PLID_APPOINTMENT_FEE`, `GENERAL_APPOINTMENT_FEE`, `OLD_GENERAL_APPOINTMENT_FEE`.

### 4. Appointment write path

- Create (admin or public): persist `feeCategory` when the client sends it; otherwise leave null and resolve via slot.
- Admin status/update (existing PATCH): accept optional `feeCategory` (`NEW_PLID` | `OLD_PLID` | `GENERAL` | `OLD_GENERAL`). Saving it writes only that row.
- Public booking form: no category control; G-5 stays GENERAL by inference.

### 5. Admin invoice and payment consumers

- Appointment JSON includes `feeCategory` (stored or null) and `consultationFee` (resolved live number, or 0 for OTHER).
- Admin invoice/discount helpers use `consultationFee` from the appointment payload.
- `startPayment` resolves category from the booking slot (null stored category on new paid booking) and charges `loadFeesByCategory()[category]`. Do not call `resolveConsultationFee(doctorId)`. `doctorId` on Payment may still be set from `DEFAULT_DOCTOR_ID` for existing FK compatibility; it MUST NOT affect amount.

### 6. Revenue summary and list filters

Aggregation uses the same resolve function as invoices (stored category wins). FOUR ordered rows plus OTHER. Appointment list category filter for OLD_GENERAL must match stored `feeCategory = OLD_GENERAL`, not every G-5 row. GENERAL filter: stored GENERAL **or** (null stored and G-5 slot).

### 7. Single-doctor pricing without schema deletion

Remove doctor-based amount resolution and any UI/API that implies choosing a doctor for price. Keep the Doctor seed row and payment FK so historical payments do not require a destructive migration in this change.

## Risks / Trade-offs

- **[Risk] Live fees rewrite old invoice reprints without updating rows** → Accepted by spec. Mitigation: staff can still set category per appointment; amounts follow Configure Fees.
- **[Risk] List filter / revenue double-count G-5 if OLD_GENERAL is implemented as “preferredTime = G-5”** → Use stored `feeCategory` in WHERE clauses; do not treat OLD_GENERAL as a new slot code.
- **[Risk] PATCH clients that omit `OLD_GENERAL` start failing** → Document the extra field; modal always sends all four.
- **[Risk] Payments still store `doctorId`** → Amount is category-based; leftover FK is a follow-up cleanup, not a second price source.
- **[Trade-off] Nullable category vs always writing default on create** → Nullable preserves “no bulk migrate.” New rows may stay null and still resolve correctly from slot.

## Migration Plan

1. Prisma migrate: add enum value `OLD_GENERAL`; add nullable `Appointment.feeCategory`.
2. Seed/upsert four fee rows for `DOCTOR_SHA_ALAM` (1500/1000/600/400 unless env overrides).
3. Deploy server (fees API, resolve helpers, payment, appointment PATCH) before admin UI that sends `OLD_GENERAL` / `feeCategory`.
4. Deploy admin (four-field modal, category control, invoice uses payload fee).
5. Rollback: revert app deploys first. Enum/column additions are backward compatible; do not drop `OLD_GENERAL` if rows already use it.

## Open Questions

None that affect specs or this approach. Doctor-table deletion can be a later change.
