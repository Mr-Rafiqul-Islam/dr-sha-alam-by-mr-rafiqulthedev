## 1. SMS template and sender

- [x] 1.1 Replace chamber copy in `appointment.sms.ts` with the TruCare Diagnostics Centre template (address, landmark, contacts `০৯৬১৩-৬৬৮৮৬৬` / `০১৭০১৩১৩০০১` / `০১৭০১৩১৩০০২`, Google Maps URL); drop name and serial from the message
- [x] 1.2 Add Bengali attendance-time formatter (`DD/MM/YYYY` digits + weekday + slot `smsLabel`) and include `appointmentDate` on the SMS payload
- [x] 1.3 Route `sendAppointmentSms` through `isNovocomConfigured` / `sendNovocomSms`; no-op when credentials are missing

## 2. Create and payment triggers

- [x] 2.1 Pass `appointmentDate` into `sendAppointmentSms` from `createAppointment` (admin and client free already send after successful create)
- [x] 2.2 Pass `appointmentDate` on payment-fulfill `smsPayload`; keep SMS off `createPendingPaymentWithAppointment` (unpaid reserve)

## 3. Confirm-status trigger

- [x] 3.1 After a successful `updateAppointmentStatus`, send SMS only when `createdById` is null, previous status is not CONFIRMED, and new status is CONFIRMED
- [x] 3.2 Fire-and-forget SMS (`void` + `catch`) so create, fulfill, and status update still succeed if Novocom fails

## 4. Tests

- [x] 4.1 Unit-test the attendance-time line (e.g. 19 Aug 2026 Wednesday morning → `উপস্থিতি সময়ঃ ১৯/০৮/২০২৬ রোজ বুধবার সকাল ৯ টা।`) and assert name/serial are absent
- [x] 4.2 Run server tests for the appointment/payment modules touched
