# Daily Appointment & Revenue Dashboard

## Purpose

The Daily Appointment & Revenue Dashboard gives Dr. Shah Alam admin staff a same-day view of:

- Appointment volume by status
- Attendance rate
- Category-wise booked and attended counts
- Attendance-based expected collection (calculated revenue)

This module is designed for `SiteRef.DOCTOR_SHA_ALAM`.

## Important limitation

Calculated revenue is **attendance-based expected collection**, not audited payment settlement. Revenue is computed as:

`attended appointments × configured category fee`

The current appointment records do not provide a complete cash ledger for every attended patient. Payment reconciliation is intentionally out of scope.

## Category mapping

| Slot code | Category key | Label | Default fee (BDT) |
|-----------|--------------|-------|-------------------|
| `P-9` | `NEW_PLID` | New PLID Patient | 1500 |
| `OP-4` | `OLD_PLID` | Old PLID Patient | 1000 |
| `G-5` | `GENERAL` | General Patient | 600 |
| `G-5` | `OLD_GENERAL` | Old General Patient | 400 |
| unknown / no stored category | `OTHER` | Other | 0 |

`GENERAL` and `OLD_GENERAL` share slot `G-5`. There is no fourth public time slot.

Resolution rules:

1. Use stored `appointment.feeCategory` when set (staff override)
2. Otherwise use `appointment.slot.code` when the slot relation exists
3. Otherwise fall back to `preferredTime` when it matches a known slot code (`G-5` infers `GENERAL`, not `OLD_GENERAL`)
4. Unknown values are counted under `OTHER` with fee/revenue `0`

Existing appointment rows are not bulk-backfilled. Until staff set `feeCategory`, category is inferred from the slot as above.

## Status rules

### Booked

`PENDING + CONFIRMED + ATTEND`

### Attended

`ATTEND` only

### Excluded from booked/revenue

- `CANCEL`
- `RESCHEDULED`

These statuses are still counted separately and included in `totalAppointments`.

### Attendance rate

`booked > 0 ? round((attended / booked) × 100, 2) : 0`

## Revenue formula

Per category:

`categoryRevenue = attendedCount × configuredCategoryFee`

Total:

`totalRevenue = sum(categoryRevenue for NEW_PLID, OLD_PLID, GENERAL, OLD_GENERAL)`

`OTHER` always contributes `0` revenue.

## API endpoints

All routes require admin auth and the `appointments` permission.

### Summary

```http
GET /api/v1/admin/appointment-revenue/summary?date=YYYY-MM-DD&siteRef=DOCTOR_SHA_ALAM
```

- `date` optional; defaults to today in `Asia/Dhaka`
- `siteRef` optional; defaults to `DOCTOR_SHA_ALAM`

### Get fees

```http
GET /api/v1/admin/appointment-revenue/fees?siteRef=DOCTOR_SHA_ALAM
```

### Update fees

```http
PATCH /api/v1/admin/appointment-revenue/fees
Content-Type: application/json

{
  "siteRef": "DOCTOR_SHA_ALAM",
  "fees": {
    "NEW_PLID": 1500,
    "OLD_PLID": 1000,
    "GENERAL": 600,
    "OLD_GENERAL": 400
  }
}
```

Fee validation:

- required
- numeric
- minimum `0`
- maximum `1,000,000`
- maximum two decimal places

## Fee configuration

Fees are stored in `AppointmentRevenueFee` using Prisma `Decimal(10, 2)`.

Seed defaults come from environment variables (used when set and valid):

- `NEW_PLID_APPOINTMENT_FEE` (default 1500)
- `OLD_PLID_APPOINTMENT_FEE` (default 1000)
- `GENERAL_APPOINTMENT_FEE` (default 600)
- `OLD_GENERAL_APPOINTMENT_FEE` (default 400)

When unset or invalid, seed uses the defaults above. Changing these fees later updates `AppointmentRevenueFee` only; it does not bulk-update existing appointment rows.

Admins can also update fees from the dashboard **Configure Fees** action.

## Bangladesh timezone behavior

Business timezone: `Asia/Dhaka`

For a selected calendar date, the API queries:

```text
appointmentDate >= startOfDayUtc
appointmentDate < nextDayStartUtc
```

The response returns the selected business date unchanged as `YYYY-MM-DD`.

Note: existing appointment day list APIs still use server-local day boundaries. The revenue dashboard is the authoritative Dhaka-day view for this feature.

## Pending delete alignment

Revenue summary excludes appointments hidden from admin appointment lists when the current admin role uses pending-delete hiding. This keeps dashboard counts aligned with what staff see elsewhere.

## Migration steps

From `server/`:

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:generate
```

For local development:

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

## Testing steps

From `server/`:

```bash
npm test
npm run build
npx prisma format
npx prisma validate
npm run prisma:generate
npm run prisma:migrate:status
```

From `admin/`:

```bash
npm run build
npm run lint
```

## Environment variables

Add to `server/.env` as needed:

```env
NEW_PLID_APPOINTMENT_FEE=1500
OLD_PLID_APPOINTMENT_FEE=1000
GENERAL_APPOINTMENT_FEE=600
OLD_GENERAL_APPOINTMENT_FEE=400
```

See also [`server/.env.example`](../server/.env.example).
