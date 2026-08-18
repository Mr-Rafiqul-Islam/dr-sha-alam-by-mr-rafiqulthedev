## Why

Patients need a reliable chamber-location SMS after they book, and again when staff confirm a website booking. The server already calls Novocom on create/payment, but the message still uses the old Healing Centre copy (name + serial, time only) and does not fire when staff later set a client appointment to Confirmed.

## What Changes

- Send a Novocom Unicode SMS to the patient phone after every successful appointment create: admin dashboard (already `CONFIRMED`) and client website (free create, or paid after payment success — not the unpaid reserved row).
- Also send the same SMS when staff update a **client-created** appointment (`createdById` is null) from a non-`CONFIRMED` status to `CONFIRMED`. Admin-created appointments do not get a second SMS from this path.
- Replace the SMS body with the TruCare Diagnostics Centre template. Static: chamber name, Mohakhali address, landmark, contact numbers (`০৯৬১৩-৬৬৮৮৬৬`, `০১৭০১৩১৩০০১`, `০১৭০১৩১৩০০২`), Google Maps URL. Dynamic: `উপস্থিতি সময়ঃ {Bengali date} রোজ {Bengali weekday} {slot smsLabel}।`
- Drop patient name and serial from the SMS.
- Route appointment SMS through the shared Novocom client (phone normalization + gateway ErrorCode handling). SMS failure MUST NOT fail the appointment create/update.

## Capabilities

### New Capabilities

- `appointment-confirmation-sms`: When Novocom appointment SMS is sent, the Bengali chamber template, and fire-and-forget delivery behavior.

### Modified Capabilities

- (none)

## Impact

- **Server:** `appointment.sms.ts` template and payload (`appointmentDate` + slot `smsLabel`); `createAppointment` (already sends on create); `updateAppointmentStatus` (new confirm trigger for client bookings); `payment.service.ts` (SMS after payment success only); reuse `lib/novocomSms.ts`.
- **Config:** `NOVOCOM_API_KEY`, `NOVOCOM_CLIENT_ID`, `NOVOCOM_SENDER_ID` (already documented in `.env.example`). Template stays in code, not env.
- **Admin / Client UI:** No UI change. Staff and patients see the new SMS content only.
- **Dependencies:** Novocom SMS gateway (`sms.novocom-bd.com`). No new packages.
