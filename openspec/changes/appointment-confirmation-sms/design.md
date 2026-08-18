## Context

See proposal.md for motivation. Appointment SMS already exists: `createAppointment` and `fulfillSuccessfulPayment` call `sendAppointmentSms` in `appointment.sms.ts`, which talks to Novocom directly. Admin OTP already uses the shared client `lib/novocomSms.ts` (BD phone normalization + ErrorCode checks). `updateAppointmentStatus` does not send SMS. Client vs admin bookings are already distinguished by `createdById` (null on the website). Slot copy for time of day already lives on `smsLabel` (e.g. `সকাল ৯ টা`).

## Goals / Non-Goals

**Goals:**
- One domain sender (`sendAppointmentSms`) used by create, payment fulfill, and confirm-status.
- Shared Novocom client for delivery; appointment layer owns the template and trigger rules.
- Bengali date/weekday formatting from `appointmentDate` plus slot `smsLabel`.

**Non-Goals:**
- UI, retries, SMS audit table, or a sent-flag on Appointment.
- SMS on reschedule, cancel, or any status other than create-success and client → CONFIRMED.
- Changing Novocom credentials shape or adding template env vars.

## Decisions

### 1. Keep `sendAppointmentSms` as the appointment wrapper; call `sendNovocomSms` inside it

`appointment.sms.ts` builds the Unicode message and no-ops when `isNovocomConfigured()` is false. Delivery, MSISDN normalization (`016…` → `88016…`), and ErrorCode handling stay in `lib/novocomSms.ts`.

Alternatives considered: calling `sendNovocomSms` from each controller (duplicates template + fire-and-forget); putting the chamber template in `.env` (fragile multiline Unicode).

### 2. Identify website bookings with `createdById == null`

Status-update SMS fires only when `existing.createdById` is null, previous status is not CONFIRMED, and the new status is CONFIRMED. Admin creates already send on create and are stored with `createdById` set.

Alternatives considered: `siteRef` (both sources can be `DOCTOR_SHA_ALAM`); a new `source` column (unnecessary).

### 3. Paid SMS stays on payment success, not on reserve

`createPendingPaymentWithAppointment` creates the reserved row without SMS. `fulfillSuccessfulPayment` sends SMS when `smsPayload` is present and the payment was not already processed.

### 4. Format attendance time in Asia/Dhaka from the stored appointment date

Build `উপস্থিতি সময়ঃ {bn DD/MM/YYYY} রোজ {bn weekday} {smsLabel}।` using the appointment calendar date and the slot `smsLabel` (fallback to bootstrap labels by `preferredTime`). Weekdays: রবিবার … শনিবার. Digits: ০–৯.

### 5. Fire-and-forget after the DB commit

`void sendAppointmentSms(...).catch(console.error)` after create/fulfill/status update succeeds. SMS errors never fail the HTTP response.

## Risks / Trade-offs

- [Unicode multipart cost] → Accept ~5 Novocom segments; do not shorten the address/maps copy.
- [Client booking gets two SMS: create then confirm] → Intentional; do not dedupe.
- [Staff un-confirm then confirm again] → A second SMS is acceptable; no sent-flag.
- [Missing `NOVOCOM_*` in env] → Silent skip so local/dev booking still works; `.env.example` already documents the keys.
- [Local phone format not delivered] → Shared client normalizes to `880…` before send.

## Migration Plan

- Deploy server change; no schema migration.
- Set `NOVOCOM_API_KEY`, `NOVOCOM_CLIENT_ID`, `NOVOCOM_SENDER_ID` in production if unset.
- Rollback: revert the SMS module/controller/payment hook; bookings continue without the new template.
