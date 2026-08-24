## Context

See `proposal.md` for motivation and `specs/appointment-day-autoclose/spec.md` for behavior. `NOT_ATTENDED` already exists; staff set it by hand. There is no scheduler, job queue, or day-close ledger. Business dates use `Asia/Dhaka` via `getTodayYmdInTimeZone`, `addDaysToYmd`, and `getUtcHalfOpenRangeForBusinessDate` (same half-open UTC window as revenue). Appointment `siteRef` distinguishes `DOCTOR_SHA_ALAM` from `TRUE_CARE_HELLING_CENTER`. Activity logs always have a staff actor; this job has none.

## Goals / Non-Goals

**Goals:**
- Close leftover `PENDING`/`CONFIRMED` Doctor Sha Alam rows for each eligible Dhaka date exactly once.
- Fire at 06:00 Asia/Dhaka and catch up on process start if 06:00 was missed.
- Bound history with a deploy-from date so pre-deploy leftovers stay as they are.

**Non-Goals:**
- Admin UI, manual “close day” button, or a public API for this job.
- True Care autoclose.
- SMS, staff activity rows, or a system user.
- Changing revenue or seat rules (existing `NOT_ATTENDED` behavior already matches).
- A job queue (Bull/Redis) or extra cron process.

## Decisions

### In-process timer plus boot catch-up

On server listen: run catch-up immediately, then `setTimeout` until the next 06:00 Asia/Dhaka and repeat. Bangladesh is UTC+6 with no DST, so 06:00 Dhaka is 00:00 UTC, but schedule in Dhaka wall time so the rule stays obvious.

**Alternative:** `node-cron` with `timezone: "Asia/Dhaka"`. Rejected — extra dependency for one clock.

**Alternative:** host crontab hitting an HTTP route. Rejected — catch-up on boot would still be required, and this app has no ops cron today.

### Ledger row is the once-per-day lock

New Prisma model (name can match implementation) unique on `(siteRef, businessDate)` where `businessDate` is `YYYY-MM-DD`. Closing a date is one transaction: `updateMany` leftovers, then insert the ledger row. If the unique insert fails, another worker already closed that date — skip. If the process dies before commit, there is no ledger row, so catch-up retries.

Do not infer “already ran” from “zero PENDING/CONFIRMED left.” A fully attended day must still record a successful close so catch-up does not keep treating it as work.

**Alternative:** only `updateMany` and rely on idempotent updates. Rejected — the spec requires not closing a date again; the ledger is the durable “this day ran” bit, including days with nothing to flip.

### Eligible dates: deploy-from through yesterday

Env `APPOINTMENT_DAY_AUTOCLOSE_FROM=YYYY-MM-DD` (Dhaka calendar date of first day this feature may close). Eligible = `[FROM, todayDhaka)` excluding dates already in the ledger for `DOCTOR_SHA_ALAM`. If the env is missing or invalid, do not close anything (fail closed, log once).

Walk oldest eligible date first so a long outage closes in calendar order.

**Alternative:** close only yesterday and hope the next 06:00 is never missed. Rejected — spec requires catch-up.

**Alternative:** sweep all historical PENDING. Rejected — spec forbids dates before deploy-from.

### Appointment query window

Use `getUtcHalfOpenRangeForBusinessDate(dateYmd)` with `siteRef: DOCTOR_SHA_ALAM` and `status in (PENDING, CONFIRMED)`. Do not use `getDayRange` (server-local midnight).

Leave `updatedById` null. Do not call SMS. Do not write activity logs (no staff actor; activity is for dashboard actions).

### Concurrency

One Node process is the expected deploy. Unique `(siteRef, businessDate)` still makes a second instance safe: both `updateMany` calls are idempotent; only one ledger insert commits.

## Risks / Trade-offs

- **[Process down across many days]** → Catch-up walks every eligible date since FROM not in the ledger. FROM keeps the range bounded. Long outages mean a larger first catch-up; still one `updateMany` per date.
- **[Two instances at 06:00]** → Unique ledger insert; loser skips. Status updates are idempotent.
- **[Crash after updates, before ledger commit]** → Transaction rolls back; catch-up retries. Prefer one transaction per date so leftovers and the ledger stay together.
- **[Staff change a closed day back to PENDING]** → Job will not flip it again. Accepted: once closed, that date is done.
- **[FROM unset in production]** → Job no-ops until configured. Set the env to the Dhaka date of deploy (or the first clinic day that should auto-close).
- **[Boot every night at 04:00]** → Catch-up at 04:00 closes yesterday (eligible, before today). The 06:00 tick then no-ops via the ledger. Safe; does not require waiting until 06:00 if the night was already missed.

## Migration Plan

1. Add Prisma ledger model + migration; add `APPOINTMENT_DAY_AUTOCLOSE_FROM` to `server/.env.example` and production env (Dhaka `YYYY-MM-DD` of first closable day).
2. Deploy server. On first start, catch-up closes eligible dates **after** FROM through yesterday only. Pre-FROM rows stay unchanged.
3. Confirm 06:00 Asia/Dhaka (00:00 UTC) tick in logs.

Rollback: stop scheduling (feature flag or revert the listen hook). Ledger table can remain. Status values already flipped stay `NOT_ATTENDED` (do not auto-revert).
