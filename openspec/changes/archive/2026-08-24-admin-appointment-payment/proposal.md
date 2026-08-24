## Why

Chamber staff create walk-in appointments from the admin form but cannot record cash or digital payment. Public SSLCommerz booking already exists, yet it ignores discounts, cancels the appointment on fail, and leaves the dashboard. Desk collection needs a first-class payment step that is required only for CHAMBER users.

## What Changes

- Wire `UserRole.CHAMBER` (already on the Prisma enum) as a staff-panel role with the same facilities as SUPPORT, except appointment payment on create is required.
- Add a Payment Method control on the admin create-appointment form, between Fee Discount and Create Appointment.
- Cash: staff enter the collected amount, which MUST equal due (`category fee − applied discount`). Create marks `paymentStatus` SUCCESS.
- Digital Payment:
  - SSL: new admin-authenticated start endpoint, amount = due, dynamic QR, IPN/validate SUCCESS; fail/cancel leaves the appointment and sets `paymentStatus` PENDING.
  - bKash: show merchant QR (uploaded image, else hardcoded admin asset); staff confirm they collected; until then PENDING.
- Payment is **required for CHAMBER** and **optional for every other role** that can create appointments. Skipping it keeps today’s unpaid create (`paymentStatus` null).
- One due-amount calculation everywhere staff collect or print: category fee minus this appointment’s discount.
- Do not reuse public `POST /api/v1/payment/start` for the dashboard (it creates a second reserved appointment, ignores discount, and redirects to the patient site).

## Capabilities

### New Capabilities

- `admin-chamber-role`: CHAMBER is a staff-panel role with SUPPORT-equivalent access (login, appointments home, assignable users). Payment-required-on-create is the only behavioral difference.
- `admin-appointment-payment`: Staff payment collection on admin create — Cash, Digital Payment (SSL dynamic QR, bKash merchant QR + confirm), role-based required vs optional, admin SSL endpoint, fail/cancel stays PENDING.

### Modified Capabilities

- `appointment-fees`: Staff-collected SSL/cash amounts SHALL use the same due figure as invoices (category fee minus applied discount), not the undiscounted category fee used by public paid booking.

## Impact

- Server: admin auth/permissions and admin-management role lists for CHAMBER; appointment create payload (payment method, cash amount); new admin SSL start (and optional confirm-bKash); Prisma payment method / collected amount as needed; Payment row for SSL linked to the created appointment; bKash QR upload setting; SSL fail/cancel MUST NOT cancel a staff-created appointment.
- Admin: create-appointment form payment UI; CHAMBER in role dropdowns and permission maps; bKash QR settings upload plus asset fallback; SSL QR modal; bKash “payment received” confirm.
- Client public paid booking: unchanged.
- Invoice and dashboard collection: consume the same due-amount helper as cash and SSL.
