# appointment-day-autoclose Specification

## Purpose

Closes leftover Doctor Sha Alam appointments to NOT_ATTENDED after the clinic day is finished, at 6:00 AM Asia/Dhaka, including catch-up for days missed while the server was down, without re-closing a day that already ran and without backfilling dates before deploy.

## Requirements

### Requirement: Close leftovers at 6:00 AM Asia/Dhaka
The system SHALL, at 06:00 in the Asia/Dhaka timezone, close the previous Dhaka business date for site `DOCTOR_SHA_ALAM`. Closing a date SHALL set every appointment on that date and site whose status is `PENDING` or `CONFIRMED` to `NOT_ATTENDED`. The system MUST NOT change appointments whose status is `ATTEND`, `CANCEL`, `RESCHEDULED`, or `NOT_ATTENDED`. The system MUST NOT change appointments for `TRUE_CARE_HELLING_CENTER`. The system MUST NOT change appointments whose business date is today or in the future in Asia/Dhaka. The system MUST NOT send appointment confirmation SMS as a result of this close.

#### Scenario: Yesterday leftovers become not attended
- **WHEN** it is 06:00 Asia/Dhaka and yesterday has leftover Doctor Sha Alam appointments in PENDING or CONFIRMED
- **THEN** those appointments are stored as NOT_ATTENDED

#### Scenario: Attended and cancelled rows stay
- **WHEN** the close runs for yesterday and some appointments on that date are ATTEND, CANCEL, or RESCHEDULED
- **THEN** those appointments keep their existing status

#### Scenario: True Care is excluded
- **WHEN** the close runs and True Care appointments on yesterday are still PENDING
- **THEN** those True Care appointments remain PENDING

#### Scenario: Today and future are not closed
- **WHEN** the close runs at 06:00 Asia/Dhaka
- **THEN** Doctor Sha Alam appointments dated today or later are not changed

#### Scenario: No confirmation SMS on autoclose
- **WHEN** leftover appointments are closed to NOT_ATTENDED by this job
- **THEN** the system does not send appointment confirmation SMS

### Requirement: Catch up missed days and never close twice
If the 06:00 Asia/Dhaka run did not complete for an eligible business date, the system SHALL close that date on the next process start or the next 06:00 run, whichever happens first. An eligible date is a Dhaka calendar date on or after the configured deploy-from date, strictly before today in Asia/Dhaka, for site `DOCTOR_SHA_ALAM`. The system MUST NOT close any date before the deploy-from date. After a date has been closed successfully once, the system MUST NOT close that date again.

#### Scenario: Server down at 6:00 AM
- **WHEN** the server was down at 06:00 Asia/Dhaka and later starts while yesterday has not yet been closed
- **THEN** the system closes yesterday (and any other still-open eligible dates) without waiting for the next 06:00

#### Scenario: Already closed date is skipped
- **WHEN** a business date was already closed successfully and the job runs again
- **THEN** appointments for that date are not updated again by this job

#### Scenario: Days before deploy stay untouched
- **WHEN** the close runs and older Doctor Sha Alam PENDING appointments exist before the deploy-from date
- **THEN** those older appointments keep their existing status
