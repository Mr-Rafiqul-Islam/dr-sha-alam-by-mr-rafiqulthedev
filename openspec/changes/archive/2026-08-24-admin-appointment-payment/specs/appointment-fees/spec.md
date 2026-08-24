## ADDED Requirements

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
