## Context

See `proposal.md` for motivation and the delta specs for behavior. `UserRole.CHAMBER` is already on the Prisma enum but is absent from `STAFF_PANEL_ROLES`, permission maps, assignable roles, and the admin user form — a CHAMBER user cannot log in or open appointments. Admin create (`AppointmentForm`) has fee discount and writes `CONFIRMED` with `paymentStatus` null. Public `POST /api/v1/payment/start` creates a *new* reserved appointment (default `PENDING`, `createdById` null), charges the undiscounted category fee, and on fail **cancels** that appointment. `Payment.appointmentId` is stored without a Prisma relation. There is no cash path and no bKash appointment QR.

Constraints: one due-amount formula shared with invoices (category fee − this appointment’s fee discounts). Public paid booking stays undiscounted. Fail/cancel for staff-created rows must not cancel the appointment.

## Goals / Non-Goals

**Goals:**

- Treat CHAMBER as SUPPORT for panel access; payment-required-on-create is the only extra rule.
- Create-form collection: Cash (validated due), SSL (admin start + dynamic QR), bKash (merchant QR + staff confirm).
- Distinguish staff SSL from public reserve so IPN/fail/cancel do not cancel walk-ins.
- Persist payment method and collected amount so list/invoice/dashboard can show the same due.

**Non-Goals:**

- Changing public `POST /api/v1/payment/start` amount rules or the patient redirect flow.
- Collecting payment from the appointment *edit* form except bKash/SSL confirm/poll for an already-created PENDING row (needed so staff can finish after leaving create).
- bKash tokenized/checkout API (merchant QR + manual confirm only).
- Injecting injection/operation amounts into create-time due.
- New staff permissions beyond copying SUPPORT for CHAMBER.

## Decisions

### 1. Copy SUPPORT access for CHAMBER; gate payment in the appointment module

Add `CHAMBER` to `STAFF_PANEL_ROLES` on server and admin. Reuse `SUPPORT_PERMISSIONS` (or a shared `FRONT_DESK_PERMISSIONS` set) for both SUPPORT and CHAMBER. Default path `/appointments`. Admin management: CHAMBER is assignable under the same actor rules as SUPPORT (`ADMIN` / `MANAGER` / `SUPER_ADMIN`). Zod role enums and `STAFF_ROLE_OPTIONS` include CHAMBER.

Payment required vs optional is **not** a permission bit. Create validation: if `req.admin.role === CHAMBER` and no payment method, 400. Other roles may omit it.

- **Why:** Specs require identical facilities except payment. Duplicating the SUPPORT permission list twice is worse than one shared set.
- **Alternative:** New `CHAMBER` permission. Rejected — no extra pages.

### 2. Store method and amount on `Appointment`; keep SSL money on `Payment`

Add:

- `enum AppointmentPaymentMethod { CASH SSL BKASH }`
- `Appointment.paymentMethod AppointmentPaymentMethod?`
- `Appointment.collectedAmount Float?`
- Prisma relation `Appointment.payments Payment[]` / `Payment.appointment` (today `appointmentId` is an unenforced FK)

Cash: set `paymentMethod = CASH`, `collectedAmount = due`, `paymentStatus = SUCCESS`, no `Payment` row.

SSL: set `paymentMethod = SSL`, `paymentStatus = PENDING`, create `Payment` (`gateway: SSLCommerz`, `amount: due`, `meta.source: "admin"`). Success copies `transactionId` / SUCCESS as today.

bKash: set `paymentMethod = BKASH`, `paymentStatus = PENDING`, `collectedAmount` null until confirm, then SUCCESS and `collectedAmount = due`. No `Payment` row (no gateway session).

- **Why:** List/invoice need method without joining Payment; SSL already has a ledger table.
- **Alternative:** Only `Payment` rows including CASH/BKASH. Rejected — forces fake gateway rows and breaks current null unpaid creates.

### 3. Shared due helper; server is source of truth

One server function: `due = categoryFee(resolved category) − sum(fee discounts)`, never below 0, two decimal places. Admin create, cash validation, SSL `total_amount`, bKash confirm, and appointment JSON `consultationFee` + discounts already used by invoices MUST call it (admin UI may preview due from the same inputs but MUST send cash amount; server rejects mismatch).

Public `resolveBookingConsultationFee` stays undiscounted.

- **Why:** Specs require invoice and staff collection to match; client-only math would drift.
- **Alternative:** Trust the cash input as collected even when ≠ due. Rejected — specs reject mismatch.

### 4. Two-step SSL after create; new admin route; QR from session URL

Do **not** call public `/api/v1/payment/start`.

Flow:

