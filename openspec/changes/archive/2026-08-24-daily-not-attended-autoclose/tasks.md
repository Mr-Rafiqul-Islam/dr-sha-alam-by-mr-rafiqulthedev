## 1. Persistence

- [x] 1.1 Add Prisma ledger model unique on `(siteRef, businessDate)` (`YYYY-MM-DD`) with close timestamp and closed-count, plus a migration
- [x] 1.2 Document `APPOINTMENT_DAY_AUTOCLOSE_FROM=YYYY-MM-DD` in `server/.env.example` (first Dhaka date this job may close)

## 2. Close service

- [x] 2.1 Resolve eligible dates as `[FROM, todayDhaka)` for `DOCTOR_SHA_ALAM`, skip dates already in the ledger, oldest first; no-op and log if FROM is missing or invalid
- [x] 2.2 Close one date in a transaction: `updateMany` PENDING/CONFIRMED in the Dhaka UTC half-open range to NOT_ATTENDED (`updatedById` null), then insert the ledger row; treat unique-conflict as already closed
- [x] 2.3 Do not update ATTEND/CANCEL/RESCHEDULED/NOT_ATTENDED, True Care rows, today, or future dates; do not send SMS or write activity logs

## 3. Scheduler

- [x] 3.1 On server listen, run catch-up immediately, then `setTimeout` to the next 06:00 Asia/Dhaka and reschedule after each tick (no extra cron dependency)

## 4. Tests

- [x] 4.1 Cover leftover PENDING/CONFIRMED → NOT_ATTENDED, preserved other statuses, True Care exclusion, dates before FROM untouched, ledger skip on second run, and catch-up of a missed eligible day
- [x] 4.2 Run server tests for the new module and existing appointment tests
