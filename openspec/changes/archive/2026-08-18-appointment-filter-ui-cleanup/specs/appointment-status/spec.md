## Purpose

Lets staff record and identify appointments where the patient did not attend, using a first-class NOT_ATTENDED status instead of inferring no-shows from Pending or Confirmed.

## ADDED Requirements

### Requirement: NOT_ATTENDED is a valid appointment status
The system SHALL persist `NOT_ATTENDED` as a value on the `AppointmentStatus` enum. Admin appointment update APIs SHALL accept `NOT_ATTENDED` when staff change status. The admin appointment list and detail views SHALL display the label "Not Attended" with a distinct badge style.

#### Scenario: Mark appointment not attended
- **WHEN** staff update an appointment status to NOT_ATTENDED
- **THEN** the appointment is stored with status NOT_ATTENDED and displays as Not Attended in the admin UI

#### Scenario: Invalid status rejected
- **WHEN** an admin submits an unknown status value
- **THEN** the system rejects the update

### Requirement: NOT_ATTENDED in revenue aggregation
Daily appointment revenue aggregation SHALL count NOT_ATTENDED appointments as booked but not attended. NOT_ATTENDED MUST NOT increment attended counts or revenue.

#### Scenario: Not attended counts as booked only
- **WHEN** one appointment on a business date has status NOT_ATTENDED
- **THEN** summary booked count includes it and summary attended count does not

### Requirement: NOT_ATTENDED does not consume seats
NOT_ATTENDED appointments SHALL NOT be included in seat-consuming status sets used for slot availability after the status is set.

#### Scenario: Seat pool excludes not attended
- **WHEN** slot availability is calculated for a date
- **THEN** appointments with status NOT_ATTENDED do not reduce available seats
