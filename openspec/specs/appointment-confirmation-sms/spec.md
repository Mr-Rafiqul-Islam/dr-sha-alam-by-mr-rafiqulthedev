# appointment-confirmation-sms Specification

## Purpose

Sends patients a Novocom chamber-location SMS after a successful appointment booking and when staff confirm a website-created appointment.

## Requirements

### Requirement: SMS after successful appointment create
When an appointment is created successfully, the system SHALL send a Unicode SMS to the patient phone via Novocom. This MUST apply to admin dashboard creates and to client website free creates. For client paid bookings, the system MUST send the SMS only after payment success, not when a reserved unpaid appointment row is first created.

#### Scenario: Admin dashboard create
- **WHEN** staff create an appointment from the admin dashboard and the create succeeds
- **THEN** the system sends the confirmation SMS to the patient phone

#### Scenario: Client website free create
- **WHEN** a patient creates a free appointment from the client website and the create succeeds
- **THEN** the system sends the confirmation SMS to the patient phone even if status is PENDING

#### Scenario: Client paid booking after payment success
- **WHEN** a client paid booking payment succeeds and the appointment is fulfilled
- **THEN** the system sends the confirmation SMS to the patient phone

#### Scenario: Unpaid reserved appointment
- **WHEN** a client paid booking starts and a reserved appointment row is created before payment completes
- **THEN** the system does not send the confirmation SMS

### Requirement: SMS when staff confirm a client appointment
When staff update a client-created appointment (`createdById` is null) from a status other than CONFIRMED to CONFIRMED, the system SHALL send the confirmation SMS to the patient phone. The system MUST NOT send this status-update SMS for admin-created appointments.

#### Scenario: Staff confirm website booking
- **WHEN** staff change a client-created appointment from PENDING to CONFIRMED
- **THEN** the system sends the confirmation SMS to the patient phone

#### Scenario: Admin-created appointment already confirmed
- **WHEN** staff update an admin-created appointment whose status is already CONFIRMED
- **THEN** the system does not send a second confirmation SMS from the status-update path

#### Scenario: Confirm is not the new status
- **WHEN** staff change a client-created appointment to ATTEND, CANCEL, or NOT_ATTENDED
- **THEN** the system does not send the confirmation SMS

### Requirement: Chamber SMS template
The confirmation SMS MUST use the TruCare Diagnostics Centre chamber template. The only dynamic line MUST be attendance time in the form `উপস্থিতি সময়ঃ {DD/MM/YYYY in Bengali digits} রোজ {Bengali weekday} {slot smsLabel}।` The message MUST include the static chamber name, Mohakhali address, landmark, contact numbers `০৯৬১৩-৬৬৮৮৬৬`, `০১৭০১৩১৩০০১`, and `০১৭০১৩১৩০০২`, and the Google Maps URL `https://maps.app.goo.gl/pKnvNaqG8cdvUtrR9?g_st=ic`. The message MUST NOT include patient name or serial number.

#### Scenario: Dynamic attendance time
- **WHEN** an appointment is booked for 19 August 2026 on a Wednesday in the morning 9 AM slot
- **THEN** the SMS contains `উপস্থিতি সময়ঃ ১৯/০৮/২০২৬ রোজ বুধবার সকাল ৯ টা।` and does not contain the patient name or serial number

### Requirement: Booking succeeds even if SMS fails
Appointment create, payment fulfillment, and status update MUST succeed even when Novocom is unconfigured or the SMS send fails. The system MUST NOT roll back the appointment because of an SMS error.

#### Scenario: Novocom not configured
- **WHEN** an appointment is created successfully and Novocom credentials are missing
- **THEN** the appointment is saved and no SMS is sent

#### Scenario: Gateway error
- **WHEN** an appointment is created successfully and the SMS gateway returns an error
- **THEN** the appointment remains saved and the API still returns success
