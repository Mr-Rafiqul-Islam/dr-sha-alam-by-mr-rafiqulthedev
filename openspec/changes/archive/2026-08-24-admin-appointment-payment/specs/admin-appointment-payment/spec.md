## Purpose

Lets staff collect appointment payment from the admin create form using cash or digital payment, required for CHAMBER and optional for other roles.

## ADDED Requirements

### Requirement: Payment method on admin create form
The admin create-appointment form SHALL show a payment method control between the Fee Discount section and the Create Appointment action. Options SHALL be Cash and Digital Payment. Digital Payment SHALL offer SSL and bKash.

#### Scenario: Control sits below fee discount
- **WHEN** staff open the add-appointment form
- **THEN** the payment method control appears after Fee Discount and before Create Appointment

#### Scenario: Digital Payment nested methods
- **WHEN** staff select Digital Payment
- **THEN** they can choose SSL or bKash

### Requirement: Payment required only for CHAMBER
CHAMBER users MUST select Cash or Digital Payment before create succeeds. Every other role that can create appointments MAY omit payment. Omitting payment SHALL create the appointment with no payment method and `paymentStatus` null, matching unpaid creates today. EDITOR users SHALL NOT see this form.

#### Scenario: CHAMBER cannot create without payment
- **WHEN** a CHAMBER user submits a valid appointment without Cash or Digital Payment
- **THEN** the system rejects the create and does not store the appointment

#### Scenario: Non-CHAMBER may skip payment
- **WHEN** an ADMIN submits a valid appointment with no payment method
- **THEN** the appointment is created with `paymentStatus` null

### Requirement: Cash collects the due amount
When Cash is selected, staff MUST enter the collected amount. That amount MUST equal due: the appointment's category fee minus any fee discount applied on this form. A matching cash create SHALL store the appointment as paid (`paymentStatus` SUCCESS) with method cash. A mismatched or missing amount SHALL be rejected.

#### Scenario: Cash equals due with discount
- **WHEN** staff enable a 200 BDT discount on a 1500 BDT category fee and enter cash 1300
- **THEN** the appointment is created with `paymentStatus` SUCCESS and collected amount 1300

#### Scenario: Cash mismatch rejected
- **WHEN** due is 1300 and staff enter cash 1000
- **THEN** the system rejects the create

#### Scenario: Cash without discount
- **WHEN** discount is off, the category fee is 600, and staff enter cash 600
- **THEN** the appointment is created with `paymentStatus` SUCCESS

### Requirement: Admin SSL start uses a dedicated endpoint
Staff SSL collection SHALL use a new admin-authenticated payment-start endpoint. The system MUST NOT start dashboard SSL via the public patient `payment/start` path. Unauthenticated callers and staff without appointments permission SHALL be denied.

#### Scenario: Admin start requires staff auth
- **WHEN** an unauthenticated caller posts to the admin SSL start endpoint
- **THEN** the system denies the request

#### Scenario: Public start remains for patients
- **WHEN** a patient starts paid booking from the public site
- **THEN** the existing public payment-start path still creates that paid booking and is unchanged by this dashboard flow

### Requirement: SSL charges due and shows a dynamic QR
Admin SSL SHALL charge due (category fee minus applied discount). The system SHALL create the appointment, start an SSLCommerz session for that appointment, and show a dynamic QR for this transaction. Successful SSL validation or IPN SHALL set `paymentStatus` SUCCESS.

#### Scenario: SSL amount after discount
- **WHEN** staff apply a 200 BDT discount on a 1500 BDT fee and start SSL
- **THEN** the SSL session amount is 1300 and a dynamic QR for that session is shown

#### Scenario: SSL success marks paid
- **WHEN** SSLCommerz reports a valid payment for the staff-created appointment
- **THEN** that appointment's `paymentStatus` is SUCCESS

### Requirement: SSL fail or cancel keeps the appointment pending
If SSL fails or is cancelled for a staff-created appointment, the system SHALL leave the appointment in place and set `paymentStatus` to PENDING. The system MUST NOT cancel or delete that appointment because of payment fail or cancel.

#### Scenario: Patient abandons SSL checkout
- **WHEN** SSL reports fail or cancel for a CHAMBER-created appointment
- **THEN** the appointment still exists and `paymentStatus` is PENDING

### Requirement: bKash shows merchant QR and requires staff confirm
When bKash is selected, the system SHALL display the merchant QR: the admin-uploaded image if one is stored, otherwise a hardcoded admin asset. Create SHALL set `paymentStatus` PENDING until a staff user with appointments permission confirms they collected the due amount. Confirm SHALL set `paymentStatus` SUCCESS. Showing the QR alone MUST NOT mark the appointment paid.

#### Scenario: Uploaded QR takes precedence
- **WHEN** an admin has uploaded a bKash merchant QR image
- **THEN** the create-form bKash view shows that uploaded image

#### Scenario: Fallback hardcoded QR
- **WHEN** no uploaded bKash QR is stored
- **THEN** the create-form bKash view shows the hardcoded admin asset

#### Scenario: Confirm collected amount
- **WHEN** staff confirm they collected the due amount for a bKash appointment
- **THEN** `paymentStatus` becomes SUCCESS

#### Scenario: QR without confirm stays pending
- **WHEN** staff create with bKash and do not confirm collection
- **THEN** `paymentStatus` remains PENDING
