# appointment-fee-category Specification

## Purpose

Lets each appointment carry a fee category so General and Old General can share slot G-5 while staff still assign the correct price on new and existing appointments.

## Requirements

### Requirement: Appointments have a resolvable fee category
Every appointment SHALL resolve to one of NEW_PLID, OLD_PLID, GENERAL, or OLD_GENERAL when a known slot or stored category exists. The public booking and schedule surface SHALL keep three time slots only: P-9, OP-4, and G-5. OLD_GENERAL MUST NOT introduce a fourth public time slot.

#### Scenario: Three public slots
- **WHEN** a patient opens the public booking form
- **THEN** the available times are the existing three slots and Old General is not offered as a separate time

#### Scenario: Stored category wins over slot
- **WHEN** an appointment slot is G-5 and its stored category is OLD_GENERAL
- **THEN** the resolved fee category is OLD_GENERAL

### Requirement: Default category from slot
When an appointment has no stored fee category, the system SHALL infer NEW_PLID from P-9, OLD_PLID from OP-4, and GENERAL from G-5. G-5 MUST NOT infer OLD_GENERAL. Unknown slots remain uncategorized for revenue (OTHER) until staff assign a category.

#### Scenario: New G-5 booking
- **WHEN** a patient or admin creates an appointment for G-5 without choosing a category
- **THEN** the resolved category is GENERAL

#### Scenario: New P-9 booking
- **WHEN** an appointment is created for P-9 without a stored category
- **THEN** the resolved category is NEW_PLID

#### Scenario: Legacy appointment without stored category
- **WHEN** staff open an existing appointment that has no stored category and preferred time OP-4
- **THEN** the resolved category is OLD_PLID and the appointment row is not bulk-migrated

### Requirement: Staff can switch category on any appointment
Admins with permission to update appointments SHALL set or change the fee category of any appointment, including historical ones, to any of the four categories. Saving the category SHALL persist it on that appointment only. The category control SHALL be available in the admin appointment document (the same admin appointment update flow used for status, injection, operation, and discount).

#### Scenario: Switch existing General to Old General
- **WHEN** staff open an existing G-5 appointment resolved as GENERAL and save category OLD_GENERAL
- **THEN** that appointment's stored category is OLD_GENERAL and later invoices, discounts, and revenue counts treat it as OLD_GENERAL at the current global OLD_GENERAL fee

#### Scenario: Switch a PLID appointment
- **WHEN** staff save category GENERAL on an appointment whose slot is P-9
- **THEN** the stored and resolved category is GENERAL even though the slot remains P-9

#### Scenario: Category switch is per appointment
- **WHEN** staff change the category on one appointment
- **THEN** other appointments are unchanged

### Requirement: Shared G-5 seat pool
GENERAL and OLD_GENERAL SHALL share the General slot time G-5, including seat limits and schedule occupancy. Changing only the fee category MUST NOT move the appointment to a different clock time.

#### Scenario: Old General stays at G-5
- **WHEN** staff set an appointment's category to OLD_GENERAL
- **THEN** the appointment remains in the G-5 slot and continues to occupy that slot's seats
