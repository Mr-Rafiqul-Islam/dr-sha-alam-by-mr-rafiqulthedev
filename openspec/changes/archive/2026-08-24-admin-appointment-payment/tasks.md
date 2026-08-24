## 1. Data model

- [x] 1.1 Add Prisma `AppointmentPaymentMethod` (`CASH`, `SSL`, `BKASH`), nullable `Appointment.paymentMethod` and `collectedAmount`, and the Payment↔Appointment relation; create and apply the migration (no backfill)
- [x] 1.2 Add `PaymentSetting` singleton (or equivalent) for optional bKash merchant QR image URL/publicId; migrate

## 2. CHAMBER staff access

- [x] 2.1 Add `CHAMBER` to server `STAFF_PANEL_ROLES`; share SUPPORT permissions with CHAMBER; default admin path `/appointments`
- [x] 2.2 Allow SUPER_ADMIN / MANAGER / ADMIN to assign CHAMBER with the same rules as SUPPORT
- [x] 2.3 Add `CHAMBER` to admin `StaffRole`, permission maps, `STAFF_ROLE_OPTIONS`, AdminForm zod enum, and assignable-role helpers
- [x] 2.4 Seed an optional local CHAMBER user (same pattern as SUPPORT) so the role can be signed in during development

## 3. Due amount and appointment create

- [x] 3.1 Add a shared server due helper: category fee minus this appointment’s fee discounts, floor at 0; keep public `resolveBookingConsultationFee` undiscounted
- [x] 3.2 Accept `paymentMethod` and cash `collectedAmount` on admin appointment create; require method for CHAMBER; omit remains unpaid (`paymentStatus` null)
- [x] 3.3 Cash create: reject amount ≠ due; on match set `paymentMethod CASH`, `collectedAmount`, `paymentStatus SUCCESS`
- [x] 3.4 SSL/bKash create: persist method, `paymentStatus PENDING`; do not mark paid
- [x] 3.5 Return `paymentMethod` and `collectedAmount` on appointment API payloads used by admin list, view, and invoice

## 4. Admin SSL and fail/cancel

- [x] 4.1 Add `POST /api/v1/admin/appointments/:id/payments/ssl/start` behind admin auth + appointments permission; init SSLCommerz for that appointment at due; set `Payment.meta.source = "admin"`; return `gatewayPageUrl`, `tranId`, `amount`
- [x] 4.2 In fail/cancel sync: if appointment `createdById` is set, keep the appointment and set `paymentStatus PENDING`; public reserves (`createdById` null) still cancel on fail
- [x] 4.3 Confirm existing IPN/success still marks staff SSL appointments `paymentStatus SUCCESS` without using public `/payment/start`

## 5. bKash QR setting and confirm

- [x] 5.1 GET payment setting (appointments permission) and PATCH/upload QR (FULL_ACCESS_ROLES) using the existing Cloudinary image-upload pattern
- [x] 5.2 Add `POST /api/v1/admin/appointments/:id/payments/bkash/confirm`; only BKASH + not already SUCCESS; set SUCCESS and `collectedAmount = due`

## 6. Admin create UI

- [x] 6.1 Payment method control on `AppointmentForm` after Fee Discount: Cash | Digital Payment, then SSL | bKash; show due hint; CHAMBER required in zod
- [x] 6.2 Cash submit sends collected amount; toast and navigate on success
- [x] 6.3 SSL submit creates then calls admin start; show dynamic QR of `gatewayPageUrl` (prefer SSL QR image if present); poll `paymentStatus` until SUCCESS or dismiss
- [x] 6.4 Add hardcoded fallback bKash QR asset; show uploaded image if present else that asset; confirm collected on create modal and on appointment view/status for PENDING bKash
- [x] 6.5 Admin settings (or fees-adjacent) UI for full-access roles to upload/replace the bKash merchant QR

## 7. Tests and verification

- [x] 7.1 Server tests: CHAMBER create without payment rejected; ADMIN skip allowed; cash match/mismatch; SSL start unauthorized; fail/cancel does not cancel `createdById` appointments; bKash confirm; due = fee − discount; public start amount still undiscounted
- [x] 7.2 Run server tests/build and admin build/lint
