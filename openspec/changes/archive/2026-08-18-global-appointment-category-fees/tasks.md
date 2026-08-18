## 1. Data model and seed

- [x] 1.1 Add Prisma enum value `OLD_GENERAL` and nullable `Appointment.feeCategory`; create and apply the migration
- [x] 1.2 Seed four `AppointmentRevenueFee` rows for `DOCTOR_SHA_ALAM` with defaults 1500 / 1000 / 600 / 400 when env is unset or invalid; add `OLD_GENERAL_APPOINTMENT_FEE` to `.env.example`
- [x] 1.3 Document the four env keys in `docs/daily-appointment-revenue-dashboard.md` (no bulk appointment backfill)

## 2. Server resolve and fees API

- [x] 2.1 Shared resolve helper: stored `feeCategory` wins, else P-9→NEW_PLID, OP-4→OLD_PLID, G-5→GENERAL, else OTHER; map OLD_GENERAL display slot to G-5
- [x] 2.2 Extend GET/PATCH `/api/v1/admin/appointment-revenue/fees` and summary aggregation to four categories; GENERAL and OLD_GENERAL as separate revenue rows sharing G-5 occupancy
- [x] 2.3 Update appointment list category filter so OLD_GENERAL matches stored category only; GENERAL matches stored GENERAL or (null stored + G-5)
- [x] 2.4 Cover resolve, fees validation (including OLD_GENERAL), and G-5 split revenue in server tests

## 3. Appointment APIs

- [x] 3.1 Include stored `feeCategory` and live `consultationFee` on appointment API payloads (0 when OTHER)
- [x] 3.2 Accept optional `feeCategory` on admin appointment update; persist only that row; leave null on create when omitted
- [x] 3.3 Charge paid booking from resolved category fee; stop using `Doctor.consultationFee` / `CONSULTATION_FEE_FALLBACK` for amount (keep Payment.doctorId FK unused for price)

## 4. Admin dashboard and appointment document

- [x] 4.1 Configure Fees modal: four fields, GET on open, PATCH all four, invalidate summary
- [x] 4.2 Daily revenue table: four category rows plus OTHER; fees from summary API
- [x] 4.3 Appointment update modal: category select for any appointment (new or old); save via existing update endpoint
- [x] 4.4 Appointment list category filter includes Old General

## 5. Invoices, discounts, and cleanup

- [x] 5.1 Invoice and discount helpers use appointment `consultationFee`; remove `CONSULTATION_FEE_BDT` as the price source
- [x] 5.2 Confirm public booking still has three slots only (no Old General time)
- [x] 5.3 Run server tests/build and admin build/lint