1. `POST` existing admin/client appointment create with `paymentMethod: "SSL"` (and discounts). Appointment is `CONFIRMED`, `paymentStatus PENDING`, `createdById` set.
2. `POST /api/v1/admin/appointments/:id/payments/ssl/start` (`requireAdminAuth` + appointments permission). Init SSLCommerz for **this** id, amount = due, `success_url` / `fail_url` / `cancel_url` / `ipn_url` reuse existing payment callbacks (patient still completes checkout on their phone).
3. Response: `{ gatewayPageUrl, tranId, amount }`. Admin renders a **dynamic QR of `gatewayPageUrl`** (use SSL’s QR image from init if present). Modal stays open; poll appointment `paymentStatus` until SUCCESS or staff dismisses (PENDING).

CHAMBER: UI must complete step 1+2 in the same submit; if start fails, appointment remains PENDING (allowed by fail/cancel spec).

- **Why:** Public start would create a duplicate reserved row and ignore discount. Encoding the hosted checkout URL is a per-transaction QR without a new SSL product.
- **Alternative:** Combined create+init in one handler. Possible later; two endpoints keep create and gateway failures separate.
- **Alternative:** Static merchant SSL QR. Rejected — cannot match `tran_id`.

### 5. Fail/cancel: staff rows stay; public reserves still cancel on fail

In `handlePaymentFailSync` / `handlePaymentCancelSync`: if the linked appointment has `createdById` set (staff create), update `paymentStatus` to PENDING only — do **not** set `AppointmentStatus.CANCEL`. Public reserved payments (`createdById` null) keep today’s fail → cancel.

Branch on `createdById`, not on `status`, so a later status edit cannot change payment teardown.

- **Why:** Matches SMS design’s staff vs website split and the fail/cancel spec.
- **Alternative:** `Payment.meta.source === "admin"` only. Also set that meta, but `createdById` is the durable appointment-level signal.

### 6. bKash QR: uploaded setting then hardcoded asset; confirm is a staff action

Store optional Cloudinary URL/publicId on a small singleton (`PaymentSetting` or equivalent), not Meta `AnalyticsSetting` (CHAMBER cannot open analytics settings).

- GET: any role with appointments permission (CHAMBER must display the QR).
- PATCH/upload: `FULL_ACCESS_ROLES` only (SUPER_ADMIN / ADMIN / MANAGER).
- Display order: uploaded image if present, else hardcoded `admin` asset (e.g. `src/assets/bkash-merchant-qr.png`). Ship a placeholder asset until the real merchant QR is added.

Confirm: `POST /api/v1/admin/appointments/:id/payments/bkash/confirm` — only `paymentMethod = BKASH` and not already SUCCESS. Sets SUCCESS + `collectedAmount = due`. Expose confirm on the post-create QR step **and** on appointment view/status so PENDING bKash can be finished later.

- **Why:** Specs require upload-or-hardcode and an explicit collected confirm. Analytics settings are the wrong permission and domain.
- **Alternative:** Hardcode only. Rejected — staff asked for upload.
- **Alternative:** Confirm implies SUCCESS without storing amount. Rejected — cash/invoice alignment needs `collectedAmount`.

### 7. Create-form UI state

Place the control in `AppointmentForm` after `AppointmentDiscountFields`. Nested select: method empty | Cash | Digital Payment; if digital, SSL | bKash. Show due (read-only hint) whenever a method is chosen; cash input is editable and validated against due. CHAMBER: method required in zod + server. Others: optional.

After SSL create, open QR modal (do not immediately `navigate("/appointments")` until dismissed). After bKash create, show QR + Confirm collected. Cash: existing success toast + navigate.

## Risks / Trade-offs

- **[Risk] QR of GatewayPageURL is a hosted checkout, not SSL’s native merchant QR** → Still unique per `tran_id`; prefer init QR image if SSLCommerz returns one.
- **[Risk] IPN delayed while staff close the modal** → Appointment stays PENDING; list badge shows it; poll while modal open; IPN still completes after dismiss.
- **[Risk] CHAMBER enum exists in DB before permissions are deployed** → Deploy server+admin permission wiring together; creating a CHAMBER user before that login fails closed (safer than open).
- **[Risk] Fail handler change could spare a public booking if `createdById` were ever set** → Public start never sets `createdById`; do not add it.
- **[Trade-off] Two-step SSL vs one handler** → Extra round trip; clearer recovery when the gateway is down (appointment exists, PENDING).
- **[Trade-off] Hardcoded QR file in the repo** → Operationally simple; replace the asset or upload in settings without a code change for the upload path.

## Migration Plan

1. Prisma: `CHAMBER` already on enum; add `AppointmentPaymentMethod`, `paymentMethod`, `collectedAmount`, Payment↔Appointment relation. No backfill (existing rows stay null/unpaid).
2. Deploy server: CHAMBER permissions, due helper, create validation, admin SSL start, bKash confirm, fail/cancel branch, payment-setting GET/PATCH.
3. Deploy admin: role wiring, form, QR modal, fallback asset, settings upload.
4. Rollback: hide form fields; old clients omit payment keys and keep unpaid create. Do not remove `CHAMBER` from the enum.

## Open Questions

- Exact filename/artwork of the first hardcoded bKash QR (placeholder vs production image) can be swapped at implement time without changing specs.
