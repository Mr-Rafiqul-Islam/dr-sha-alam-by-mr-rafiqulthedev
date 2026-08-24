## Why

Staff mark attendance before midnight, but leftover Doctor Sha Alam appointments stay `PENDING` or `CONFIRMED` forever unless someone updates them by hand. `NOT_ATTENDED` already exists; the clinic needs the day to close itself the next morning, including catching up days missed while the server was down, without touching history from before deploy or running the same day twice.

## What Changes

- After a Doctor Sha Alam clinic day is finished, leftover `PENDING` and `CONFIRMED` appointments for that day become `NOT_ATTENDED`.
- The job runs at **6:00 AM Asia/Dhaka** (not midnight). Staff already mark Attend before 12:00 AM; 6:00 AM is the safer run time.
- **Catch-up:** if the server was down at 6:00 AM, the next start or next 6:00 AM run closes every missed eligible day that has not been closed yet.
- **Once per day:** if a given business date was already closed successfully, do not close it again.
- **From deploy day forward only:** do not backfill days before the feature went live.
- **Doctor Sha Alam only:** True Care appointments are unchanged.
- Do not change `ATTEND`, `CANCEL`, `RESCHEDULED`, or rows already `NOT_ATTENDED`. Do not send SMS for this close. Not a **BREAKING** API change.

## Capabilities

### New Capabilities

- `appointment-day-autoclose`: Daily (and catch-up) close of leftover Doctor Sha Alam appointments to `NOT_ATTENDED` at 6:00 AM Asia/Dhaka, once per business date, from deploy day forward.

### Modified Capabilities

- (none)

## Impact

- **Server:** new in-process 6:00 AM Asia/Dhaka scheduler; close service using existing Dhaka date-range helpers; persist a per-date close ledger so missed days can catch up and completed days do not re-run; Prisma model/migration for that ledger; env for the deploy-from date.
- **Admin / client:** no UI change. Existing Not Attended labels, filters, revenue (booked, not attended), and seat rules already apply.
- **SMS / activity:** no confirmation SMS on autoclose. No staff actor on the job (system close, not a dashboard status click).
