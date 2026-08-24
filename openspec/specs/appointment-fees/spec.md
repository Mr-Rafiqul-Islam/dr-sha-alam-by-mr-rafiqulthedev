# appointment-fees Specification

## Purpose

Defines the clinic-wide appointment price list for Dr. Shah Alam so dashboard collection, invoices, discounts, and paid bookings all use the same four category fees.

## Requirements

### Requirement: Global four-category fee list
The system SHALL persist exactly four global appointment fees for site `DOCTOR_SHA_ALAM`: NEW_PLID, OLD_PLID, GENERAL, and OLD_GENERAL. Seed or first-run amounts SHALL be NEW_PLID 1500 BDT, OLD_PLID 1000 BDT, GENERAL 600 BDT, and OLD_GENERAL 400 BDT. Fees SHALL be non-negative, at most 1,000,000, and have at most two decimal places.

#### Scenario: Seeded defaults
- **WHEN** fees are seeded for `DOCTOR_SHA_ALAM` with no overriding invalid values
- **THEN** the stored amounts are NEW_PLID 1500, OLD_PLID 1000, GENERAL 600, and OLD_GENERAL 400

#### Scenario: Reject invalid fee
- **WHEN** an admin submits a fee that is negative, above 1,000,000, or has more than two decimal places
- **THEN** the system rejects the update and leaves stored fees unchanged

### Requirement: Admins can read and update global fees
Authenticated admins with appointments permission SHALL retrieve and update all four fees through the existing appointment-revenue fees API. Configure Fees on the admin dashboard SHALL load current fees when opened and persist all four values on save. Saving SHALL refresh dashboard expected-collection amounts that depend on those fees.

#### Scenario: Load Configure Fees
- **WHEN** an admin with appointments permission opens Configure Fees
- **THEN** the system loads NEW_PLID, OLD_PLID, GENERAL, and OLD_GENERAL from the fees API

#### Scenario: Save Configure Fees
- **WHEN** an admin saves valid amounts for all four categories
- **THEN** the system stores those amounts and subsequent revenue summary responses use the new values

#### Scenario: Unauthorized fees access
- **WHEN** an unauthenticated caller or an admin without appointments permission requests or updates fees
- **THEN** the system denies the request

### Requirement: Dashboard expected collection uses global fees
Daily appointment revenue SHALL compute category revenue as attended count for that fee category multiplied by the configured fee for that category. GENERAL and OLD_GENERAL SHALL appear as separate rows even though they share slot G-5. OTHER (unknown slot, no stored category) SHALL contribute 0 fee and 0 revenue.

#### Scenario: Mixed general attendance
- **WHEN** on a business date two attended appointments are GENERAL and one attended appointment is OLD_GENERAL, with fees 600 and 400
- **THEN** GENERAL revenue is 1200, OLD_GENERAL revenue is 400, and those amounts are included in total calculated revenue

### Requirement: Invoices and discounts use the appointment category fee
Printed appointment invoices and percentage fee discounts SHALL use the global fee for the appointment's resolved fee category, not a hardcoded consultation amount and not a per-doctor consultation amount.

#### Scenario: Invoice for Old General
- **WHEN** staff print an invoice for an appointment whose resolved category is OLD_GENERAL and the global OLD_GENERAL fee is 400
- **THEN** the consultation fee line and discount base amount are 400

#### Scenario: Invoice for New PLID
- **WHEN** staff print an invoice for an appointment whose resolved category is NEW_PLID and the global NEW_PLID fee is 1500
- **THEN** the consultation fee line and discount base amount are 1500

### Requirement: Paid booking amount uses the appointment category fee
Starting a paid booking SHALL charge the global fee for the appointment's resolved fee category. The system MUST NOT use `Doctor.consultationFee` or a consultation-fee environment fallback to determine that amount. The clinic SHALL operate as a single-doctor practice (Dr. Shah Alam) with no doctor picker and no per-doctor price.

#### Scenario: Paid G-5 booking defaults to General fee
- **WHEN** a patient starts paid booking for slot G-5 and no staff category override exists
- **THEN** the payment amount is the global GENERAL fee (600 after seed)

#### Scenario: Paid booking ignores doctor consultation fee
- **WHEN** a Doctor record has consultationFee 1500 and the resolved appointment category fee is 600
- **THEN** the payment amount is 600

### Requirement: Staff collection uses invoice due amount
Staff cash collection and admin SSL start SHALL charge the same due amount used on the printed invoice for consultation: the global fee for the appointment's resolved category minus fee discounts applied on that appointment. Public patient paid booking SHALL continue to charge the undiscounted category fee. Create-time due SHALL NOT include injection or operation amounts added later on edit.

#### Scenario: Discounted staff SSL matches invoice net consultation
- **WHEN** the resolved category fee is 1500, staff apply a 200 BDT discount, and they start admin SSL
- **THEN** the SSL amount is 1300 and a later invoice for that appointment shows consultation 1500 and discount 200 (net 1300)

#### Scenario: Cash due matches invoice without discount
- **WHEN** the resolved category fee is 600, no discount is applied, and staff collect cash
- **THEN** the required cash amount is 600 and the invoice consultation line is 600

#### Scenario: Public paid booking still ignores staff discounts
- **WHEN** a patient starts public paid booking for a category whose fee is 600
- **THEN** the public payment amount is 600 even though admin staff collection would subtract a discount when one is applied

### Requirement: Changing fees does not bulk-update old appointments
Updating the global fee list SHALL change the stored fee table only. The system MUST NOT mass-update existing appointment rows. New reads of invoices, discounts, dashboard, and new payments SHALL use current global fees for the appointment's resolved category.

#### Scenario: Fee change leaves appointment rows unchanged
- **WHEN** an admin changes GENERAL from 600 to 700
- **THEN** existing appointment records are not rewritten and a later invoice for an appointment still resolved as GENERAL uses 700
